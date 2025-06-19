import React, { useState, useEffect } from 'react';
import { 
  User, Mail, Phone, Code, Star, TrendingUp, Bell, BellOff, 
  Calendar, Award, BookOpen, Edit, ArrowLeft, Loader, AlertCircle,
  RefreshCw, Filter, BarChart2, Clock, Activity, Thermometer, Target,
  CheckCircle
} from 'lucide-react';
import axios from "axios";
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  BarChart, Bar, Cell
} from 'recharts';

interface ContestHistory {
  id: number;
  contestId: number;
  contestName: string;
  date: Date | string;
  rank: number;
  oldRating: number;
  newRating: number;
  ratingChange: number;
  problemsUnsolved?: number;
}

interface Submission {
  id: number;
  problemName: string;
  problemRating: number | null;
  verdict: string;
  timestamp: Date | string;
  isSolved: boolean;
}

interface StudentProfileData {
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
  codeforcesHandle: string;
  currentRating: number;
  maxRating: number;
  emailRemindersEnabled: boolean;
  createdAt: Date | string;
  updatedAt: Date | string;
  lastSyncedAt?: Date | string;
  contestHistory?: ContestHistory[];
  submissions?: Submission[];
}

interface ProblemSolvingData {
  mostDifficultSolved: {
    name: string;
    rating: number;
  } | null;
  totalSolved: number;
  averageRating: number;
  averageProblemsPerDay: number;
  problemsByRating: { rating: number; count: number }[];
  submissionHeatmap: { date: string; count: number }[];
}

function StudentProfile() {
  const { studentId } = useParams<{ studentId: string }>();
  const navigate = useNavigate();
  const [student, setStudent] = useState<StudentProfileData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncError, setSyncError] = useState<string | null>(null);
  const [syncSuccess, setSyncSuccess] = useState(false);
  
  // Filters
  const [contestFilter, setContestFilter] = useState<'30days' | '90days' | '365days'>('30days');
  const [problemFilter, setProblemFilter] = useState<'7days' | '30days' | '90days'>('7days');

  // Fetch student data
  useEffect(() => {
    let isMounted = true;
    
    const fetchStudentData = async () => {
      if (!studentId) return;
      
      setIsLoading(true);
      setError(null);
      
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`http://localhost:3000/api/student/${studentId}`,{
           headers: {
          token: token
        }
        });
        const studentData = response.data;
        
        if (isMounted) {
          setStudent({
            ...studentData,
            createdAt: new Date(studentData.createdAt),
            updatedAt: new Date(studentData.updatedAt),
            lastSyncedAt: studentData.lastSyncedAt ? new Date(studentData.lastSyncedAt) : undefined,
            contestHistory: studentData.contestHistory?.map((ch: any) => ({
              ...ch,
              date: new Date(ch.date)
            })),
            submissions: studentData.submissions?.map((s: any) => ({
              ...s,
              timestamp: new Date(s.timestamp)
            }))
          });
        }
      } catch (err) {
        if (isMounted) {
          console.error('Error fetching student data:', err);
          setError('Failed to load student data. Please try again.');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchStudentData();

    return () => {
      isMounted = false;
    };
  }, [studentId, syncSuccess]);

  // Sync with Codeforces
  const handleSyncWithCodeforces = async () => {
    if (!student) return;
    
    setIsSyncing(true);
    setSyncError(null);
    
    try {
      const token = localStorage.getItem("token");
      await axios.get(`http://localhost:3000/api/sync/${student.codeforcesHandle}`,{
         headers: {
          token: token
        }
      });
      setSyncSuccess(true);
      setTimeout(() => setSyncSuccess(false), 3000);
    } catch (err) {
      console.error('Sync error:', err);
      setSyncError('Failed to sync with Codeforces. Please try again.');
    } finally {
      setIsSyncing(false);
    }
  };

  // Format date consistently
  const formatDate = (date?: Date | string | null) => {
    if (!date) return "N/A";
    
    const parsedDate = date instanceof Date ? date : new Date(date);
    
    if (isNaN(parsedDate.getTime())) return "Invalid date";
    
    return parsedDate.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Filter contest history with proper date handling
  const getFilteredContestHistory = () => { 
    if (!student?.contestHistory?.length) {
    console.log("No contest history available");
    return [];
  }
    
    const now = new Date();
    let cutoffDate = new Date(now);
    
     switch (contestFilter) {
    case '30days': cutoffDate.setDate(now.getDate() - 30); break;
    case '90days': cutoffDate.setDate(now.getDate() - 90); break;
    case '365days': cutoffDate.setDate(now.getDate() - 365); break;
  }
     console.log(`Filtering contests before ${cutoffDate}`);
    return student.contestHistory
      .filter(contest => {
        const contestDate = contest.date instanceof Date ? contest.date : new Date(contest.date);
        return contestDate >= cutoffDate;
      })
      .sort((a, b) => {
        const dateA = a.date instanceof Date ? a.date : new Date(a.date);
        const dateB = b.date instanceof Date ? b.date : new Date(b.date);
        return dateB.getTime() - dateA.getTime();
      });
  };

  // Filter submissions and calculate problem stats with proper date handling
  const getProblemSolvingData = (): ProblemSolvingData | null => {
    if (!student?.submissions?.length) return null;
    
    const now = new Date();
    let cutoffDate = new Date(now);
    
    switch (problemFilter) {
      case '7days':
        cutoffDate.setDate(now.getDate() - 7);
        break;
      case '30days':
        cutoffDate.setDate(now.getDate() - 30);
        break;
      case '90days':
        cutoffDate.setDate(now.getDate() - 90);
        break;
    }
    
    const filteredSubmissions = student.submissions.filter(s => {
      const subDate = s.timestamp instanceof Date ? s.timestamp : new Date(s.timestamp);
      return subDate >= cutoffDate;
    });
    
    const solvedSubmissions = filteredSubmissions.filter(s => s.isSolved);
    const problemNames = new Set(solvedSubmissions.map(s => s.problemName));
    const uniqueSolvedProblems = Array.from(problemNames).map(name => {
      return solvedSubmissions.find(s => s.problemName === name)!;
    });
    
    const problemsByRating = uniqueSolvedProblems.reduce((acc, problem) => {
      if (problem.problemRating) {
        const roundedRating = Math.round(problem.problemRating / 100) * 100;
        const existing = acc.find(item => item.rating === roundedRating);
        if (existing) {
          existing.count++;
        } else {
          acc.push({ rating: roundedRating, count: 1 });
        }
      }
      return acc;
    }, [] as { rating: number; count: number }[]);
    
    const submissionHeatmap = Array.from({ length: 30 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (29 - i));
      const dateStr = date.toISOString().split('T')[0];
      const count = filteredSubmissions.filter(s => {
        const subDate = s.timestamp instanceof Date ? s.timestamp : new Date(s.timestamp);
        return subDate.toISOString().split('T')[0] === dateStr;
      }).length;
      return { date: dateStr, count };
    });
    
    const averageRating = uniqueSolvedProblems.length > 0 
      ? uniqueSolvedProblems.reduce((sum, problem) => 
          sum + (problem.problemRating || 0), 0) / uniqueSolvedProblems.length
      : 0;
    
    const daysInPeriod = problemFilter === '7days' ? 7 : 
                        problemFilter === '30days' ? 30 : 90;
    const averageProblemsPerDay = uniqueSolvedProblems.length / daysInPeriod;
    
    const mostDifficultSolved = uniqueSolvedProblems
      .filter(p => p.problemRating)
      .sort((a, b) => (b.problemRating || 0) - (a.problemRating || 0))[0];
    
    return {
      mostDifficultSolved: mostDifficultSolved ? {
        name: mostDifficultSolved.problemName,
        rating: mostDifficultSolved.problemRating || 0
      } : null,
      totalSolved: uniqueSolvedProblems.length,
      averageRating,
      averageProblemsPerDay,
      problemsByRating: problemsByRating.sort((a, b) => a.rating - b.rating),
      submissionHeatmap
    };
  };

  const ratingProgress = student?.currentRating 
    ? Math.min(100, (student.currentRating / 4000) * 100) 
    : 0;

  if (isLoading) {
    return <LoadingState />;
  }

  if (error) {
    return <ErrorState error={error} onGoBack={() => navigate(-1)} />;
  }

  if (!student) {
    return <NotFoundState onGoBack={() => navigate(-1)} />;
  }

  const filteredContests = getFilteredContestHistory();
  const problemData = getProblemSolvingData();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <button 
            onClick={() => navigate(-1)}
            className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors duration-200 mb-4"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Students
          </button>
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div className="flex items-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-500 to-blue-600 rounded-xl mr-4">
                <User className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{student.name}</h1>
                <p className="text-gray-600">Codeforces: {student.codeforcesHandle}</p>
              </div>
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={handleSyncWithCodeforces}
                disabled={isSyncing}
                className={`inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 ${
                  isSyncing ? 'opacity-75 cursor-not-allowed' : ''
                }`}
              >
                {isSyncing ? (
                  <>
                    <Loader className="w-5 h-5 mr-2 animate-spin" />
                    Syncing...
                  </>
                ) : (
                  <>
                    <RefreshCw className="w-5 h-5 mr-2" />
                    Sync with Codeforces
                  </>
                )}
              </button>
              
              <Link
                to={`/${studentId}`}
                className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-lg font-semibold hover:from-green-700 hover:to-blue-700 transition-all duration-200"
              >
                <Edit className="w-5 h-5 mr-2" />
                Edit Profile
              </Link>
            </div>
          </div>
          
          {syncSuccess && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center">
              <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
              <span className="text-green-800">Successfully synced with Codeforces!</span>
            </div>
          )}
          
          {syncError && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center">
              <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
              <span className="text-red-800">{syncError}</span>
            </div>
          )}
        </div>

        {/* Main Content */}
        <div className="space-y-8">
          {/* Basic Info Card */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <h2 className="text-2xl font-bold">{student.name}</h2>
                  <p className="text-blue-100">
                    Current Rating: {student.currentRating} (Max: {student.maxRating})
                    {student.lastSyncedAt && ` • Last synced: ${formatDate(student.lastSyncedAt)}`}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  {student.emailRemindersEnabled ? (
                    <span className="inline-flex items-center px-3 py-1 rounded-full bg-green-100 text-green-800 text-sm">
                      <Bell className="w-4 h-4 mr-1" />
                      Reminders ON
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-3 py-1 rounded-full bg-gray-100 text-gray-800 text-sm">
                      <BellOff className="w-4 h-4 mr-1" />
                      Reminders OFF
                    </span>
                  )}
                </div>
              </div>
            </div>
            <div className="p-6 grid md:grid-cols-4 gap-6">
              <div className="flex items-start">
                <Mail className="w-5 h-5 text-gray-500 mr-3 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="text-gray-900">{student.email}</p>
                </div>
              </div>
              <div className="flex items-start">
                <Phone className="w-5 h-5 text-gray-500 mr-3 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm text-gray-500">Phone</p>
                  <p className="text-gray-900">{student.phoneNumber}</p>
                </div>
              </div>
              <div className="flex items-start">
                <Code className="w-5 h-5 text-gray-500 mr-3 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm text-gray-500">Codeforces</p>
                  <a 
                    href={`https://codeforces.com/profile/${student.codeforcesHandle}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    {student.codeforcesHandle}
                  </a>
                </div>
              </div>
              <div className="flex items-start">
                <Calendar className="w-5 h-5 text-gray-500 mr-3 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm text-gray-500">Member Since</p>
                  <p className="text-gray-900">{formatDate(student.createdAt)}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contest History Section */}
          <ContestHistorySection 
            contests={filteredContests}
            filter={contestFilter}
            onFilterChange={setContestFilter}
            lastSyncedAt={student.lastSyncedAt}
          />

          {/* Problem Solving Section */}
          <ProblemSolvingSection 
            problemData={problemData}
            filter={problemFilter}
            onFilterChange={setProblemFilter}
          />
        </div>
      </div>
    </div>
  );
}

// Sub-components

const LoadingState = () => (
  <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
    <div className="max-w-6xl mx-auto px-6 py-8">
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Loading Student Profile</h2>
          <p className="text-gray-600">Please wait while we fetch the student information...</p>
        </div>
      </div>
    </div>
  </div>
);

const ErrorState = ({ error, onGoBack }: { error: string; onGoBack: () => void }) => (
  <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
    <div className="max-w-6xl mx-auto px-6 py-8">
      <div className="mb-8">
        <button 
          onClick={onGoBack}
          className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors duration-200 mb-4"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Students
        </button>
      </div>
      
      <div className="bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Unable to Load Student</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200"
          >
            Try Again
          </button>
        </div>
      </div>
    </div>
  </div>
);

const NotFoundState = ({ onGoBack }: { onGoBack: () => void }) => (
  <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
    <div className="max-w-6xl mx-auto px-6 py-8">
      <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Student Not Found</h2>
        <p className="text-gray-600 mb-6">The requested student profile could not be found.</p>
        <button
          onClick={onGoBack}
          className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200"
        >
          Back to Students
        </button>
      </div>
    </div>
  </div>
);

interface ContestHistorySectionProps {
  contests: ContestHistory[];
  filter: string;
  onFilterChange: (filter: '30days' | '90days' | '365days') => void;
  lastSyncedAt?: Date | string;
}

const ContestHistorySection: React.FC<ContestHistorySectionProps> = ({ 
  contests, 
  filter, 
  onFilterChange,
  lastSyncedAt
}) => {
  console.log("Contests received:", contests);
   const formatDate = (date: Date | string) => {
    const d = date instanceof Date ? date : new Date(date);
    return isNaN(d.getTime()) ? "N/A" : d.toLocaleDateString();
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
      <div className="border-b border-gray-200 p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <h2 className="text-xl font-semibold text-gray-900 flex items-center">
            <Award className="w-5 h-5 mr-2 text-orange-600" />
            Contest History
          </h2>
          <div className="flex space-x-2">
            <button
              onClick={() => onFilterChange('30days')}
              className={`px-4 py-2 rounded-lg text-sm font-medium ${filter === '30days' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}
            >
              Last 30 Days
            </button>
            <button
              onClick={() => onFilterChange('90days')}
              className={`px-4 py-2 rounded-lg text-sm font-medium ${filter === '90days' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}
            >
              Last 90 Days
            </button>
            <button
              onClick={() => onFilterChange('365days')}
              className={`px-4 py-2 rounded-lg text-sm font-medium ${filter === '365days' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}
            >
              Last Year
            </button>
          </div>
        </div>
      </div>
      
      <div className="p-6">
        {contests.length > 0 ? (
          <>
            <div className="h-80 mb-8">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={contests.map(contest => ({
                    name: contest.contestName,
                    date: formatDate(contest.date),
                    rating: contest.newRating,
                    rank: contest.rank
                  }))}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="rating" 
                    stroke="#8884d8" 
                    activeDot={{ r: 8 }} 
                    name="Rating"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contest</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rank</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rating Change</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">New Rating</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {contests.map((contest) => {
                    const contestDate = contest.date instanceof Date ? contest.date : new Date(contest.date);
                    return (
                      <tr key={contest.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          <a 
                            href={`https://codeforces.com/contest/${contest.contestId}`} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline"
                          >
                            {contest.contestName}
                          </a>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(contestDate)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{contest.rank}</td>
                        <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${contest.ratingChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {contest.ratingChange >= 0 ? '+' : ''}{contest.ratingChange}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{contest.newRating}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500">
              No contest history available for the selected period ({filter}). 
              {lastSyncedAt && ` Last sync: ${formatDate(lastSyncedAt)}`}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

interface ProblemSolvingSectionProps {
  problemData: ProblemSolvingData | null;
  filter: string;
  onFilterChange: (filter: '7days' | '30days' | '90days') => void;
}

const ProblemSolvingSection: React.FC<ProblemSolvingSectionProps> = ({ 
  problemData, 
  filter, 
  onFilterChange 
}) => (
  <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
    <div className="border-b border-gray-200 p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h2 className="text-xl font-semibold text-gray-900 flex items-center">
          <BookOpen className="w-5 h-5 mr-2 text-green-600" />
          Problem Solving Data
        </h2>
        <div className="flex space-x-2">
          <button
            onClick={() => onFilterChange('7days')}
            className={`px-4 py-2 rounded-lg text-sm font-medium ${filter === '7days' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}
          >
            Last 7 Days
          </button>
          <button
            onClick={() => onFilterChange('30days')}
            className={`px-4 py-2 rounded-lg text-sm font-medium ${filter === '30days' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}
          >
            Last 30 Days
          </button>
          <button
            onClick={() => onFilterChange('90days')}
            className={`px-4 py-2 rounded-lg text-sm font-medium ${filter === '90days' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}
          >
            Last 90 Days
          </button>
        </div>
      </div>
    </div>
    
    <div className="p-6">
      {problemData ? (
        <div className="space-y-8">
          {/* Stats Overview */}
          <div className="grid md:grid-cols-4 gap-6">
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="flex items-center">
                <Thermometer className="w-6 h-6 text-blue-600 mr-2" />
                <div>
                  <p className="text-sm text-gray-500">Most Difficult Solved</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {problemData.mostDifficultSolved?.rating || 'N/A'}
                    {problemData.mostDifficultSolved?.name && (
                      <span className="text-sm ml-1 text-gray-500">({problemData.mostDifficultSolved.name})</span>
                    )}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-green-50 rounded-lg p-4">
              <div className="flex items-center">
                <Target className="w-6 h-6 text-green-600 mr-2" />
                <div>
                  <p className="text-sm text-gray-500">Total Solved</p>
                  <p className="text-lg font-semibold text-gray-900">{problemData.totalSolved}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-purple-50 rounded-lg p-4">
              <div className="flex items-center">
                <Activity className="w-6 h-6 text-purple-600 mr-2" />
                <div>
                  <p className="text-sm text-gray-500">Avg. Rating</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {Math.round(problemData.averageRating)}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-orange-50 rounded-lg p-4">
              <div className="flex items-center">
                <Clock className="w-6 h-6 text-orange-600 mr-2" />
                <div>
                  <p className="text-sm text-gray-500">Avg. Per Day</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {problemData.averageProblemsPerDay.toFixed(1)}
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Problems by Rating Chart */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <BarChart2 className="w-5 h-5 mr-2 text-blue-600" />
              Problems Solved by Rating
            </h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={problemData.problemsByRating}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="rating" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#8884d8" name="Problems Solved">
                    {problemData.problemsByRating.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={`hsl(${index * 30}, 70%, 50%)`} 
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          {/* Submission Heatmap */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Activity className="w-5 h-5 mr-2 text-orange-600" />
              Submission Activity
            </h3>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center">
                {problemData.submissionHeatmap.map((day) => (
                  <div
                    key={day.date}
                    className={`w-4 h-4 m-0.5 rounded-sm ${
                      day.count === 0 ? 'bg-gray-100' :
                      day.count <= 2 ? 'bg-green-200' :
                      day.count <= 5 ? 'bg-green-400' :
                      day.count <= 10 ? 'bg-green-600' : 'bg-green-800'
                    }`}
                    title={`${day.date}: ${day.count} submissions`}
                  />
                ))}
              </div>
              <div className="flex items-center mt-2 text-xs text-gray-500">
                <span className="mr-2">Less</span>
                <div className="flex-1 flex">
                  <div className="w-4 h-4 m-0.5 rounded-sm bg-gray-100"></div>
                  <div className="w-4 h-4 m-0.5 rounded-sm bg-green-200"></div>
                  <div className="w-4 h-4 m-0.5 rounded-sm bg-green-400"></div>
                  <div className="w-4 h-4 m-0.5 rounded-sm bg-green-600"></div>
                  <div className="w-4 h-4 m-0.5 rounded-sm bg-green-800"></div>
                </div>
                <span className="ml-2">More</span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-gray-500">No problem solving data available for the selected period.</p>
        </div>
      )}
    </div>
  </div>
);

export default StudentProfile;
 
import { 
  Users, 
  BarChart3, 
  RefreshCw, 
  Bell, 
  Target, 
  Mail
} from 'lucide-react';

function About() {
  const features = [
    {
      icon: Users,
      title: "Student Dashboard",
      description: "Comprehensive view of all enrolled students with key metrics including rating, handle, email, and phone. Add, edit, delete, and export student data as CSV for easy management.",
      color: "bg-blue-500"
    },
    {
      icon: BarChart3,
      title: "Student Profile & Analytics",
      description: "Visualize contest history with interactive rating graphs and ranks. Analyze problem-solving statistics with advanced filtering by days, heat maps, and rating-based charts.",
      color: "bg-purple-500"
    },
    {
      icon: RefreshCw,
      title: "Daily Codeforces Sync",
      description: "Automatically fetches the latest Codeforces data every day via cron job. Enables real-time updates when handles change and records last sync time for complete transparency.",
      color: "bg-teal-500"
    },
    {
      icon: Bell,
      title: "Inactivity Detection & Email Alerts",
      description: "Intelligently detects students inactive for 7+ days and sends motivational email reminders automatically. Track reminder history with manual disable options.",
      color: "bg-orange-500"
    }
  ];

//   const stats = [
//     { icon: Award, number: "100+", label: "Students Tracked" },
//     { icon: TrendingUp, number: "15k+", label: "Problems Solved" },
//     { icon: Calendar, number: "365", label: "Days Automated" },
//     { icon: Download, number: "50+", label: "Reports Generated" }
//   ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="relative max-w-7xl mx-auto px-6 py-20 sm:py-32">
          <div className="text-center">
            <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium mb-8">
              <Target className="w-4 h-4 mr-2" />
              Empowering Students Through Data-Driven Progress Tracking
            </div>
            
            <h1 className="text-4xl sm:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Student Progress
              <span className="bg-gradient-to-r from-sky-600 to-red-600 bg-clip-text text-transparent"> Management System</span>
            </h1>
            
            <p className="text-xl text-gray-600 mb-10 max-w-3xl mx-auto leading-relaxed">
              A comprehensive web platform designed to help educators and institutions monitor and support 
              competitive programming progress among students—especially on platforms like Codeforces.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="px-8 py-4 bg-yellow-600 text-white rounded-lg font-semibold hover:bg-yellow-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1">
                Get Started Today
              </button>
              <button className="px-8 py-4 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:border-blue-600 hover:text-blue-600 transition-all duration-200">
                Request Demo
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      {/* <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center group">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl mb-4 group-hover:scale-110 transition-transform duration-200">
                  <stat.icon className="w-8 h-8 text-white" />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">{stat.number}</div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div> */}

      {/* Features Section */}
      <div className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              What We Offer
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Comprehensive tools and features designed to enhance competitive programming education
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 group">
                <div className={`inline-flex items-center justify-center w-16 h-16 ${feature.color} rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-200`}>
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Mission Section */}
      <div className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full mb-8">
            <Target className="w-10 h-10 text-white" />
          </div>
          
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
            Our Mission
          </h2>
          
          <p className="text-xl text-gray-600 leading-relaxed mb-8">
            To foster a culture of discipline, accountability, and growth among students aiming to excel in 
            competitive programming by giving them and their mentors data-backed clarity on their learning journey.
          </p>
          
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8 border border-blue-100">
            <p className="text-lg text-gray-700 italic">
              "We believe that consistent practice, data insights, and timely feedback can significantly 
              enhance a student's problem-solving skills. SPMS bridges the gap between students' efforts 
              and mentors' guidance by providing an intelligent, centralized system for performance tracking."
            </p>
          </div>
        </div>
      </div>

      {/* Contact Section */}
      <div className="py-20 bg-gradient-to-br from-sky-600 to-red-700">
        <div className="max-w-4xl mx-auto px-6 text-center">
          
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
            Get in Touch
          </h2>
          
          <p className="text-xl text-blue-100 mb-8 leading-relaxed">
            Interested in collaborating or deploying SPMS at your institution?
            <br />
            Reach out to us for demos, onboarding, and feature support.
          </p>
          
          <div className="bg-white bg-opacity-10 rounded-2xl p-8 backdrop-blur-sm border border-white border-opacity-20">
            <div className="flex items-center justify-center mb-4">
              <Mail className="w-6 h-6 text-black mr-3" />
              <a href="mailto:ng61315@gmail.com" className="text-2xl font-semibold text-black hover:text-blue-400 transition-colors duration-200">
                ng61315@gmail.com
              </a>
            </div>
            <p className="text-blue-300">
              Available for consultations, demos, and institutional partnerships
            </p>
          </div>
          
          <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-8 py-4 bg-white text-sky-600 rounded-lg font-semibold hover:bg-gray-100 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1">
              Schedule a Demo
            </button>
            <button className="px-8 py-4 border-2 border-white text-white rounded-lg font-semibold hover:bg-white hover:text-sky-600 transition-all duration-200">
              Request Partnership
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-gray-900 py-12">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="text-2xl font-bold text-white mb-4">SPMS</div>
          <p className="text-gray-400 mb-6">
            Empowering students through data-driven progress tracking
          </p>
          <div className="border-t border-gray-800 pt-6">
            <p className="text-gray-500 text-sm">
              © 2025 Student Progress Management System. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default About;
import React, { useState } from 'react';
import { User,Mail, Phone, Code, Star,  TrendingUp, Save, ArrowLeft, AlertCircle, CheckCircle, Bell, BellOff,UserCheck} from 'lucide-react';
import axios from "axios";
import { useNavigate } from 'react-router-dom';

interface StudentFormData {
  name: string;
  email: string;
  phoneNumber: string;
  codeforcesHandle: string;
  currentRating: number;
  maxRating: number;
  emailRemindersEnabled: boolean;
}

interface FormErrors {
  name?: string;
  email?: string;
  phoneNumber?: string;
  codeforcesHandle?: string;
  currentRating?: string;
  maxRating?: string; 
}

function AddStudent() {
  const [formData, setFormData] = useState<StudentFormData>({
    name: '',
    email: '',
    phoneNumber: '',
    codeforcesHandle: '',
    currentRating: 0,
    maxRating: 0,
    emailRemindersEnabled: true
  });
  const navigate= useNavigate();
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = 'Student name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Student name must be at least 2 characters';
    }
 

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Phone number validation
    const phoneRegex = /^\+?[\d\s\-\(\)]{10,}$/;
    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = 'Phone number is required';
    } else if (!phoneRegex.test(formData.phoneNumber)) {
      newErrors.phoneNumber = 'Please enter a valid phone number';
    }

    // Codeforces handle validation
    const handleRegex = /^[a-zA-Z0-9_]{3,24}$/;
    if (!formData.codeforcesHandle.trim()) {
      newErrors.codeforcesHandle = 'Codeforces handle is required';
    } else if (!handleRegex.test(formData.codeforcesHandle)) {
      newErrors.codeforcesHandle = 'Handle must be 3-24 characters (letters, numbers, underscore only)';
    }

    // Rating validation
    if (formData.currentRating < 0 || formData.currentRating > 4000) {
      newErrors.currentRating = 'Current rating must be between 0 and 4000';
    }

    if (formData.maxRating < 0 || formData.maxRating > 4000) {
      newErrors.maxRating = 'Max rating must be between 0 and 4000';
    }

    if (formData.maxRating < formData.currentRating) {
      newErrors.maxRating = 'Max rating cannot be less than current rating';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof StudentFormData, value: string | number | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Clear error for this field when user starts typing
    if (errors[field as keyof FormErrors]) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Simulate API call
      const token = localStorage.getItem("token");

      await axios.post("http://localhost:3000/api/student",formData,{
         headers: {
          token: token
        }
      })
      
      console.log('Student data to submit:', {
        ...formData,
        id: crypto.randomUUID(),
        lastSyncedAt:new Date(),
        inactiveReminders: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      
      setSubmitSuccess(true);
      setTimeout(() => {
        setFormData({
          name: '',
          email: '',
          phoneNumber: '',
          codeforcesHandle: '',
          currentRating: 0,
          maxRating: 0,
          emailRemindersEnabled: true
        });
        setSubmitSuccess(false);
      }, 3000);
      
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoBack = () => {
    // In a real app, this would navigate back to the student list
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <button 
            onClick={handleGoBack}
            className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors duration-200 mb-4"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Students
          </button>
          
          <div className="flex items-center mb-2">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl mr-4">
              <User className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Add New Student</h1>
              <p className="text-gray-600">Enter student details to add them to the SPMS system</p>
            </div>
          </div>
        </div>

        {/* Success Message */}
        {submitSuccess && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center">
            <CheckCircle className="w-5 h-5 text-green-600 mr-3" />
            <span className="text-green-800 font-medium">Student added successfully!</span>
          </div>
        )}

        {/* Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            

            {/* Student Information Section */}
            <div className="border-t pt-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <User className="w-5 h-5 mr-2 text-blue-600" />
                Student Information
              </h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                {/* Name Field */}
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Student Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 ${
                      errors.name ? 'border-red-300 bg-red-50' : 'border-gray-300'
                    }`}
                    placeholder="Enter student's full name"
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.name}
                    </p>
                  )}
                </div>

                {/* Email Field */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address <span className="text-red-500">*</span>
                    <span className="text-xs text-gray-500 ml-1">(must be unique)</span>
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      id="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className={`w-full pl-11 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 ${
                        errors.email ? 'border-red-300 bg-red-50' : 'border-gray-300'
                      }`}
                      placeholder="student@example.com"
                    />
                  </div>
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.email}
                    </p>
                  )}
                </div>

                {/* Phone Number Field */}
                <div>
                  <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                    <input
                      type="tel"
                      id="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                      className={`w-full pl-11 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 ${
                        errors.phoneNumber ? 'border-red-300 bg-red-50' : 'border-gray-300'
                      }`}
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>
                  {errors.phoneNumber && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.phoneNumber}
                    </p>
                  )}
                </div>

                {/* Codeforces Handle Field */}
                <div>
                  <label htmlFor="codeforcesHandle" className="block text-sm font-medium text-gray-700 mb-2">
                    Codeforces Handle <span className="text-red-500">*</span>
                    <span className="text-xs text-gray-500 ml-1">(must be unique)</span>
                  </label>
                  <div className="relative">
                    <Code className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      id="codeforcesHandle"
                      value={formData.codeforcesHandle}
                      onChange={(e) => handleInputChange('codeforcesHandle', e.target.value)}
                      className={`w-full pl-11 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 ${
                        errors.codeforcesHandle ? 'border-red-300 bg-red-50' : 'border-gray-300'
                      }`}
                      placeholder="username123"
                    />
                  </div>
                  {errors.codeforcesHandle && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.codeforcesHandle}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Rating Information Section */}
            <div className="border-t pt-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <Star className="w-5 h-5 mr-2 text-purple-600" />
                Rating Information
              </h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                {/* Current Rating Field */}
                <div>
                  <label htmlFor="currentRating" className="block text-sm font-medium text-gray-700 mb-2">
                    Current Rating
                    <span className="text-xs text-gray-500 ml-1">(default: 0)</span>
                  </label>
                  <div className="relative">
                    <Star className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                    <input
                      type="number"
                      id="currentRating"
                      min="0"
                      max="4000"
                      value={formData.currentRating}
                      onChange={(e) => handleInputChange('currentRating', parseInt(e.target.value) || 0)}
                      className={`w-full pl-11 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 ${
                        errors.currentRating ? 'border-red-300 bg-red-50' : 'border-gray-300'
                      }`}
                      placeholder="1200"
                    />
                  </div>
                  {errors.currentRating && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.currentRating}
                    </p>
                  )}
                </div>

                {/* Max Rating Field */}
                <div>
                  <label htmlFor="maxRating" className="block text-sm font-medium text-gray-700 mb-2">
                    Maximum Rating
                    <span className="text-xs text-gray-500 ml-1">(default: 0)</span>
                  </label>
                  <div className="relative">
                    <TrendingUp className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                    <input
                      type="number"
                      id="maxRating"
                      min="0"
                      max="4000"
                      value={formData.maxRating}
                      onChange={(e) => handleInputChange('maxRating', parseInt(e.target.value) || 0)}
                      className={`w-full pl-11 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 ${
                        errors.maxRating ? 'border-red-300 bg-red-50' : 'border-gray-300'
                      }`}
                      placeholder="1350"
                    />
                  </div>
                  {errors.maxRating && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.maxRating}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Notification Settings Section */}
            <div className="border-t pt-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <Bell className="w-5 h-5 mr-2 text-orange-600" />
                Notification Settings
              </h2>
              
              <div className="bg-gray-50 rounded-lg p-4">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.emailRemindersEnabled}
                    onChange={(e) => handleInputChange('emailRemindersEnabled', e.target.checked)}
                    className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <div className="ml-3">
                    <div className="flex items-center">
                      {formData.emailRemindersEnabled ? (
                        <Bell className="w-5 h-5 text-green-600 mr-2" />
                      ) : (
                        <BellOff className="w-5 h-5 text-gray-400 mr-2" />
                      )}
                      <span className="text-sm font-medium text-gray-900">
                        Enable Email Reminders
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      Send automatic email reminders when student is inactive for 7+ days
                      <span className="text-xs text-gray-500 ml-1">(default: enabled)</span>
                    </p>
                  </div>
                </label>
              </div>
            </div>

            {/* Submit Button */}
            <div className="border-t pt-6">
              <div className="flex flex-col sm:flex-row gap-4 justify-end">
                <button
                  type="button"
                  onClick={handleGoBack}
                  className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:border-gray-400 hover:bg-gray-50 transition-all duration-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold transition-all duration-200 flex items-center justify-center ${
                    isSubmitting 
                      ? 'opacity-75 cursor-not-allowed' 
                      : 'hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transform hover:-translate-y-1'
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Adding Student...
                    </>
                  ) : (
                    <>
                      <Save className="w-5 h-5 mr-2" />
                      Add Student
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* Info Cards */}
        <div className="mt-8 grid md:grid-cols-2 gap-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start">
              <AlertCircle className="w-5 h-5 text-blue-600 mr-3 mt-0.5" />
              <div>
                <h3 className="font-semibold text-blue-900 mb-1">Required Fields</h3>
                <p className="text-sm text-blue-800">
                  Fields marked with <span className="text-red-500">*</span> are required. 
                  Email and Codeforces handle must be unique across all students.
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <div className="flex items-start">
              <Code className="w-5 h-5 text-purple-600 mr-3 mt-0.5" />
              <div>
                <h3 className="font-semibold text-purple-900 mb-1">Auto-Generated Fields</h3>
                <p className="text-sm text-purple-800">
                  ID, timestamps, and sync data will be automatically generated. 
                  Inactive reminders counter starts at 0.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddStudent;
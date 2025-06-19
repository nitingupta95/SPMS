import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, ArrowRight } from 'lucide-react';
import { AuthLayout } from './Authlayout';
import { InputField } from './InputField';
import { validateEmail, validatePassword } from '../lib/validation';
import axios from 'axios';
import {toast} from "sonner";


interface LoginForm {
  email: string;
  password: string;
}


export const Login: React.FC = () => {
  const [form, setForm] = useState<LoginForm>({
    email: '',
    password: '',
  });
  const navigate= useNavigate();
  const [errors, setErrors] = useState<Partial<LoginForm>>({});
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: Partial<LoginForm> = {};
    
    const emailError = validateEmail(form.email);
    if (emailError) newErrors.email = emailError;
    
    const passwordError = validatePassword(form.password);
    if (passwordError) newErrors.password = passwordError;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

        
  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  if (!validateForm()) return;

  setIsLoading(true);

  try {
    const res = await axios.post("http://localhost:3000/api/signin", form);

    // ✅ Store token and username in localStorage
    localStorage.setItem("token", res.data.token);
    localStorage.setItem("username", res.data.username);
    localStorage.setItem("id", res.data.id);
    console.log("Login successful:", res.data);
    toast.success("login Successful");
    window.dispatchEvent(new Event("storage"));
     

    navigate("/");  
  } catch (error: any) {
    console.error("Login failed:", error?.response?.data || error.message);
    alert("Login failed: " + (error?.response?.data?.message || "Unknown error"));
  } finally {
    setIsLoading(false);
  }
};


useEffect(() => {
  const token = localStorage.getItem("token");
  if (token) navigate("/"); // redirect to home if already signed in
}, []);



  const updateForm = (field: keyof LoginForm) => (value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <AuthLayout
      title="Welcome Back"
      subtitle="Sign in to your account to continue"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <InputField
          label="Email Address"
          type="email"
          value={form.email}
          onChange={updateForm('email')}
          error={errors.email}
          placeholder="Enter your email"
          icon={<Mail className="h-5 w-5" />}
        />

        <InputField
          label="Password"
          type="password"
          value={form.password}
          onChange={updateForm('password')}
          error={errors.password}
          placeholder="Enter your password"
          icon={<Lock className="h-5 w-5" />}
        />

        <div className="flex items-center justify-between">
          <label className="flex items-center">
            <input
              type="checkbox"
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <span className="ml-2 text-sm text-gray-600">Remember me</span>
          </label>
          <Link
            to="/forgot-password"
            className="text-sm text-blue-600 hover:text-blue-500 transition-colors"
          >
            Forgot password?
          </Link>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          onClick={handleSubmit}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-4 rounded-lg font-medium flex items-center justify-center space-x-2 hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-[1.02]"
        >
          {isLoading ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              <span>Sign In</span>
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </button>

        <div className="text-center">
          <p className="text-gray-600">
            Don't have an account?{' '}
            <Link
              to="/signup"
              className="text-blue-600 hover:text-blue-500 font-medium transition-colors"
            >
              Create one here
            </Link>
          </p>
        </div>
      </form>
    </AuthLayout>
  );
};
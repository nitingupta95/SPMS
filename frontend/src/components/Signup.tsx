import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Lock, User, ArrowRight } from 'lucide-react';
import { AuthLayout } from './Authlayout';
import { InputField } from './InputField';
import { validateEmail, validatePassword, validateUsername, validateConfirmPassword } from '../lib/validation';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from "sonner"
interface User {
  id: string;
  username: string;
  email: string;
  password: string;
}


interface SignupForm {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}



export const Signup: React.FC = () => {
  const [form, setForm] = useState<SignupForm>({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const navigate= useNavigate();
  const [errors, setErrors] = useState<Partial<SignupForm>>({});
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: Partial<SignupForm> = {};
    
    const usernameError = validateUsername(form.username);
    if (usernameError) newErrors.username = usernameError;
    
    const emailError = validateEmail(form.email);
    if (emailError) newErrors.email = emailError;
    
    const passwordError = validatePassword(form.password);
    if (passwordError) newErrors.password = passwordError;
    
    const confirmPasswordError = validateConfirmPassword(form.password, form.confirmPassword);
    if (confirmPasswordError) newErrors.confirmPassword = confirmPasswordError;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

   

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  if (!validateForm()) return;

  setIsLoading(true);

  try {
    const res = await axios.post("http://localhost:3000/api/signup", form);

    // ✅ Save token and username
    localStorage.setItem("token", res.data.token);
    localStorage.setItem("username", res.data.username);
    localStorage.setItem("id", res.data.id);
    // ✅ Navigate to home/dashboard
    toast.success("Event has been created.")
    navigate("/");

    

  } catch (err: any) {
    toast.error("Signup error:", err);
    alert(err.response?.data?.message || "Signup failed");
  } finally {
    setIsLoading(false);
  }
};







  const updateForm = (field: keyof SignupForm) => (value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <AuthLayout
      title="Create Account"
      subtitle="Join us today and get started"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <InputField
          label="Username"
          type="text"
          value={form.username}
          onChange={updateForm('username')}
          error={errors.username}
          placeholder="Choose a username"
          icon={<User className="h-5 w-5" />}
        />

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
          placeholder="Create a strong password"
          icon={<Lock className="h-5 w-5" />}
        />

        <InputField
          label="Confirm Password"
          type="password"
          value={form.confirmPassword}
          onChange={updateForm('confirmPassword')}
          error={errors.confirmPassword}
          placeholder="Confirm your password"
          icon={<Lock className="h-5 w-5" />}
        />

        <div>
          <label className="flex items-start space-x-3">
            <input
              type="checkbox"
              required
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mt-1"
            />
            <span className="text-sm text-gray-600 leading-relaxed">
              I agree to the{' '}
              <Link to="/terms" className="text-blue-600 hover:text-blue-500 transition-colors">
                Terms of Service
              </Link>
              {' '}and{' '}
              <Link to="/privacy" className="text-blue-600 hover:text-blue-500 transition-colors">
                Privacy Policy
              </Link>
            </span>
          </label>
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
              <span>Create Account</span>
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </button>

        <div className="text-center">
          <p className="text-gray-600">
            Already have an account?{' '}
            <Link
              to="/login"
              className="text-blue-600 hover:text-blue-500 font-medium transition-colors"
            >
              Sign in here
            </Link>
          </p>
        </div>
      </form>
    </AuthLayout>
  );
};
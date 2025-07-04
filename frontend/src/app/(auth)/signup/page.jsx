'use client';
import { useForm } from 'react-hook-form';
import Link from 'next/link';
import { useState } from 'react';
import { Mail, Lock, User, Brain, Eye, EyeOff } from 'lucide-react';
import { Signup } from '@/services/auth';
import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';

export default function SignupPage() {
  const [showPassword, setShowPassword] = useState(false);
  const { isPending, mutate: createSignupTrigger } = useMutation({
    mutationFn: Signup,
    onError: (error) => {
      toast.error(error);
      console.log("Error:", error);
    },
    onSuccess: (data) => {
      toast.success("Signup successful! 🎉");
      console.log("Success:", data);
    },
  });

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();

  const onSubmit = async (data) => {
    console.log('Form submitted:', data);
    createSignupTrigger(data);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200">
      <div style={{ padding: '2rem' }} className="w-full max-w-md card bg-base-100 shadow-2xl border border-primary">
        <div style={{ marginBottom: '0.75rem' }} className="flex justify-center text-primary">
          <Brain size={40} strokeWidth={1.5} />
        </div>
        <h2 style={{ marginBottom: '0.5rem' }} className="text-3xl font-bold text-primary text-center">Create your account</h2>
        <p style={{ marginBottom: '2rem' }} className="text-center text-base-content/70">Join Studymate AI and start learning smarter!</p>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
          {/* Name */}
          <div>
            <label className="label" htmlFor="name">
              <span className="label-text font-semibold">Name</span>
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-base-content/50 z-10 w-5 h-5" />
              <input
                id="name"
                type="text"
                placeholder="Your Name"
                style={{ paddingLeft: '2.5rem' }}
                className={`input input-bordered w-full ${errors.name ? 'input-error' : ''}`}
                {...register('name', { required: 'Name is required' })}
              />
            </div>
            {errors.name && <span className="text-error text-sm">{errors.name.message}</span>}
          </div>

          {/* Email */}
          <div>
            <label className="label" htmlFor="email">
              <span className="label-text font-semibold">Email</span>
            </label>
            <div className="relative">
              <Mail className="absolute z-10 left-3 top-1/2 transform -translate-y-1/2 text-base-content/50 w-5 h-5" />
              <input
                id="email"
                type="email"
                placeholder="you@email.com"
                style={{ paddingLeft: '2.5rem' }}
                className={`input input-bordered w-full ${errors.email ? 'input-error' : ''}`}
                {...register('email', {
                  required: 'Email is required',
                  pattern: {
                    value: /^\S+@\S+$/i,
                    message: 'Enter a valid email address',
                  },
                })}
              />
            </div>
            {errors.email && <span className="text-error text-sm">{errors.email.message}</span>}
          </div>

          {/* Password */}
          <div>
            <label className="label" htmlFor="password">
              <span className="label-text font-semibold">Password</span>
            </label>
            <div className="relative">
              <Lock className="absolute z-10 left-3 top-1/2 transform -translate-y-1/2 text-base-content/50 w-5 h-5" />
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                style={{ paddingLeft: '2.5rem',paddingRight: '2.5rem' }}
                className={`input input-bordered w-full ${errors.password ? 'input-error' : ''}`}
                {...register('password', {
                  required: 'Password is required',
                  minLength: {
                    value: 6,
                    message: 'Password must be at least 6 characters',
                  },
                })}
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-base-content/50"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {errors.password && <span className="text-error text-sm">{errors.password.message}</span>}
          </div>

          {/* Submit */}
          <button
            style={{ marginTop: '2rem' }}
            type="submit"
            className="btn btn-primary w-full"
            disabled={isSubmitting}
          >
            {isPending ? (
              <span className="loading loading-spinner loading-sm"></span>
            ) : (
              'Sign Up'
            )}
          </button>

          {/*!isPending && (
            <div style={{ marginTop: '1rem', padding: '0.5rem 1rem' }} className="alert alert-success">
              <span>Signup successful! You can now <Link href="/login" className="link link-primary">login</Link>.</span>
            </div>
          )*/}
        </form>

        <div style={{ marginTop: '1.5rem' }} className="text-center text-sm">
          Already have an account?{' '}
          <Link href="/login" className="link link-hover text-primary font-semibold">
            Login
          </Link>
        </div>
      </div>
    </div>
  );
}

'use client';
import { useForm } from 'react-hook-form';
import Link from 'next/link';
import { useState } from 'react';
import { Mail, Lock, Brain, Eye, EyeOff } from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { Login } from '@/services/auth';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
    const { setAuthUser } = useAuthStore();
    const router = useRouter();
    const { isPending, mutate: createloginTrigger } = useMutation({
    mutationFn: Login,
    onError: (error) => {
      toast.error(error);
      console.log("Error:", error);
      setAuthUser(null);
    },
    onSuccess: (data) => {
      toast.success("Login successful! 🎉");
      setAuthUser(data.user);
      router.push("/dashboard");
    },
  });
  const [showPassword, setShowPassword] = useState(false);
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();
  const onSubmit = async (data) => {
    createloginTrigger(data);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200">
      <div style={{ padding: '2rem' }} className="w-full max-w-md card bg-base-100 shadow-2xl border border-primary">
        <div style={{ marginBottom: '0.75rem' }} className="flex justify-center text-primary">
          <Brain size={40} strokeWidth={1.5} />
        </div>
        <h2 style={{ marginBottom: '0.5rem' }} className="text-3xl font-bold text-primary text-center">Welcome Back</h2>
        <p style={{ marginBottom: '2rem' }} className="text-center text-base-content/70">Login to continue learning with Studymate AI</p>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
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
                style={{ paddingLeft: '2.5rem', paddingRight: '2.5rem' }}
                placeholder="••••••••"
                className={`input input-bordered w-full ${errors.password ? 'input-error' : ''}`}
                {...register('password', {
  required: 'Password is required',
  minLength: {
    value: 8,
    message: 'Password must be at least 8 characters',
  },
  pattern: {
    value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s]).{8,}$/,
    message: 'Password must include uppercase, lowercase, number, and special character',
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
              'Login'
            )}
          </button>

        </form>

        <div style={{ marginTop: '1.5rem' }} className="text-center text-sm">
          Don’t have an account?{' '}
          <Link href="/signup" className="link link-hover text-primary font-semibold">
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
}

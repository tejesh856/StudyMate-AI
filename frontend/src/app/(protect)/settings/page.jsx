'use client';
import { useEffect, useRef, useState } from 'react';
import { Sun, Moon, Lock, EyeOff, Eye, User, Mail, PencilIcon } from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
import { useThemeStore } from '@/store/useThemeStore';
import { useForm } from 'react-hook-form';
import Image from 'next/image';
import { convertToBase64, getInitials } from '@/lib/utils';
import { useMutation } from '@tanstack/react-query';
import { UpdatePassword, UpdateProfile } from '@/services/auth';
import toast from 'react-hot-toast';

export default function SettingsPage() {
  const { authUser, setAuthUser } = useAuthStore();
  const { theme,setTheme } = useThemeStore();
  const fileInputRef = useRef();
  const { mutate: updateProfileTrigger, isPending } = useMutation({
    mutationFn: UpdateProfile,
    onSuccess: (data) => {
      toast.success('Profile Details Updated');
      setAuthUser(data.user);
    },
    onError: (error) => {
      toast.error('❌ Failed to update profile. Try again!');
      console.error('Error:', error);
    },
  });
  const { mutate: updatePasswordTrigger, isPending:isPasswordUpdatePending } = useMutation({
    mutationFn: UpdatePassword,
    onSuccess: (data) => {
      toast.success('Password Updated');
      setPasswords({new:'',confirm:''});
    },
    onError: (error) => {
      toast.error('❌ Failed to update profile. Try again!');
      console.error('Error:', error);
    },
  });

  const handleImageClick = () => {
    fileInputRef.current.click(); // 👈 Trigger file explorer
  };
  const [passwords, setPasswords] = useState({
    new: '',
    confirm: '',
  });
  const [passwordErrors, setPasswordErrors] = useState({
  new: '',
  confirm: '',
});


  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: '',
      email: '',
      profilePic: ''
    },
  });
  const initials = getInitials(authUser?.name || 'Student');
  const profilePic = watch('profilePic');


  useEffect(() => {
    if (authUser) {
      reset({
        name: authUser.name || '',
        email: authUser.email || '',
        profilePic:authUser.profilePic||'',
      });
    }
  }, [authUser, reset]);

  const onSavePersonalInfo = (data) => {
    const hasChanges =
    data.name !== authUser?.name ||
    data.email !== authUser?.email ||
    data.profilePic !== authUser?.profilePic;

  if (!hasChanges) {
    return;
  }

  updateProfileTrigger(data);

  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }
    const base64 = await convertToBase64(file);
    setValue('profilePic', base64);
  };


  const [show, setShow] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const toggleVisibility = (field) => {
    setShow((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const onPasswordUpdate = () => {
  const newErrors = {
    new: '',
    confirm: '',
  };

  if (!passwords.new) {
    newErrors.new = 'New password is required';
  } else if (passwords.new.length < 6) {
    newErrors.new = 'Password must be at least 6 characters long';
  }

  if (!passwords.confirm) {
    newErrors.confirm = 'Please confirm your password';
  } else if (passwords.new !== passwords.confirm) {
    newErrors.confirm = 'Passwords do not match';
  }

  setPasswordErrors(newErrors);

  const hasErrors = newErrors.new || newErrors.confirm;
  if (hasErrors) return;

  updatePasswordTrigger({newPassword:passwords.new,confirmPassword:passwords.confirm});
  // Make API call
};

  return (
    <div style={{padding:'1.5rem'}} className="min-h-screen bg-base-200">
      <div style={{margin:'0rem auto'}} className="max-w-4xl flex flex-col gap-8">
        <h1 className="text-3xl font-bold text-primary">⚙️ Settings</h1>

        {/* Profile Settings */}
        <form onSubmit={handleSubmit(onSavePersonalInfo)} style={{padding:'1rem'}} className="card bg-base-100 shadow-md border border-base-300">
          <div className="card-body">
            <h2 style={{marginBottom:'1rem'}} className="card-title text-lg">👤 Personal Information</h2>

            <div className='flex justify-center'>
              <div className="relative w-32 h-32 rounded-full group cursor-pointer" onClick={handleImageClick}>
      {profilePic ? (
        <Image
          src={profilePic}
          fill
          alt="Profile"
          className="w-full h-full object-cover rounded-full border border-base-300"
        />
      ) : (
        <div
          className="w-full h-full rounded-full flex items-center justify-center text-white text-lg font-bold border border-base-300"
          style={{ backgroundColor: authUser?.color }}
        >
          {initials}
        </div>
      )}

      {/* Pencil Icon Overlay */}
      <div className="absolute bottom-0 right-5 bg-base-100 rounded-full p-1 shadow-sm ">
        <PencilIcon size={24} className="text-primary" />
      </div>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleImageUpload}
      />
    </div>
            </div>

            <div style={{marginBottom:'0.5rem',padding:'0.5rem'}} className="form-control flex flex-col gap-2">
              <label className="label">Name</label>
              <div className="relative w-full">
              <input
                type="text"
                style={{padding:'0rem 2rem',paddingRight:'2.5rem'}}
                className="input input-bordered w-full"
                {...register('name',{ required: 'Name is required' })}
              />
              <User className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/70" size={18} />
            </div>
            {errors.name && <p className="text-error text-sm">{errors.name.message}</p>}

            </div>

            <div style={{marginBottom:'0.5rem',padding:'0.5rem'}} className="form-control flex flex-col gap-2">
              <label className="label">Email</label>
              <div className="relative w-full">
              <input
                type="email"
                style={{padding:'0rem 2rem',paddingRight:'2.5rem'}}
                className="input input-bordered w-full"
                {...register('email', {
    required: 'Email is required',
    pattern: {
      value: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
      message: 'Invalid email format',
    }
  })}
              />
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/70" size={18} />
            </div>
            {errors.email && <p className="text-error text-sm">{errors.email.message}</p>}

            </div>

           


            <div style={{marginTop:'1rem'}}>
<button className="btn btn-primary btn-sm" disabled={isPending}>
  {isPending ? 'Saving...' : 'Save Changes'}
</button>
            </div>
          </div>
        </form>

        {/* Preferences */}
        <div style={{padding:'1rem'}} className="card bg-base-100 shadow-md border border-base-300">
          <div className="card-body">
            <h2 style={{marginBottom:'1rem'}} className="card-title text-lg">✨ Preferences</h2>

            <div style={{marginBottom:'0.75rem',padding:'0.5rem'}} className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                {theme==='dark' ? <Moon size={18} /> : <Sun size={18} />}
                Dark Mode
              </span>
              <input
                type="checkbox"
                className="toggle checked:border-primary checked:bg-primary checked:text-white"
                checked={theme==='dark'}
                onChange={() =>setTheme(theme === 'dark' ? 'light' : 'dark') }
              />
            </div>

            
          </div>
        </div>

        {/* Password Change */}
        <div
      style={{ padding: '1rem' }}
      className="card bg-base-100 shadow-md border border-base-300"
    >
      <div className="card-body">
        <h2
          style={{ marginBottom: '1rem' }}
          className="card-title text-lg"
        >
          🔐 Change Password
        </h2>

        {/* Current Password */}
        <div
          style={{ marginBottom: '0.75rem', padding: '0.5rem' }}
          className="form-control flex flex-col gap-2"
        >
          <label className="label"><Lock size={14} className="text-base-content/70" />Current Password</label>
          <div className="relative">
            <input
              type={'password'}
              className="input input-bordered w-full bg-base-200 text-base-content/50 cursor-not-allowed"
              style={{ padding: '0.5rem',paddingRight:'2.5rem' }}
              value="• • • • • • • •"
              readOnly
              disabled
            />
          </div>
        </div>

        {/* New Password */}
        <div
          style={{ marginBottom: '0.75rem', padding: '0.5rem' }}
          className="form-control flex flex-col gap-2"
        >
          <label className="label"><Lock size={14} className="text-base-content/70" />New Password</label>
          <div className="relative">
            <input
              type={show.new ? 'text' : 'password'}
              className="input input-bordered w-full"
              value={passwords.new}
              style={{ padding: '0.5rem',paddingRight:'2.5rem' }}
              onChange={(e) =>
                setPasswords({ ...passwords, new: e.target.value })
              }
            />
            <button
              type="button"
              onClick={() => toggleVisibility('new')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-base-content/70"
            >
              {show.new ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {passwordErrors.new && (
    <p style={{marginTop:'0.25rem'}} className="text-sm text-error">{passwordErrors.new}</p>
  )}
        </div>

        {/* Confirm Password */}
        <div
          style={{ marginBottom: '1rem', padding: '0.5rem' }}
          className="form-control flex flex-col gap-2"
        >
          <label className="label"><Lock size={14} className="text-base-content/70" />Confirm New Password</label>
          <div className="relative">
            <input
              type={show.confirm ? 'text' : 'password'}
              className="input input-bordered w-full"
              value={passwords.confirm}
              style={{ padding: '0.5rem',paddingRight:'2.5rem' }}
              onChange={(e) =>
                setPasswords({ ...passwords, confirm: e.target.value })
              }
            />
            <button
              type="button"
              onClick={() => toggleVisibility('confirm')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-base-content/70"
            >
              {show.confirm ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {passwordErrors.confirm && (
    <p style={{marginTop:'0.25rem'}} className="text-sm text-error">{passwordErrors.confirm}</p>
  )}
        </div>

        <button
  onClick={onPasswordUpdate}
  className="btn btn-accent btn-sm w-fit flex gap-2 items-center"
  disabled={isPasswordUpdatePending}
>
  <Lock size={16} />
  {isPasswordUpdatePending ? 'Updating...' : 'Update Password'}
</button>

      </div>
    </div>
      </div>
    </div>
  );
}

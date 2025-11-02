import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../contexts/AuthContext';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Save,
  Camera,
  Edit
} from 'lucide-react';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm({
    defaultValues: {
      first_name: user?.first_name || '',
      last_name: user?.last_name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      address: user?.address || ''
    }
  });

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    const result = await updateProfile(data);

    if (result.success) {
      toast.success('Profile updated successfully');
      setIsEditing(false);
    } else {
      toast.error(result.error || 'Failed to update profile');
    }
    setIsSubmitting(false);
  };

  const handleCancel = () => {
    reset();
    setIsEditing(false);
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'admin':
        return 'bg-red-100 text-red-800';
      case 'faculty':
        return 'bg-blue-100 text-blue-800';
      case 'student':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-6 bg-gradient-to-br from-blue-50 via-white to-purple-50 min-h-screen">
      <div className="max-w-7xl mx-auto font-inter">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Profile</h1>
            <p className="text-gray-600 mt-1">Manage your account information ✨</p>
          </div>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="px-5 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium flex items-center gap-2 shadow-md hover:shadow-lg transition mt-4 sm:mt-0"
          >
            <Edit className="w-5 h-5" />
            {isEditing ? 'Cancel' : 'Edit Profile'}
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <motion.div
            className="lg:col-span-1 bg-white rounded-2xl shadow-md p-6 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="relative inline-block mb-4">
              <div className="w-28 h-28 bg-gradient-to-tr from-primary-100 to-primary-200 rounded-full flex items-center justify-center mx-auto overflow-hidden shadow-lg">
                {user?.profile_picture ? (
                  <img
                    src={user.profile_picture}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="w-12 h-12 text-primary-600" />
                )}
              </div>
              {isEditing && (
                <button className="absolute bottom-0 right-0 w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center text-white hover:bg-primary-700 shadow-lg transition">
                  <Camera className="w-4 h-4" />
                </button>
              )}
            </div>

            <h2 className="text-xl md:text-2xl font-semibold text-gray-900 mb-1">{user?.first_name} {user?.last_name}</h2>
            <p className="text-gray-500 mb-2">@{user?.username}</p>
            <span className={`inline-flex px-3 py-1 text-sm font-medium rounded-full ${getRoleColor(user?.role)}`}>
              {user?.role?.toUpperCase()}
            </span>

            {user?.student_id && (
              <div className="mt-4 p-3 bg-gray-50 rounded-lg shadow-inner">
                <p className="text-sm text-gray-500">Student ID</p>
                <p className="font-medium text-gray-900">{user.student_id}</p>
              </div>
            )}
            {user?.faculty_id && (
              <div className="mt-4 p-3 bg-gray-50 rounded-lg shadow-inner">
                <p className="text-sm text-gray-500">Faculty ID</p>
                <p className="font-medium text-gray-900">{user.faculty_id}</p>
              </div>
            )}
          </motion.div>

          {/* Profile Form */}
          <motion.div
            className="lg:col-span-2 bg-white rounded-2xl shadow-md p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h3 className="text-xl font-semibold text-gray-900 mb-6">Personal Information</h3>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {['first_name', 'last_name'].map((field, i) => (
                  <div key={i}>
                    <label className="block text-sm font-medium text-gray-700 mb-2 capitalize">
                      {field.replace('_', ' ')}
                    </label>
                    {isEditing ? (
                      <input
                        {...register(field, { required: `${field.replace('_', ' ')} is required` })}
                        type="text"
                        className="input-field"
                      />
                    ) : (
                      <p className="text-gray-900 py-2">{user?.[field] || 'Not provided'}</p>
                    )}
                    {errors[field] && (
                      <p className="mt-1 text-sm text-red-600">{errors[field].message}</p>
                    )}
                  </div>
                ))}
              </div>

              {[
                { label: 'Email Address', field: 'email', icon: Mail, type: 'email' },
                { label: 'Phone Number', field: 'phone', icon: Phone, type: 'tel' },
              ].map((item, i) => (
                <div key={i}>
                  <label className="block text-sm font-medium text-gray-700 mb-2">{item.label}</label>
                  {isEditing ? (
                    <div className="relative">
                      <item.icon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        {...register(item.field)}
                        type={item.type}
                        className="input-field pl-10"
                      />
                    </div>
                  ) : (
                    <div className="flex items-center py-2">
                      <item.icon className="w-5 h-5 text-gray-400 mr-3" />
                      <p className="text-gray-900">{user?.[item.field] || 'Not provided'}</p>
                    </div>
                  )}
                </div>
              ))}

              {/* Address */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                {isEditing ? (
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                    <textarea
                      {...register('address')}
                      className="input-field pl-10"
                      rows={3}
                    />
                  </div>
                ) : (
                  <div className="flex items-start py-2">
                    <MapPin className="w-5 h-5 text-gray-400 mr-3 mt-1" />
                    <p className="text-gray-900">{user?.address || 'Not provided'}</p>
                  </div>
                )}
              </div>

              {isEditing && (
                <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-4 py-2 rounded-lg bg-primary-600 hover:bg-primary-700 text-white font-medium flex items-center transition disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    ) : (
                      <Save className="w-4 h-4 mr-2" />
                    )}
                    Save Changes
                  </button>
                </div>
              )}
            </form>

            {/* Account Information */}
            <div className="mt-8 bg-gray-50 p-5 rounded-xl shadow-inner">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Information</h3>
              <div className="space-y-4">
                {[
                  { label: 'Username', value: user?.username },
                  { label: 'Role', value: user?.role, color: getRoleColor(user?.role) },
                  { label: 'Member Since', value: user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A' },
                  { label: 'Last Updated', value: user?.updated_at ? new Date(user.updated_at).toLocaleDateString() : 'N/A' }
                ].map((item, i) => (
                  <div key={i} className="flex justify-between items-center py-2 border-b border-gray-200 last:border-b-0">
                    <span className="text-sm font-medium text-gray-600">{item.label}</span>
                    {item.color ? (
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${item.color}`}>
                        {item.value?.toUpperCase()}
                      </span>
                    ) : (
                      <span className="text-sm text-gray-900">{item.value}</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
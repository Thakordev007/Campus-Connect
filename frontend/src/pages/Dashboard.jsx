import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { apiService } from "../services/api";
import {
  Calendar,
  BookOpen,
  Award,
  FileText,
  Users,
  TrendingUp,
  Clock,
  CheckCircle,
} from "lucide-react";
import LoadingSpinner from "../components/LoadingSpinner/LoadingSpinner";
import toast from "react-hot-toast";

const Dashboard = () => {
  const { user, isAdmin, isFaculty, isStudent } = useAuth();
  const [stats, setStats] = useState(null);
  const [recentEvents, setRecentEvents] = useState([]);
  const [recentExams, setRecentExams] = useState([]);
  const [recentResults, setRecentResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      const statsResponse = await apiService.getDashboardStats();
      setStats(statsResponse.data);

      const eventsResponse = await apiService.getEvents({ page_size: 5 });
      setRecentEvents(eventsResponse.data.results || []);

      const examsResponse = await apiService.getExams({ page_size: 5 });
      setRecentExams(examsResponse.data.results || []);

      if (isStudent || isFaculty) {
        const resultsResponse = await apiService.getResults({ page_size: 5 });
        setRecentResults(resultsResponse.data.results || []);
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      toast.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getRoleBasedStats = () => {
    if (!stats) return [];

    if (isAdmin) {
      return [
        { label: "Total Events", value: stats.total_events, icon: Calendar, color: "bg-blue-100 text-blue-600" },
        { label: "Total Exams", value: stats.total_exams, icon: BookOpen, color: "bg-emerald-100 text-emerald-600" },
        { label: "Total Results", value: stats.total_results, icon: Award, color: "bg-amber-100 text-amber-600" },
        { label: "Total Materials", value: stats.total_materials, icon: FileText, color: "bg-purple-100 text-purple-600" },
        { label: "Total Users", value: stats.total_users, icon: Users, color: "bg-rose-100 text-rose-600" },
      ];
    } else if (isFaculty) {
      return [
        { label: "My Events", value: stats.my_events, icon: Calendar, color: "bg-blue-100 text-blue-600" },
        { label: "My Exams", value: stats.my_exams, icon: BookOpen, color: "bg-emerald-100 text-emerald-600" },
        { label: "My Results", value: stats.my_results, icon: Award, color: "bg-amber-100 text-amber-600" },
        { label: "My Materials", value: stats.my_materials, icon: FileText, color: "bg-purple-100 text-purple-600" },
      ];
    } else {
      return [
        { label: "My Results", value: stats.my_results, icon: Award, color: "bg-amber-100 text-amber-600" },
        { label: "Available Events", value: stats.available_events, icon: Calendar, color: "bg-blue-100 text-blue-600" },
        { label: "Available Exams", value: stats.available_exams, icon: BookOpen, color: "bg-emerald-100 text-emerald-600" },
        { label: "Available Materials", value: stats.available_materials, icon: FileText, color: "bg-purple-100 text-purple-600" },
      ];
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <LoadingSpinner size="lg" className="py-20" />
      </div>
    );
  }

  const roleBasedStats = getRoleBasedStats();

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {getGreeting()}, {user?.first_name || user?.username} 👋
        </h1>
        <p className="text-gray-600">
          Welcome to your <span className="font-semibold text-indigo-600">Campus Connect</span> dashboard. ✨
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {roleBasedStats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className="bg-white rounded-xl shadow-md hover:shadow-xl transition transform hover:-translate-y-1 p-5 flex items-center gap-4"
            >
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${stat.color}`}>
                <Icon className="w-6 h-6" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-sm text-gray-600">{stat.label}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="mb-10">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">🚀 Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {isAdmin && (
            <>
              <button className="bg-white rounded-xl shadow-md hover:shadow-xl hover:-translate-y-1 transition p-5 text-left">
                <Calendar className="w-8 h-8 text-blue-600 mb-2" />
                <h3 className="font-semibold text-gray-900">Create Event</h3>
                <p className="text-sm text-gray-600">Schedule a new campus event</p>
              </button>
              <button className="bg-white rounded-xl shadow-md hover:shadow-xl hover:-translate-y-1 transition p-5 text-left">
                <Users className="w-8 h-8 text-rose-600 mb-2" />
                <h3 className="font-semibold text-gray-900">Manage Users</h3>
                <p className="text-sm text-gray-600">Add or edit user accounts</p>
              </button>
            </>
          )}
          {isFaculty && (
            <>
              <button className="bg-white rounded-xl shadow-md hover:shadow-xl hover:-translate-y-1 transition p-5 text-left">
                <BookOpen className="w-8 h-8 text-emerald-600 mb-2" />
                <h3 className="font-semibold text-gray-900">Create Exam</h3>
                <p className="text-sm text-gray-600">Schedule a new examination</p>
              </button>
              <button className="bg-white rounded-xl shadow-md hover:shadow-xl hover:-translate-y-1 transition p-5 text-left">
                <FileText className="w-8 h-8 text-purple-600 mb-2" />
                <h3 className="font-semibold text-gray-900">Upload Material</h3>
                <p className="text-sm text-gray-600">Share study materials</p>
              </button>
            </>
          )}
          <button className="bg-white rounded-xl shadow-md hover:shadow-xl hover:-translate-y-1 transition p-5 text-left">
            <Award className="w-8 h-8 text-amber-600 mb-2" />
            <h3 className="font-semibold text-gray-900">View Results</h3>
            <p className="text-sm text-gray-600">Check exam results</p>
          </button>
          <button className="bg-white rounded-xl shadow-md hover:shadow-xl hover:-translate-y-1 transition p-5 text-left">
            <TrendingUp className="w-8 h-8 text-indigo-600 mb-2" />
            <h3 className="font-semibold text-gray-900">Analytics</h3>
            <p className="text-sm text-gray-600">View performance metrics</p>
          </button>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Events */}
        <div className="bg-white rounded-xl shadow-md p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">📅 Recent Events</h3>
            <a href="/events" className="text-indigo-600 hover:text-indigo-700 text-sm font-medium">
              View all
            </a>
          </div>
          <div className="space-y-3">
            {recentEvents.length > 0 ? (
              recentEvents.map((event, index) => (
                <div key={index} className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-indigo-50 transition">
                  <Calendar className="w-5 h-5 text-blue-600 mr-3" />
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{event.title}</p>
                    <p className="text-sm text-gray-600">{formatDate(event.date)}</p>
                  </div>
                  <Clock className="w-4 h-4 text-gray-400" />
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-4">No recent events</p>
            )}
          </div>
        </div>

        {/* Recent Exams */}
        <div className="bg-white rounded-xl shadow-md p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">📝 Recent Exams</h3>
            <a href="/exams" className="text-indigo-600 hover:text-indigo-700 text-sm font-medium">
              View all
            </a>
          </div>
          <div className="space-y-3">
            {recentExams.length > 0 ? (
              recentExams.map((exam, index) => (
                <div key={index} className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-emerald-50 transition">
                  <BookOpen className="w-5 h-5 text-emerald-600 mr-3" />
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{exam.title}</p>
                    <p className="text-sm text-gray-600">
                      {exam.subject} • {formatDate(exam.date)}
                    </p>
                  </div>
                  <Clock className="w-4 h-4 text-gray-400" />
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-4">No recent exams</p>
            )}
          </div>
        </div>
      </div>

      {/* Recent Results (for students and faculty) */}
      {(isStudent || isFaculty) && (
        <div className="mt-10">
          <div className="bg-white rounded-xl shadow-md p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">🏆 Recent Results</h3>
              <a href="/results" className="text-indigo-600 hover:text-indigo-700 text-sm font-medium">
                View all
              </a>
            </div>
            <div className="space-y-3">
              {recentResults.length > 0 ? (
                recentResults.map((result, index) => (
                  <div
                    key={index}
                    className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-amber-50 transition"
                  >
                    <Award className="w-5 h-5 text-amber-600 mr-3" />
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{result.exam_title}</p>
                      <p className="text-sm text-gray-600">
                        {result.marks_obtained}/{result.total_marks} • Grade: {result.grade}
                      </p>
                    </div>
                    <CheckCircle className="w-4 h-4 text-emerald-500" />
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-4">No recent results</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Role-specific content */}
      {isAdmin && (
        <div className="mt-10">
          <div className="bg-white rounded-xl shadow-md p-5">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">📊 System Overview</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div className="text-center p-5 bg-blue-50 rounded-lg">
                <Users className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-blue-600">{stats?.total_users || 0}</p>
                <p className="text-sm text-gray-600">Total Users</p>
              </div>
              <div className="text-center p-5 bg-emerald-50 rounded-lg">
                <TrendingUp className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-emerald-600">99.9%</p>
                <p className="text-sm text-gray-600">System Uptime</p>
              </div>
              <div className="text-center p-5 bg-purple-50 rounded-lg">
                <FileText className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-purple-600">1.2GB</p>
                <p className="text-sm text-gray-600">Storage Used</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;

import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  Calendar, 
  BookOpen, 
  Award, 
  FileText, 
  Users, 
  BarChart3,
  ArrowRight,
  CheckCircle,
  Star
} from 'lucide-react';
import { motion } from 'framer-motion';

const Home = () => {
  const { isAuthenticated, user } = useAuth();

  const features = [
    {
      icon: Calendar,
      title: 'Event Management',
      description: 'Create, manage, and track campus events with ease.',
      color: 'bg-blue-100 text-blue-600'
    },
    {
      icon: BookOpen,
      title: 'Exam System',
      description: 'Comprehensive exam management and scheduling system.',
      color: 'bg-green-100 text-green-600'
    },
    {
      icon: Award,
      title: 'Results & Grades',
      description: 'Track student performance and manage academic records.',
      color: 'bg-yellow-100 text-yellow-600'
    },
    {
      icon: FileText,
      title: 'Study Materials',
      description: 'Share and organize educational resources and documents.',
      color: 'bg-purple-100 text-purple-600'
    },
    {
      icon: Users,
      title: 'User Management',
      description: 'Role-based access control for students, faculty, and admins.',
      color: 'bg-red-100 text-red-600'
    },
    {
      icon: BarChart3,
      title: 'Analytics',
      description: 'Comprehensive insights and reporting dashboard.',
      color: 'bg-indigo-100 text-indigo-600'
    }
  ];

  const stats = [
    { label: 'Active Students', value: '2,500+' },
    { label: 'Faculty Members', value: '150+' },
    { label: 'Events This Year', value: '200+' },
    { label: 'Study Materials', value: '1,000+' }
  ];

  return (
    <div className="min-h-screen font-inter">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 via-primary-700 to-primary-800 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-[url('/pattern.svg')] bg-cover" />
        <div className="relative max-w-7xl mx-auto px-6 py-28 text-center">
          <motion.h1 
            className="text-4xl md:text-6xl font-extrabold mb-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Welcome to <span className="text-yellow-300">Campus Connect</span>
          </motion.h1>
          <motion.p 
            className="text-lg md:text-2xl mb-10 text-primary-100 max-w-3xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            The all-in-one platform connecting students, faculty, and administrators in a seamless academic environment. ✨
          </motion.p>
          
          {!isAuthenticated ? (
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/register"
                className="bg-white text-primary-700 px-8 py-3 rounded-xl font-semibold shadow hover:shadow-lg transition"
              >
                Get Started
              </Link>
              <Link
                to="/login"
                className="border-2 border-white text-white px-8 py-3 rounded-xl font-semibold hover:bg-white hover:text-primary-700 transition"
              >
                Sign In
              </Link>
            </div>
          ) : (
            <div>
              <p className="text-xl mb-4">Welcome back, {user?.first_name}!</p>
              <Link
                to="/dashboard"
                className="bg-white text-primary-700 px-8 py-3 rounded-xl font-semibold inline-flex items-center shadow hover:shadow-lg transition"
              >
                Go to Dashboard
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div 
              key={index} 
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
            >
              <div className="text-3xl md:text-4xl font-bold text-primary-700 mb-2">
                {stat.value}
              </div>
              <div className="text-gray-600">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Everything You Need for Campus Management
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Manage events, exams, grades, and more with our all-in-one academic solution.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div 
                  key={index} 
                  className="bg-white rounded-2xl shadow hover:shadow-xl transition p-6 text-center"
                  whileHover={{ scale: 1.03 }}
                >
                  <div className={`w-14 h-14 flex items-center justify-center rounded-xl mx-auto mb-6 ${feature.color}`}>
                    <Icon className="w-7 h-7" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">
              Why Choose <span className="text-primary-600">Campus Connect?</span>
            </h2>
            <div className="space-y-6">
              {[
                { title: 'Streamlined Workflow', desc: 'Automated processes reduce admin overhead.' },
                { title: 'Real-time Collaboration', desc: 'Seamless communication between all roles.' },
                { title: 'Data Security', desc: 'Enterprise-grade security for sensitive data.' },
                { title: 'Mobile Responsive', desc: 'Access features anywhere, on any device.' }
              ].map((benefit, i) => (
                <motion.div 
                  key={i} 
                  className="flex items-start"
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.2 }}
                >
                  <CheckCircle className="w-6 h-6 text-green-500 mt-1 mr-3" />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{benefit.title}</h3>
                    <p className="text-gray-600">{benefit.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          <motion.div 
            className="bg-gradient-to-br from-primary-50 to-primary-100 rounded-2xl p-10 shadow-lg"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <div className="text-center">
              <Star className="w-16 h-16 text-primary-600 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Trusted by Thousands
              </h3>
              <p className="text-gray-600 mb-6">
                "Campus Connect has revolutionized how we manage academics. 
                Intuitive, powerful, and time-saving."
              </p>
              <div className="text-sm text-gray-500">
                – Dr. Sarah Johnson, Academic Director
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      {!isAuthenticated && (
        <section className="py-20 bg-gradient-to-r from-primary-700 to-primary-900 text-center text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Transform Your Campus?
          </h2>
          <p className="text-lg text-primary-100 mb-10 max-w-2xl mx-auto">
            Join our community and experience the future of campus management today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register"
              className="bg-white text-primary-700 px-8 py-3 rounded-xl font-semibold shadow hover:shadow-lg transition"
            >
              Start Free Trial
            </Link>
            <Link
              to="/contact"
              className="border-2 border-white text-white px-8 py-3 rounded-xl font-semibold hover:bg-white hover:text-primary-700 transition"
            >
              Contact Sales
            </Link>
          </div>
        </section>
      )}
    </div>
  );
};

export default Home;

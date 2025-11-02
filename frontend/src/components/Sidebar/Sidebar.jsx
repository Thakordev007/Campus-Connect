import { NavLink } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import {
  LayoutDashboard,
  Calendar,
  BookOpen,
  Award,
  FileText,
  User,
  Users,
  BarChart3,
  X
} from 'lucide-react';

const Sidebar = () => {
  const { user, isAdmin } = useAuth();

  const getNavigationItems = () => {
    const baseItems = [
      { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard, roles: ['admin','faculty','student'] },
      { name: 'Events', href: '/events', icon: Calendar, roles: ['admin','faculty','student'] },
      { name: 'Exams', href: '/exams', icon: BookOpen, roles: ['admin','faculty','student'] },
      { name: 'Results', href: '/results', icon: Award, roles: ['admin','faculty','student'] },
      { name: 'Study Materials', href: '/materials', icon: FileText, roles: ['admin','faculty','student'] }
    ];

    if (isAdmin) {
      baseItems.push(
        { name: 'Users', href: '/admin/users', icon: Users, roles: ['admin'] },
        { name: 'Analytics', href: '/admin/analytics', icon: BarChart3, roles: ['admin'] }
      );
    }

    baseItems.push({ name: 'Profile', href: '/profile', icon: User, roles: ['admin','faculty','student'] });

    return baseItems.filter(item => item.roles.includes(user?.role));
  };

  const navigationItems = getNavigationItems();

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden md:flex md:flex-col md:fixed md:inset-y-0 md:w-64 md:pt-16 bg-white border-r border-gray-200 shadow-sm z-30">
        <div className="flex-1 flex flex-col min-h-0">
          {/* Brand */}
          <div className="h-16 px-4 border-b hidden md:flex items-center">
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">CC</span>
            </div>
            <span className="ml-2 font-semibold text-gray-900">Campus Connect</span>
          </div>

          <div className="flex-1 flex flex-col pb-4 overflow-y-auto">
            <nav className="mt-4 flex-1 px-2 space-y-1">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.name}
                    to={item.href}
                    className={({ isActive }) =>
                      `sidebar-link ${isActive ? 'active' : ''}`
                    }
                  >
                    <Icon className="w-5 h-5 mr-3" />
                    {item.name}
                  </NavLink>
                );
              })}
            </nav>
          </div>

          {/* User Info */}
          <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-primary-600" />
                </div>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-700">
                  {user?.first_name} {user?.last_name}
                </p>
                <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile sidebar (off-canvas) */}
      <input id="sidebar-drawer" type="checkbox" className="peer hidden" />

      <div className="md:hidden fixed inset-0 z-50 pointer-events-none peer-checked:pointer-events-auto">
        <label htmlFor="sidebar-drawer" className="absolute inset-0 bg-black/40 transition-opacity"></label>
        <div className="absolute inset-y-0 left-0 w-72 bg-white shadow-xl flex flex-col transform -translate-x-full peer-checked:translate-x-0 transition-transform duration-300">
          <div className="flex items-center justify-between px-4 h-16 border-b">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">CC</span>
              </div>
              <span className="font-semibold">Campus Connect</span>
            </div>
            <label htmlFor="sidebar-drawer" className="text-gray-600 hover:text-gray-900 cursor-pointer">
              <X className="w-5 h-5" />
            </label>
          </div>

          <nav className="flex-1 overflow-y-auto p-3 space-y-1">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.name}
                  to={item.href}
                  className={({ isActive }) =>
                    `flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                      isActive
                        ? 'bg-primary-50 text-primary-700'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`
                  }
                >
                  <Icon className="w-5 h-5 mr-3" />
                  {item.name}
                </NavLink>
              );
            })}
          </nav>

          <div className="border-t p-4">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-primary-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-700">
                  {user?.first_name} {user?.last_name}
                </p>
                <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;

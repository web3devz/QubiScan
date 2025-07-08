import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Shield, Home, BookOpen, History, Code } from 'lucide-react';

export default function Header() {
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/audit', label: 'Audit', icon: Code },
    { path: '/learn', label: 'Learn', icon: BookOpen },
    { path: '/gallery', label: 'Gallery', icon: History },
  ];

  return (
    <header className="bg-gradient-to-r from-purple-900 via-blue-900 to-purple-900 text-white shadow-lg">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
            <Shield className="h-8 w-8 text-purple-300" />
            <span className="text-2xl font-bold bg-gradient-to-r from-purple-300 to-blue-300 bg-clip-text text-transparent">
              QubiScan
            </span>
          </Link>
          
          <nav className="hidden md:flex space-x-8">
            {navItems.map(({ path, label, icon: Icon }) => (
              <Link
                key={path}
                to={path}
                className={`flex items-center space-x-1 px-3 py-2 rounded-lg transition-all hover:bg-white/10 ${
                  location.pathname === path
                    ? 'bg-white/20 text-purple-200'
                    : 'text-white/80 hover:text-white'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{label}</span>
              </Link>
            ))}
          </nav>

          <div className="md:hidden">
            <button className="text-white hover:text-purple-200 transition-colors">
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
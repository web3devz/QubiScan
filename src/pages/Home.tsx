import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Code, BookOpen, History, ArrowRight, Zap, Users, Award } from 'lucide-react';

export default function Home() {
  const features = [
    {
      icon: Code,
      title: 'Smart Contract Analysis',
      description: 'Advanced static analysis with AI-powered insights for Qubic C++ contracts'
    },
    {
      icon: Shield,
      title: 'Security Focused',
      description: 'Comprehensive security checks covering common vulnerabilities and best practices'
    },
    {
      icon: BookOpen,
      title: 'Interactive Learning',
      description: 'Learn secure coding practices through hands-on tutorials and examples'
    },
    {
      icon: History,
      title: 'Audit History',
      description: 'Track your audits, compare results, and monitor security improvements over time'
    }
  ];

  const stats = [
    { icon: Zap, value: '15+', label: 'Security Patterns' },
    { icon: Users, value: '1K+', label: 'Audits Completed' },
    { icon: Award, value: '99%', label: 'Accuracy Rate' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-purple-50">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-20">
        <div className="text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center space-x-2 bg-purple-100 text-purple-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Shield className="h-4 w-4" />
            <span>Advanced Smart Contract Security</span>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Secure Your{' '}
            <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Qubic Contracts
            </span>
          </h1>
          
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            QubiScan is a comprehensive platform for analyzing, learning, and securing smart contracts
            on the Qubic Network. Get AI-powered insights, detailed security reports, and interactive tutorials.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/audit"
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all hover:scale-105 hover:shadow-lg font-semibold"
            >
              Start Audit
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            
            <Link
              to="/learn"
              className="inline-flex items-center px-8 py-4 bg-white text-purple-600 rounded-xl hover:bg-purple-50 transition-all hover:scale-105 hover:shadow-lg border border-purple-200 font-semibold"
            >
              Learn Security
              <BookOpen className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center bg-white/60 backdrop-blur-sm rounded-2xl p-8 hover:shadow-lg transition-shadow">
              <stat.icon className="h-12 w-12 text-purple-600 mx-auto mb-4" />
              <div className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</div>
              <div className="text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Everything You Need for Smart Contract Security
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Comprehensive tools and resources to ensure your Qubic smart contracts are secure, efficient, and production-ready.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 hover:shadow-lg transition-all hover:scale-105">
              <feature.icon className="h-12 w-12 text-purple-600 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
              <p className="text-gray-600 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="container mx-auto px-4 py-20">
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-3xl p-12 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Ready to Secure Your Contracts?</h2>
          <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
            Join thousands of developers who trust QubiScan for their smart contract security needs.
          </p>
          <Link
            to="/audit"
            className="inline-flex items-center px-8 py-4 bg-white text-purple-600 rounded-xl hover:bg-purple-50 transition-all hover:scale-105 hover:shadow-lg font-semibold"
          >
            Start Your First Audit
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
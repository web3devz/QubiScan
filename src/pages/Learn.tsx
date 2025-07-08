import React, { useState } from 'react';
import { BookOpen, Code, Shield, AlertTriangle, AlertCircle, Info, X } from 'lucide-react';
import { securityTutorials } from '../data/tutorials';
import { Tutorial } from '../types/audit';

export default function Learn() {
  const [selectedTutorial, setSelectedTutorial] = useState<Tutorial | null>(null);
  const [activeTab, setActiveTab] = useState<'vulnerable' | 'secure'>('vulnerable');

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'High':
        return <AlertTriangle className="h-5 w-5 text-red-500" />;
      case 'Medium':
        return <AlertCircle className="h-5 w-5 text-yellow-500" />;
      case 'Low':
        return <Info className="h-5 w-5 text-blue-500" />;
      default:
        return <Info className="h-5 w-5 text-gray-500" />;
    }
  };

  const getSeverityStyles = (severity: string) => {
    switch (severity) {
      case 'High':
        return 'bg-red-50 border-red-200 hover:bg-red-100';
      case 'Medium':
        return 'bg-yellow-50 border-yellow-200 hover:bg-yellow-100';
      case 'Low':
        return 'bg-blue-50 border-blue-200 hover:bg-blue-100';
      default:
        return 'bg-gray-50 border-gray-200 hover:bg-gray-100';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-purple-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center space-x-2 bg-purple-100 text-purple-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <BookOpen className="h-4 w-4" />
            <span>Security Education</span>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Learn Smart Contract Security
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Master secure coding practices for Qubic smart contracts through interactive tutorials
            and real-world examples.
          </p>
        </div>

        {/* Tutorial Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {securityTutorials.map((tutorial) => (
            <div
              key={tutorial.id}
              onClick={() => setSelectedTutorial(tutorial)}
              className={`cursor-pointer rounded-2xl border-2 p-6 transition-all hover:shadow-lg hover:scale-105 ${getSeverityStyles(tutorial.severity)}`}
            >
              <div className="flex items-center justify-between mb-4">
                {getSeverityIcon(tutorial.severity)}
                <span className={`text-xs font-medium px-2 py-1 rounded ${
                  tutorial.severity === 'High' ? 'bg-red-200 text-red-800' :
                  tutorial.severity === 'Medium' ? 'bg-yellow-200 text-yellow-800' :
                  'bg-blue-200 text-blue-800'
                }`}>
                  {tutorial.severity}
                </span>
              </div>
              
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {tutorial.title}
              </h3>
              
              <p className="text-gray-600 text-sm leading-relaxed">
                {tutorial.description}
              </p>
              
              <div className="mt-4 flex items-center text-purple-600 text-sm font-medium">
                <Code className="h-4 w-4 mr-2" />
                View Tutorial
              </div>
            </div>
          ))}
        </div>

        {/* Tutorial Modal */}
        {selectedTutorial && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {getSeverityIcon(selectedTutorial.severity)}
                    <h2 className="text-2xl font-bold text-gray-900">
                      {selectedTutorial.title}
                    </h2>
                    <span className={`text-xs font-medium px-2 py-1 rounded ${
                      selectedTutorial.severity === 'High' ? 'bg-red-200 text-red-800' :
                      selectedTutorial.severity === 'Medium' ? 'bg-yellow-200 text-yellow-800' :
                      'bg-blue-200 text-blue-800'
                    }`}>
                      {selectedTutorial.severity}
                    </span>
                  </div>
                  <button
                    onClick={() => setSelectedTutorial(null)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>
              </div>
              
              <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
                <div className="mb-6">
                  <p className="text-gray-700 leading-relaxed">
                    {selectedTutorial.explanation}
                  </p>
                </div>
                
                {/* Code Tabs */}
                <div className="mb-4">
                  <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
                    <button
                      onClick={() => setActiveTab('vulnerable')}
                      className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                        activeTab === 'vulnerable'
                          ? 'bg-white text-red-600 shadow-sm'
                          : 'text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      <AlertTriangle className="h-4 w-4 inline mr-2" />
                      Vulnerable Code
                    </button>
                    <button
                      onClick={() => setActiveTab('secure')}
                      className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                        activeTab === 'secure'
                          ? 'bg-white text-green-600 shadow-sm'
                          : 'text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      <Shield className="h-4 w-4 inline mr-2" />
                      Secure Code
                    </button>
                  </div>
                </div>
                
                {/* Code Display */}
                <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
                  <pre className="text-sm text-gray-100">
                    <code>
                      {activeTab === 'vulnerable' ? selectedTutorial.badCode : selectedTutorial.fixedCode}
                    </code>
                  </pre>
                </div>
                
                {/* Key Points */}
                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <h3 className="font-semibold text-blue-900 mb-2">Key Security Points:</h3>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Always validate input parameters</li>
                    <li>• Use safe string functions to prevent buffer overflows</li>
                    <li>• Implement proper access controls</li>
                    <li>• Check for integer overflow conditions</li>
                    <li>• Update state before external calls</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
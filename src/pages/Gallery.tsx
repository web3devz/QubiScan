import React, { useState } from 'react';
import { History, Download, Code, Calendar, TrendingUp, Filter, Search } from 'lucide-react';
import { useAudit } from '../context/AuditContext';
import { generateAuditReport } from '../utils/pdfGenerator';
import ScoreDisplay from '../components/ScoreDisplay';
import SecurityIssueCard from '../components/SecurityIssueCard';

export default function Gallery() {
  const { state, dispatch } = useAudit();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAudit, setSelectedAudit] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'date' | 'score' | 'name'>('date');

  const filteredAudits = state.auditHistory
    .filter(audit => 
      audit.contractName.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
        case 'score':
          return b.score - a.score;
        case 'name':
          return a.contractName.localeCompare(b.contractName);
        default:
          return 0;
      }
    });

  const selectedAuditData = selectedAudit 
    ? state.auditHistory.find(audit => audit.id === selectedAudit)
    : null;

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const averageScore = state.auditHistory.length > 0 
    ? Math.round(state.auditHistory.reduce((sum, audit) => sum + audit.score, 0) / state.auditHistory.length)
    : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-purple-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 mb-8 shadow-lg">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <div className="inline-flex items-center space-x-2 bg-purple-100 text-purple-800 px-4 py-2 rounded-full text-sm font-medium mb-4">
                <History className="h-4 w-4" />
                <span>Audit History</span>
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Audit Gallery</h1>
              <p className="text-gray-600">Review and manage your smart contract audit history</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              <div className="bg-white/80 rounded-lg p-4">
                <div className="text-2xl font-bold text-gray-900">{state.auditHistory.length}</div>
                <div className="text-sm text-gray-600">Total Audits</div>
              </div>
              <div className="bg-white/80 rounded-lg p-4">
                <div className={`text-2xl font-bold ${getScoreColor(averageScore)}`}>
                  {averageScore}
                </div>
                <div className="text-sm text-gray-600">Average Score</div>
              </div>
              <div className="bg-white/80 rounded-lg p-4">
                <div className="text-2xl font-bold text-blue-600">
                  {state.auditHistory.filter(a => a.score >= 80).length}
                </div>
                <div className="text-sm text-gray-600">Secure Contracts</div>
              </div>
            </div>
          </div>
        </div>

        {state.auditHistory.length === 0 ? (
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-12 text-center shadow-lg">
            <History className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">No Audits Yet</h2>
            <p className="text-gray-600 mb-6">
              Start auditing your smart contracts to build your audit history.
            </p>
            <button
              onClick={() => window.location.href = '/audit'}
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all"
            >
              Start First Audit
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Audit List */}
            <div className="lg:col-span-2">
              <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
                {/* Controls */}
                <div className="flex flex-col md:flex-row gap-4 mb-6">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search contracts..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as 'date' | 'score' | 'name')}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="date">Sort by Date</option>
                    <option value="score">Sort by Score</option>
                    <option value="name">Sort by Name</option>
                  </select>
                </div>

                {/* Audit Cards */}
                <div className="space-y-4">
                  {filteredAudits.map((audit) => (
                    <div
                      key={audit.id}
                      onClick={() => setSelectedAudit(audit.id)}
                      className={`p-4 rounded-lg border-2 cursor-pointer transition-all hover:shadow-md ${
                        selectedAudit === audit.id
                          ? 'border-purple-500 bg-purple-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-gray-900">{audit.contractName}</h3>
                        <div className="flex items-center space-x-2">
                          <span className={`text-2xl font-bold ${getScoreColor(audit.score)}`}>
                            {audit.score}
                          </span>
                          <span className="text-sm text-gray-500">/100</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between text-sm text-gray-600">
                        <div className="flex items-center space-x-4">
                          <span className="flex items-center">
                            <Calendar className="h-4 w-4 mr-1" />
                            {new Date(audit.timestamp).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                              timeZone: 'UTC'
                            })}
                          </span>
                          <span className="flex items-center">
                            <TrendingUp className="h-4 w-4 mr-1" />
                            {audit.staticIssues.length} issues
                          </span>
                        </div>
                        {audit.deployedAccount && (
                          <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                            Deployed
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Audit Details */}
            <div className="space-y-6">
              {selectedAuditData ? (
                <>
                  <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">
                      {selectedAuditData.contractName}
                    </h3>
                    <ScoreDisplay score={selectedAuditData.score} size="md" />
                    
                    <div className="mt-4 space-y-2">
                      <button
                        onClick={() => generateAuditReport(selectedAuditData)}
                        className="flex items-center justify-center w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Download Report
                      </button>
                      
                      <button
                        onClick={() => {
                          dispatch({ type: 'SET_CONTRACT_CODE', payload: selectedAuditData.contractCode });
                          dispatch({ type: 'SET_CURRENT_AUDIT', payload: selectedAuditData });
                          window.location.href = '/audit';
                        }}
                        className="flex items-center justify-center w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                      >
                        <Code className="h-4 w-4 mr-2" />
                        Open in Editor
                      </button>
                    </div>
                  </div>

                  <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
                    <h4 className="font-semibold text-gray-900 mb-4">Security Issues</h4>
                    {selectedAuditData.staticIssues.length === 0 ? (
                      <p className="text-green-600 text-sm">No issues found!</p>
                    ) : (
                      <div className="space-y-3 max-h-96 overflow-y-auto">
                        {selectedAuditData.staticIssues.map((issue, index) => (
                          <SecurityIssueCard key={issue.id} issue={issue} index={index} />
                        ))}
                      </div>
                    )}
                  </div>

                  {selectedAuditData.deployedAccount && (
                    <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
                      <h4 className="font-semibold text-gray-900 mb-2">Deployment</h4>
                      <div className="space-y-2 text-sm text-gray-600">
                        <p>Account: {selectedAuditData.deployedAccount.substring(0, 20)}...</p>
                        {selectedAuditData.transactionId && (
                          <p>Transaction: {selectedAuditData.transactionId.substring(0, 20)}...</p>
                        )}
                        {selectedAuditData.contractAddress && (
                          <p>Contract: {selectedAuditData.contractAddress.substring(0, 20)}...</p>
                        )}
                        {selectedAuditData.transactionId && (
                          <a
                            href={`https://explorer.qubic.org/network/tx/${selectedAuditData.transactionId}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-block text-blue-600 hover:text-blue-800 underline"
                          >
                            View on Explorer →
                          </a>
                        )}
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 text-center shadow-lg">
                  <Code className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">Select an audit to view details</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
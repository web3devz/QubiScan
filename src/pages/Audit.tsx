import React, { useState, useRef } from 'react';
import Editor from '@monaco-editor/react';
import { Upload, Play, Download, Settings, Rocket, Key } from 'lucide-react';
import { useAudit } from '../context/AuditContext';
import { runStaticAudit } from '../utils/staticAudit';
import { runOpenAIAudit } from '../utils/openaiAudit';
import { generateAuditReport } from '../utils/pdfGenerator';
import { deployToQubicTestnet, getDeploymentStatus, getQubicExplorerUrl, DeploymentResult } from '../utils/qubicDeployment';
import { testnetAccounts } from '../data/testnetAccounts';
import { AuditResult } from '../types/audit';
import LoadingSpinner from '../components/LoadingSpinner';
import SecurityIssueCard from '../components/SecurityIssueCard';
import ScoreDisplay from '../components/ScoreDisplay';

export default function Audit() {
  const { state, dispatch } = useAudit();
  const [contractName, setContractName] = useState('MyContract');
  const [selectedAccount, setSelectedAccount] = useState('');
  const [showApiKeyModal, setShowApiKeyModal] = useState(false);
  const [tempApiKey, setTempApiKey] = useState('');
  const [deploymentResult, setDeploymentResult] = useState<DeploymentResult | null>(null);
  const [isDeploying, setIsDeploying] = useState(false);
  const [deploymentStatus, setDeploymentStatus] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        dispatch({ type: 'SET_CONTRACT_CODE', payload: content });
        setContractName(file.name.replace('.cpp', ''));
      };
      reader.readAsText(file);
    }
  };

  const handleRunAudit = async () => {
    if (!state.contractCode.trim()) {
      alert('Please enter or upload a contract first');
      return;
    }

    dispatch({ type: 'SET_LOADING', payload: true });

    try {
      // Run static audit
      const staticResult = runStaticAudit(state.contractCode);
      
      let aiResponse = '';
      if (state.openaiApiKey) {
        try {
          aiResponse = await runOpenAIAudit(state.contractCode, state.openaiApiKey);
        } catch (error) {
          console.error('OpenAI API error:', error);
          aiResponse = 'AI analysis failed: ' + (error as Error).message;
        }
      }

      const auditResult: AuditResult = {
        id: Date.now().toString(),
        contractName,
        timestamp: new Date(),
        contractCode: state.contractCode,
        staticIssues: staticResult.issues,
        aiResponse,
        score: staticResult.score,
        deployedAccount: selectedAccount || undefined,
      };

      dispatch({ type: 'SET_CURRENT_AUDIT', payload: auditResult });
    } catch (error) {
      console.error('Audit error:', error);
      alert('Audit failed: ' + (error as Error).message);
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const handleDeployToTestnet = () => {
    if (!selectedAccount) {
      alert('Please select a testnet account first');
      return;
    }

    if (!state.contractCode.trim()) {
      alert('Please enter contract code first');
      return;
    }

    handleActualDeployment();
  };

  const handleActualDeployment = async () => {
    const account = testnetAccounts.find(acc => acc.address === selectedAccount);
    if (!account) return;

    setIsDeploying(true);
    setDeploymentStatus('Compiling contract...');
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setDeploymentStatus('Deploying to Qubic testnet...');
      
      const result = await deployToQubicTestnet(state.contractCode, account, contractName);
      setDeploymentResult(result);
      
      if (result.success && result.transactionId) {
        setDeploymentStatus('Confirming transaction...');
        
        // Update the audit result with deployment info
        if (state.currentAudit) {
          const updatedAudit = {
            ...state.currentAudit,
            deployedAccount: selectedAccount,
            transactionId: result.transactionId,
            contractAddress: result.contractAddress,
          };
          dispatch({ type: 'SET_CURRENT_AUDIT', payload: updatedAudit });
        }
        
        // Check deployment status
        const status = await getDeploymentStatus(result.transactionId);
        if (status.status === 'confirmed') {
          setDeploymentStatus('Deployment confirmed!');
        } else if (status.status === 'failed') {
          setDeploymentStatus('Deployment failed');
        } else {
          setDeploymentStatus('Deployment pending...');
        }
      }
    } catch (error) {
      setDeploymentResult({
        success: false,
        error: (error as Error).message,
      });
    } finally {
      setIsDeploying(false);
    }
  };
  const handleSaveApiKey = () => {
    dispatch({ type: 'SET_API_KEY', payload: tempApiKey });
    setShowApiKeyModal(false);
    setTempApiKey('');
  };

  const sampleContract = `#include <iostream>
#include <string>
#include <map>

class SimpleWallet {
private:
    std::map<std::string, int> balances;
    std::string owner;

public:
    SimpleWallet(std::string _owner) : owner(_owner) {
        balances[owner] = 1000000; // Initial balance
    }

    void deposit(std::string user, int amount) {
        require(amount > 0, "Amount must be positive");
        balances[user] += amount;
    }

    void withdraw(std::string user, int amount) {
        require(balances[user] >= amount, "Insufficient balance");
        balances[user] -= amount;
        // Transfer logic here
    }

    int getBalance(std::string user) {
        return balances[user];
    }

    void transfer(std::string from, std::string to, int amount) {
        require(msg.sender == from, "Unauthorized transfer");
        require(balances[from] >= amount, "Insufficient balance");
        
        balances[from] -= amount;
        balances[to] += amount;
    }
};`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-purple-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 mb-8 shadow-lg">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Smart Contract Audit</h1>
              <p className="text-gray-600">Analyze your Qubic C++ smart contract for security vulnerabilities</p>
            </div>
            
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => setShowApiKeyModal(true)}
                className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
                  state.openaiApiKey 
                    ? 'bg-green-600 text-white hover:bg-green-700' 
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                <Key className="h-4 w-4 mr-2" />
                {state.openaiApiKey ? '✓ API Key Set' : 'Set API Key'}
              </button>
              
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                <Upload className="h-4 w-4 mr-2" />
                Upload Contract
              </button>
              
              <button
                onClick={handleRunAudit}
                disabled={state.isLoading}
                className="flex items-center px-6 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all disabled:opacity-50"
              >
                <Play className="h-4 w-4 mr-2" />
                {state.isLoading ? 'Running...' : 'Run Audit'}
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Code Editor */}
          <div className="lg:col-span-2">
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">Contract Code</h2>
                  <input
                    type="text"
                    value={contractName}
                    onChange={(e) => setContractName(e.target.value)}
                    className="mt-2 px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Contract name"
                  />
                </div>
                <button
                  onClick={() => dispatch({ type: 'SET_CONTRACT_CODE', payload: sampleContract })}
                  className="text-sm text-purple-600 hover:text-purple-700 underline"
                >
                  Load Sample Contract
                </button>
              </div>
              
              <div className="border rounded-lg overflow-hidden">
                <Editor
                  height="500px"
                  language="cpp"
                  value={state.contractCode}
                  onChange={(value) => dispatch({ type: 'SET_CONTRACT_CODE', payload: value || '' })}
                  theme="vs-light"
                  options={{
                    minimap: { enabled: false },
                    scrollBeyondLastLine: false,
                    fontSize: 14,
                    lineNumbers: 'on',
                    wordWrap: 'on',
                  }}
                />
              </div>
            </div>
          </div>

          {/* Results Panel */}
          <div className="space-y-6">
            {/* Audit Results */}
            {state.currentAudit && (
              <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Audit Results</h3>
                
                <div className="space-y-4">
                  <ScoreDisplay score={state.currentAudit.score} />
                  
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Static Analysis Issues</h4>
                    {state.currentAudit.staticIssues.length === 0 ? (
                      <p className="text-green-600 text-sm">No static issues found!</p>
                    ) : (
                      <div className="space-y-2 max-h-60 overflow-y-auto">
                        {state.currentAudit.staticIssues.map((issue, index) => (
                          <SecurityIssueCard key={issue.id} issue={issue} index={index} />
                        ))}
                      </div>
                    )}
                  </div>

                  {state.currentAudit.aiResponse && (
                    <div>
                      <h4 className="font-medium text-gray-900 mb-3">AI Analysis</h4>
                      <div className="bg-gray-50 rounded-lg p-4 max-h-60 overflow-y-auto">
                        <pre className="text-sm text-gray-700 whitespace-pre-wrap">
                          {state.currentAudit.aiResponse}
                        </pre>
                      </div>
                    </div>
                  )}

                  <div className="flex flex-col gap-2">
                    <button
                      onClick={() => generateAuditReport(state.currentAudit!)}
                      className="flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download Report
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Testnet Deployment */}
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Testnet Deployment</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Testnet Account
                  </label>
                  <select
                    value={selectedAccount}
                    onChange={(e) => setSelectedAccount(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="">Choose an account...</option>
                    {testnetAccounts.map((account) => (
                      <option key={account.id} value={account.address}>
                        {account.address.substring(0, 20)}... ({account.balance})
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  onClick={handleDeployToTestnet}
                  disabled={!selectedAccount || isDeploying}
                  className="flex items-center justify-center w-full px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors disabled:opacity-50"
                >
                  <Rocket className="h-4 w-4 mr-2" />
                  {isDeploying ? 'Deploying...' : 'Deploy to Testnet'}
                </button>

                {isDeploying && (
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-600 border-t-transparent"></div>
                      <p className="text-blue-800 text-sm">{deploymentStatus}</p>
                    </div>
                  </div>
                )}

                {deploymentResult && !isDeploying && (
                  <div className={`p-4 border rounded-lg ${
                    deploymentResult.success 
                      ? 'bg-green-50 border-green-200' 
                      : 'bg-red-50 border-red-200'
                  }`}>
                    {deploymentResult.success ? (
                      <div className="space-y-2">
                        <p className="text-green-800 text-sm font-medium">
                          ✅ Successfully deployed to Qubic testnet!
                        </p>
                        <div className="text-xs text-green-700 space-y-1">
                          <p>Transaction ID: {deploymentResult.transactionId?.substring(0, 20)}...</p>
                          <p>Contract Address: {deploymentResult.contractAddress?.substring(0, 20)}...</p>
                          <p>Gas Used: {deploymentResult.gasUsed?.toLocaleString()}</p>
                        </div>
                        {deploymentResult.transactionId && (
                          <a
                            href={getQubicExplorerUrl(deploymentResult.transactionId)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-block text-xs text-green-600 hover:text-green-800 underline"
                          >
                            View on Qubic Explorer →
                          </a>
                        )}
                      </div>
                    ) : (
                      <p className="text-red-800 text-sm">
                        ❌ Deployment failed: {deploymentResult.error}
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Loading State */}
            {state.isLoading && (
              <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
                <LoadingSpinner text="Running security audit..." />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* API Key Modal */}
      {showApiKeyModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">OpenAI API Key</h3>
            <p className="text-gray-600 text-sm mb-4">
              Enter your OpenAI API key to enable AI-powered audit analysis.
            </p>
            <input
              type="password"
              value={tempApiKey}
              onChange={(e) => setTempApiKey(e.target.value)}
              placeholder="sk-..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 mb-4"
            />
            <div className="flex gap-3">
              <button
                onClick={handleSaveApiKey}
                className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                Save
              </button>
              <button
                onClick={() => setShowApiKeyModal(false)}
                className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept=".cpp,.c,.h,.hpp"
        onChange={handleFileUpload}
        className="hidden"
      />
    </div>
  );
}
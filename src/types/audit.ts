export interface SecurityIssue {
  id: string;
  pattern: string;
  severity: 'High' | 'Medium' | 'Low';
  message: string;
  line?: number;
  column?: number;
}

export interface AuditResult {
  id: string;
  contractName: string;
  timestamp: Date;
  contractCode: string;
  staticIssues: SecurityIssue[];
  aiResponse?: string;
  score: number;
  deployedAccount?: string;
  transactionId?: string;
  contractAddress?: string;
}

export interface Tutorial {
  id: string;
  title: string;
  severity: 'High' | 'Medium' | 'Low';
  badCode: string;
  fixedCode: string;
  explanation: string;
  description: string;
}

export interface TestnetAccount {
  id: string;
  address: string;
  balance: string;
}
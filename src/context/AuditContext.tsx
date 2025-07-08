import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { AuditResult, SecurityIssue } from '../types/audit';
import { sampleAudits } from '../data/sampleAudits';


interface AuditState {
  contractCode: string;
  currentAudit: AuditResult | null;
  auditHistory: AuditResult[];
  isLoading: boolean;
  openaiApiKey: string;
}

type AuditAction =
  | { type: 'SET_CONTRACT_CODE'; payload: string }
  | { type: 'SET_CURRENT_AUDIT'; payload: AuditResult }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_API_KEY'; payload: string }
  | { type: 'LOAD_HISTORY' }
  | { type: 'CLEAR_CURRENT_AUDIT' };

const initialState: AuditState = {
  contractCode: '',
  currentAudit: null,
  auditHistory: [],
  isLoading: false,
  openaiApiKey: '',
};

const AuditContext = createContext<{
  state: AuditState;
  dispatch: React.Dispatch<AuditAction>;
} | null>(null);

function auditReducer(state: AuditState, action: AuditAction): AuditState {
  switch (action.type) {
    case 'SET_CONTRACT_CODE':
      return { ...state, contractCode: action.payload };
    case 'SET_CURRENT_AUDIT':
      const newHistory = [...state.auditHistory, action.payload];
      localStorage.setItem('qubiscan-audit-history', JSON.stringify(newHistory));
      return { ...state, currentAudit: action.payload, auditHistory: newHistory };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_API_KEY':
      localStorage.setItem('qubiscan-openai-key', action.payload);
      return { ...state, openaiApiKey: action.payload };
    case 'LOAD_HISTORY':
      const history = localStorage.getItem('qubiscan-audit-history');
const apiKey = localStorage.getItem('qubiscan-openai-key') || import.meta.env.VITE_OPENAI_API_KEY || '';
      // Force refresh with new sample data (clear old cache)
      localStorage.removeItem('qubiscan-audit-history');
      const auditHistory = sampleAudits;
      localStorage.setItem('qubiscan-audit-history', JSON.stringify(sampleAudits));
      
      return {
        ...state,
        auditHistory,
        openaiApiKey: apiKey,
      };
    case 'CLEAR_CURRENT_AUDIT':
      return { ...state, currentAudit: null };
    default:
      return state;
  }
}

export function AuditProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(auditReducer, initialState);

  React.useEffect(() => {
    dispatch({ type: 'LOAD_HISTORY' });
  }, []);

  return (
    <AuditContext.Provider value={{ state, dispatch }}>
      {children}
    </AuditContext.Provider>
  );
}

export function useAudit() {
  const context = useContext(AuditContext);
  if (!context) {
    throw new Error('useAudit must be used within an AuditProvider');
  }
  return context;
}
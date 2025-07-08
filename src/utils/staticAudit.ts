import { SecurityIssue } from '../types/audit';

const securityPatterns = [
  {
    pattern: /strcpy\s*\(/g,
    severity: 'High' as const,
    message: 'Unsafe use of strcpy() can lead to buffer overflow vulnerabilities'
  },
  {
    pattern: /strcat\s*\(/g,
    severity: 'High' as const,
    message: 'Unsafe use of strcat() can lead to buffer overflow vulnerabilities'
  },
  {
    pattern: /sprintf\s*\(/g,
    severity: 'High' as const,
    message: 'Unsafe use of sprintf() can lead to buffer overflow vulnerabilities'
  },
  {
    pattern: /gets\s*\(/g,
    severity: 'High' as const,
    message: 'gets() function is inherently unsafe and should never be used'
  },
  {
    pattern: /malloc\s*\([^)]*\)/g,
    severity: 'Medium' as const,
    message: 'Manual memory management may lead to memory leaks or double-free vulnerabilities'
  },
  {
    pattern: /free\s*\([^)]*\)/g,
    severity: 'Medium' as const,
    message: 'Manual memory deallocation requires careful handling to prevent double-free'
  },
  {
    pattern: /delete\s+[^;]+/g,
    severity: 'Medium' as const,
    message: 'Manual memory deallocation requires careful handling to prevent double-free'
  },
  {
    pattern: /if\s*\([^)]*\)\s*{[^}]*}/g,
    severity: 'Low' as const,
    message: 'Ensure input validation is comprehensive and handles edge cases'
  },
  {
    pattern: /msg\.sender/g,
    severity: 'Medium' as const,
    message: 'Access control using msg.sender should be implemented with proper authorization checks'
  },
  {
    pattern: /transfer\s*\(/g,
    severity: 'High' as const,
    message: 'Transfer operations should include proper balance checks and reentrancy protection'
  },
  {
    pattern: /require\s*\(/g,
    severity: 'Low' as const,
    message: 'Ensure require statements have meaningful error messages'
  },
  {
    pattern: /assert\s*\(/g,
    severity: 'Medium' as const,
    message: 'Assert statements should be used for invariants, not user input validation'
  },
  {
    pattern: /random\s*\(/g,
    severity: 'High' as const,
    message: 'Random number generation in smart contracts is vulnerable to manipulation'
  },
  {
    pattern: /timestamp/g,
    severity: 'Medium' as const,
    message: 'Block timestamp can be manipulated by miners within certain bounds'
  },
  {
    pattern: /tx\.origin/g,
    severity: 'High' as const,
    message: 'tx.origin should never be used for authorization as it can be exploited'
  }
];

export function runStaticAudit(code: string): { issues: SecurityIssue[]; score: number } {
  const issues: SecurityIssue[] = [];
  const lines = code.split('\n');

  securityPatterns.forEach((pattern) => {
    let match;
    while ((match = pattern.pattern.exec(code)) !== null) {
      const lineNumber = code.substring(0, match.index).split('\n').length;
      const columnNumber = match.index - code.lastIndexOf('\n', match.index - 1) - 1;

      issues.push({
        id: `${pattern.severity}-${issues.length}`,
        pattern: pattern.pattern.source,
        severity: pattern.severity,
        message: pattern.message,
        line: lineNumber,
        column: columnNumber,
      });
    }
  });

  // Calculate score: start with 100, subtract points based on severity
  const highIssues = issues.filter(i => i.severity === 'High').length;
  const mediumIssues = issues.filter(i => i.severity === 'Medium').length;
  const lowIssues = issues.filter(i => i.severity === 'Low').length;

  const score = Math.max(0, 100 - (highIssues * 15) - (mediumIssues * 10) - (lowIssues * 5));

  return { issues, score };
}
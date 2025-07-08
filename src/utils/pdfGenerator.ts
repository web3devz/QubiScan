import jsPDF from 'jspdf';
import { AuditResult } from '../types/audit';

export function generateAuditReport(audit: AuditResult): void {
  const doc = new jsPDF();
  let yPos = 20;
  
  // Helper function to add new page if needed
  const checkPageBreak = (requiredSpace: number = 20) => {
    if (yPos + requiredSpace > 270) {
      doc.addPage();
      yPos = 20;
    }
  };

  // Clean Professional Header with Light Colors
  doc.setFillColor(139, 92, 246); // Purple gradient
  doc.rect(0, 0, 210, 50, 'F');
  
  // Logo Shield Design - Clean and Simple
  doc.setFillColor(255, 255, 255);
  doc.circle(30, 25, 12, 'F');
  doc.setFillColor(139, 92, 246);
  doc.circle(30, 25, 9, 'F');
  doc.setFillColor(255, 255, 255);
  doc.circle(30, 25, 6, 'F');
  
  // Main Title - Larger and More Readable
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(32);
  doc.setFont('helvetica', 'bold');
  doc.text('QubiScan', 50, 28);
  
  // Subtitle - Larger Text
  doc.setFontSize(16);
  doc.setFont('helvetica', 'normal');
  doc.text('Smart Contract Security Assessment Report', 50, 40);
  
  // Report ID and Date - Larger Text
  doc.setFontSize(12);
  doc.text(`Report ID: ${audit.id}`, 140, 25);
  doc.text(`Generated: ${new Date().toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })}`, 140, 35);
  
  yPos = 70;
  doc.setTextColor(0, 0, 0);

  // Executive Summary Card - Light Background
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(15, yPos - 5, 180, 50, 5, 5, 'F');
  doc.setDrawColor(200, 200, 200);
  doc.setLineWidth(1);
  doc.roundedRect(15, yPos - 5, 180, 50, 5, 5, 'S');
  
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(30, 41, 59);
  doc.text('Executive Summary', 20, yPos + 10);
  
  doc.setFontSize(14);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(71, 85, 105);
  doc.text(`Contract Name: ${audit.contractName}`, 20, yPos + 25);
  doc.text(`Audit Date: ${new Date(audit.timestamp).toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric'
  })}`, 20, yPos + 35);
  
  if (audit.deployedAccount) {
    doc.text(`Deployment Status: Successfully deployed to testnet`, 20, yPos + 45);
  } else {
    doc.text(`Deployment Status: Not deployed`, 20, yPos + 45);
  }
  
  yPos += 65;

  // Security Score Section - Clean Design
  checkPageBreak(80);
  
  const scoreColor = audit.score >= 80 ? [34, 197, 94] : 
                    audit.score >= 60 ? [251, 191, 36] : [239, 68, 68];
  
  // Score Card Background - Very Light
  doc.setFillColor(scoreColor[0], scoreColor[1], scoreColor[2], 0.05);
  doc.roundedRect(15, yPos - 5, 180, 75, 5, 5, 'F');
  doc.setDrawColor(scoreColor[0], scoreColor[1], scoreColor[2], 0.3);
  doc.setLineWidth(2);
  doc.roundedRect(15, yPos - 5, 180, 75, 5, 5, 'S');
  
  // Section Title - Larger
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(30, 41, 59);
  doc.text('Security Assessment', 20, yPos + 12);
  
  // Large Score Circle - Clean White Background
  doc.setFillColor(255, 255, 255);
  doc.circle(160, yPos + 35, 28, 'F');
  doc.setDrawColor(scoreColor[0], scoreColor[1], scoreColor[2]);
  doc.setLineWidth(4);
  doc.circle(160, yPos + 35, 28, 'S');
  
  // Score Number - Much Larger
  doc.setFontSize(42);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(scoreColor[0], scoreColor[1], scoreColor[2]);
  const scoreText = audit.score.toString();
  const scoreWidth = doc.getTextWidth(scoreText);
  doc.text(scoreText, 160 - scoreWidth/2, yPos + 42);
  
  doc.setFontSize(16);
  doc.text('/100', 160 + scoreWidth/2 - 3, yPos + 42);
  
  // Score Interpretation - Larger Text
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  const scoreLabel = audit.score >= 80 ? 'SECURE' : 
                    audit.score >= 60 ? 'MODERATE RISK' : 'HIGH RISK';
  doc.text(scoreLabel, 20, yPos + 30);
  
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(13);
  doc.setTextColor(71, 85, 105);
  const scoreDesc = audit.score >= 80 ? 'Contract follows security best practices with minimal risks identified.' : 
                   audit.score >= 60 ? 'Contract has some security concerns that should be addressed.' : 
                   'Contract has significant security vulnerabilities requiring immediate attention.';
  
  const descLines = doc.splitTextToSize(scoreDesc, 120);
  let descY = yPos + 42;
  descLines.forEach((line: string) => {
    doc.text(line, 20, descY);
    descY += 8;
  });
  
  yPos += 90;
  doc.setTextColor(0, 0, 0);

  // Static Analysis Results Section
  checkPageBreak(50);
  
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(30, 41, 59);
  doc.text('Static Analysis Results', 20, yPos);
  yPos += 25;

  if (audit.staticIssues.length === 0) {
    // No Issues Found Card - Light Green
    doc.setFillColor(240, 253, 244);
    doc.roundedRect(15, yPos - 5, 180, 35, 5, 5, 'F');
    doc.setDrawColor(34, 197, 94);
    doc.setLineWidth(2);
    doc.roundedRect(15, yPos - 5, 180, 35, 5, 5, 'S');
    
    // Success Icon (checkmark) - Larger
    doc.setDrawColor(34, 197, 94);
    doc.setLineWidth(4);
    doc.line(25, yPos + 10, 30, yPos + 15);
    doc.line(30, yPos + 15, 40, yPos + 5);
    
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(21, 128, 61);
    doc.text('No Security Issues Detected', 45, yPos + 12);
    
    doc.setFontSize(13);
    doc.setFont('helvetica', 'normal');
    doc.text('Static analysis completed successfully with no vulnerabilities found.', 45, yPos + 22);
    yPos += 45;
  } else {
    // Issues Summary Card - Light Background
    doc.setFillColor(248, 250, 252);
    doc.roundedRect(15, yPos - 5, 180, 40, 5, 5, 'F');
    doc.setDrawColor(200, 200, 200);
    doc.setLineWidth(1);
    doc.roundedRect(15, yPos - 5, 180, 40, 5, 5, 'S');
    
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(30, 41, 59);
    doc.text('Issues Summary', 20, yPos + 12);
    
    // Count issues by severity
    const highIssues = audit.staticIssues.filter(i => i.severity === 'High');
    const mediumIssues = audit.staticIssues.filter(i => i.severity === 'Medium');
    const lowIssues = audit.staticIssues.filter(i => i.severity === 'Low');
    
    doc.setFontSize(13);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(71, 85, 105);
    doc.text(`Total Issues: ${audit.staticIssues.length}`, 20, yPos + 22);
    
    // Severity breakdown with colored indicators - Larger
    let summaryX = 20;
    if (highIssues.length > 0) {
      doc.setFillColor(239, 68, 68);
      doc.circle(summaryX + 6, yPos + 30, 4, 'F');
      doc.setTextColor(239, 68, 68);
      doc.setFontSize(12);
      doc.text(`${highIssues.length} High`, summaryX + 15, yPos + 32);
      summaryX += 45;
    }
    
    if (mediumIssues.length > 0) {
      doc.setFillColor(251, 191, 36);
      doc.circle(summaryX + 6, yPos + 30, 4, 'F');
      doc.setTextColor(251, 191, 36);
      doc.setFontSize(12);
      doc.text(`${mediumIssues.length} Medium`, summaryX + 15, yPos + 32);
      summaryX += 55;
    }
    
    if (lowIssues.length > 0) {
      doc.setFillColor(59, 130, 246);
      doc.circle(summaryX + 6, yPos + 30, 4, 'F');
      doc.setTextColor(59, 130, 246);
      doc.setFontSize(12);
      doc.text(`${lowIssues.length} Low`, summaryX + 15, yPos + 32);
    }
    
    yPos += 55;

    // Individual Issue Cards
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(30, 41, 59);
    doc.text('Detailed Findings', 20, yPos);
    yPos += 20;

    audit.staticIssues.forEach((issue, index) => {
      checkPageBreak(45);
      
      const issueColor = issue.severity === 'High' ? [239, 68, 68] : 
                        issue.severity === 'Medium' ? [251, 191, 36] : [59, 130, 246];
      
      // Issue Card - Very Light Background
      doc.setFillColor(issueColor[0], issueColor[1], issueColor[2], 0.03);
      doc.roundedRect(15, yPos - 5, 180, 40, 5, 5, 'F');
      doc.setDrawColor(issueColor[0], issueColor[1], issueColor[2], 0.3);
      doc.setLineWidth(1);
      doc.roundedRect(15, yPos - 5, 180, 40, 5, 5, 'S');
      
      // Issue Number - Larger
      doc.setFillColor(issueColor[0], issueColor[1], issueColor[2]);
      doc.circle(28, yPos + 8, 10, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      const issueNum = (index + 1).toString();
      const numWidth = doc.getTextWidth(issueNum);
      doc.text(issueNum, 28 - numWidth/2, yPos + 10);
      
      // Severity Badge - Larger
      doc.setFillColor(issueColor[0], issueColor[1], issueColor[2]);
      doc.roundedRect(155, yPos, 35, 15, 3, 3, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      const severityWidth = doc.getTextWidth(issue.severity.toUpperCase());
      doc.text(issue.severity.toUpperCase(), 172.5 - severityWidth/2, yPos + 9);
      
      // Issue Description - Larger Text
      doc.setTextColor(30, 41, 59);
      doc.setFontSize(12);
      doc.setFont('helvetica', 'normal');
      
      if (issue.line) {
        doc.setTextColor(100, 116, 139);
        doc.setFontSize(11);
        doc.text(`Line ${issue.line}`, 42, yPos + 5);
      }
      
      doc.setTextColor(30, 41, 59);
      doc.setFontSize(11);
      const messageLines = doc.splitTextToSize(issue.message, 135);
      let messageY = yPos + 18;
      messageLines.forEach((line: string) => {
        doc.text(line, 42, messageY);
        messageY += 6;
      });
      
      yPos += Math.max(40, messageLines.length * 6 + 25);
    });
  }

  // AI Analysis Section
  if (audit.aiResponse) {
    checkPageBreak(50);
    
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(30, 41, 59);
    doc.text('AI Security Analysis', 20, yPos);
    yPos += 25;
    
    // AI Analysis Card - Light Background
    doc.setFillColor(250, 245, 255);
    const aiResponseLines = doc.splitTextToSize(audit.aiResponse, 170);
    const aiCardHeight = Math.min(aiResponseLines.length * 5 + 30, 120);
    doc.roundedRect(15, yPos - 5, 180, aiCardHeight, 5, 5, 'F');
    doc.setDrawColor(139, 92, 246, 0.5);
    doc.setLineWidth(1);
    doc.roundedRect(15, yPos - 5, 180, aiCardHeight, 5, 5, 'S');
    
    // AI Icon - Larger
    doc.setFillColor(139, 92, 246);
    doc.circle(28, yPos + 8, 8, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('AI', 25, yPos + 10);
    
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(55, 48, 163);
    
    let aiYPos = yPos + 20;
    aiResponseLines.forEach((line: string) => {
      if (aiYPos > 270) {
        doc.addPage();
        aiYPos = 20;
      }
      doc.text(line, 20, aiYPos);
      aiYPos += 5;
    });
    
    yPos = aiYPos + 20;
  }

  // Deployment Information
  if (audit.deployedAccount) {
    checkPageBreak(65);
    
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(30, 41, 59);
    doc.text('Deployment Information', 20, yPos);
    yPos += 25;
    
    doc.setFillColor(240, 253, 244);
    doc.roundedRect(15, yPos - 5, 180, 55, 5, 5, 'F');
    doc.setDrawColor(34, 197, 94);
    doc.setLineWidth(2);
    doc.roundedRect(15, yPos - 5, 180, 55, 5, 5, 'S');
    
    // Success checkmark - Larger
    doc.setDrawColor(34, 197, 94);
    doc.setLineWidth(4);
    doc.line(25, yPos + 12, 30, yPos + 17);
    doc.line(30, yPos + 17, 40, yPos + 7);
    
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(21, 128, 61);
    doc.text('Successfully Deployed to Qubic Testnet', 45, yPos + 12);
    
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(22, 101, 52);
    doc.text(`Account: ${audit.deployedAccount}`, 20, yPos + 25);
    
    if (audit.transactionId) {
      doc.text(`Transaction ID: ${audit.transactionId}`, 20, yPos + 35);
    }
    
    if (audit.contractAddress) {
      doc.text(`Contract Address: ${audit.contractAddress}`, 20, yPos + 45);
    }
    
    doc.text(`Deployment Date: ${new Date(audit.timestamp).toLocaleDateString()}`, 20, yPos + 55);
    
    yPos += 70;
  }

  // Recommendations Section
  checkPageBreak(50);
  
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(30, 41, 59);
  doc.text('Security Recommendations', 20, yPos);
  yPos += 25;
  
  doc.setFillColor(255, 251, 235);
  doc.roundedRect(15, yPos - 5, 180, 50, 5, 5, 'F');
  doc.setDrawColor(245, 158, 11);
  doc.setLineWidth(2);
  doc.roundedRect(15, yPos - 5, 180, 50, 5, 5, 'S');
  
  doc.setFontSize(13);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(146, 64, 14);
  
  const recommendations = [
    '• Regularly update and audit your smart contracts',
    '• Implement comprehensive input validation',
    '• Use established security patterns and libraries',
    '• Consider formal verification for critical contracts',
    '• Maintain proper access controls and permissions'
  ];
  
  let recY = yPos + 8;
  recommendations.forEach(rec => {
    doc.text(rec, 20, recY);
    recY += 8;
  });
  
  yPos += 65;

  // Professional Footer - Light Background
  checkPageBreak(30);
  
  doc.setFillColor(248, 250, 252);
  doc.rect(0, 280, 210, 17, 'F');
  
  doc.setFontSize(10);
  doc.setTextColor(100, 116, 139);
  doc.text('QubiScan - Professional Smart Contract Security Assessment Platform', 20, 290);
  doc.text(`This report was generated on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}`, 20, 295);
  
  // Page numbers with professional styling
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(10);
    doc.setTextColor(100, 116, 139);
    doc.text(`Page ${i} of ${pageCount}`, 180, 290);
    
    // Add subtle page border
    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.5);
    doc.rect(10, 10, 190, 277, 'S');
  }
  
  // Enhanced filename with more details
  const timestamp = new Date().toISOString().split('T')[0];
  const riskLevel = audit.score >= 80 ? 'SECURE' : audit.score >= 60 ? 'MODERATE' : 'HIGH_RISK';
  doc.save(`QubiScan_${audit.contractName}_${timestamp}_${riskLevel}_Score${audit.score}.pdf`);
}
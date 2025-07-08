export async function runOpenAIAudit(contractCode: string, apiKey: string): Promise<string> {
  if (!apiKey) {
    throw new Error('OpenAI API key is required');
  }

  const prompt = `
You are an expert in Qubic smart contract security auditing. The Qubic network uses C++ for smart contracts.

Analyze the following C++ smart contract code for security vulnerabilities:

${contractCode}

Please provide a detailed analysis including:
1. List of security vulnerabilities found (with line numbers if possible)
2. Severity assessment for each vulnerability (High/Medium/Low)
3. Detailed explanation of potential risks
4. Specific code suggestions for fixing each issue
5. General best practices recommendations

Format your response clearly with sections for each vulnerability found.
`;

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'gpt-4',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 2000,
      temperature: 0.1,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`OpenAI API error: ${error.error?.message || 'Unknown error'}`);
  }

  const data = await response.json();
  return data.choices[0].message.content;
}
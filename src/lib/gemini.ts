const GROQ_API_KEY = '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';

export const generateGeminiSuggestions = async (prompt: string, context?: string): Promise<string[]> => {
  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.1-8b-instant',
        messages: [
          {
            role: 'system',
            content: 'You are a concise goal coach. Provide actionable suggestions in exactly 2 lines each. First line: main action (8-12 words). Second line: specific detail or benefit (8-12 words). Keep it practical and engaging for Gen Z users.'
          },
          {
            role: 'user',
            content: `Goal: "${context?.replace('User\'s dream: ', '') || prompt}"\n\nGive me 5 actionable steps. Each suggestion must be exactly 2 lines:\nLine 1: Main action (8-12 words)\nLine 2: Specific detail/benefit (8-12 words)\n\nFormat: ["Action 1\\nDetail 1", "Action 2\\nDetail 2", "Action 3\\nDetail 3", "Action 4\\nDetail 4", "Action 5\\nDetail 5"]`
          }
        ],
        temperature: 0.7,
        max_tokens: 500,
      })
    });

    if (!response.ok) {
      throw new Error(`Groq API error: ${response.status}`);
    }

    const data = await response.json();
    const textContent = data.choices?.[0]?.message?.content;
    
    if (!textContent) {
      throw new Error('No content received from Groq API');
    }

    // Try to parse JSON from the response
    try {
      const jsonMatch = textContent.match(/\[.*?\]/s);
      if (jsonMatch) {
        const suggestions = JSON.parse(jsonMatch[0]);
        return Array.isArray(suggestions) ? suggestions.slice(0, 5) : [];
      }
    } catch (parseError) {
      // If JSON parsing fails, split by newlines and clean up
      const lines = textContent.split('\n')
        .map(line => line.replace(/^[\d\-\*\.\s]+/, '').trim())
        .filter(line => line.length > 0 && !line.includes('[') && !line.includes(']'))
        .slice(0, 5);
      return lines;
    }

    return [];
  } catch (error) {
    console.error('Error generating Groq suggestions:', error);
    return [];
  }
};

export const analyzeGoalsWithGemini = async (goals: string[], timeline: number): Promise<string> => {
  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.1-8b-instant',
        messages: [
          {
            role: 'system',
            content: 'You are an encouraging life coach. Provide motivational and strategic insights about life goals.'
          },
          {
            role: 'user',
            content: `Analyze these life goals and provide encouraging insights:

Goals: ${goals.join(', ')}
Timeline: ${timeline} years

Please provide:
1. A brief motivational analysis (2-3 sentences)
2. Key themes you notice in their goals
3. One piece of strategic advice for achieving these dreams

Keep the response positive, personal, and actionable.`
          }
        ],
        temperature: 0.8,
        max_tokens: 300,
      })
    });

    if (!response.ok) {
      throw new Error(`Groq API error: ${response.status}`);
    }

    const data = await response.json();
    return data.choices?.[0]?.message?.content || 'Your goals show great ambition and thoughtfulness!';
  } catch (error) {
    console.error('Error analyzing goals with Groq:', error);
    return 'Your goals are inspiring and well-thought-out. Stay focused and take consistent daily actions!';
  }
};
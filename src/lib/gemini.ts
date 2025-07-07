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
        model: 'llama-3.1-70b-versatile',
        messages: [
          {
            role: 'system',
            content: 'You are a helpful goal-setting assistant. Provide practical, actionable suggestions for achieving life goals. Always respond with exactly 5 suggestions in JSON array format.'
          },
          {
            role: 'user',
            content: `${context ? `Context: ${context}\n\n` : ''}${prompt}\n\nPlease provide 5 specific, actionable suggestions as a JSON array of strings. Each suggestion should be practical and achievable. Response format: ["suggestion1", "suggestion2", "suggestion3", "suggestion4", "suggestion5"]`
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
        model: 'llama-3.1-70b-versatile',
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
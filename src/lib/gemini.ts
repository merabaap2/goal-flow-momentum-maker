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
            content: 'You are a goal coach. You MUST provide exactly 3 separate actionable suggestions. Each suggestion MUST be exactly 3 lines. Line 1: main action (10-12 words). Line 2: implementation detail (10-12 words). Line 3: expected benefit (10-12 words). Always return exactly 3 suggestions in JSON array format.'
          },
          {
            role: 'user',
            content: `Goal: "${context?.replace('User\'s dream: ', '') || prompt}"\n\nProvide exactly 3 different actionable suggestions. Each suggestion must have exactly 3 lines:\n\nLine 1: Main action (10-12 words)\nLine 2: Implementation detail (10-12 words) \nLine 3: Expected benefit (10-12 words)\n\nIMPORTANT: Return exactly 3 suggestions in this format: ["Action 1\\nImplementation 1\\nBenefit 1", "Action 2\\nImplementation 2\\nBenefit 2", "Action 3\\nImplementation 3\\nBenefit 3"]`
          }
        ],
        temperature: 0.8,
        max_tokens: 600,
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
        if (Array.isArray(suggestions) && suggestions.length >= 3) {
          return suggestions.slice(0, 3); // Ensure exactly 3 suggestions
        }
      }
    } catch (parseError) {
      // If JSON parsing fails, try to extract 3 distinct suggestions
      const lines = textContent.split('\n')
        .map(line => line.replace(/^[\d\-\*\.\s]+/, '').trim())
        .filter(line => line.length > 10);
      
      // Group lines into sets of 3 for suggestions
      const suggestions = [];
      for (let i = 0; i < Math.min(9, lines.length); i += 3) {
        if (i + 2 < lines.length) {
          suggestions.push(`${lines[i]}\n${lines[i+1]}\n${lines[i+2]}`);
        }
      }
      return suggestions.slice(0, 3);
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
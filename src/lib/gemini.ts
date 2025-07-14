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
            content: 'You are an AI assistant that follows specific prompt templates exactly as provided. Return only clean JSON arrays with no additional text or formatting.'
          },
          {
            role: 'user',
            content: prompt
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
      const cleanedResponse = textContent.replace(/```json|```/g, '').trim();
      const jsonMatch = cleanedResponse.match(/\[.*?\]/s);
      if (jsonMatch) {
        const suggestions = JSON.parse(jsonMatch[0]);
        if (Array.isArray(suggestions) && suggestions.length >= 3) {
          return suggestions.slice(0, 3); // Ensure exactly 3 suggestions
        } else if (Array.isArray(suggestions) && suggestions.length > 0) {
          // If we got fewer than 3, duplicate and modify the existing ones
          const result = [...suggestions];
          while (result.length < 3) {
            const randomIndex = Math.floor(Math.random() * suggestions.length);
            result.push(suggestions[randomIndex]);
          }
          return result.slice(0, 3);
        }
      }
    } catch (parseError) {
      console.warn('JSON parsing failed, using fallback approach');
    }

    // Enhanced fallback: Always generate exactly 3 SHORT single-paragraph suggestions
    const goal = context?.replace('User\'s dream: ', '') || prompt || 'this goal';
    const shortGoal = goal.toLowerCase().split(' ').slice(0, 3).join(' ');
    const fallbackSuggestions = [
      `Start learning essential skills for ${shortGoal} through online courses and mentorship`,
      `Create a detailed action plan with specific milestones for ${shortGoal}`,
      `Build a support network by connecting with communities focused on ${shortGoal}`
    ];
    
    return fallbackSuggestions;

  } catch (error) {
    console.error('Error generating Groq suggestions:', error);
    // Even in error case, return 3 SHORT single-paragraph suggestions
    const goal = context?.replace('User\'s dream: ', '') || prompt || 'this goal';
    const shortGoal = goal.toLowerCase().split(' ').slice(0, 3).join(' ');
    return [
      `Start learning essential skills for ${shortGoal} through courses and practice`,
      `Create a step-by-step action plan with clear milestones for ${shortGoal}`,
      `Build connections with people who share similar goals in ${shortGoal}`
    ];
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
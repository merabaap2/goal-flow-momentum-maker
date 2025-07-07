const GEMINI_API_KEY = 'AIzaSyALIwTDBeZvgmQCAtiu9BxXvpWtH2e4oHA';

export const generateGeminiSuggestions = async (prompt: string, context?: string): Promise<string[]> => {
  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `${context ? `Context: ${context}\n\n` : ''}${prompt}\n\nPlease provide 5 specific, actionable suggestions as a JSON array of strings. Each suggestion should be practical and achievable. Response format: ["suggestion1", "suggestion2", "suggestion3", "suggestion4", "suggestion5"]`
          }]
        }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 500,
        }
      })
    });

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const data = await response.json();
    const textContent = data.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!textContent) {
      throw new Error('No content received from Gemini API');
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
        .filter(line => line.length > 0)
        .slice(0, 5);
      return lines;
    }

    return [];
  } catch (error) {
    console.error('Error generating Gemini suggestions:', error);
    return [];
  }
};

export const analyzeGoalsWithGemini = async (goals: string[], timeline: number): Promise<string> => {
  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `Analyze these life goals and provide encouraging insights:

Goals: ${goals.join(', ')}
Timeline: ${timeline} years

Please provide:
1. A brief motivational analysis (2-3 sentences)
2. Key themes you notice in their goals
3. One piece of strategic advice for achieving these dreams

Keep the response positive, personal, and actionable.`
          }]
        }],
        generationConfig: {
          temperature: 0.8,
          maxOutputTokens: 300,
        }
      })
    });

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const data = await response.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || 'Your goals show great ambition and thoughtfulness!';
  } catch (error) {
    console.error('Error analyzing goals with Gemini:', error);
    return 'Your goals are inspiring and well-thought-out. Stay focused and take consistent daily actions!';
  }
};
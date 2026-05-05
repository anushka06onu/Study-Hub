import { GoogleGenerativeAI } from "@google/generative-ai";

export const suggestTasks = async (req, res) => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return res.status(500).json({ message: 'GEMINI_API_KEY not configured' });
  console.log('Using API Key starting with:', apiKey.slice(0, 4));

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const { task } = req.body;
    const prompt = `You are a study assistant. Based on this request: "${task}", suggest 3 specific study tasks. 
    Return ONLY a valid JSON array of objects with exactly these keys: "title", "subject", and "due".
    Do not include any other text or markdown formatting.`;

    const models = [
      { name: "gemini-1.5-flash", version: "v1beta" },
      { name: "gemini-1.5-flash", version: "v1" },
      { name: "gemini-pro", version: "v1beta" },
      { name: "gemini-pro", version: "v1" },
      { name: "gemini-1.5-flash-latest", version: "v1beta" }
    ];

    let text = "";
    for (const m of models) {
      try {
        const url = `https://generativelanguage.googleapis.com/${m.version}/models/${m.name}:generateContent?key=${apiKey}`;
        console.log(`Trying AI: ${m.name} (${m.version})`);
        const resp = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
        });
        const data = await resp.json();
        if (resp.ok && data.candidates?.[0]?.content?.parts?.[0]?.text) {
          text = data.candidates[0].content.parts[0].text;
          console.log(`AI Success with ${m.name} (${m.version})`);
          break;
        } else {
          console.warn(`AI ${m.name} (${m.version}) failed:`, data.error?.message || 'Unknown error');
        }
      } catch (err) {
        console.warn(`AI Fetch Error for ${m.name}:`, err.message);
      }
    }

    if (!text) throw new Error("All AI model attempts failed. Please ensure Generative Language API is enabled in your Google Cloud Console.");
    console.log('AI Response:', text);
    
    // Cleanup potential markdown formatting
    const jsonStr = text.replace(/```json|```/g, "").trim();
    const suggestions = JSON.parse(jsonStr);
    
    res.json({ suggestions });
  } catch (err) {
    console.error('AI Controller Error:', err);
    res.status(500).json({ 
      message: "AI suggestion failed", 
      error: err.message,
      stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
  }
};


import { GoogleGenerativeAI } from "@google/generative-ai";

export const suggestTasks = async (req, res) => {
  const apiKey = process.env.GEMINI_API_KEY;
  const { task } = req.body;

  const getMockData = () => [
    { title: `Complete first chapter of ${task || 'Study'}`, subject: "Core", due: "Today" },
    { title: `Take practice quiz for ${task || 'Subject'}`, subject: "Review", due: "Tomorrow" },
    { title: `Summarize key concepts for ${task || 'Exam'}`, subject: "Summary", due: "Friday" }
  ];

  if (!apiKey) {
    console.warn('GEMINI_API_KEY not configured. Returning mock suggestions.');
    return res.json({ suggestions: getMockData() });
  }

  try {
    const prompt = `You are a study assistant. Based on this request: "${task}", suggest 3 specific study tasks. 
    Return ONLY a valid JSON array of objects with exactly these keys: "title", "subject", and "due".
    Do not include any other text or markdown formatting.`;

    const models = [
      { name: "gemini-1.5-flash", version: "v1beta" },
      { name: "gemini-1.5-flash", version: "v1" }
    ];

    let text = "";
    for (const m of models) {
      try {
        const url = `https://generativelanguage.googleapis.com/${m.version}/models/${m.name}:generateContent?key=${apiKey}`;
        const resp = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
        });
        const data = await resp.json();
        if (resp.ok && data.candidates?.[0]?.content?.parts?.[0]?.text) {
          text = data.candidates[0].content.parts[0].text;
          break;
        }
      } catch (err) {
        console.warn(`AI Fetch Error for ${m.name}:`, err.message);
      }
    }

    if (!text) {
      console.warn("All AI model attempts failed. Returning mock data.");
      return res.json({ suggestions: getMockData() });
    }
    
    // Cleanup potential markdown formatting
    const jsonStr = text.replace(/```json|```/g, "").trim();
    const suggestions = JSON.parse(jsonStr);
    
    res.json({ suggestions });
  } catch (err) {
    console.error('AI Controller Error:', err);
    res.json({ suggestions: getMockData() }); // Fallback on parse error too
  }
};


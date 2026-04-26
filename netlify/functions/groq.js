// netlify/functions/groq.js
const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  try {
    const { messages, model, temperature, max_tokens } = JSON.parse(event.body);
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      return { statusCode: 500, body: JSON.stringify({ error: "Missing GROQ_API_KEY" }) };
    }

    const groqRes = await fetch(GROQ_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: model || "llama-3.3-70b-versatile",
        messages: messages,
        temperature: temperature || 0.7,
        max_tokens: max_tokens || 800
      })
    });

    const data = await groqRes.json();
    return {
      statusCode: 200,
      body: JSON.stringify(data)
    };
  } catch (error) {
    console.error("Groq proxy error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};
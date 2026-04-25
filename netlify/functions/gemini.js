// netlify/functions/gemini.js
exports.handler = async (event) => {
    if (event.httpMethod !== "POST") {
        return { statusCode: 405, body: "Method Not Allowed" };
    }

    try {
        // frontend gửi cả contents (lịch sử) và generationConfig
        const { contents, generationConfig } = JSON.parse(event.body);
        
        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            return { statusCode: 500, body: JSON.stringify({ error: "Missing GEMINI_API_KEY" }) };
        }

        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;
        
        const geminiRes = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: contents,
                generationConfig: generationConfig || { temperature: 0.6, maxOutputTokens: 700 }
            })
        });

        const data = await geminiRes.json();
        
        return {
            statusCode: 200,
            body: JSON.stringify(data)  // giữ nguyên cấu trúc Gemini để frontend đọc candidates
        };
    } catch (error) {
        console.error("Proxy error:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message })
        };
    }
};
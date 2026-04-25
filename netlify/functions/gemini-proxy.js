// netlify/functions/gemini-proxy.js
exports.handler = async (event) => {
    // Chỉ cho phép phương thức POST
    if (event.httpMethod !== "POST") {
        return { statusCode: 405, body: "Method Not Allowed" };
    }

    try {
        // Lấy dữ liệu câu hỏi từ frontend gửi lên
        const { message } = JSON.parse(event.body);
        
        // Lấy API Key từ biến môi trường GEMINI_API_KEY 
        const apiKey = process.env.GEMINI_API_KEY;

        // Gọi đến Google Gemini API (có thể dùng Gemini 1.5 hay 2.0, tùy key bạn có)
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                
            },
            body: JSON.stringify({
                contents: [{ parts: [{ text: message }] }]
            })
        });

        const data = await response.json();
        const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || "Xin lỗi, tôi chưa hiểu câu hỏi.";

        return {
            statusCode: 200,
            body: JSON.stringify({ reply })
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "Lỗi server" })
        };
    }
};
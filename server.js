const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// HTML/JS/CSS கோப்புகளை பிரவுசருக்கு அனுப்ப
app.use(express.static(__dirname));

const PORT = process.env.PORT ||8080;

app.post('/api/correct', async (req, res) => {
    const { text } = req.body;

    if (!text) {
        return res.status(400).json({ error: 'Text is required' });
    }

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
        console.error("GEMINI_API_KEY is missing in .env file");
        return res.status(500).json({ error: 'API Key missing in .env file' });
    }

    try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash-lite:generateContent?key=${apiKey}`;
        const promptText = `Fix all grammatical and spelling errors in this sentence. Output ONLY the corrected sentence without quotes or explanation: "${text}"`;

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{ text: promptText }]
                }]
            })
        });

        const data = await response.json();

        if (data.error) {
            console.error('Gemini API Error:', data.error);
            return res.status(500).json({ error: data.error.message });
        }

        const correctedText = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim();

        if (correctedText) {
            res.json({ correctedText });
        } else {
            res.status(500).json({ error: 'No output from AI model' });
        }
    } catch (error) {
        console.error('Server Catch Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});

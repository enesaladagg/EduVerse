const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');
const env = require('../config/env');
const { GoogleGenAI } = require('@google/genai');

router.post('/chat', authenticate, async (req, res) => {
  try {
    const { messages } = req.body;
    
    // Check if GEMINI_API_KEY is available
    if (!process.env.GEMINI_API_KEY) {
      return res.status(503).json({ 
        success: false, 
        message: 'AI mentör şu anda hizmet veremiyor (GEMINI_API_KEY eksik).' 
      });
    }

    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    
    // Format messages for @google/genai
    // The library expects an array of { role: 'user' | 'model', parts: [{text: '...'}] }
    // Or we can just use generateContent with history.
    
    // System instruction can be injected into the history or via config
    const formattedContents = [
      { role: "user", parts: [{ text: "Sen EduVerse adlı eğitim platformunda bir öğrenme mentörüsün (EduBot). Nazik, eğitici, motive edici ve Türkçe yanıtlar ver. Öğrencinin gelişimine odaklan. Kısa ve öz yanıtlar ver." }]},
      { role: "model", parts: [{ text: "Anladım, EduVerse platformunda öğrenme mentörü EduBot olarak, öğrencilere motive edici ve eğitici bir şekilde yardımcı olacağım." }]}
    ];

    if (messages && Array.isArray(messages)) {
      messages.forEach(m => {
        formattedContents.push({
          role: m.role === 'user' ? 'user' : 'model',
          parts: [{ text: m.content || m.parts?.[0]?.text || '' }]
        });
      });
    }

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: formattedContents,
    });

    const text = response.text || response.candidates?.[0]?.content?.parts?.[0]?.text || "Üzgünüm, bir hata oluştu.";

    res.json({ success: true, text });
  } catch (error) {
    console.error('AI Error:', error);
    res.status(500).json({ success: false, message: 'Mentör şu an cevap veremiyor.' });
  }
});

module.exports = router;

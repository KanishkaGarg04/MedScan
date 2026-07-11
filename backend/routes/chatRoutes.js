const express = require("express");
const router = express.Router();

const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

router.post("/", async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({
        reply: "Message is required."
      });
    }

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash"
    });

    const prompt = `
You are MedScan AI.

You are an AI medical assistant.

You explain:

- blood reports
- CBC
- lipid profile
- thyroid
- liver function
- kidney function
- medical terms
- medicines
- lifestyle
- diet

Never diagnose diseases with certainty.

Always advise consulting a doctor.

Question:

${message}
`;

    const result = await model.generateContent(prompt);

    const response = result.response.text();

    res.json({
      reply: response
    });

  } catch (err) {

    console.error(err);

    res.status(500).json({
      reply: err.message
    });

  }

});

module.exports = router;
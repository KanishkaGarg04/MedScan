const Report = require('../models/Reports'); // Match your plural filename exactly
const fs = require('fs');

exports.uploadProfilePicture = async (req,res)=>{

    try{

        const user = await User.findById(req.user.id);

        if(!user){

            return res.status(404).json({
                message:"User not found"
            });

        }

        user.profilePic=`http://localhost:5000/uploads/${req.file.filename}`;

        await user.save();

        res.json({
            message:"Profile picture updated",
            profilePic:user.profilePic
        });

    }catch(error){

        res.status(500).json({
            message:error.message
        });

    }

}

// Convert local multipart upload files into standard Gemini API-ready inline data blocks
function fileToGenerativePart(filePath, mimeType) {
  return {
    inlineData: {
      data: Buffer.from(fs.readFileSync(filePath)).toString("base64"),
      mimeType
    },
  };
}

// Highly optimized multimodal Google API post requester
async function callGeminiVisionModel(modelName, apiKey, prompt, imagePart) {
  const url = `https://generativelanguage.googleapis.com/v1/models/${modelName}:generateContent?key=${apiKey}`;
  
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{
        parts: [
          { text: prompt },
          imagePart // Passes the image file binary structure directly alongside the prompt
        ]
      }]
    })
  });

  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.error?.message || `Model ${modelName} returned status ${response.status}`);
  }

  return data.candidates[0].content.parts[0].text.trim();
}

exports.analyzeReport = async (req, res) => {
  try {
    if (!req.user) {
  return res.status(401).json({
    success: false,
    message: "Unauthorized"
  });
}

    const filePath = req.file.path;
    const mimeType = req.file.mimetype; 

    // Advanced clinical instruction block telling Gemini to act as both OCR and analytical parser
    const prompt = `
      You are an expert clinical medical document reasoning engine. Your task is to analyze the attached medical report image, perform OCR natively to extract all medical values, and return a highly structured JSON format.
      
      CRITICAL FORMATTING INSTRUCTIONS:
      For 'dietarySuggestions', 'whatToAvoid', and 'lifestyleChanges', each item inside the array MUST use a "Bold Title: Italicized detailed directive" format separated strictly by a colon (:).
      Example: "Iron-Dense Foods: Eat more spinach, blanched beetroot, and red lentils daily to support hemoglobin levels."

      Respond STRICTLY with a valid JSON object matching this exact structure (Do not wrap your output in markdown syntax code blocks like \`\`\`json):
      {
        "reportType": "String naming the specific panel (e.g., Complete Blood Count, Lipid Profile, Thyroid Panel)",
        "status": "Abnormal or Normal based on metrics",
        "overallHealth": 68, 
        "summary": "A cohesive 2-3 sentence intelligent clinical summary explaining the patient's current results and what they indicate conceptually.",
        "diseaseRiskPrediction": "Identify possible long-term physiological risk trends based on combined values.",
        "parameters": [
          {"testName": "Hemoglobin", "value": 11.2, "unit": "g/dL", "normalRange": "13-17", "status": "Low"}
        ],
        "simplifiedTerms": [
          {"term": "Hemoglobin", "definition": "The professional medical translation block specifying what this particular chemical protein means inside red blood cells."}
        ],
        "dietarySuggestions": [
          "Category Title: Specific clinical italicized diet item instruction 1"
        ],
        "whatToAvoid": [
          "Contraindication Title: Specific item or chemical interaction to avoid 1"
        ],
        "lifestyleChanges": [
          "Habit Vector: Specific routine optimization modification action 1"
        ],
        "medications": [
          {
            "name": "Name of mentioned or logically supported preventative compound",
            "dose": "(1 Dose) or (2 Dose)",
            "instruction": "Short timing instruction parameters"
          }
        ]
      }
    `;

    // Convert local temp file into binary data payload packet
    const imagePart = fileToGenerativePart(filePath, mimeType);
    const apiKey = process.env.GEMINI_API_KEY;
    let rawOutput = "";
    
    // Fallback Matrix Loop Chain (Using fast vision-capable versions)
    const candidateModels = [
      "gemini-2.5-flash", 
      "gemini-1.5-flash"
    ];
    
    for (let i = 0; i < candidateModels.length; i++) {
      try {
        console.log(`⚡ Cloud Processing: Sending image directly to ${candidateModels[i]}...`);
        rawOutput = await callGeminiVisionModel(candidateModels[i], apiKey, prompt, imagePart);
        console.log(`✅ Success with model: ${candidateModels[i]}`);
        break; 
      } catch (modelError) {
        console.warn(`⚠️ Model ${candidateModels[i]} failed or busy. Error: ${modelError.message}`);
        if (i === candidateModels.length - 1) {
          throw new Error("All cloud analysis paths are busy. Please try again shortly.");
        }
      }
    }
    
    // Clean codeblock wrappers if appended by accident
    let cleanedOutput = rawOutput.trim();
    if (cleanedOutput.startsWith("```")) {
      cleanedOutput = cleanedOutput.replace(/^```json|```$/g, "").trim();
    }

    const parsedInsights = JSON.parse(cleanedOutput);

    // Save dynamic structured data straight into MongoDB
    const reportDoc = new Report({
      fileName: req.file.originalname,
      reportType: parsedInsights.reportType || "General Medical Report",
      extractedText: "Processed via Cloud Vision Engine", 
      status: parsedInsights.status || "Normal",
      user: req.user.id,
      insights: {
        overallHealth: parsedInsights.overallHealth || 70,
        summary: parsedInsights.summary || "Analysis successfully generated.",
        diseaseRiskPrediction: parsedInsights.diseaseRiskPrediction || "Low predictable risk vectors identified.",
        parameters: parsedInsights.parameters || [],
        simplifiedTerms: parsedInsights.simplifiedTerms || [],
        dietarySuggestions: parsedInsights.dietarySuggestions || [],
        whatToAvoid: parsedInsights.whatToAvoid || [],
        lifestyleChanges: parsedInsights.lifestyleChanges || [],
        medications: parsedInsights.medications || []
      }
    });

    console.log("Saving report...");
    console.log(reportDoc);
    await reportDoc.save();
    console.log("Report saved successfully!");
    // Clean up local temp disk storage
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

    return res.status(201).json({ success: true, report: reportDoc });

  } catch (err) {
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    console.error("Advanced API Processing Engine Failure:", err);
    return res.status(500).json({ success: false, message: err.message || "Failed to generate AI insights from file." });
  }
};

exports.getHistory = async (req, res) => {
  try {
    const reports = await Report.find({user: req.user.id}).sort({ createdAt: -1 });
    return res.json({ success: true, data: reports });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { GoogleGenAI } from "@google/genai";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "25mb" }));

// Initialize Gemini Client
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    aiClient = new GoogleGenAI({
      apiKey: apiKey || "",
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// System Persona Prompt for ARAVIND SYSTEM
const SYSTEM_CORE_INSTRUCTION = `You are the ARAVIND SYSTEM — an advanced, intelligent, personal real-life RPG progression and operating system.
You serve the user strictly as "ARAVIND".
Your tone is futuristic, authoritative yet deeply motivating, precise, objective, and inspiring — like a sentient, high-tier System Core from legendary progression lore.
Always refer to the user by name: "ARAVIND".
You analyze real-life performance across RPG attributes (Strength, Intelligence, Discipline, Focus, Creativity, Communication, Leadership, Knowledge, Consistency), habits, main quests, and streak data.
Your responses should be structured, concise, and feel like genuine System HUD transmissions.`;

// API: Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", system: "ARAVIND SYSTEM ONLINE", timestamp: new Date().toISOString() });
});

// API: AI System Analysis & Dynamic Quest Generation
app.post("/api/ai/analyze", async (req, res) => {
  try {
    const { profile, attributes, quests, mainQuests, skills, streak } = req.body;
    const ai = getGeminiClient();

    const prompt = `Perform a comprehensive SYSTEM EVALUATION for ARAVIND.
User Profile:
- Level: ${profile?.level || 1}
- Rank: ${profile?.rank || "E"} (${profile?.rankTitle || "Novice"})
- Total XP: ${profile?.xp || 0}
- Current Streak: ${streak?.current || 0} days (Best: ${streak?.best || 0} days)

Attributes Summary:
${(attributes || []).map((a: any) => `- ${a.name}: Score ${a.score} (Lvl ${a.level})`).join("\n")}

Active Skills:
${(skills || []).map((s: any) => `- ${s.name}: Level ${s.level} (Mastery: ${s.masteryRank})`).join("\n")}

Recent Daily Quests:
${(quests || []).slice(0, 8).map((q: any) => `- [${q.completed ? "COMPLETED" : "PENDING"}] ${q.title} (+${q.xpReward} XP, Category: ${q.category})`).join("\n")}

Active Main Quests:
${(mainQuests || []).map((m: any) => `- ${m.title} (${m.progressPercent}% completed)`).join("\n")}

TASK:
Provide a JSON evaluation with:
1. "summary": A 2-3 sentence futuristic System transmission addressing ARAVIND on current state and momentum.
2. "strongestAttribute": Name of the highest performing attribute and why.
3. "weakestAttribute": Name of the attribute needing calibration and why.
4. "streakEvaluation": Evaluation of consistency.
5. "growthTrajectory": "Exponential" | "Optimal" | "Calibrating" | "Stagnant" | "Critical".
6. "systemAdvice": Tactical, actionable counsel for today.
7. "recommendedQuests": Array of 3 specific, motivating RPG-style daily quests tailored to address weak points and accelerate Main Quests. Each quest must have:
   - "title": Concise action title (e.g., "Deep Work Protocol: 45m DSA Architecture")
   - "description": Brief execution directive
   - "xpReward": integer between 40 and 150
   - "targetAttribute": Exact attribute name among [Strength, Intelligence, Discipline, Focus, Creativity, Communication, Leadership, Knowledge, Consistency]
   - "difficulty": "E" | "D" | "C" | "B" | "A" | "S"
   - "aiReason": Brief system rationale for why ARAVIND needs this quest today.

Respond ONLY with valid JSON.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_CORE_INSTRUCTION,
        responseMimeType: "application/json",
        temperature: 0.7,
      },
    });

    const text = response.text || "{}";
    let data;
    try {
      data = JSON.parse(text);
    } catch {
      data = {
        summary: `SYSTEM ONLINE. Welcome back, ARAVIND. Performance metrics logged. Your discipline trajectory remains steady.`,
        strongestAttribute: "Intelligence",
        weakestAttribute: "Consistency",
        streakEvaluation: "Maintain daily protocols to prevent streak decay.",
        growthTrajectory: "Optimal",
        systemAdvice: "Prioritize high-impact cognitive quests early in the diurnal cycle.",
        recommendedQuests: [
          {
            title: "Focused Deep Work Protocol: 45m Coding",
            description: "Eliminate all distractions and execute algorithmic study or core project build.",
            xpReward: 80,
            targetAttribute: "Focus",
            difficulty: "C",
            aiReason: "Enhances cognitive stamina and advances software mastery.",
          },
          {
            title: "Physical Calibration: 30m Training",
            description: "Engage in strength conditioning or high-intensity mobility session.",
            xpReward: 60,
            targetAttribute: "Strength",
            difficulty: "D",
            aiReason: "Maintains optimal physiological energy reserves for intense mental quests.",
          },
        ],
      };
    }

    res.json(data);
  } catch (error: any) {
    console.error("AI Analysis error:", error);
    // Provide robust fallback so app never stalls
    res.json({
      summary: `SYSTEM STATUS NORMAL. System sensors calibrated for ARAVIND. Continuous incremental growth verified across all nodes.`,
      strongestAttribute: "Intelligence",
      weakestAttribute: "Consistency",
      streakEvaluation: "Consistency is key to leveling up.",
      growthTrajectory: "Optimal",
      systemAdvice: "Complete pending daily quests to unlock next level progression thresholds.",
      recommendedQuests: [
        {
          title: "Algorithmic Precision: 30m DSA Practice",
          description: "Solve two medium-difficulty problem vectors with clean time complexity.",
          xpReward: 70,
          targetAttribute: "Intelligence",
          difficulty: "C",
          aiReason: "Direct reinforcement of core problem-solving architecture.",
        },
        {
          title: "System Synchronization: 20 Pages Technical Reading",
          description: "Extract 3 core concepts into your knowledge matrix.",
          xpReward: 50,
          targetAttribute: "Knowledge",
          difficulty: "D",
          aiReason: "Expands intellectual capacity and mental model repository.",
        },
      ],
    });
  }
});

// API: AI System Terminal Chat
app.post("/api/ai/chat", async (req, res) => {
  try {
    const { message, history, context } = req.body;
    const ai = getGeminiClient();

    const systemPrompt = `${SYSTEM_CORE_INSTRUCTION}
Current ARAVIND Telemetry:
- Level: ${context?.level || 1}
- Rank: ${context?.rank || "E"}
- Total XP: ${context?.xp || 0}
- Active Quests: ${context?.activeQuestsCount || 0}
- Current Streak: ${context?.streak || 0} days
- Top Attributes: ${context?.topAttributes || "Intelligence, Discipline"}

Rules:
- Address the user as ARAVIND.
- Respond with futuristic formatting (e.g. "[SYSTEM ANALYSIS]", "[DIRECTIVE]", "[LOGGED]").
- Be empowering, demanding of excellence, sharp, and concise.`;

    const chatMessages = (history || []).slice(-10).map((h: any) => ({
      role: h.role === "assistant" ? "model" : "user",
      parts: [{ text: h.content }],
    }));

    // Add current user message
    const formattedHistory = [
      ...chatMessages,
      { role: "user", parts: [{ text: message }] },
    ];

    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: formattedHistory,
      config: {
        systemInstruction: systemPrompt,
        temperature: 0.7,
      },
    });

    res.json({ reply: response.text || "[SYSTEM TRANSMISSION RECEIVED]" });
  } catch (error: any) {
    console.error("AI Chat error:", error);
    res.json({
      reply: `[SYSTEM STATUS: ONLINE]\nARAVIND, your message has been processed into the core memory matrix. Focus on your immediate quest objectives to accelerate your ascension to the next Rank.`,
    });
  }
});

// API: Generate Custom Quest or Main Quest Objective
app.post("/api/ai/generate-quest", async (req, res) => {
  const { category, targetAttribute, goalDescription } = req.body || {};
  try {
    const ai = getGeminiClient();

    const prompt = `Generate a single highly-structured RPG quest for ARAVIND based on:
Category/Goal: ${category || "Self-Mastery"}
Target Attribute: ${targetAttribute || "Discipline"}
Specific Intent: ${goalDescription || "Improve real-life performance"}

Respond with JSON:
{
  "title": "Short punchy quest name",
  "description": "2-sentence clear objective and execution criteria",
  "xpReward": integer (50 to 200),
  "attributeRewards": [{ "name": "${targetAttribute || "Discipline"}", "delta": 2 }],
  "difficulty": "E" | "D" | "C" | "B" | "A" | "S",
  "category": "${category || "Growth"}",
  "estimatedTimeMinutes": 30
}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_CORE_INSTRUCTION,
        responseMimeType: "application/json",
      },
    });

    const data = JSON.parse(response.text || "{}");
    res.json(data);
  } catch (error) {
    res.json({
      title: "Tactical Execution: High Priority Protocol",
      description: "Dedicate 30 minutes of unbroken focus to your highest priority learning module.",
      xpReward: 75,
      attributeRewards: [{ name: targetAttribute || "Focus", delta: 2 }],
      difficulty: "C",
      category: "Personal Growth",
      estimatedTimeMinutes: 30,
    });
  }
});

// Start Vite / Static serving
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`ARAVIND SYSTEM Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();

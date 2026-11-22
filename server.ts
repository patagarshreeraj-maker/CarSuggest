import express from 'express';
import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';
import { createServer as createViteServer } from 'vite';

dotenv.config();

let aiClient: GoogleGenAI | null = null;
function getGenAI(): GoogleGenAI | null {
  if (!aiClient && process.env.GEMINI_API_KEY) {
    aiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build'
        }
      }
    });
  }
  return aiClient;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // 1. Health check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', time: new Date().toISOString() });
  });

  // 2. Extract preferences from natural language query
  app.post(['/api/ai/extract-requirements', '/api/ai/parse-prompt'], async (req, res) => {
    try {
      const textQuery = req.body.textQuery || req.body.prompt || req.body.query || '';
      
      const fallbackPrefs = {
        budgetMinLakh: 8,
        budgetMaxLakh: 18,
        familySize: 5,
        primaryUsage: 'City Commute',
        monthlyKm: 1200,
        preferredFuel: ['Petrol', 'Electric', 'Strong Hybrid'],
        preferredBodyTypes: ['Compact SUV', 'SUV'],
        preferredTransmission: 'Any',
        priorities: {
          safety: 5,
          mileage: 4,
          performance: 3,
          comfortSpace: 4,
          lowMaintenance: 4,
          featuresTech: 4
        }
      };

      if (!textQuery || typeof textQuery !== 'string' || !textQuery.trim()) {
        return res.json(fallbackPrefs);
      }

      const ai = getGenAI();
      if (!ai) {
        return res.json(fallbackPrefs);
      }

      const prompt = `You are DriveAI, an expert Indian automotive analyst. Extract structured user car-buying requirements from the user's freeform statement:
"${textQuery}"

Analyze their budget (in Indian Lakhs INR), family size, monthly driving distance (km), terrain/driving pattern, fuel preferences (Petrol, Diesel, Electric, Strong Hybrid, CNG), body types (SUV, Compact SUV, Sedan, Hatchback, MPV), and importance weights (1 to 5) for safety, mileage, performance, comfortSpace, lowMaintenance, featuresTech.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.7-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              budgetMinLakh: { type: Type.NUMBER, description: 'Minimum budget in Lakhs INR (e.g. 10)' },
              budgetMaxLakh: { type: Type.NUMBER, description: 'Maximum budget in Lakhs INR (e.g. 18)' },
              familySize: { type: Type.INTEGER, description: 'Number of people (e.g. 4, 5, 7)' },
              primaryUsage: { type: Type.STRING, description: 'One of: City Commute, Highway Trips, Mixed Daily, Rough Roads / Hills' },
              monthlyKm: { type: Type.NUMBER, description: 'Estimated monthly driving distance in kilometers' },
              preferredFuel: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: 'Array containing any of: Petrol, Diesel, Electric, Strong Hybrid, CNG'
              },
              preferredBodyTypes: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: 'Array containing any of: SUV, Compact SUV, Sedan, Hatchback, MPV'
              },
              preferredTransmission: { type: Type.STRING, description: 'Any, Manual, or Automatic' },
              priorities: {
                type: Type.OBJECT,
                properties: {
                  safety: { type: Type.INTEGER, description: '1 to 5' },
                  mileage: { type: Type.INTEGER, description: '1 to 5' },
                  performance: { type: Type.INTEGER, description: '1 to 5' },
                  comfortSpace: { type: Type.INTEGER, description: '1 to 5' },
                  lowMaintenance: { type: Type.INTEGER, description: '1 to 5' },
                  featuresTech: { type: Type.INTEGER, description: '1 to 5' }
                },
                required: ['safety', 'mileage', 'performance', 'comfortSpace', 'lowMaintenance', 'featuresTech']
              }
            },
            required: ['budgetMinLakh', 'budgetMaxLakh', 'familySize', 'primaryUsage', 'monthlyKm', 'priorities']
          }
        }
      });

      if (response.text) {
        const extracted = JSON.parse(response.text);
        return res.json({ ...fallbackPrefs, ...extracted });
      }
      return res.json(fallbackPrefs);
    } catch (err: any) {
      console.error('Error extracting requirements:', err);
      // Return fallback without crashing
      return res.json({
        budgetMinLakh: 8,
        budgetMaxLakh: 18,
        familySize: 5,
        primaryUsage: 'City Commute',
        monthlyKm: 1200,
        preferredFuel: ['Petrol', 'Electric'],
        preferredBodyTypes: ['Compact SUV', 'SUV'],
        preferredTransmission: 'Any',
        priorities: {
          safety: 5,
          mileage: 4,
          performance: 3,
          comfortSpace: 4,
          lowMaintenance: 4,
          featuresTech: 4
        }
      });
    }
  });

  // 3. AI Explanation for top recommended car (supports both /api/ai/recommend-explain and /api/ai/explain-recommendation)
  app.post(['/api/ai/recommend-explain', '/api/ai/explain-recommendation'], async (req, res) => {
    try {
      const userPrefs = req.body.preferences || req.body.userPrefs || {};
      const rankedCars = req.body.rankedCars || [];
      
      const rawTopCar = req.body.topCar || rankedCars[0]?.car || rankedCars[0] || null;
      const rawRunnerUps = req.body.runnerUpCars || (rankedCars.slice(1).map((rc: any) => rc.car || rc)) || [];

      const topCarName = rawTopCar ? `${rawTopCar.brand} ${rawTopCar.model}` : 'Top Recommended Car';
      const topCarId = rawTopCar?.id || 'top-car';

      const defaultExplanation = {
        topPickId: topCarId,
        topPickReasoning: `The ${topCarName} emerged as your top match by balancing your budget of ₹${userPrefs.budgetMinLakh || 8}-${userPrefs.budgetMaxLakh || 20}L with high crash safety, efficient ownership costs, and family comfort.`,
        prosForUser: rawTopCar?.pros?.slice(0, 3) || [
          'High structural crash safety and confidence',
          'Low running and scheduled maintenance costs',
          'Spacious cabin layout and ride comfort'
        ],
        tradeOffs: rawTopCar?.cons?.slice(0, 2) || [
          'Waiting periods on high-demand top variants',
          'Premium features reserved for higher trims'
        ],
        runnerUps: rawRunnerUps.slice(0, 2).map((c: any) => ({
          carId: c.id || 'runner-up',
          reason: `Strong alternative with distinct ${c.brand || 'brand'} characteristics and practical features.`
        })),
        expertAdvice: 'Always request an extended test drive across city potholes and highway stretches with full AC load before finalizing your variant.'
      };

      if (!rawTopCar) {
        return res.json(defaultExplanation);
      }

      const ai = getGenAI();
      if (!ai) {
        return res.json(defaultExplanation);
      }

      const prompt = `You are DriveAI, a trusted automotive consultant for Indian car buyers.
Explain why the "${rawTopCar.brand} ${rawTopCar.model}" is the #1 recommended match for this user:
User Profile:
- Budget: ₹${userPrefs.budgetMinLakh || 10}L to ₹${userPrefs.budgetMaxLakh || 20}L
- Family Size: ${userPrefs.familySize || 5} members
- Monthly Driving: ${userPrefs.monthlyKm || 1200} km (${userPrefs.primaryUsage || 'City Commute'})
- Fuel Preference: ${userPrefs.preferredFuel?.join(', ') || 'Any'}
- Priorities: Safety ${userPrefs.priorities?.safety || 4}/5, Mileage ${userPrefs.priorities?.mileage || 4}/5, Comfort ${userPrefs.priorities?.comfortSpace || 4}/5, Tech ${userPrefs.priorities?.featuresTech || 4}/5.

Top Car Details:
- Brand/Model: ${rawTopCar.brand} ${rawTopCar.model} (₹${rawTopCar.priceMinLakh}L - ₹${rawTopCar.priceMaxLakh}L)
- Engine/Specs: ${rawTopCar.specs?.powerPS || 120}PS, ${rawTopCar.specs?.mileageKmPerLitreOrKWh || 18} km/l or km range
- Safety: ${rawTopCar.safety?.ratingStars || 5}-Star ${rawTopCar.safety?.testingAgency || 'BNCAP'}, ADAS: ${Boolean(rawTopCar.safety?.hasADAS)}
- Key Features: ${rawTopCar.features?.comfort?.join(', ') || 'Modern infotainment, climate control'}

Runner Up Cars:
${rawRunnerUps.map((c: any) => `- ${c.brand} ${c.model} (₹${c.priceMinLakh}-${c.priceMaxLakh}L)`).join('\n')}

Generate a comprehensive, clear, high-trust explanation. Focus on real-world Indian conditions (potholes, traffic, monsoon, highway speeds, AC load).`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.7-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              topPickId: { type: Type.STRING },
              topPickReasoning: { type: Type.STRING, description: '2-3 crisp sentences detailing why this car won top recommendation' },
              prosForUser: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: '3 specific reasons tailored to the user'
              },
              tradeOffs: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: '2 honest trade-offs to keep in mind'
              },
              runnerUps: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    carId: { type: Type.STRING },
                    reason: { type: Type.STRING }
                  },
                  required: ['carId', 'reason']
                }
              },
              expertAdvice: { type: Type.STRING, description: '1 actionable dealership or test drive tip' }
            },
            required: ['topPickId', 'topPickReasoning', 'prosForUser', 'tradeOffs', 'runnerUps', 'expertAdvice']
          }
        }
      });

      if (response.text) {
        const explanation = JSON.parse(response.text);
        return res.json({
          ...defaultExplanation,
          ...explanation,
          topPickId: rawTopCar.id
        });
      }
      return res.json(defaultExplanation);
    } catch (err: any) {
      console.error('Error generating AI explanation:', err);
      // Always return 200 with fallback JSON so client never fails
      const rawTopCar = req.body.topCar || req.body.rankedCars?.[0]?.car || req.body.rankedCars?.[0];
      return res.json({
        topPickId: rawTopCar?.id || 'top-car',
        topPickReasoning: rawTopCar 
          ? `The ${rawTopCar.brand} ${rawTopCar.model} matches your driving priorities with strong performance, practical cabin space, and robust safety.`
          : 'This vehicle is uniquely suited for your budget, family space requirements, and daily commute pattern in Indian conditions.',
        prosForUser: rawTopCar?.pros?.slice(0, 3) || ['Excellent crash safety ratings', 'Optimal city & highway driving balance', 'Rich comfort and tech package'],
        tradeOffs: rawTopCar?.cons?.slice(0, 2) || ['High demand waiting periods', 'Touch controls take initial familiarization'],
        runnerUps: (req.body.runnerUpCars || req.body.rankedCars?.slice(1, 3) || []).map((c: any) => {
          const item = c.car || c;
          return {
            carId: item.id || 'alt-car',
            reason: `Strong alternative option offering distinct ${item.brand || 'segment'} appeal.`
          };
        }),
        expertAdvice: 'Book a morning test drive on your typical office route to inspect suspension comfort and air conditioning efficiency.'
      });
    }
  });

  // 4. AI Multi-Car Comparison Verdict
  app.post('/api/ai/compare-verdict', async (req, res) => {
    try {
      const { cars, userPriorities } = req.body;
      if (!cars || !Array.isArray(cars) || cars.length < 2) {
        return res.status(400).json({ error: 'At least 2 cars are required for comparison' });
      }

      const defaultVerdict = {
        verdict: `Comparing ${cars.map((c: any) => c.model).join(' vs ')} reveals clear distinctions in fuel economy, space, and driving dynamics for Indian roads.`,
        bestOverallCarId: cars[0].id,
        bestMileageCarId: cars.reduce((prev: any, curr: any) => curr.specs?.mileageKmPerLitreOrKWh > prev.specs?.mileageKmPerLitreOrKWh ? curr : prev).id,
        bestPerformanceCarId: cars.reduce((prev: any, curr: any) => curr.specs?.powerPS > prev.specs?.powerPS ? curr : prev).id,
        bestValueForMoneyCarId: cars.reduce((prev: any, curr: any) => curr.priceMinLakh < prev.priceMinLakh ? curr : prev).id,
        bestFamilyCarId: cars.reduce((prev: any, curr: any) => curr.specs?.seatingCapacity > prev.specs?.seatingCapacity ? curr : prev).id,
        keyDifferentiators: [
          { category: 'Running Costs & Powertrain', description: 'Significant difference across electric/hybrid vs pure petrol/diesel.', winnerCarId: cars[0].id },
          { category: 'Safety & ADAS', description: 'Active radar assistance and structural crash test protection levels.', winnerCarId: cars[0].id }
        ],
        finalAdvice: 'Pick based on whether your primary priority is maximum fuel economy or outright high-speed highway stability.'
      };

      const ai = getGenAI();
      if (!ai) {
        return res.json(defaultVerdict);
      }

      const prompt = `You are DriveAI, senior automotive jury member. Compare the following ${cars.length} cars available in the Indian market:
${cars.map((c: any, idx: number) => `
Car ${idx + 1}: ${c.brand} ${c.model}
- Price: ₹${c.priceMinLakh}L - ₹${c.priceMaxLakh}L
- Body: ${c.bodyType} | Fuel: ${c.fuelTypes?.join(', ')}
- Power: ${c.specs?.powerPS}PS | Torque: ${c.specs?.torqueNM}Nm | 0-100: ${c.specs?.acceleration0to100}s
- Mileage/Range: ${c.specs?.mileageKmPerLitreOrKWh} km/l or km range
- Boot: ${c.specs?.bootSpaceLitres}L | Ground Clearance: ${c.specs?.groundClearanceMm}mm | Seats: ${c.specs?.seatingCapacity}
- Safety: ${c.safety?.ratingStars}-Star ${c.safety?.testingAgency} | ADAS: ${Boolean(c.safety?.hasADAS)}
`).join('\n')}

User Focus: ${userPriorities ? JSON.stringify(userPriorities) : 'Balanced family, city and highway usage'}.

Provide a definitive comparison verdict identifying category winners and a conclusive final buying recommendation.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.7-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              verdict: { type: Type.STRING, description: 'Executive summary comparing these vehicles' },
              bestOverallCarId: { type: Type.STRING },
              bestMileageCarId: { type: Type.STRING },
              bestPerformanceCarId: { type: Type.STRING },
              bestValueForMoneyCarId: { type: Type.STRING },
              bestFamilyCarId: { type: Type.STRING },
              keyDifferentiators: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    category: { type: Type.STRING },
                    description: { type: Type.STRING },
                    winnerCarId: { type: Type.STRING }
                  },
                  required: ['category', 'description', 'winnerCarId']
                }
              },
              finalAdvice: { type: Type.STRING, description: 'Which type of buyer should choose which vehicle' }
            },
            required: ['verdict', 'bestOverallCarId', 'bestMileageCarId', 'bestPerformanceCarId', 'bestValueForMoneyCarId', 'bestFamilyCarId', 'keyDifferentiators', 'finalAdvice']
          }
        }
      });

      if (response.text) {
        const verdictData = JSON.parse(response.text);
        return res.json({ ...defaultVerdict, ...verdictData });
      }
      return res.json(defaultVerdict);
    } catch (err: any) {
      console.error('Error generating comparison verdict:', err);
      // Fallback response with status 200
      const cars = req.body.cars || [];
      return res.json({
        verdict: `Comparing ${cars.map((c: any) => c.model).join(' vs ')} reveals clear distinctions in fuel economy, space, and driving dynamics for Indian roads.`,
        bestOverallCarId: cars[0]?.id || '',
        bestMileageCarId: cars[1]?.id || cars[0]?.id || '',
        bestPerformanceCarId: cars[0]?.id || '',
        bestValueForMoneyCarId: cars[0]?.id || '',
        bestFamilyCarId: cars[0]?.id || '',
        keyDifferentiators: [
          { category: 'Running Costs & Powertrain', description: 'Significant difference across electric/hybrid vs pure petrol/diesel.', winnerCarId: cars[0]?.id || '' },
          { category: 'Safety & ADAS', description: 'Active radar assistance and structural crash test protection levels.', winnerCarId: cars[0]?.id || '' }
        ],
        finalAdvice: 'Pick based on whether your primary priority is maximum fuel economy or outright high-speed highway stability.'
      });
    }
  });

  // 5. Conversational AI Car Assistant
  app.post('/api/ai/chat', async (req, res) => {
    try {
      const userMessage = req.body.message || req.body.prompt || (Array.isArray(req.body.messages) ? req.body.messages[req.body.messages.length - 1]?.text || req.body.messages[req.body.messages.length - 1]?.content : 'Hello');
      const conversationHistory = req.body.conversationHistory || req.body.messages || [];
      const context = req.body.context || req.body.availableCars || null;

      const ai = getGenAI();

      if (!ai) {
        return res.json({
          reply: `I am **DriveAI**, your automotive advisor. 

Based on verified Indian market data:
• **For City Commutes**: EVs like the **Tata Nexon.ev** (running cost ₹1.1/km) or Strong Hybrids like the **Maruti Grand Vitara** (27.9 km/l) offer highest savings.
• **For Highway & Safety**: 5-Star BNCAP vehicles like **Mahindra XUV700**, **Tata Safari**, and **Skoda Slavia** offer supreme high-speed stability and ADAS Level 2 safety.
• **For 7-Seater Family**: **Toyota Innova Hycross** and **Mahindra XUV700** provide best-in-class 3rd-row usability.

Feel free to ask about any specific model, variant recommendations, or 5-year EMI calculations!`,
          suggestedActions: [
            'Compare Creta vs Grand Vitara',
            'Is Nexon EV good for Bangalore traffic?',
            'Suggest best 7-seater under ₹20 Lakhs',
            'Explain Level 2 ADAS features'
          ]
        });
      }

      const systemInstruction = `You are DriveAI, a friendly, knowledgeable, and objective Indian automotive advisor.
You know in-depth specifications, real-world mileage, safety crash test results (BNCAP/GNCAP), maintenance costs, boot space, transmission types (Manual, Torque Converter, DCT, CVT, e-CVT), and ground clearance of cars in India (Tata, Hyundai, Maruti Suzuki, Mahindra, Toyota, Honda, MG, Skoda, Volkswagen, Kia).

Context:
${context ? JSON.stringify(context).slice(0, 3000) : 'General car advice in India'}

Guidelines:
1. Provide accurate, practical advice considering Indian road conditions, monsoon waterlogging, city traffic vs highway cruising, and real-world fuel economy.
2. Structure your replies cleanly with bold highlights and bullet points when comparing specs or giving pros/cons.
3. If discussing EVs, mention realistic highway range vs ARAI claims, home charging speeds, and 5-year savings.
4. Keep the tone helpful, modern, and confident.`;

      // Build chat prompt
      const historyFormatted = conversationHistory
        .map((m: any) => `${m.role === 'user' || m.sender === 'user' ? 'User' : 'DriveAI'}: ${m.content || m.text}`)
        .join('\n');

      const fullPrompt = `${historyFormatted}\nUser: ${userMessage}\nDriveAI:`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.7-flash',
        contents: fullPrompt,
        config: {
          systemInstruction,
          temperature: 0.7
        }
      });

      const replyText = response.text || "I'm here to help you evaluate and choose the ideal car for your needs!";

      // Generate context-based quick suggestions
      const queryLower = (userMessage || '').toLowerCase();
      const suggestedActions: string[] = [];
      if (queryLower.includes('ev') || queryLower.includes('electric')) {
        suggestedActions.push('Calculate 5-year EV vs Petrol savings', 'Check home charger installation costs', 'Compare Nexon EV vs MG Windsor EV');
      } else if (queryLower.includes('family') || queryLower.includes('7 seater') || queryLower.includes('seat')) {
        suggestedActions.push('Compare XUV700 vs Innova Hycross', 'Check 3rd row legroom & boot space', 'Review 5-star BNCAP safety scores');
      } else {
        suggestedActions.push('Compare top segment rivals', 'Calculate monthly EMI & fuel costs', 'Review real-world mileage');
      }

      return res.json({
        reply: replyText,
        suggestedActions
      });
    } catch (err: any) {
      console.error('Error in AI chat:', err);
      return res.json({
        reply: `Here are key takeaways for Indian car buyers:
• **Fuel Efficiency**: Strong Hybrids (Grand Vitara, Hyryder) achieve 22–27 km/l in heavy city stop-and-go traffic.
• **Safety First**: Look for 6 airbags standard, Electronic Stability Program (ESP), and 5-Star BNCAP ratings.
• **Total Cost of Ownership**: Factor in resale value, periodic service costs (annual ₹6,000–₹12,000), and insurance premiums.

Would you like to compare specific variants or calculate monthly loan EMIs?`,
        suggestedActions: [
          'Compare Creta vs Grand Vitara',
          'Calculate 5-year EV savings',
          'Show safest cars under ₹15 Lakhs'
        ]
      });
    }
  });

  // Serve the 3D landing page at root and /landing
  app.get(['/', '/landing'], (req, res) => {
    const distLanding = path.join(process.cwd(), 'dist', 'landing.html');
    const publicLanding = path.join(process.cwd(), 'public', 'landing.html');
    if (process.env.NODE_ENV === 'production' && fs.existsSync(distLanding)) {
      res.sendFile(distLanding);
    } else {
      res.sendFile(publicLanding);
    }
  });

  // Vite middleware setup (React app served under /app and all other non-API routes)
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        watch: {
          ignored: ['**/3d car modules/**', '**/*.zip', '**/*.glb', '**/scratch/**', '**/.git/**']
        }
      },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`DriveAI server running at http://localhost:${PORT}`);
  });
}

startServer();

// Knowledge base for chatbot responses
const knowledgeBase = [
  // --- F25 & S25 BATCH (LATEST PROJECTS) ---
  {
    keywords: ["detectra", "video analysis", "cctv", "surveillance", "security"],
    responseText: "Project: DETECTRA AI\nAdvisor: Mr. Usman Aamer\nStatus: In Process of Completion\nDescription: A unified web application for multimodal video analysis. Unlike systems relying on third-party APIs, it integrates object detection, logo recognition, and audio transcription into a single platform using transformers.",
    pdfUrl: "/Ongoing and Completed Projects-13-11-2025.pdf"
  },
  {
    keywords: ["retinawise", "eye disease", "oct diagnosis", "blindness", "medical ai"],
    responseText: "Project: RATINAWISE: SMART OCT DIAGNOSIS & SPECIALIST PORTAL\nAdvisor: Ms. Sumra Fayyaz\nStatus: In Process of Completion\nDescription: A multimodal AI system that integrates fundus imaging and OCT scans to detect eye diseases like diabetic retinopathy and glaucoma in early stages.",
    pdfUrl: "/Ongoing and Completed Projects-13-11-2025.pdf"
  },
  {
    keywords: ["findify", "product finder", "shopping ai", "visual search"],
    responseText: "Project: FINDIFY: SMART PRODUCT FINDER USING AI\nAdvisor: Ms. Sumra Fayyaz\nStatus: In Process of Completion\nDescription: An AI-based smart product finder that helps users locate products using visual search and intelligent recommendations.",
    pdfUrl: "/Ongoing and Completed Projects-13-11-2025.pdf"
  },
  {
    keywords: ["stitchmate", "tailoring", "fashion", "custom clothes", "measurements"],
    responseText: "Project: STITCHMATE: AI MEETS TAILORING\nAdvisor: Ms. Sumra Fayyaz\nStatus: In Process of Completion\nDescription: A platform allowing users to visualize, customize, and deliver tailored clothing. It uses AI to estimate measurements and visualize designs.",
    pdfUrl: "/Ongoing and Completed Projects-13-11-2025.pdf"
  },
  {
    keywords: ["medico+", "medication", "health records", "adherence", "reminder"],
    responseText: "Project: MEDICO+: AI ASSISTANT FOR MEDICATION ADHERENCE\nAdvisor: Ms. Sumra Fayyaz\nStatus: In Process of Completion\nDescription: An AI assistant helping patients with medication adherence and managing health records efficiently.",
    pdfUrl: "/Ongoing and Completed Projects-13-11-2025.pdf"
  },
  {
    keywords: ["edubot", "teacher avatar", "learning assistant", "education"],
    responseText: "Project: EDUBOT: THE WEB-BASED AI TEACHER AVATAR\nAdvisor: Mr. Jawad Hassan\nStatus: In Process of Completion\nDescription: A web-based AI teacher avatar and learning assistant designed to provide interactive education.",
    pdfUrl: "/Ongoing and Completed Projects-13-11-2025.pdf"
  },
  {
    keywords: ["streetfresh", "local commerce", "shopping", "fresh food"],
    responseText: "Project: STREETFRESH: SMARTER WAY TO SHOP LOCAL COMMERCE\nAdvisor: Mr. Jawad Hassan\nStatus: In Process of Completion\nDescription: A smarter way to shop for local commerce, focusing on fresh produce and connecting local sellers with buyers.",
    pdfUrl: "/Ongoing and Completed Projects-13-11-2025.pdf"
  },
  {
    keywords: ["craftai", "ui generator", "web design", "figma", "frontend"],
    responseText: "Project: CRAFTAI: SMART UI GENERATOR FOR APPS & WEB\nAdvisor: Mr. Jawad Hassan\nStatus: In Process of Completion\nDescription: Uses NLP and LLMs to generate responsive UI designs from text prompts or hand-drawn sketches, reducing design time by 80%.",
    pdfUrl: "/Ongoing and Completed Projects-13-11-2025.pdf"
  },
  {
    keywords: ["sahicheck", "fake news", "fraud detection", "phishing", "fact check"],
    responseText: "Project: SAHICHECK: AI-POWERED FAKE NEWS & FRAUD DETECTION\nAdvisor: Ms. Sumra Fayyaz\nStatus: In Process of Completion\nDescription: An AI-based mobile app that detects fake news, phishing, and online frauds using Machine Learning and NLP in real-time.",
    pdfUrl: "/Ongoing and Completed Projects-13-11-2025.pdf"
  },
  {
    keywords: ["multimodal eye", "eye disease", "south asia", "blindness"],
    responseText: "Project: MULTIMODAL AI FOR EARLY DETECTION OF EYE DISEASES\nAdvisor: Ms. Sumra Fayyaz\nStatus: In Process of Completion\nDescription: Integrates fundus imaging, OCT, and patient health data for early detection of eye diseases in South Asian populations.",
    pdfUrl: "/Ongoing and Completed Projects-13-11-2025.pdf"
  },
  {
    keywords: ["chronic disease", "big data", "healthcare", "diabetes", "heart disease"],
    responseText: "Project: BIG DATA ANALYTICS IN HEALTHCARE\nAdvisor: Ms. Sumra Fayyaz\nStatus: In Process of Completion\nDescription: Uses big data and ML to forecast probability of chronic diseases like Diabetes, Breast Cancer, and Heart Disease with 80% accuracy.",
    pdfUrl: "/Ongoing and Completed Projects-13-11-2025.pdf"
  },
  {
    keywords: ["sales bot", "customer support", "automation", "call center"],
    responseText: "Project: AI-POWERED AUTOMATED SALES AND CUSTOMER SUPPORT\nAdvisor: Ms. Sumra Fayyaz\nStatus: In Process of Completion\nDescription: A cloud-based AI platform that automates sales calls and customer support to boost conversions and cut costs.",
    pdfUrl: "/Ongoing and Completed Projects-13-11-2025.pdf"
  },
  {
    keywords: ["farmvision", "leaf disease", "agriculture", "crops", "plant health"],
    responseText: "Project: FARMVISION\nAdvisor: Mr. Umar Rana\nStatus: In Process of Completion\nDescription: A CNN-based multi-crop leaf disease detection system that allows farmers to upload leaf images and receive instant predictions and treatment guidance.",
    pdfUrl: "/Ongoing and Completed Projects-13-11-2025.pdf"
  },
  {
    keywords: ["hire", "interview", "recruitment", "resume evaluation", "saas"],
    responseText: "Project: HIRE: HOLISTIC INTERVIEW AND RESUME EVALUATION\nAdvisor: Mr. Umar Rana\nStatus: In Process of Completion\nDescription: AI-agent based SaaS platform for SMEs to simplify tech hiring, reducing hiring time by 80% using autonomous agents.",
    pdfUrl: "/Ongoing and Completed Projects-13-11-2025.pdf"
  },
  {
    keywords: ["intellihire", "smart recruiter", "resume matcher", "interview scheduler"],
    responseText: "Project: INTELLIHIRE: SMART RECRUITER\nAdvisor: Mr. Jawad Hassan\nStatus: In Process of Completion\nDescription: Automates candidate shortlisting, pre-screening, and scheduling to reduce recruiter workload and remove bias.",
    pdfUrl: "/Ongoing and Completed Projects-13-11-2025.pdf"
  },
  {
    keywords: ["automarket", "ecommerce", "product video", "ai listing"],
    responseText: "Project: AUTOMARKET: AI-POWERED E-COMMERCE MARKETPLACE\nAdvisor: Mr. Jawad Hassan\nStatus: In Process of Completion\nDescription: Solves seller challenges with AI image enhancement, voice-to-text descriptions, and AI-generated product videos.",
    pdfUrl: "/Ongoing and Completed Projects-13-11-2025.pdf"
  },
  {
    keywords: ["gap guide", "job fit", "skill gap", "career", "upskilling"],
    responseText: "Project: GAP GUIDE: AI JOB FIT AND SKILL GAP ASSISTANT\nAdvisor: Mr. Jawad Hassan\nStatus: In Process of Completion\nDescription: Analyzes resumes against target roles to identify skill gaps and create upskilling plans.",
    pdfUrl: "/Ongoing and Completed Projects-13-11-2025.pdf"
  },
  {
    keywords: ["voigerai", "voice", "ai", "assistant"],
    responseText: "Project: VOIGERAI\nAdvisor: Mr. Jawad Hassan\nStatus: In Process of Completion\nDescription: An AI voice project (Details pending in document).",
    pdfUrl: "/Ongoing and Completed Projects-13-11-2025.pdf"
  },
  {
    keywords: ["osdg", "data gathering", "open source", "dataset"],
    responseText: "Project: OPEN SOURCE DATA GATHERING (OSDG)\nAdvisor: Mr. Jawad Hassan\nStatus: In Process of Completion\nDescription: A platform for gathering open-source data for research and analysis.",
    pdfUrl: "/Ongoing and Completed Projects-13-11-2025.pdf"
  },
  {
    keywords: ["quickmart", "shopping", "retail", "fast commerce"],
    responseText: "Project: QUICKMART\nAdvisor: Mr. Jawad Hassan\nStatus: In Process of Completion\nDescription: A quick commerce solution for retail shopping.",
    pdfUrl: "/Ongoing and Completed Projects-13-11-2025.pdf"
  },
  {
    keywords: ["easycar", "obd-ii", "car service", "vehicle maintenance"],
    responseText: "Project: EASYCAR: SMART OBD-II BASED AUTOMOTIVE PLATFORM\nAdvisor: Mr. Jawad Hassan\nStatus: In Process of Completion\nDescription: An automotive service platform integrating OBD-II data for smart vehicle maintenance and diagnostics.",
    pdfUrl: "/Ongoing and Completed Projects-13-11-2025.pdf"
  },
  {
    keywords: ["wholpal", "group buying", "b2b", "retailers"],
    responseText: "Project: WHOLPAL: GROUP BUYING FOR RETAILERS\nAdvisor: Mr. Jawad Hassan\nStatus: In Process of Completion\nDescription: A group buying and reselling e-commerce platform designed for small retailers to get better rates.",
    pdfUrl: "/Ongoing and Completed Projects-13-11-2025.pdf"
  },
  {
    keywords: ["medimate", "medication", "health companion", "reminders"],
    responseText: "Project: MEDIMATE: YOUR SMART HEALTH COMPANION\nAdvisor: Mr. Jawad Hassan\nStatus: In Process of Completion\nDescription: A smart health and medication companion app.",
    pdfUrl: "/Ongoing and Completed Projects-13-11-2025.pdf"
  },
  {
    keywords: ["smart token", "queue management", "api", "waiting line"],
    responseText: "Project: AI-DRIVEN SMART TOKEN SYSTEM\nAdvisor: Mr. Jawad Hassan\nStatus: In Process of Completion\nDescription: Predictive queue management system with public API integration to reduce waiting times.",
    pdfUrl: "/Ongoing and Completed Projects-13-11-2025.pdf"
  },
  {
    keywords: ["taleem", "education", "learning", "school"],
    responseText: "Project: TALEEM\nAdvisor: Mr. Jawad Hassan\nStatus: In Process of Completion\nDescription: An educational platform.",
    pdfUrl: "/Ongoing and Completed Projects-13-11-2025.pdf"
  },
  {
    keywords: ["eldercare connect", "elderly", "nursing home", "monitoring"],
    responseText: "Project: ELDERCARE CONNECT\nAdvisor: Ms. Nabeela Khalid Siddiqui\nStatus: In Process of Completion\nDescription: Web portal for families to receive daily AI-summarized updates on their elderly relatives in care facilities.",
    pdfUrl: "/Ongoing and Completed Projects-13-11-2025.pdf"
  },
  {
    keywords: ["depolify", "cloud deployment", "hosting", "devops"],
    responseText: "Project: DEPOLIFY: YOUR GO TO CLOUD DEPLOYMENT SOLUTION\nAdvisor: Ms. Mubashra Anwar\nStatus: In Process of Completion\nDescription: One-click deployment platform that builds and hosts full-stack apps directly from repositories.",
    pdfUrl: "/Ongoing and Completed Projects-13-11-2025.pdf"
  },
  {
    keywords: ["trans pak", "logistics", "freight", "trucking"],
    responseText: "Project: TRANS PAK\nAdvisor: Ms. Maham Noor\nStatus: In Process of Completion\nDescription: Digital loadboard connecting shippers and carriers with real-time GPS tracking.",
    pdfUrl: "/Ongoing and Completed Projects-13-11-2025.pdf"
  },
  {
    keywords: ["voice math", "kids math", "education", "speech recognition"],
    responseText: "Project: VOICE-ENABLED MATHEMATICS LEARNING APP\nAdvisor: Ms. Maham Meher Awan\nStatus: In Process of Completion\nDescription: Voice-command educational app for children to learn math using Speech-to-Text.",
    pdfUrl: "/Ongoing and Completed Projects-13-11-2025.pdf"
  },
  {
    keywords: ["nutriflex", "fitness", "diet", "workout"],
    responseText: "Project: NUTRIFLEX\nAdvisor: Ms. Maham Meher Awan\nStatus: In Process of Completion\nDescription: Mobile fitness app providing personalized workout routines and diet plans using AI.",
    pdfUrl: "/Ongoing and Completed Projects-13-11-2025.pdf"
  },
  {
    keywords: ["sentivibe", "mood music", "emotion ai", "spotify"],
    responseText: "Project: SENTIVIBE: WHERE MOODS MEET MEDIA\nAdvisor: Ms. Maham Meher Awan\nStatus: In Process of Completion\nDescription: Detects emotions via face/voice and plays matching music from Spotify/YouTube.",
    pdfUrl: "/Ongoing and Completed Projects-13-11-2025.pdf"
  },
  {
    keywords: ["skinzy", "skincare", "dermatology", "acne"],
    responseText: "Project: SKINZY: AI-POWERED SKIN CARE\nAdvisor: Ms. Maham Meher Awan\nStatus: In Process of Completion\nDescription: AI app analyzing facial skin to detect issues like acne and recommending products.",
    pdfUrl: "/Ongoing and Completed Projects-13-11-2025.pdf"
  },
  {
    keywords: ["mindmesh", "workspace", "productivity", "ai tools"],
    responseText: "Project: MINDMESH: AI-POWERED WORKSPACE\nAdvisor: Ms. Maham Meher Awan\nStatus: In Process of Completion\nDescription: An AI-powered workspace for productivity.",
    pdfUrl: "/Ongoing and Completed Projects-13-11-2025.pdf"
  },
  {
    keywords: ["syncluence", "influencer", "marketing", "brand match"],
    responseText: "Project: SYNCLUENCE: AI INFLUENCER MATCHMAKING\nAdvisor: Ms. Maham Meher Awan\nStatus: In Process of Completion\nDescription: AI-powered platform connecting brands with suitable influencers.",
    pdfUrl: "/Ongoing and Completed Projects-13-11-2025.pdf"
  },
  {
    keywords: ["auto morf", "ai", "morphing"],
    responseText: "Project: AUTO MORF AI\nAdvisor: Ms. Maham Meher Awan\nStatus: In Process of Completion\nDescription: AI morphing project.",
    pdfUrl: "/Ongoing and Completed Projects-13-11-2025.pdf"
  },
  {
    keywords: ["sootheu", "mental health", "emotion regulation", "therapy"],
    responseText: "Project: SOOTHEU: AI EMOTION REGULATION\nAdvisor: Ms. Maham Meher Awan\nStatus: In Process of Completion\nDescription: AI emotion regulation and mental health assistance system.",
    pdfUrl: "/Ongoing and Completed Projects-13-11-2025.pdf"
  },
  {
    keywords: ["lhrsehat", "lahore health", "emergency", "ambulance"],
    responseText: "Project: LHRSEHAT: SMART HEALTHCARE LAHORE\nAdvisor: Ms. Maham Meher Awan\nStatus: In Process of Completion\nDescription: Smart healthcare and emergency assistance system for Lahore.",
    pdfUrl: "/Ongoing and Completed Projects-13-11-2025.pdf"
  },
  {
    keywords: ["soulify", "inner peace", "meditation", "wellness"],
    responseText: "Project: SOULIFY: EMBRACE YOUR INNER PEACE\nAdvisor: Ms. Maham Meher Awan\nStatus: In Process of Completion\nDescription: Wellness app for inner peace and meditation.",
    pdfUrl: "/Ongoing and Completed Projects-13-11-2025.pdf"
  },
  {
    keywords: ["rice blast", "crop disease", "agriculture ai", "plant disease"],
    responseText: "Project: AI SYSTEM FOR RICE BLAST DETECTION\nAdvisor: Ms. Maham Meher Awan\nStatus: In Process of Completion\nDescription: AI system to detect Rice Blast disease in crops.",
    pdfUrl: "/Ongoing and Completed Projects-13-11-2025.pdf"
  },
  {
    keywords: ["spareshare", "food waste", "donations", "household"],
    responseText: "Project: SPARESHARE\nAdvisor: Ms. Maham Meher Awan\nStatus: In Process of Completion\nDescription: Web platform for sharing food, groceries, and household essentials to reduce waste.",
    pdfUrl: "/Ongoing and Completed Projects-13-11-2025.pdf"
  },
  {
    keywords: ["sportsphere", "badminton", "sports assistant", "coaching"],
    responseText: "Project: SPORTSSPHERE: AI BADMINTON ASSISTANT\nAdvisor: Ms. Maham Meher Awan\nStatus: In Process of Completion\nDescription: AI-powered badminton assistant.",
    pdfUrl: "/Ongoing and Completed Projects-13-11-2025.pdf"
  },
  {
    keywords: ["tapunity", "campus app", "nfc", "student id"],
    responseText: "Project: TAPUNITY: UNIFYING CAMPUS\nAdvisor: Ms. Maham Meher Awan\nStatus: In Process of Completion\nDescription: Unifying campus services with one smart tap (NFC).",
    pdfUrl: "/Ongoing and Completed Projects-13-11-2025.pdf"
  },
  {
    keywords: ["flex", "browser extension", "eye tracking", "accessibility"],
    responseText: "Project: FLEX: FACIAL & LIGHT EXPERIENCE EXTENSION\nAdvisor: Ms. Maham Meher Awan\nStatus: In Process of Completion\nDescription: Smart adaptive browser extension using facial and gaze detection.",
    pdfUrl: "/Ongoing and Completed Projects-13-11-2025.pdf"
  },
  {
    keywords: ["charmchime", "stories", "kids", "imagination"],
    responseText: "Project: CHARMCHIME: STORIES OF WONDER\nAdvisor: Mr. Shah Nawaz\nStatus: In Process of Completion\nDescription: Interactive storytelling platform for children.",
    pdfUrl: "/Ongoing and Completed Projects-13-11-2025.pdf"
  },
  {
    keywords: ["unibrandconnect", "marketing", "students", "referrals"],
    responseText: "Project: UNIBRANDCONNECT\nAdvisor: Mr. Shah Nawaz\nStatus: In Process of Completion\nDescription: Platform bridging companies and student marketers for campus promotions.",
    pdfUrl: "/Ongoing and Completed Projects-13-11-2025.pdf"
  },
  {
    keywords: ["clearclever", "insurance", "policy comparison", "fintech"],
    responseText: "Project: CLEARCLEVER: CLARITY IN COVERAGE\nAdvisor: Mr. Mohsin Sami\nStatus: In Process of Completion\nDescription: Insurance aggregation platform for comparing policies in Pakistan.",
    pdfUrl: "/Ongoing and Completed Projects-13-11-2025.pdf"
  },
  {
    keywords: ["lexify", "legal help", "lawyer finder", "justice"],
    responseText: "Project: LEXIFY\nAdvisor: Mr. Mohsin Sami\nStatus: In Process of Completion\nDescription: User-centered legal assistance platform connecting users with lawyers.",
    pdfUrl: "/Ongoing and Completed Projects-13-11-2025.pdf"
  },
  {
    keywords: ["flavor haus", "dining", "home chef", "food"],
    responseText: "Project: FLAVOR HAUS\nAdvisor: Mr. Mohsin Sami\nStatus: In Process of Completion\nDescription: Connects guests with hosts for home-cooked meal experiences.",
    pdfUrl: "/Ongoing and Completed Projects-13-11-2025.pdf"
  },
  {
    keywords: ["pennywise", "budgeting", "shopping", "finance"],
    responseText: "Project: PENNYWISE: INTELLIGENT SHOPPING\nAdvisor: Mr. Mohsin Sami\nStatus: In Process of Completion\nDescription: Intelligent shopping and budgeting platform.",
    pdfUrl: "/Ongoing and Completed Projects-13-11-2025.pdf"
  },
  {
    keywords: ["helping hand", "charity", "donation", "community"],
    responseText: "Project: HELPING HAND\nAdvisor: Mr. Mohsin Sami\nStatus: In Process of Completion\nDescription: Platform for community help and donations.",
    pdfUrl: "/Ongoing and Completed Projects-13-11-2025.pdf"
  },
  {
    keywords: ["agritrade", "agriculture", "trading", "crops"],
    responseText: "Project: AGRITRADE\nAdvisor: Mr. Mohsin Sami\nStatus: In Process of Completion\nDescription: Online agricultural trading platform.",
    pdfUrl: "/Ongoing and Completed Projects-13-11-2025.pdf"
  },
  {
    keywords: ["medicopanion", "medical help", "health"],
    responseText: "Project: MEDICOMPANION\nAdvisor: Mr. Mohsin Sami\nStatus: In Process of Completion\nDescription: Plain language medical help app.",
    pdfUrl: "/Ongoing and Completed Projects-13-11-2025.pdf"
  },
  {
    keywords: ["synthea", "coding assistant", "developer tool"],
    responseText: "Project: SYNTHEA: THE CODING ASSISTANT\nAdvisor: Mr. Mohsin Sami\nStatus: In Process of Completion\nDescription: AI coding assistant.",
    pdfUrl: "/Ongoing and Completed Projects-13-11-2025.pdf"
  },
  {
    keywords: ["virqa", "voice qa", "interview", "questioning"],
    responseText: "Project: VIRQA: VOICE BASED INTELLIGENT QUESTIONING\nAdvisor: Mr. Mohsin Sami\nStatus: In Process of Completion\nDescription: Voice-based real-time questioning system.",
    pdfUrl: "/Ongoing and Completed Projects-13-11-2025.pdf"
  },
  {
    keywords: ["lifesync", "voice assistant", "daily planner"],
    responseText: "Project: LIFESYNC\nAdvisor: Mr. Mohsin Sami\nStatus: In Process of Completion\nDescription: AI-powered voice-based daily assistant.",
    pdfUrl: "/Ongoing and Completed Projects-13-11-2025.pdf"
  },
  {
    keywords: ["music connect", "local music", "poetry", "artists"],
    responseText: "Project: MUSIC CONNECT\nAdvisor: Mr. Mohsin Sami\nStatus: In Process of Completion\nDescription: AI platform for local music and poetry.",
    pdfUrl: "/Ongoing and Completed Projects-13-11-2025.pdf"
  },
  {
    keywords: ["careerforge", "jobs", "career"],
    responseText: "Project: CAREERFORGE\nAdvisor: Mr. Mohsin Sami\nStatus: In Process of Completion\nDescription: Career development platform.",
    pdfUrl: "/Ongoing and Completed Projects-13-11-2025.pdf"
  },
  {
    keywords: ["dine design", "restaurant website", "templates", "saas"],
    responseText: "Project: DINE DESIGN\nAdvisor: Mr. Mohsin Sami\nStatus: In Process of Completion\nDescription: SaaS platform for restaurant website templates.",
    pdfUrl: "/Ongoing and Completed Projects-13-11-2025.pdf"
  },
  {
    keywords: ["uaams", "university admission", "management"],
    responseText: "Project: UAAMS\nAdvisor: Mr. Mohsin Sami\nStatus: In Process of Completion\nDescription: University Admission Assistance and Management System.",
    pdfUrl: "/Ongoing and Completed Projects-13-11-2025.pdf"
  },
  {
    keywords: ["smartprep", "interview coach", "job seekers"],
    responseText: "Project: SMARTPREP\nAdvisor: Mr. Mohsin Sami\nStatus: In Process of Completion\nDescription: AI interview coach for tech job seekers.",
    pdfUrl: "/Ongoing and Completed Projects-13-11-2025.pdf"
  },
  {
    keywords: ["teachxchange", "teaching", "education"],
    responseText: "Project: TEACHXCHANGE\nAdvisor: Mr. Mohsin Sami\nStatus: In Process of Completion\nDescription: Platform for teaching exchange.",
    pdfUrl: "/Ongoing and Completed Projects-13-11-2025.pdf"
  },
  {
    keywords: ["bidify", "auction", "unique items"],
    responseText: "Project: BIDIFY\nAdvisor: Mr. Mohsin Sami\nStatus: In Process of Completion\nDescription: Celebrate, Bid, Own Unique items platform.",
    pdfUrl: "/Ongoing and Completed Projects-13-11-2025.pdf"
  },
  {
    keywords: ["vibebook", "social app", "mobile"],
    responseText: "Project: VIBEBOOK\nAdvisor: Mr. Mohsin Sami\nStatus: In Process of Completion\nDescription: Smart mobile app for social connection.",
    pdfUrl: "/Ongoing and Completed Projects-13-11-2025.pdf"
  },
  {
    keywords: ["lexai", "legal document", "analyzer"],
    responseText: "Project: LEXAI\nAdvisor: Mr. Ali Haider Arif\nStatus: In Process of Completion\nDescription: Legal document analyzer using AI.",
    pdfUrl: "/Ongoing and Completed Projects-13-11-2025.pdf"
  },
  {
    keywords: ["book ex", "book exchange", "sale"],
    responseText: "Project: BOOK EX\nAdvisor: Mr. Ali Haider Arif\nStatus: In Process of Completion\nDescription: Community-based book exchange and sale.",
    pdfUrl: "/Ongoing and Completed Projects-13-11-2025.pdf"
  },
  {
    keywords: ["tastescope", "food review", "scraper", "analysis"],
    responseText: "Project: TASTESCOPE\nAdvisor: Mr. Ali Haider Arif\nStatus: In Process of Completion\nDescription: AI-powered review scraper and analyzer for food.",
    pdfUrl: "/Ongoing and Completed Projects-13-11-2025.pdf"
  },
  {
    keywords: ["forensic timeline", "evidence", "digital forensics"],
    responseText: "Project: FORENSIC TIMELINE RECONSTRUCTOR\nAdvisor: Mr. Ali Haider Arif\nStatus: In Process of Completion\nDescription: Automated digital forensic timeline generator.",
    pdfUrl: "/Ongoing and Completed Projects-13-11-2025.pdf"
  },
  {
    keywords: ["psychological assessment", "mental health", "nlp"],
    responseText: "Project: AI BASED PSYCHOLOGICAL ASSESSMENT SYSTEM\nAdvisor: Mr. Abid Bashir\nStatus: In Process of Completion\nDescription: Analyzes mental health using NLP and ML from questionnaires and voice tone.",
    pdfUrl: "/Ongoing and Completed Projects-13-11-2025.pdf"
  },
  {
    keywords: ["intellibid", "auction", "bidding", "price estimation"],
    responseText: "Project: INTELLIBID: AI WEB BIDDING SYSTEM\nAdvisor: Mr. Abid Bashir\nStatus: In Process of Completion\nDescription: AI-driven auction platform with price estimation and auto-category detection.",
    pdfUrl: "/Ongoing and Completed Projects-13-11-2025.pdf"
  },
  {
    keywords: ["construction estimation", "floor plan", "cost calculator"],
    responseText: "Project: INTELLIGENT CONSTRUCTION ESTIMATION (ICEMGS)\nAdvisor: Mr. Abid Bashir\nStatus: In Process of Completion\nDescription: System to estimate building costs and generate 2D floor plans automatically.",
    pdfUrl: "/Ongoing and Completed Projects-13-11-2025.pdf"
  },
  {
    keywords: ["neurolog", "mental wellbeing", "journaling", "emotion detection"],
    responseText: "Project: NEUROLOG\nAdvisor: Dr. Nauman Mazhar\nStatus: In Process of Completion\nDescription: AI web app for mental wellbeing monitoring via journals and facial expression.",
    pdfUrl: "/Ongoing and Completed Projects-13-11-2025.pdf"
  },
  {
    keywords: ["nexa", "chatbot builder", "website builder"],
    responseText: "Project: NEXA\nAdvisor: Dr. Nabeel Sabir\nStatus: In Process of Completion\nDescription: Chatbot and website builder platform.",
    pdfUrl: "/Ongoing and Completed Projects-13-11-2025.pdf"
  },
  {
    keywords: ["opticodes", "web generator", "planning"],
    responseText: "Project: OPTICODES\nAdvisor: Ms. Sadia Aslam\nStatus: In Process of Completion\nDescription: Desktop AI tool for planning and generating web applications.",
    pdfUrl: "/Ongoing and Completed Projects-13-11-2025.pdf"
  }
];

// Function to calculate match score
const calculateMatchScore = (query, keywords) => {
  const queryWords = query.toLowerCase().split(/\s+/);
  let score = 0;

  for (const keyword of keywords) {
    const keywordLower = keyword.toLowerCase();
    // Check for exact word match
    if (queryWords.includes(keywordLower)) {
      score += 2;
    }
    // Check if query contains the keyword
    else if (query.toLowerCase().includes(keywordLower)) {
      score += 1;
    }
  }

  return score;
};

exports.getResponse = async (req, res) => {
  const { query, question } = req.body;
  const userQuery = query || question;

  if (!userQuery) return res.status(400).json({ message: "Query is required" });

  // Calculate scores for all knowledge base entries
  const scoredResponses = knowledgeBase.map(item => ({
    ...item,
    score: calculateMatchScore(userQuery, item.keywords)
  }));

  // Sort by score and get the best match
  scoredResponses.sort((a, b) => b.score - a.score);
  const bestMatch = scoredResponses[0];

  if (bestMatch && bestMatch.score > 0) {
    return res.json({
      answer: bestMatch.responseText,
      response: bestMatch.responseText,
      pdf: bestMatch.pdfUrl || null
    });
  }

  const defaultResponse = "I'm sorry, I don't have a specific answer for that question. Try asking about:\n• Submitting tasks\n• Project guidelines\n• Deadlines\n• Progress tracking\n• Discussion board\n• Finding advisors\n\nOr type 'help' for more options!";
  return res.json({ answer: defaultResponse, response: defaultResponse, pdf: null });
};

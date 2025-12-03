// Knowledge base for chatbot responses
const knowledgeBase = [
  // Task related
  { keywords: ["submit", "task", "upload", "assignment"], responseText: "To submit a task: 1) Go to your Tasks page, 2) Find the task you want to submit, 3) Click 'Upload' or 'Submit', 4) Select your file and confirm. Your submission will be sent to your advisor for review.", pdfUrl: "" },
  { keywords: ["create", "task", "new task"], responseText: "Only advisors can create tasks. Advisors: Go to Tasks page → Click 'Add New Task' → Fill in the details (title, description, deadline, file if needed) → Assign to a project → Save.", pdfUrl: "" },

  // Project related
  { keywords: ["create", "project", "new project"], responseText: "To create a project: 1) Go to Projects page, 2) Click 'Add New Project', 3) Enter project name and description, 4) Click 'Create'. You can then add students to the project.", pdfUrl: "" },
  { keywords: ["search", "fyp", "project", "find project"], responseText: "You can view your assigned FYP projects in the Projects section. Each project shows its progress, tasks, team members, and advisor. Use the search bar to filter projects.", pdfUrl: "" },
  { keywords: ["add", "student", "assign student"], responseText: "To add a student to a project: 1) Go to Students page, 2) Click 'Add New Student', 3) Select the project and student, 4) Click 'Add Student'. The student will now have access to the project.", pdfUrl: "" },

  // Advisor related
  { keywords: ["advisor", "supervisor", "find advisor", "contact advisor"], responseText: "You can find your advisor information in the Projects section - each project shows the assigned advisor. To contact your advisor, use the Discussion Board for your project.", pdfUrl: "" },
  { keywords: ["search", "advisor", "list"], responseText: "Advisors are assigned to projects. You can see your project advisor in the Projects section. Each project displays the advisor's name and you can message them through the Discussion Board.", pdfUrl: "" },

  // Progress related
  { keywords: ["progress", "status", "completion", "percentage"], responseText: "Your project progress is shown on the Dashboard. It's calculated based on completed tasks out of total tasks. Each task completion contributes to the overall progress percentage.", pdfUrl: "" },
  { keywords: ["dashboard", "overview", "summary"], responseText: "The Dashboard shows: 1) Total projects count, 2) Pending tasks, 3) Overall progress percentage, 4) Recent activities. It gives you a quick overview of your FYP status.", pdfUrl: "" },

  // Deadline related
  { keywords: ["deadline", "due date", "when", "date"], responseText: "Check your task details for specific deadlines. Each task shows its due date when created by your advisor. Tasks are sorted by deadline on the Tasks page. Late submissions may be marked accordingly.", pdfUrl: "" },

  // Submission related
  { keywords: ["submission", "submitted", "my submission"], responseText: "To view your submissions: Go to Submissions page. You'll see all your submitted work with status, submission date, and grade (if graded). You can update submissions before the deadline.", pdfUrl: "" },
  { keywords: ["grade", "marks", "score", "feedback"], responseText: "Your grades appear in the Submissions page after your advisor reviews and grades your work. Each submission shows the grade and any feedback provided by your advisor.", pdfUrl: "" },

  // Discussion related
  { keywords: ["discussion", "message", "chat", "communicate", "talk"], responseText: "Use the Discussion Board to communicate with your advisor and team. Go to Discussion → Select your project → Type your message → Send. All project members can see the conversation.", pdfUrl: "" },

  // FAQ
  { keywords: ["faq", "frequently", "asked", "questions", "common"], responseText: "Frequently Asked Questions:\n1) How to submit tasks? → Tasks page → Upload file\n2) How to check progress? → Dashboard\n3) How to contact advisor? → Discussion Board\n4) How to see deadlines? → Tasks page shows due dates\n5) How to view grades? → Submissions page", pdfUrl: "" },

  // Help
  { keywords: ["help", "assist", "support", "guide"], responseText: "I can help you with:\n• Submitting tasks and assignments\n• Understanding project guidelines\n• Checking deadlines and progress\n• Navigating FYP COMPASS\n• Finding advisor information\n• Using the Discussion Board\n\nJust ask me about any of these topics!", pdfUrl: "" },

  // Guidelines
  { keywords: ["guideline", "rule", "requirement", "format"], responseText: "Project guidelines are typically provided by your advisor in task descriptions. Check each task for specific requirements. Common requirements include: file format, naming conventions, and submission deadlines.", pdfUrl: "" },

  // Login/Account
  { keywords: ["login", "password", "account", "forgot", "reset"], responseText: "For account issues: 1) Forgot password? Use 'Forgot Password' on login page, 2) Can't login? Check your email/password, 3) Need an account? Contact your administrator or use Sign Up if available.", pdfUrl: "" },
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

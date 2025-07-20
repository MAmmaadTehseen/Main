// Temporary static array (can be replaced with DB queries)
const queries = [
  { queryText: "how to submit task", responseText: "Go to your tasks and click 'Submit'", pdfUrl: "" },
  { queryText: "how to create project", responseText: "Only advisors and admins can create projects.", pdfUrl: "" },
  { queryText: "project guidelines", responseText: "Please read the guidelines in the provided PDF.", pdfUrl: "/pdfs/guidelines.pdf" }
];

exports.getResponse = async (req, res) => {
  const { query } = req.body;
  if (!query) return res.status(400).json({ message: "Query is required" });

  const q = query.toLowerCase();

  // Find a matching query in the static array
  const match = queries.find(item => q.includes(item.queryText));
  if (match) {
    return res.json({ response: match.responseText, pdf: match.pdfUrl });
  }

  return res.json({ response: "Sorry, I don't have an answer for that.", pdf: null });
};

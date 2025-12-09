module.exports = (req, res) => {
  res.status(200).json({
    name: "Calendrier KIS API",
    version: "5.0.0",
    database: "Supabase PostgreSQL",
    endpoints: {
      health: "/api/health",
      evaluations: "/api/evaluations",
      evaluationById: "/api/evaluations/:id",
      export: "/api/export"
    }
  });
};

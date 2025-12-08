// ═══════════════════════════════════════════════════════════════
// API INDEX - Router Principal (Supabase)
// ═══════════════════════════════════════════════════════════════

const express = require('express');
const cors = require('cors');
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Import des routes
const healthHandler = require('./health');
const evaluationsHandler = require('./evaluations/index');
const evaluationByIdHandler = require('./evaluations/[id]');
const exportHandler = require('./export');

// Routes
app.get('/api/health', healthHandler);
app.get('/api/evaluations', evaluationsHandler);
app.post('/api/evaluations', evaluationsHandler);
app.delete('/api/evaluations/:id', (req, res) => {
  req.query = { id: req.params.id };
  evaluationByIdHandler(req, res);
});
app.post('/api/export', exportHandler);

// Route par défaut
app.get('/', (req, res) => {
  res.json({
    name: 'Calendrier KIS API',
    version: '5.0.0',
    database: 'Supabase PostgreSQL',
    endpoints: {
      health: '/api/health',
      evaluations: '/api/evaluations',
      evaluationById: '/api/evaluations/:id',
      export: '/api/export'
    }
  });
});

// Export pour Vercel
module.exports = app;

// Démarrage local
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`🚀 Serveur démarré sur le port ${PORT}`);
    console.log(`📊 Database: Supabase PostgreSQL`);
  });
}

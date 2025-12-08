// ═══════════════════════════════════════════════════════════════
// CALENDRIER DES ÉVALUATIONS KIS - API BACKEND
// ═══════════════════════════════════════════════════════════════

require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// CORS headers pour Vercel
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// ═══════════════════════════════════════════════════════════════
// CONFIGURATION MONGODB
// ═══════════════════════════════════════════════════════════════

const MONGODB_URI = process.env.MONGODB_URI || process.env.MONGO_URL;

console.log('━'.repeat(60));
console.log('🔍 Configuration MongoDB');
console.log('━'.repeat(60));

if (!MONGODB_URI) {
  console.error('❌ MONGODB_URI non définie !');
  console.error('💡 Configurez-la dans Vercel → Environment Variables');
} else {
  const masked = MONGODB_URI.substring(0, 20) + '***' + MONGODB_URI.substring(MONGODB_URI.length - 15);
  console.log('✅ URI détectée :', masked);
}

// Connexion MongoDB (sans options dépréciées)
console.log('⏳ Connexion à MongoDB...');

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('━'.repeat(60));
    console.log('✅ CONNEXION MONGODB RÉUSSIE');
    console.log('📊 Base de données prête');
    console.log('━'.repeat(60));
  })
  .catch(err => {
    console.error('━'.repeat(60));
    console.error('❌ ERREUR CONNEXION MONGODB');
    console.error('━'.repeat(60));
    console.error('Message:', err.message);
    console.error('');
    console.error('💡 Solutions :');
    console.error('1. Vérifiez MONGODB_URI dans Vercel');
    console.error('2. Autorisez 0.0.0.0/0 dans MongoDB Atlas Network Access');
    console.error('3. Vérifiez username/password');
    console.error('━'.repeat(60));
  });

// Gestion erreurs connexion
mongoose.connection.on('error', err => {
  console.error('❌ Erreur MongoDB:', err.message);
});

mongoose.connection.on('disconnected', () => {
  console.warn('⚠️  MongoDB déconnecté');
});

// ═══════════════════════════════════════════════════════════════
// SCHÉMA MONGOOSE
// ═══════════════════════════════════════════════════════════════

const evaluationSchema = new mongoose.Schema({
  classe: { type: String, required: true, trim: true },
  semaine: { type: String, required: true, trim: true },
  matiere: { type: String, required: true, trim: true },
  unite: { type: String, required: true, trim: true },
  critere: { type: String, required: true, trim: true },
  createdAt: { type: Date, default: Date.now }
}, {
  collection: 'evaluations'
});

const Evaluation = mongoose.model('Evaluation', evaluationSchema);

// ═══════════════════════════════════════════════════════════════
// ROUTES API
// ═══════════════════════════════════════════════════════════════

// 🏥 Health check
app.get('/api/health', (req, res) => {
  const dbState = mongoose.connection.readyState;
  const states = ['disconnected', 'connected', 'connecting', 'disconnecting'];
  res.json({
    status: 'ok',
    database: states[dbState],
    timestamp: new Date().toISOString()
  });
});

// 📥 GET /api/evaluations - Récupérer les évaluations
app.get('/api/evaluations', async (req, res) => {
  try {
    const { classe } = req.query;
    
    if (!classe) {
      return res.status(400).json({ 
        error: 'Le paramètre "classe" est requis' 
      });
    }
    
    // Vérifier connexion MongoDB
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({ 
        error: 'Base de données non disponible',
        dbState: mongoose.connection.readyState
      });
    }
    
    console.log(`📥 GET /api/evaluations?classe=${classe}`);
    
    const evaluations = await Evaluation.find({ classe: classe.trim() })
      .sort({ semaine: 1, matiere: 1 })
      .lean();
    
    console.log(`✅ ${evaluations.length} évaluation(s) trouvée(s)`);
    
    res.json(evaluations);
  } catch (error) {
    console.error('❌ Erreur GET /api/evaluations:', error.message);
    res.status(500).json({ 
      error: 'Erreur lors de la récupération',
      message: error.message 
    });
  }
});

// 📤 POST /api/evaluations - Ajouter une évaluation
app.post('/api/evaluations', async (req, res) => {
  try {
    const { classe, semaine, matiere, unite, critere } = req.body;
    
    // Validation
    if (!classe || !semaine || !matiere || !unite || !critere) {
      return res.status(400).json({ 
        error: 'Tous les champs sont requis',
        missing: { classe, semaine, matiere, unite, critere }
      });
    }
    
    // Vérifier connexion MongoDB
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({ 
        error: 'Base de données non disponible',
        dbState: mongoose.connection.readyState
      });
    }
    
    console.log(`📤 POST /api/evaluations - Classe: ${classe}, Semaine: ${semaine}, Matière: ${matiere}`);
    
    // Créer et sauvegarder
    const evaluation = new Evaluation({
      classe: classe.trim(),
      semaine: semaine.trim(),
      matiere: matiere.trim(),
      unite: unite.trim(),
      critere: critere.trim()
    });
    
    const saved = await evaluation.save();
    
    console.log(`✅ Évaluation enregistrée: ${saved._id}`);
    
    res.status(201).json(saved);
  } catch (error) {
    console.error('❌ Erreur POST /api/evaluations:', error.message);
    res.status(500).json({ 
      error: 'Erreur lors de l\'enregistrement',
      message: error.message 
    });
  }
});

// 🗑️ DELETE /api/evaluations/:id - Supprimer une évaluation
app.delete('/api/evaluations/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Vérifier connexion MongoDB
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({ 
        error: 'Base de données non disponible',
        dbState: mongoose.connection.readyState
      });
    }
    
    console.log(`🗑️  DELETE /api/evaluations/${id}`);
    
    const deleted = await Evaluation.findByIdAndDelete(id);
    
    if (!deleted) {
      return res.status(404).json({ 
        error: 'Évaluation non trouvée' 
      });
    }
    
    console.log(`✅ Évaluation supprimée: ${id}`);
    
    res.json({ 
      message: 'Évaluation supprimée',
      deletedId: id 
    });
  } catch (error) {
    console.error('❌ Erreur DELETE /api/evaluations:', error.message);
    res.status(500).json({ 
      error: 'Erreur lors de la suppression',
      message: error.message 
    });
  }
});

// ═══════════════════════════════════════════════════════════════
// DÉMARRAGE SERVEUR (local uniquement)
// ═══════════════════════════════════════════════════════════════

if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log('━'.repeat(60));
    console.log(`🚀 Serveur démarré : http://localhost:${PORT}`);
    console.log('━'.repeat(60));
  });
}

// Export pour Vercel Serverless
module.exports = app;

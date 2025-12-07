// index.js (Backend)

require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());

// ✅ Correction : compatibilité MONGO_URL / MONGODB_URI (Vercel)
const MONGODB_URI = process.env.MONGODB_URI || process.env.MONGO_URL;

if (!MONGODB_URI) {
  console.error("❌ Erreur critique : la variable d'environnement MONGODB_URI (ou MONGO_URL) n'est pas définie.");
  console.error("💡 Assure-toi de l’avoir ajoutée dans Vercel → Settings → Environment Variables.");
  // process.exit(1); // Commenté pour permettre le mode dégradé
}

// ✅ Connexion à MongoDB avec options recommandées
mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ Connexion à MongoDB réussie.'))
.catch(err => {
  console.error('❌ Erreur de connexion à MongoDB :', err.message);
  // process.exit(1); // Commenté pour permettre le mode dégradé
});

// Schéma de l'Évaluation
const evaluationSchema = new mongoose.Schema({
  classe: { type: String, required: true },   // Ex: PEI1, DP2
  semaine: { type: String, required: true },  // Ex: S2, S4, S26
  matiere: { type: String, required: true },
  unite: { type: String, required: true },
  critere: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const Evaluation = mongoose.model('Evaluation', evaluationSchema);

// --- Routes API ---

// 1️⃣ POST /api/evaluations : Ajouter une évaluation
app.post('/api/evaluations', async (req, res) => {
  try {
    const { classe, semaine, matiere, unite, critere } = req.body;
    
    // Validation des champs requis
    if (!classe || !semaine || !matiere || !unite || !critere) {
      console.error('❌ Champs manquants:', { classe, semaine, matiere, unite, critere });
      return res.status(400).json({ 
        message: 'Tous les champs sont requis.',
        missing: { classe, semaine, matiere, unite, critere }
      });
    }
    
    // Vérification de la connexion MongoDB
    if (mongoose.connection.readyState !== 1) {
      console.error('❌ MongoDB non connecté. État:', mongoose.connection.readyState);
      return res.status(503).json({ 
        message: 'Base de données non disponible. Veuillez réessayer.',
        dbState: mongoose.connection.readyState
      });
    }
    
    // Création et sauvegarde de l'évaluation
    const nouvelleEvaluation = new Evaluation({ 
      classe: classe.trim(), 
      semaine: semaine.trim(), 
      matiere: matiere.trim(), 
      unite: unite.trim(), 
      critere: critere.trim() 
    });
    
    const savedEvaluation = await nouvelleEvaluation.save();
    console.log('✅ Évaluation enregistrée avec succès:', savedEvaluation._id);
    
    res.status(201).json(savedEvaluation);
  } catch (error) {
    console.error('❌ Erreur lors de l\'enregistrement:', error);
    res.status(500).json({ 
      message: "Erreur lors de l'enregistrement de l'évaluation.", 
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// 2️⃣ GET /api/evaluations?classe=PEI1 : Récupérer les évaluations d’une classe
app.get('/api/evaluations', async (req, res) => {
  try {
    const { classe } = req.query;
    
    if (!classe) {
      return res.status(400).json({ message: 'Le paramètre "classe" est requis.' });
    }
    
    // Vérification de la connexion MongoDB
    if (mongoose.connection.readyState !== 1) {
      console.error('❌ MongoDB non connecté. État:', mongoose.connection.readyState);
      return res.status(503).json({ 
        message: 'Base de données non disponible.',
        dbState: mongoose.connection.readyState
      });
    }
    
    console.log('📥 Récupération des évaluations pour la classe:', classe);
    const evaluations = await Evaluation.find({ classe: classe.trim() })
      .sort({ semaine: 1, matiere: 1 })
      .lean();
    
    console.log(`✅ ${evaluations.length} évaluation(s) trouvée(s) pour ${classe}`);
    res.json(evaluations);
  } catch (error) {
    console.error('❌ Erreur lors de la récupération:', error);
    res.status(500).json({ 
      message: "Erreur lors de la récupération des évaluations.", 
      error: error.message 
    });
  }
});

// 3️⃣ DELETE /api/evaluations/:id : Supprimer une évaluation
app.delete('/api/evaluations/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Vérification de la connexion MongoDB
    if (mongoose.connection.readyState !== 1) {
      console.error('❌ MongoDB non connecté. État:', mongoose.connection.readyState);
      return res.status(503).json({ 
        message: 'Base de données non disponible.',
        dbState: mongoose.connection.readyState
      });
    }
    
    console.log('🗑️ Suppression de l\'évaluation:', id);
    const resultat = await Evaluation.findByIdAndDelete(id);
    
    if (!resultat) {
      console.error('❌ Évaluation non trouvée:', id);
      return res.status(404).json({ message: 'Évaluation non trouvée.' });
    }
    
    console.log('✅ Évaluation supprimée avec succès:', id);
    res.status(200).json({ message: 'Évaluation supprimée avec succès.', deletedId: id });
  } catch (error) {
    console.error('❌ Erreur lors de la suppression:', error);
    res.status(500).json({ 
      message: "Erreur lors de la suppression de l'évaluation.", 
      error: error.message 
    });
  }
});

// 🗂 Servir les fichiers statiques (mode local)
app.use(express.static(path.join(__dirname, 'public')));

// 🚀 Démarrage du serveur local (non utilisé sur Vercel)
if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`🚀 Serveur local démarré sur http://localhost:${PORT}`);
  });
}

// 🔁 Export Express app pour Vercel (Serverless)
module.exports = app;

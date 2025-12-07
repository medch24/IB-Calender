// index.js (Backend) - Version corrigée

require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());

// === CONFIGURATION MONGODB ===
const MONGODB_URI = process.env.MONGODB_URI || process.env.MONGO_URL;

console.log('━'.repeat(60));
console.log('🔍 Vérification de la configuration MongoDB');
console.log('━'.repeat(60));

if (!MONGODB_URI) {
  console.error("❌ ERREUR CRITIQUE : MONGODB_URI non définie !");
  console.error("💡 Ajoutez-la dans Vercel → Settings → Environment Variables");
  console.error("   Exemple: mongodb+srv://user:pass@cluster.mongodb.net/ib-calendar");
} else {
  const maskedURI = MONGODB_URI.substring(0, 20) + '...' + MONGODB_URI.substring(MONGODB_URI.length - 10);
  console.log('✅ MONGODB_URI détectée :', maskedURI);
}

// === CONNEXION MONGODB (sans options dépréciées) ===
console.log('⏳ Tentative de connexion à MongoDB...');

mongoose.connect(MONGODB_URI)
.then(() => {
  console.log('━'.repeat(60));
  console.log('✅✅✅ CONNEXION À MONGODB RÉUSSIE ! ✅✅✅');
  console.log('📊 Base de données prête');
  console.log('🎯 Les évaluations peuvent maintenant être enregistrées');
  console.log('━'.repeat(60));
})
.catch(err => {
  console.log('━'.repeat(60));
  console.error('❌❌❌ ERREUR DE CONNEXION MONGODB ❌❌❌');
  console.error('━'.repeat(60));
  console.error('📋 Détails de l\'erreur :');
  console.error('   Message:', err.message);
  console.error('   Code:', err.code || 'N/A');
  console.error('   Name:', err.name || 'N/A');
  console.error('━'.repeat(60));
  console.error('💡 Solutions possibles :');
  console.error('   1. Vérifiez que MONGODB_URI est correcte dans Vercel');
  console.error('   2. Vérifiez que 0.0.0.0/0 est autorisé dans MongoDB Atlas');
  console.error('   3. Vérifiez le nom d\'utilisateur et mot de passe');
  console.error('   4. Encodez les caractères spéciaux dans le mot de passe');
  console.error('━'.repeat(60));
});

// Gestion des erreurs de connexion après initialisation
mongoose.connection.on('error', err => {
  console.error('❌ Erreur MongoDB runtime:', err.message);
});

mongoose.connection.on('disconnected', () => {
  console.warn('⚠️ MongoDB déconnecté');
});

// Schéma de l'Évaluation
const evaluationSchema = new mongoose.Schema({
  classe: { type: String, required: true },
  semaine: { type: String, required: true },
  matiere: { type: String, required: true },
  unite: { type: String, required: true },
  critere: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const Evaluation = mongoose.model('Evaluation', evaluationSchema);

// === ROUTES API ===

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

// 2️⃣ GET /api/evaluations?classe=PEI1 : Récupérer les évaluations d'une classe
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

// 🗂 Servir les fichiers statiques
app.use(express.static(path.join(__dirname, 'public')));

// 🚀 Démarrage du serveur local (non utilisé sur Vercel)
if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log('━'.repeat(60));
    console.log(`🚀 Serveur local démarré sur http://localhost:${PORT}`);
    console.log('━'.repeat(60));
  });
}

// 🔁 Export pour Vercel (Serverless)
module.exports = app;

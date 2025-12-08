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

// CORS headers
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
// CONFIGURATION MONGODB - CONNEXION SERVERLESS
// ═══════════════════════════════════════════════════════════════

const MONGODB_URI = process.env.MONGODB_URI || process.env.MONGO_URL;

let cachedDb = null;

async function connectToDatabase() {
  if (cachedDb && mongoose.connection.readyState === 1) {
    console.log('✅ Utilisation connexion MongoDB existante');
    return cachedDb;
  }

  console.log('━'.repeat(60));
  console.log('🔍 Configuration MongoDB');
  console.log('━'.repeat(60));

  if (!MONGODB_URI) {
    console.error('❌ MONGODB_URI non définie !');
    console.error('💡 Configurez-la dans Vercel → Environment Variables');
    throw new Error('MONGODB_URI non configurée');
  }

  const masked = MONGODB_URI.substring(0, 20) + '***' + MONGODB_URI.substring(MONGODB_URI.length - 15);
  console.log('✅ URI détectée :', masked);
  console.log('⏳ Connexion à MongoDB...');

  try {
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });

    cachedDb = mongoose.connection;

    console.log('━'.repeat(60));
    console.log('✅ CONNEXION MONGODB RÉUSSIE');
    console.log('📊 Base de données prête');
    console.log('━'.repeat(60));

    return cachedDb;
  } catch (err) {
    console.error('━'.repeat(60));
    console.error('❌ ERREUR CONNEXION MONGODB');
    console.error('━'.repeat(60));
    console.error('Message:', err.message);
    console.error('━'.repeat(60));
    throw err;
  }
}

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

const Evaluation = mongoose.models.Evaluation || mongoose.model('Evaluation', evaluationSchema);

// ═══════════════════════════════════════════════════════════════
// MIDDLEWARE - CONNEXION AUTOMATIQUE
// ═══════════════════════════════════════════════════════════════

app.use(async (req, res, next) => {
  try {
    await connectToDatabase();
    next();
  } catch (error) {
    console.error('❌ Erreur connexion middleware:', error.message);
    res.status(503).json({ 
      error: 'Service temporairement indisponible',
      message: 'Impossible de se connecter à la base de données',
      details: error.message
    });
  }
});

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

// 📥 GET /api/evaluations
app.get('/api/evaluations', async (req, res) => {
  try {
    const { classe } = req.query;
    
    if (!classe) {
      return res.status(400).json({ 
        error: 'Le paramètre "classe" est requis' 
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

// 📤 POST /api/evaluations
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

// 🗑️ DELETE /api/evaluations/:id
app.delete('/api/evaluations/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
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

// 📄 POST /api/export - Génération document Word
app.post('/api/export', async (req, res) => {
  try {
    const { classe, matiere, evaluations } = req.body;
    
    if (!classe || !evaluations) {
      return res.status(400).json({ 
        error: 'Paramètres manquants' 
      });
    }
    
    console.log(`📄 Génération document Word - Classe: ${classe}, Évaluations: ${evaluations.length}`);
    
    // Import dynamique de docx
    const { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, Table, TableRow, TableCell, WidthType, BorderStyle } = require('docx');
    
    const titre = matiere || 'TOUTES MATIÈRES';
    const timestamp = new Date().toLocaleString('fr-FR');
    
    // Créer les paragraphes du document
    const paragraphs = [
      new Paragraph({
        text: 'CALENDRIER DES ÉVALUATIONS',
        heading: HeadingLevel.HEADING_1,
        alignment: AlignmentType.CENTER,
        spacing: { after: 400 }
      }),
      new Paragraph({
        text: 'Kawthar International School',
        alignment: AlignmentType.CENTER,
        spacing: { after: 200 }
      }),
      new Paragraph({
        children: [
          new TextRun({ text: 'Classe: ', bold: true }),
          new TextRun(classe)
        ],
        spacing: { after: 100 }
      }),
      new Paragraph({
        children: [
          new TextRun({ text: 'Matière: ', bold: true }),
          new TextRun(titre)
        ],
        spacing: { after: 100 }
      }),
      new Paragraph({
        children: [
          new TextRun({ text: 'Date d\'export: ', bold: true }),
          new TextRun(timestamp)
        ],
        spacing: { after: 200 }
      }),
      new Paragraph({
        children: [
          new TextRun({ text: `Total: ${evaluations.length} évaluation(s)`, bold: true, color: '003366' })
        ],
        spacing: { after: 400 }
      })
    ];
    
    // Grouper par semaine
    const semaines = {};
    evaluations.forEach(e => {
      if (!semaines[e.semaine]) {
        semaines[e.semaine] = [];
      }
      semaines[e.semaine].push(e);
    });
    
    // Ajouter les évaluations par semaine
    Object.keys(semaines).sort().forEach(semaine => {
      paragraphs.push(
        new Paragraph({
          text: semaine,
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 300, after: 200 }
        })
      );
      
      semaines[semaine].forEach(e => {
        paragraphs.push(
          new Paragraph({
            children: [
              new TextRun({ text: '• ', color: 'FF8C00' }),
              new TextRun({ text: e.matiere + ' - ', bold: true }),
              new TextRun({ text: e.unite + ' - ' }),
              new TextRun({ text: 'Critère: ' + e.critere, italics: true })
            ],
            spacing: { after: 100 }
          })
        );
      });
    });
    
    // Pied de page
    paragraphs.push(
      new Paragraph({
        text: '─'.repeat(60),
        spacing: { before: 400, after: 200 }
      }),
      new Paragraph({
        text: `Généré le ${timestamp}`,
        alignment: AlignmentType.CENTER,
        italics: true
      })
    );
    
    // Créer le document
    const doc = new Document({
      sections: [{
        properties: {},
        children: paragraphs
      }]
    });
    
    // Générer le buffer
    const buffer = await Packer.toBuffer(doc);
    
    console.log(`✅ Document Word généré (${buffer.length} bytes)`);
    
    // Envoyer le fichier
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
    res.setHeader('Content-Disposition', `attachment; filename="Calendrier_${classe}_${titre.replace(/\s/g, '_')}_${Date.now()}.docx"`);
    res.send(buffer);
    
  } catch (error) {
    console.error('❌ Erreur génération Word:', error.message);
    res.status(500).json({ 
      error: 'Erreur lors de la génération du document',
      message: error.message 
    });
  }
});

// ═══════════════════════════════════════════════════════════════
// DÉMARRAGE SERVEUR (local uniquement)
// ═══════════════════════════════════════════════════════════════

if (!process.env.VERCEL) {
  connectToDatabase().then(() => {
    app.listen(PORT, () => {
      console.log('━'.repeat(60));
      console.log(`🚀 Serveur démarré : http://localhost:${PORT}`);
      console.log('━'.repeat(60));
    });
  });
}

// Export pour Vercel Serverless
module.exports = app;

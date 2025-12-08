// ═══════════════════════════════════════════════════════════════
// CALENDRIER KIS - API BACKEND AVEC MONGODB NATIVE DRIVER
// ═══════════════════════════════════════════════════════════════

require('dotenv').config();
const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.sendStatus(200);
  next();
});

// ═══════════════════════════════════════════════════════════════
// MONGODB - NATIVE DRIVER (Connexion Globale)
// ═══════════════════════════════════════════════════════════════

const MONGODB_URI = process.env.MONGODB_URI || process.env.MONGO_URL;

if (!MONGODB_URI) {
  console.error('❌ MONGODB_URI non définie !');
}

let client = null;
let db = null;

async function connectDB() {
  if (db) {
    console.log('✅ Réutilisation connexion MongoDB existante');
    return db;
  }

  console.log('⏳ Connexion à MongoDB...');
  
  try {
    client = new MongoClient(MONGODB_URI, {
      maxPoolSize: 10,
      minPoolSize: 1,
      maxIdleTimeMS: 60000,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });

    await client.connect();
    db = client.db('ibcalender');

    console.log('✅ CONNEXION MONGODB RÉUSSIE');
    console.log('📊 Base:', db.databaseName);

    return db;
  } catch (error) {
    console.error('❌ ERREUR CONNEXION MONGODB');
    console.error('Message:', error.message);
    throw error;
  }
}

// ═══════════════════════════════════════════════════════════════
// ROUTES API
// ═══════════════════════════════════════════════════════════════

// Health check
app.get('/api/health', async (req, res) => {
  try {
    const database = await connectDB();
    const result = await database.command({ ping: 1 });
    res.json({
      status: 'ok',
      database: result.ok === 1 ? 'connected' : 'disconnected',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(503).json({
      status: 'error',
      message: error.message
    });
  }
});

// GET /api/evaluations
app.get('/api/evaluations', async (req, res) => {
  try {
    const { classe } = req.query;
    
    if (!classe) {
      return res.status(400).json({ error: 'Paramètre "classe" requis' });
    }

    const database = await connectDB();
    const collection = database.collection('evaluations');
    
    console.log(`📥 GET /api/evaluations?classe=${classe}`);
    
    const evaluations = await collection
      .find({ classe: classe.trim() })
      .sort({ semaine: 1, matiere: 1 })
      .toArray();
    
    console.log(`✅ ${evaluations.length} évaluation(s) trouvée(s)`);
    
    res.json(evaluations);
  } catch (error) {
    console.error('❌ Erreur GET:', error.message);
    res.status(500).json({ 
      error: 'Erreur récupération',
      message: error.message 
    });
  }
});

// POST /api/evaluations
app.post('/api/evaluations', async (req, res) => {
  try {
    const { classe, semaine, matiere, unite, critere } = req.body;
    
    if (!classe || !semaine || !matiere || !unite || !critere) {
      return res.status(400).json({ 
        error: 'Tous les champs sont requis' 
      });
    }

    const database = await connectDB();
    const collection = database.collection('evaluations');
    
    console.log(`📤 POST /api/evaluations - ${classe} ${semaine} ${matiere}`);
    
    const evaluation = {
      classe: classe.trim(),
      semaine: semaine.trim(),
      matiere: matiere.trim(),
      unite: unite.trim(),
      critere: critere.trim(),
      createdAt: new Date()
    };
    
    const result = await collection.insertOne(evaluation);
    
    console.log(`✅ Évaluation enregistrée: ${result.insertedId}`);
    
    res.status(201).json({
      _id: result.insertedId,
      ...evaluation
    });
  } catch (error) {
    console.error('❌ Erreur POST:', error.message);
    res.status(500).json({ 
      error: 'Erreur enregistrement',
      message: error.message 
    });
  }
});

// DELETE /api/evaluations/:id
app.delete('/api/evaluations/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const database = await connectDB();
    const collection = database.collection('evaluations');
    
    console.log(`🗑️  DELETE /api/evaluations/${id}`);
    
    const result = await collection.deleteOne({ 
      _id: new ObjectId(id) 
    });
    
    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'Évaluation non trouvée' });
    }
    
    console.log(`✅ Évaluation supprimée: ${id}`);
    
    res.json({ 
      message: 'Évaluation supprimée',
      deletedId: id 
    });
  } catch (error) {
    console.error('❌ Erreur DELETE:', error.message);
    res.status(500).json({ 
      error: 'Erreur suppression',
      message: error.message 
    });
  }
});

// POST /api/export
app.post('/api/export', async (req, res) => {
  try {
    const { classe, matiere, evaluations } = req.body;
    
    if (!classe || !evaluations) {
      return res.status(400).json({ error: 'Paramètres manquants' });
    }

    console.log(`📄 Export Word - ${classe} - ${evaluations.length} éval.`);

    const { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType } = require('docx');
    
    const titre = matiere || 'TOUTES MATIÈRES';
    const timestamp = new Date().toLocaleString('fr-FR');
    
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
          new TextRun({ text: `Total: ${evaluations.length} évaluation(s)`, bold: true })
        ],
        spacing: { after: 400 }
      })
    ];
    
    // Grouper par semaine
    const semaines = {};
    evaluations.forEach(e => {
      if (!semaines[e.semaine]) semaines[e.semaine] = [];
      semaines[e.semaine].push(e);
    });
    
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
              new TextRun({ text: '• ' }),
              new TextRun({ text: e.matiere + ' - ', bold: true }),
              new TextRun({ text: e.unite + ' - ' }),
              new TextRun({ text: 'Critère: ' + e.critere })
            ],
            spacing: { after: 100 }
          })
        );
      });
    });
    
    const doc = new Document({
      sections: [{ properties: {}, children: paragraphs }]
    });
    
    const buffer = await Packer.toBuffer(doc);
    
    console.log(`✅ Document généré (${buffer.length} bytes)`);
    
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
    res.setHeader('Content-Disposition', `attachment; filename="Calendrier_${classe}_${titre.replace(/\s/g, '_')}.docx"`);
    res.send(buffer);
    
  } catch (error) {
    console.error('❌ Erreur export:', error.message);
    res.status(500).json({ 
      error: 'Erreur génération document',
      message: error.message 
    });
  }
});

// ═══════════════════════════════════════════════════════════════
// DÉMARRAGE
// ═══════════════════════════════════════════════════════════════

if (!process.env.VERCEL) {
  connectDB().then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 Serveur: http://localhost:${PORT}`);
    });
  });
}

module.exports = app;

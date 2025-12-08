// ═══════════════════════════════════════════════════════════════
// API EVALUATIONS - GET & POST - Vercel Serverless Function
// ═══════════════════════════════════════════════════════════════

const { connectToDatabase } = require('../../lib/mongodb');
const { ObjectId } = require('mongodb');

module.exports = async (req, res) => {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const { db } = await connectToDatabase();
    const collection = db.collection('evaluations');

    // ═══════════════════════════════════════════════════════════
    // GET /api/evaluations?classe=PEI+1
    // ═══════════════════════════════════════════════════════════
    if (req.method === 'GET') {
      const { classe } = req.query;

      if (!classe) {
        return res.status(400).json({ error: 'Paramètre "classe" requis' });
      }

      console.log(`📥 GET /api/evaluations?classe=${classe}`);

      const evaluations = await collection
        .find({ classe: classe.trim() })
        .sort({ semaine: 1, matiere: 1 })
        .toArray();

      console.log(`✅ ${evaluations.length} évaluation(s) trouvée(s)`);

      return res.status(200).json(evaluations);
    }

    // ═══════════════════════════════════════════════════════════
    // POST /api/evaluations
    // ═══════════════════════════════════════════════════════════
    if (req.method === 'POST') {
      const { classe, semaine, matiere, unite, critere } = req.body;

      if (!classe || !semaine || !matiere || !unite || !critere) {
        return res.status(400).json({ error: 'Tous les champs sont requis' });
      }

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

      return res.status(201).json({
        _id: result.insertedId,
        ...evaluation
      });
    }

    // Méthode non supportée
    return res.status(405).json({ error: 'Method not allowed' });

  } catch (error) {
    console.error('❌ Erreur API evaluations:', error.message);
    return res.status(500).json({
      error: 'Erreur serveur',
      message: error.message
    });
  }
};

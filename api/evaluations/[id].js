// ═══════════════════════════════════════════════════════════════
// API EVALUATIONS - DELETE BY ID - Vercel Serverless Function
// ═══════════════════════════════════════════════════════════════

const { connectToDatabase } = require('../../lib/mongodb');
const { ObjectId } = require('mongodb');

module.exports = async (req, res) => {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'DELETE') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { id } = req.query;

    if (!id) {
      return res.status(400).json({ error: 'ID requis' });
    }

    console.log(`🗑️  DELETE /api/evaluations/${id}`);

    const { db } = await connectToDatabase();
    const collection = db.collection('evaluations');

    const result = await collection.deleteOne({
      _id: new ObjectId(id)
    });

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'Évaluation non trouvée' });
    }

    console.log(`✅ Évaluation supprimée: ${id}`);

    return res.status(200).json({
      message: 'Évaluation supprimée',
      deletedId: id
    });

  } catch (error) {
    console.error('❌ Erreur DELETE:', error.message);
    return res.status(500).json({
      error: 'Erreur suppression',
      message: error.message
    });
  }
};

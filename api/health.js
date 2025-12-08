// ═══════════════════════════════════════════════════════════════
// API HEALTH CHECK - Vercel Serverless Function
// ═══════════════════════════════════════════════════════════════

const { connectToDatabase } = require('../lib/mongodb');

module.exports = async (req, res) => {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    console.log('🏥 Health check...');
    
    const { db } = await connectToDatabase();
    const result = await db.admin().ping();

    console.log('✅ Health check réussi');

    return res.status(200).json({
      status: 'ok',
      database: result.ok === 1 ? 'connected' : 'disconnected',
      db_name: db.databaseName,
      timestamp: new Date().toISOString(),
      environment: process.env.VERCEL_ENV || 'development'
    });
  } catch (error) {
    console.error('❌ Health check échoué:', error.message);
    
    return res.status(503).json({
      status: 'error',
      database: 'disconnected',
      message: error.message,
      timestamp: new Date().toISOString()
    });
  }
};

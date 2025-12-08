// ═══════════════════════════════════════════════════════════════
// API HEALTH CHECK - Vercel Serverless Function (Supabase)
// ═══════════════════════════════════════════════════════════════

const { supabase } = require('../lib/supabase');

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
    console.log('🏥 Health check Supabase...');
    
    // Test connexion avec un simple count
    const { count, error } = await supabase
      .from('evaluations')
      .select('*', { count: 'exact', head: true });

    if (error) throw error;

    console.log('✅ Health check réussi');

    return res.status(200).json({
      status: 'ok',
      database: 'supabase',
      db_type: 'PostgreSQL',
      evaluations_count: count || 0,
      timestamp: new Date().toISOString(),
      environment: process.env.VERCEL_ENV || 'development'
    });
  } catch (error) {
    console.error('❌ Health check échoué:', error.message);
    
    return res.status(503).json({
      status: 'error',
      database: 'supabase',
      message: error.message,
      timestamp: new Date().toISOString()
    });
  }
};

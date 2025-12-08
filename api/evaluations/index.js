// ═══════════════════════════════════════════════════════════════
// API EVALUATIONS - GET & POST - Vercel Serverless Function (Supabase)
// ═══════════════════════════════════════════════════════════════

const { supabase } = require('../../lib/supabase');

module.exports = async (req, res) => {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    // ═══════════════════════════════════════════════════════════
    // GET /api/evaluations?classe=PEI+1
    // ═══════════════════════════════════════════════════════════
    if (req.method === 'GET') {
      const { classe } = req.query;

      console.log(`📥 GET /api/evaluations${classe ? `?classe=${classe}` : ''}`);

      let query = supabase
        .from('evaluations')
        .select('*')
        .order('semaine', { ascending: true })
        .order('matiere', { ascending: true });

      // Filtrer par classe si fourni
      if (classe) {
        query = query.eq('classe', classe.trim());
      }

      const { data, error } = await query;

      if (error) throw error;

      console.log(`✅ ${data.length} évaluation(s) trouvée(s)`);

      return res.status(200).json(data);
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
        created_at: new Date().toISOString()
      };

      const { data, error } = await supabase
        .from('evaluations')
        .insert([evaluation])
        .select()
        .single();

      if (error) throw error;

      console.log(`✅ Évaluation enregistrée: ${data.id}`);

      return res.status(201).json(data);
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

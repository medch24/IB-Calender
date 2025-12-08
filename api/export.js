// ═══════════════════════════════════════════════════════════════
// API EXPORT WORD - Vercel Serverless Function
// ═══════════════════════════════════════════════════════════════

const { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType } = require('docx');

module.exports = async (req, res) => {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { classe, matiere, evaluations } = req.body;

    if (!classe || !evaluations) {
      return res.status(400).json({ error: 'Paramètres manquants' });
    }

    console.log(`📄 Export Word - ${classe} - ${evaluations.length} éval.`);

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
    
    return res.status(200).send(buffer);

  } catch (error) {
    console.error('❌ Erreur export:', error.message);
    return res.status(500).json({
      error: 'Erreur génération document',
      message: error.message
    });
  }
};

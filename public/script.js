// script.js - Version avec design original + MongoDB

const API_BASE = '/api/evaluations';
let selClasse, lblClasse, btnGenerateWord, calTable;

// Définition de la structure du calendrier (exactement comme dans votre HTML)
const calendarStructure = [
  {
    headTop: '<th class="month">Août<br>Septembre</th><th>Semaine 1:</th><th>Semaine 2:</th><th>Semaine 3:</th><th>Semaine 4:</th>',
    headBottom: '<th>Août 31 – Sep. 04</th><th>Sep. 07 – Sep. 11</th><th>Sep. 14 – Sep. 18</th><th>Sep. 21 – Sep. 25</th>',
    rows: [
      ['orientation|Orientation', 'S2|Semaine 2:|Sep. 07 – Sep. 11', 'S3|Semaine 3:|Sep. 14 – Sep. 18', 'S4|Semaine 4:|Sep. 21 – Sep. 25']
    ]
  },
  {
    headTop: '<th class="month">Septembre<br>Octobre</th><th>Semaine 5:</th><th>Semaine 6:</th><th>Semaine 7:</th><th>Semaine 8:</th>',
    headBottom: '<th>Sep. 28 – Oct. 02</th><th>Oct. 05 – Oct. 09</th><th>Oct. 12 – Oct. 16</th><th>Oct. 19 – Oct. 23</th>',
    rows: [
      ['S5|Semaine 5:|Sep. 28 – Oct. 02', 'S6|Semaine 6:|Oct. 05 – Oct. 09', 'S7|Semaine 7:|Oct. 12 – Oct. 16', 'S8|Semaine 8:|Oct. 19 – Oct. 23']
    ]
  },
  {
    headTop: '<th class="month">Octobre<br>Novembre</th><th>Semaine 9:</th><th>Semaine 10:</th><th>Semaine 11:</th><th>Semaine 12:</th>',
    headBottom: '<th>Oct. 26 – Oct. 30</th><th>Nov. 02 – Nov. 06</th><th>Nov. 09 – Nov. 13</th><th>Nov. 16 – Nov. 20</th>',
    rows: [
      ['S9|Semaine 9:|Oct. 26 – Oct. 30', 'S10|Semaine 10:|Nov. 02 – Nov. 06', 'S11|Semaine 11:|Nov. 09 – Nov. 13', 'S12|Semaine 12:|Nov. 16 – Nov. 20']
    ]
  },
  {
    headTop: '<th class="month">Novembre<br>Décembre</th><th></th><th>Semaine 13:</th><th>Semaine 14:</th><th>Semaine 15:</th>',
    headBottom: '<th>Nov. 23 – Nov. 27</th><th>Nov. 30 – Dec. 4</th><th>Dec. 7 – Dec. 11</th><th>Dec. 14 – Dec. 18</th>',
    rows: [
      ['vac|Vacances', 'S13|Semaine 13:|Nov. 30 – Dec. 4', 'S14|Semaine 14:|Dec. 7 – Dec. 11', 'S15|Semaine 15:|Dec. 14 – Dec. 18']
    ]
  },
  {
    headTop: '<th class="month">Décembre<br>Janvier</th><th>Semaine 16:</th><th>Semaine 17:</th><th>Semaine 18:</th><th></th>',
    headBottom: '<th>Dec. 21 – Dec. 25</th><th>Dec. 28 – Jan. 01</th><th>Jan. 04 – Jan. 08</th><th>Jan. 11 – Jan. 15</th>',
    rows: [
      ['exam|Dec. 24<br/>Examen final', 'exam|Examen final', 'exam|Examen final', 'vac|Vacances']
    ]
  },
  {
    headTop: '<th class="month">Janvier<br>Février</th><th>Semaine 19:</th><th>Semaine 20:</th><th>Semaine 21:</th><th>Semaine 22:</th>',
    headBottom: '<th>Jan. 18 – Jan. 22</th><th>Jan. 25 – Jan. 29</th><th>Fev. 01 – Fev. 05</th><th>Fev. 08 – Fev. 12</th>',
    rows: [
      ['S19|Semaine 19:|Jan. 18 – Jan. 22', 'S20|Semaine 20:|Jan. 25 – Jan. 29', 'S21|Semaine 21:|Fev. 01 – Fev. 05', 'S22|Semaine 22:|Fev. 08 – Fev. 12']
    ]
  },
  {
    headTop: '<th class="month">Février<br>Mars</th><th>Semaine 23:</th><th>Semaine 24:</th><th>Semaine 25:</th><th></th>',
    headBottom: '<th>Fev. 15 – Fev. 19</th><th>Fev. 22 – Fev. 26</th><th>Mars 01 – Mars 05</th><th>Mars 08 – Mars 12</th>',
    rows: [
      ['S23|Semaine 23:|Fev. 15 – Fev. 19', 'S24|Semaine 24:|Fev. 22 – Fev. 26', 'S25|Semaine 25:|Mars 01 – Mars 05', 'vac|Vacances Eid-ul-Fitr']
    ]
  },
  {
    headTop: '<th class="month">Mars<br>Avril</th><th></th><th></th><th>Semaine 26:</th><th>Semaine 27:</th>',
    headBottom: '<th>Mars 15 – Mars 19</th><th>Mars 22 – Mars 26</th><th>Mars 29 – Avril 02</th><th>Avril 05 – Avril 09</th>',
    rows: [
      ['vac|Vacances Eid-ul-Fitr', 'vac|Vacances Eid-ul-Fitr', 'S26|Semaine 26:|Mars 29 – Avril 02', 'S27|Semaine 27:|Avril 05 – Avril 09']
    ]
  },
  {
    headTop: '<th class="month">Avril<br>Mai</th><th>Semaine 28:</th><th>Semaine 29:</th><th>Semaine 30:</th><th>Semaine 31:</th>',
    headBottom: '<th>Avril 12 – Avril 16</th><th>April 19 – April 23</th><th>April 26 – April 30</th><th>Mai 03 – Mai 07</th>',
    rows: [
      ['orientation|Evaluations', 'S29|Semaine 29:|April 19 – April 23', 'S30|Semaine 30:|April 26 – April 30', 'S31|Semaine 31:|Mai 03 – Mai 07']
    ]
  },
  {
    headTop: '<th class="month">Mai<br>Juin</th><th>Semaine 32:</th><th></th><th></th><th></th>',
    headBottom: '<th>Mai 10 – May 14</th><th>Mai 17 – May 21</th><th>Mai 24 – Mai 28</th><th>Mai 31 – Juin 04</th>',
    rows: [
      ['S32|Semaine 32:|Mai 10 – May 14', 'vac|Vacances Eid-ul-Adha', 'vac|Vacances Eid-ul-Adha', 'vac|Vacances Eid-ul-Adha']
    ]
  },
  {
    headTop: '<th class="month">Juin</th><th>Juin 07 – Juin 11</th><th>Juin 14 – Juin 18</th>',
    headBottom: '',
    rows: [
      ['empty', 'exam|Examen Final', 'exam|Examen Final']
    ]
  }
];

// Fonction pour générer une cellule
function generateCell(cellData) {
  if (!cellData || cellData === 'empty') {
    return '<td></td>';
  }

  const [type, ...rest] = cellData.split('|');
  const content = rest.join('|');

  if (type === 'orientation') {
    return `<td class="orientation"><div class="card center" style="min-height:140px;display:flex;align-items:center;justify-content:center;font-weight:900">${content}</div></td>`;
  }

  if (type === 'vac') {
    return `<td class="vac"><div class="card center">${content}</div></td>`;
  }

  if (type === 'exam') {
    return `<td class="exam"><div class="card center">${content}</div></td>`;
  }

  // C'est une semaine évaluable (type commence par S)
  const [title, dates] = content.split('|');
  return `<td class="eval"><div class="card" id="${type}">
    <span class="wtitle">${title}</span><span class="wrange">${dates}</span>
    <div class="box"><div class="ttl">Évaluation Critériée</div>
      <form onsubmit="addEvaluation(event,'${type}')">
        <label>Matière:</label><select name="matiere" required><option value="">-- Choisir --</option><option>Français LL</option><option>Anglais AL</option><option>Mathématiques</option><option>Sciences</option><option>IS</option><option>Arts</option><option>Design</option></select>
        <label>Unité/Thème:</label><input name="unite" type="text" placeholder="Nom de l'unité ou Thème" required/>
        <label>Critère:</label><select name="critere" required><option value="">Choisir</option><option>A</option><option>B</option><option>C</option><option>D</option></select>
        <button class="cta">Enregistrer et Ajouter une Autre Évaluation</button>
      </form>
    </div>
  </div></td>`;
}

// Génération du calendrier au chargement
function buildCalendar() {
  if (!calTable) {
    console.error('calTable element not found!');
    return;
  }
  
  let html = '';
  calendarStructure.forEach(block => {
    if (block.headTop) {
      html += `<thead class="head-top"><tr>${block.headTop}</tr></thead>`;
    }
    if (block.headBottom) {
      html += `<thead class="head-bottom"><tr>${block.headBottom}</tr></thead>`;
    }
    html += '<tbody>';
    block.rows.forEach(row => {
      html += '<tr>';
      row.forEach(cell => {
        html += generateCell(cell);
      });
      html += '</tr>';
    });
    html += '</tbody>';
  });
  calTable.innerHTML = html;
}

// Utilitaires
function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/[&<>"']/g, s => ({
        '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    }[s]));
}

function createEvaluationChip(eval) {
    const div = document.createElement('div');
    div.className = 'planned';
    div.dataset.id = eval._id;
    div.innerHTML = `
        <button class="del" title="Supprimer" data-id="${eval._id}">✖</button>
        <p><strong>Matière:</strong> ${escapeHtml(eval.matiere)}</p>
        <p><strong>Unité:</strong> ${escapeHtml(eval.unite)}</p>
        <p><strong>Critère:</strong> ${escapeHtml(eval.critere)}</p>
    `;
    return div;
}

// Chargement des évaluations
async function loadEvaluations(classe) {
    document.querySelectorAll('.planned').forEach(el => el.remove());

    try {
        const response = await fetch(`${API_BASE}?classe=${classe}`);
        if (!response.ok) throw new Error('Erreur de chargement');
        const evaluations = await response.json();

        evaluations.forEach(eval => {
            const cardElement = document.getElementById(eval.semaine);
            if (cardElement) {
                const newChip = createEvaluationChip(eval);
                const boxForm = cardElement.querySelector('.box');
                if (boxForm) {
                    cardElement.insertBefore(newChip, boxForm);
                }
            }
        });

    } catch (error) {
        console.error("Erreur:", error);
    }
}

// Ajout d'évaluation
async function addEvaluation(e, cellId) {
    e.preventDefault();
    const form = e.target;
    const classe = selClasse.value;

    const data = {
        classe: classe,
        semaine: cellId,
        matiere: form.elements.namedItem('matiere')?.value?.trim(),
        unite: form.elements.namedItem('unite')?.value?.trim(),
        critere: form.elements.namedItem('critere')?.value?.trim()
    };

    if (!data.matiere || !data.unite || !data.critere) {
        alert('Veuillez remplir tous les champs.');
        return;
    }

    try {
        const response = await fetch(API_BASE, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        if (!response.ok) throw new Error('Erreur serveur');
        const newEval = await response.json();

        const cardElement = document.getElementById(cellId);
        const newChip = createEvaluationChip(newEval);
        const boxForm = cardElement.querySelector('.box');
        cardElement.insertBefore(newChip, boxForm);

        form.reset();
        alert('Évaluation enregistrée avec succès!');

    } catch (error) {
        console.error("Erreur:", error);
        alert('Échec de l\'enregistrement.');
    }
}

// Suppression
document.addEventListener('click', async (ev) => {
    const btn = ev.target.closest('.del');
    if (!btn) return;
    
    if (!confirm('Supprimer cette évaluation?')) return;

    const evalId = btn.dataset.id;
    const wrap = btn.closest('.planned');
    if (!evalId || !wrap) return;

    try {
        const response = await fetch(`${API_BASE}/${evalId}`, {
            method: 'DELETE'
        });

        if (!response.ok) throw new Error('Erreur suppression');

        wrap.classList.add('fade-out');
        setTimeout(() => wrap.remove(), 180);

    } catch (error) {
        console.error("Erreur:", error);
        alert('Échec de la suppression.');
    }
});

// Génération Word
async function generateWordDocument() {
    const classe = selClasse.value;
    
    try {
        const response = await fetch(`${API_BASE}?classe=${classe}`);
        if (!response.ok) throw new Error('Erreur');
        const evaluations = await response.json();

        if (evaluations.length === 0) {
            alert('Aucune évaluation pour cette classe.');
            return;
        }

        const semaines = {};
        evaluations.forEach(eval => {
            if (!semaines[eval.semaine]) semaines[eval.semaine] = [];
            semaines[eval.semaine].push(eval);
        });

        let htmlContent = `<!DOCTYPE html><html lang="fr"><head><meta charset="UTF-8"><title>Calendrier - ${classe}</title><style>body{font-family:Arial;padding:20px}.header{text-align:center;border-bottom:3px solid #1a3c8e;padding-bottom:20px}.week{margin:20px 0;border:2px solid #ddd;border-radius:10px;padding:15px}.week h2{background:#1a3c8e;color:white;padding:10px;border-radius:5px}.eval{background:#e9f7ee;padding:10px;margin:10px 0;border-left:4px solid #2e7d32}</style></head><body><div class="header"><h1>Calendrier des Évaluations</h1><p>Classe: ${classe} | Année: 2025-2026</p></div>`;

        Object.keys(semaines).sort().forEach(sem => {
            htmlContent += `<div class="week"><h2>${sem.replace('S', 'Semaine ')}</h2>`;
            semaines[sem].forEach(e => {
                htmlContent += `<div class="eval"><strong>Matière:</strong> ${escapeHtml(e.matiere)}<br><strong>Unité:</strong> ${escapeHtml(e.unite)}<br><strong>Critère:</strong> ${escapeHtml(e.critere)}</div>`;
            });
            htmlContent += '</div>';
        });

        htmlContent += '</body></html>';

        const blob = new Blob([htmlContent], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `Calendrier_${classe}_${new Date().getFullYear()}.html`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        alert('Document généré! Ouvrez-le avec Word pour le convertir en .docx');

    } catch (error) {
        console.error("Erreur:", error);
        alert('Erreur lors de la génération.');
    }
}

// Initialisation
document.addEventListener('DOMContentLoaded', () => {
    // Initialiser les références DOM
    selClasse = document.getElementById('classe');
    lblClasse = document.getElementById('lblClasse');
    btnGenerateWord = document.getElementById('btnGenerateWord');
    calTable = document.getElementById('cal');
    
    buildCalendar();
    
    const initialClasse = selClasse.value;
    lblClasse.innerHTML = `<strong>Classe :</strong> ${initialClasse}`;
    loadEvaluations(initialClasse);
    
    selClasse.addEventListener('change', (e) => {
        const nouvelleClasse = e.target.value;
        lblClasse.innerHTML = `<strong>Classe :</strong> ${nouvelleClasse}`;
        loadEvaluations(nouvelleClasse);
    });

    btnGenerateWord.addEventListener('click', generateWordDocument);
});

// Exposer globalement
window.addEvaluation = addEvaluation;

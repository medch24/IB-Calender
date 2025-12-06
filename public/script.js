// ========================================
// CALENDRIER KIS - JAVASCRIPT COMPLET
// ========================================

console.log('🚀 Calendrier KIS - Initialisation...');

// === CONFIGURATION ===
const API_URL = '/api/evaluations';
const MATIERES = ['Français LL', 'Anglais AL', 'Mathématiques', 'Sciences', 'IS', 'Arts', 'Design'];

// === DONNÉES DES SEMAINES ===
const SEMAINES = [
  { id: 'S1', nom: 'Semaine 1', dates: 'Août 31 – Sep. 04', type: 'orientation', label: '🗓️ Orientation' },
  { id: 'S2', nom: 'Semaine 2', dates: 'Sep. 07 – Sep. 11', type: 'normale' },
  { id: 'S3', nom: 'Semaine 3', dates: 'Sep. 14 – Sep. 18', type: 'normale' },
  { id: 'S4', nom: 'Semaine 4', dates: 'Sep. 21 – Sep. 25', type: 'normale' },
  { id: 'S5', nom: 'Semaine 5', dates: 'Sep. 28 – Oct. 02', type: 'normale' },
  { id: 'S6', nom: 'Semaine 6', dates: 'Oct. 05 – Oct. 09', type: 'normale' },
  { id: 'S7', nom: 'Semaine 7', dates: 'Oct. 12 – Oct. 16', type: 'normale' },
  { id: 'S8', nom: 'Semaine 8', dates: 'Oct. 19 – Oct. 23', type: 'normale' },
  { id: 'S9', nom: 'Semaine 9', dates: 'Oct. 26 – Oct. 30', type: 'normale' },
  { id: 'S10', nom: 'Semaine 10', dates: 'Nov. 02 – Nov. 06', type: 'normale' },
  { id: 'S11', nom: 'Semaine 11', dates: 'Nov. 09 – Nov. 13', type: 'normale' },
  { id: 'S12', nom: 'Semaine 12', dates: 'Nov. 16 – Nov. 20', type: 'normale' },
  { id: 'S13', nom: 'Vacances', dates: 'Nov. 23 – Nov. 27', type: 'vacances', label: '🏖️ Vacances' },
  { id: 'S14', nom: 'Semaine 13', dates: 'Nov. 30 – Dec. 04', type: 'normale' },
  { id: 'S15', nom: 'Semaine 14', dates: 'Dec. 07 – Dec. 11', type: 'normale' },
  { id: 'S16', nom: 'Semaine 15', dates: 'Dec. 14 – Dec. 18', type: 'normale' },
  { id: 'S17', nom: 'Examen Final', dates: 'Dec. 21 – Dec. 25', type: 'examen', label: '📝 Examen Final' },
  { id: 'S18', nom: 'Examen Final', dates: 'Dec. 28 – Jan. 01', type: 'examen', label: '📝 Examen Final' },
  { id: 'S19', nom: 'Examen Final', dates: 'Jan. 04 – Jan. 08', type: 'examen', label: '📝 Examen Final' },
  { id: 'S20', nom: 'Vacances', dates: 'Jan. 11 – Jan. 15', type: 'vacances', label: '🏖️ Vacances' },
  { id: 'S21', nom: 'Semaine 19', dates: 'Jan. 18 – Jan. 22', type: 'normale' },
  { id: 'S22', nom: 'Semaine 20', dates: 'Jan. 25 – Jan. 29', type: 'normale' },
  { id: 'S23', nom: 'Semaine 21', dates: 'Fev. 01 – Fev. 05', type: 'normale' },
  { id: 'S24', nom: 'Semaine 22', dates: 'Fev. 08 – Fev. 12', type: 'normale' },
  { id: 'S25', nom: 'Semaine 23', dates: 'Fev. 15 – Fev. 19', type: 'normale' },
  { id: 'S26', nom: 'Semaine 24', dates: 'Fev. 22 – Fev. 26', type: 'normale' },
  { id: 'S27', nom: 'Semaine 25', dates: 'Mars 01 – Mars 05', type: 'normale' },
  { id: 'S28', nom: 'Eid-ul-Fitr', dates: 'Mars 08 – Mars 12', type: 'vacances', label: '🌙 Eid-ul-Fitr' },
  { id: 'S29', nom: 'Eid-ul-Fitr', dates: 'Mars 15 – Mars 19', type: 'vacances', label: '🌙 Eid-ul-Fitr' },
  { id: 'S30', nom: 'Eid-ul-Fitr', dates: 'Mars 22 – Mars 26', type: 'vacances', label: '🌙 Eid-ul-Fitr' },
  { id: 'S31', nom: 'Semaine 26', dates: 'Mars 29 – Avril 02', type: 'normale' },
  { id: 'S32', nom: 'Semaine 27', dates: 'Avril 05 – Avril 09', type: 'normale' },
  { id: 'S33', nom: 'Évaluations', dates: 'Avril 12 – Avril 16', type: 'orientation', label: '✅ Évaluations' },
  { id: 'S34', nom: 'Semaine 29', dates: 'Avril 19 – Avril 23', type: 'normale' },
  { id: 'S35', nom: 'Semaine 30', dates: 'Avril 26 – Avril 30', type: 'normale' },
  { id: 'S36', nom: 'Semaine 31', dates: 'Mai 03 – Mai 07', type: 'normale' },
  { id: 'S37', nom: 'Semaine 32', dates: 'Mai 10 – Mai 14', type: 'normale' },
  { id: 'S38', nom: 'Eid-ul-Adha', dates: 'Mai 17 – Mai 21', type: 'vacances', label: '🕌 Eid-ul-Adha' },
  { id: 'S39', nom: 'Eid-ul-Adha', dates: 'Mai 24 – Mai 28', type: 'vacances', label: '🕌 Eid-ul-Adha' },
  { id: 'S40', nom: 'Eid-ul-Adha', dates: 'Mai 31 – Juin 04', type: 'vacances', label: '🕌 Eid-ul-Adha' },
  { id: 'S41', nom: 'Examen Final', dates: 'Juin 07 – Juin 11', type: 'examen', label: '📝 Examen Final' },
  { id: 'S42', nom: 'Examen Final', dates: 'Juin 14 – Juin 18', type: 'examen', label: '📝 Examen Final' }
];

// === ÉTAT DE L'APPLICATION ===
let state = {
  classe: 'PEI1',
  matiere: 'all',
  evaluations: []
};

// === HELPERS ===
function escapeHtml(text) {
  const map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' };
  return String(text).replace(/[&<>"']/g, m => map[m]);
}

function getMatiereClass(matiere) {
  const map = {
    'Français LL': 'francais',
    'Anglais AL': 'anglais',
    'Mathématiques': 'maths',
    'Sciences': 'sciences',
    'IS': 'is',
    'Arts': 'arts',
    'Design': 'design'
  };
  return map[matiere] || '';
}

function getMatiereEmoji(matiere) {
  const map = {
    'Français LL': '🇫🇷',
    'Anglais AL': '🇬🇧',
    'Mathématiques': '📐',
    'Sciences': '🔬',
    'IS': '🌍',
    'Arts': '🎨',
    'Design': '💡'
  };
  return map[matiere] || '📚';
}

function showToast(message, type = 'success') {
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.textContent = message;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}

// === AFFICHAGE DU CALENDRIER ===
function renderCalendrier() {
  const container = document.getElementById('calendrier');
  if (!container) return;

  const evalsFiltered = state.matiere === 'all'
    ? state.evaluations
    : state.evaluations.filter(e => e.matiere === state.matiere);

  let html = '';

  SEMAINES.forEach(semaine => {
    if (semaine.type === 'vacances') {
      html += `
        <div class="semaine-card semaine-vacances">
          <div class="semaine-header">
            <h2 class="semaine-titre">${semaine.label || semaine.nom}</h2>
            <span class="semaine-dates">${semaine.dates}</span>
          </div>
        </div>
      `;
    } else if (semaine.type === 'examen') {
      html += `
        <div class="semaine-card semaine-examen">
          <div class="semaine-header">
            <h2 class="semaine-titre">${semaine.label || semaine.nom}</h2>
            <span class="semaine-dates">${semaine.dates}</span>
          </div>
        </div>
      `;
    } else if (semaine.type === 'orientation') {
      html += `
        <div class="semaine-card semaine-orientation">
          <div class="semaine-header">
            <h2 class="semaine-titre">${semaine.label || semaine.nom}</h2>
            <span class="semaine-dates">${semaine.dates}</span>
          </div>
        </div>
      `;
    } else {
      const evalsWeek = evalsFiltered.filter(e => e.semaine === semaine.id);

      let evalsHtml = '';
      evalsWeek.forEach(ev => {
        evalsHtml += `
          <div class="evaluation-item eval-${getMatiereClass(ev.matiere)}">
            <div class="eval-matiere">${getMatiereEmoji(ev.matiere)} ${escapeHtml(ev.matiere)}</div>
            <div class="eval-unite">📑 Unité: ${escapeHtml(ev.unite)}</div>
            <div class="eval-critere">⭐ Critère: ${escapeHtml(ev.critere)}</div>
            <button class="btn-delete" onclick="deleteEvaluation('${ev._id}')">×</button>
          </div>
        `;
      });

      let formHtml = '';
      if (state.matiere === 'all') {
        formHtml = `
          <div class="form-ajout">
            <div class="form-titre">✏️ Ajouter une évaluation</div>
            <form onsubmit="addEvaluation(event, '${semaine.id}')">
              <div class="form-group">
                <label class="form-label">📖 Matière</label>
                <select name="matiere" class="form-select" required>
                  <option value="">-- Choisir --</option>
                  ${MATIERES.map(m => `<option value="${m}">${m}</option>`).join('')}
                </select>
              </div>
              <div class="form-group">
                <label class="form-label">📑 Unité / Thème</label>
                <input name="unite" class="form-input" required placeholder="Nom de l'unité">
              </div>
              <div class="form-group">
                <label class="form-label">⭐ Critère</label>
                <select name="critere" class="form-select" required>
                  <option value="">-- Choisir --</option>
                  <option>A</option>
                  <option>B</option>
                  <option>C</option>
                  <option>D</option>
                </select>
              </div>
              <button type="submit" class="btn-submit">💾 Enregistrer</button>
            </form>
          </div>
        `;
      } else {
        formHtml = `
          <div class="form-ajout">
            <div class="form-titre">✏️ ${getMatiereEmoji(state.matiere)} ${state.matiere}</div>
            <form onsubmit="addEvaluation(event, '${semaine.id}')">
              <input type="hidden" name="matiere" value="${state.matiere}">
              <div class="form-group">
                <label class="form-label">📑 Unité / Thème</label>
                <input name="unite" class="form-input" required placeholder="Nom de l'unité">
              </div>
              <div class="form-group">
                <label class="form-label">⭐ Critère</label>
                <select name="critere" class="form-select" required>
                  <option value="">-- Choisir --</option>
                  <option>A</option>
                  <option>B</option>
                  <option>C</option>
                  <option>D</option>
                </select>
              </div>
              <button type="submit" class="btn-submit">💾 Enregistrer</button>
            </form>
          </div>
        `;
      }

      html += `
        <div class="semaine-card">
          <div class="semaine-header">
            <h2 class="semaine-titre">📅 ${semaine.nom}</h2>
            <span class="semaine-dates">${semaine.dates}</span>
          </div>
          <div class="evaluations-list">${evalsHtml}</div>
          ${formHtml}
        </div>
      `;
    }
  });

  container.innerHTML = html;
  console.log('✅ Calendrier rendu avec', evalsFiltered.length, 'évaluations');
}

// === CHARGEMENT DES ÉVALUATIONS ===
async function loadEvaluations(classe) {
  try {
    console.log('📥 Chargement des évaluations pour', classe);
    const response = await fetch(`${API_URL}?classe=${classe}`);
    if (!response.ok) throw new Error('Erreur de chargement');
    state.evaluations = await response.json();
    console.log('✅ Chargé:', state.evaluations.length, 'évaluations');
    renderCalendrier();
  } catch (error) {
    console.error('❌ Erreur:', error);
    showToast('❌ Erreur de chargement', 'error');
  }
}

// === AJOUTER UNE ÉVALUATION ===
async function addEvaluation(event, semaineId) {
  event.preventDefault();
  const form = event.target;

  const data = {
    classe: state.classe,
    semaine: semaineId,
    matiere: form.matiere.value.trim(),
    unite: form.unite.value.trim(),
    critere: form.critere.value.trim()
  };

  if (!data.matiere || !data.unite || !data.critere) {
    showToast('⚠️ Tous les champs sont requis', 'warning');
    return;
  }

  try {
    console.log('📤 Ajout évaluation:', data);
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    if (!response.ok) throw new Error('Erreur');

    const newEval = await response.json();
    state.evaluations.push(newEval);
    form.reset();
    renderCalendrier();
    showToast('✅ Évaluation enregistrée!', 'success');
  } catch (error) {
    console.error('❌ Erreur:', error);
    showToast('❌ Erreur d\'enregistrement', 'error');
  }
}

// === SUPPRIMER UNE ÉVALUATION ===
async function deleteEvaluation(id) {
  if (!confirm('Supprimer cette évaluation ?')) return;

  try {
    console.log('🗑️ Suppression:', id);
    const response = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
    if (!response.ok) throw new Error('Erreur');

    state.evaluations = state.evaluations.filter(e => e._id !== id);
    renderCalendrier();
    showToast('✅ Évaluation supprimée', 'success');
  } catch (error) {
    console.error('❌ Erreur:', error);
    showToast('❌ Erreur de suppression', 'error');
  }
}

// === GÉNÉRATION DOCUMENT WORD ===
function generateWordDocument(evals, titre) {
  const grouped = {};
  evals.forEach(e => {
    if (!grouped[e.semaine]) grouped[e.semaine] = [];
    grouped[e.semaine].push(e);
  });

  let html = `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <title>${titre}</title>
  <style>
    body { font-family: Arial; padding: 30px; line-height: 1.7; }
    .header { text-align: center; border-bottom: 4px solid #003366; padding-bottom: 20px; margin-bottom: 30px; }
    h1 { color: #003366; font-size: 32px; margin: 12px 0; }
    .info { color: #666; margin: 8px 0; }
    .semaine { margin: 25px 0; border: 3px solid #EEE; border-radius: 12px; padding: 18px; page-break-inside: avoid; }
    .semaine h2 { background: linear-gradient(135deg, #003366, #0066CC); color: white; padding: 12px; border-radius: 10px; margin: 0 0 18px; }
    .evaluation { background: #F8F8F8; padding: 14px; margin: 12px 0; border-left: 5px solid #00CC66; border-radius: 8px; }
    .evaluation p { margin: 6px 0; }
    strong { color: #003366; }
  </style>
</head>
<body>
  <div class="header">
    <h1>📅 ${titre}</h1>
    <p class="info"><strong>Classe:</strong> ${state.classe} | <strong>Année:</strong> 2025-2026</p>
    <p class="info">Kawthar International School</p>
  </div>`;

  Object.keys(grouped).sort().forEach(sid => {
    const sem = SEMAINES.find(s => s.id === sid);
    const semTitre = sem ? `${sem.nom} (${sem.dates})` : sid;

    html += `<div class="semaine"><h2>📍 ${semTitre}</h2>`;
    grouped[sid].forEach(e => {
      html += `<div class="evaluation">
        <p><strong>${getMatiereEmoji(e.matiere)} Matière:</strong> ${escapeHtml(e.matiere)}</p>
        <p><strong>📑 Unité:</strong> ${escapeHtml(e.unite)}</p>
        <p><strong>⭐ Critère:</strong> ${escapeHtml(e.critere)}</p>
      </div>`;
    });
    html += '</div>';
  });

  html += '</body></html>';
  return html;
}

function downloadFile(content, filename) {
  const blob = new Blob([content], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

// === EXPORT ZIP ===
async function exportZIP() {
  if (!state.evaluations.length) {
    showToast('⚠️ Aucune évaluation à exporter', 'warning');
    return;
  }

  const zip = new JSZip();

  MATIERES.forEach(matiere => {
    const evals = state.evaluations.filter(e => e.matiere === matiere);
    if (evals.length) {
      const content = generateWordDocument(evals, `Calendrier ${matiere}`);
      zip.file(`${state.classe}_${matiere.replace(/\s+/g, '_')}.html`, content);
    }
  });

  try {
    console.log('📦 Génération ZIP...');
    const blob = await zip.generateAsync({ type: 'blob' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Calendrier_${state.classe}_ZIP.zip`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToast('📦 ZIP généré avec succès!', 'success');
  } catch (error) {
    console.error('❌ Erreur ZIP:', error);
    showToast('❌ Erreur de génération ZIP', 'error');
  }
}

// === EXPORT MATIÈRE ===
function exportMatiere() {
  if (state.matiere === 'all') {
    showToast('⚠️ Sélectionnez une matière spécifique', 'warning');
    return;
  }

  const evals = state.evaluations.filter(e => e.matiere === state.matiere);
  if (!evals.length) {
    showToast('⚠️ Aucune évaluation pour cette matière', 'warning');
    return;
  }

  const content = generateWordDocument(evals, `Calendrier ${state.matiere}`);
  downloadFile(content, `${state.classe}_${state.matiere.replace(/\s+/g, '_')}.html`);
  showToast('📄 Document généré!', 'success');
}

// === EXPORT COMPLET ===
function exportComplet() {
  if (!state.evaluations.length) {
    showToast('⚠️ Aucune évaluation à exporter', 'warning');
    return;
  }

  const content = generateWordDocument(state.evaluations, 'Calendrier Complet');
  downloadFile(content, `${state.classe}_Complet.html`);
  showToast('📋 Document complet généré!', 'success');
}

// === INITIALISATION ===
document.addEventListener('DOMContentLoaded', () => {
  console.log('🎯 Initialisation de l\'application...');

  // Changement de classe
  const selectClasse = document.getElementById('classeSelect');
  selectClasse.addEventListener('change', () => {
    state.classe = selectClasse.value;
    console.log('🔄 Classe changée:', state.classe);
    loadEvaluations(state.classe);
  });

  // Tabs matières
  document.querySelectorAll('.tab-matiere').forEach(tab => {
    tab.addEventListener('click', () => {
      const matiere = tab.dataset.matiere;
      state.matiere = matiere;
      console.log('🔄 Matière changée:', matiere);
      document.querySelectorAll('.tab-matiere').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      renderCalendrier();
    });
  });

  // Modal export
  const modal = document.getElementById('modalExport');
  const btnExport = document.getElementById('btnExport');
  const btnClose = modal.querySelector('.btn-close');

  btnExport.addEventListener('click', () => modal.classList.add('show'));
  btnClose.addEventListener('click', () => modal.classList.remove('show'));
  modal.addEventListener('click', (e) => {
    if (e.target === modal) modal.classList.remove('show');
  });

  // Options d'export
  document.querySelectorAll('.export-option').forEach(option => {
    option.addEventListener('click', () => {
      modal.classList.remove('show');
      const type = option.dataset.type;
      console.log('📤 Export type:', type);
      if (type === 'zip') exportZIP();
      else if (type === 'matiere') exportMatiere();
      else if (type === 'complet') exportComplet();
    });
  });

  // Chargement initial
  loadEvaluations(state.classe);
  console.log('✅ Application initialisée!');
});

// Exposer les fonctions globalement
window.addEvaluation = addEvaluation;
window.deleteEvaluation = deleteEvaluation;

console.log('✅ Script chargé avec succès!');

// ============ CONFIGURATION ============
const API = '/api/evaluations';
const MATIERES = ['Français LL', 'Anglais AL', 'Mathématiques', 'Sciences', 'IS', 'Arts', 'Design'];

const WEEKS = [
  // Bloc 1
  { id: 'W1', name: 'Semaine 1', dates: 'Août 31 – Sep. 04', type: 'orientation', label: '🎯 Orientation' },
  { id: 'W2', name: 'Semaine 2', dates: 'Sep. 07 – Sep. 11', type: 'eval' },
  { id: 'W3', name: 'Semaine 3', dates: 'Sep. 14 – Sep. 18', type: 'eval' },
  { id: 'W4', name: 'Semaine 4', dates: 'Sep. 21 – Sep. 25', type: 'eval' },
  // Bloc 2
  { id: 'W5', name: 'Semaine 5', dates: 'Sep. 28 – Oct. 02', type: 'eval' },
  { id: 'W6', name: 'Semaine 6', dates: 'Oct. 05 – Oct. 09', type: 'eval' },
  { id: 'W7', name: 'Semaine 7', dates: 'Oct. 12 – Oct. 16', type: 'eval' },
  { id: 'W8', name: 'Semaine 8', dates: 'Oct. 19 – Oct. 23', type: 'eval' },
  // Bloc 3
  { id: 'W9', name: 'Semaine 9', dates: 'Oct. 26 – Oct. 30', type: 'eval' },
  { id: 'W10', name: 'Semaine 10', dates: 'Nov. 02 – Nov. 06', type: 'eval' },
  { id: 'W11', name: 'Semaine 11', dates: 'Nov. 09 – Nov. 13', type: 'eval' },
  { id: 'W12', name: 'Semaine 12', dates: 'Nov. 16 – Nov. 20', type: 'eval' },
  // Bloc 4
  { id: 'W13', name: 'Vacances', dates: 'Nov. 23 – Nov. 27', type: 'vacation', label: '🏖️ Vacances' },
  { id: 'W14', name: 'Semaine 13', dates: 'Nov. 30 – Dec. 04', type: 'eval' },
  { id: 'W15', name: 'Semaine 14', dates: 'Dec. 07 – Dec. 11', type: 'eval' },
  { id: 'W16', name: 'Semaine 15', dates: 'Dec. 14 – Dec. 18', type: 'eval' },
  // Bloc 5 - Examens
  { id: 'W17', name: 'Examen Final', dates: 'Dec. 21 – Dec. 25', type: 'exam', label: '📝 Examen Final' },
  { id: 'W18', name: 'Examen Final', dates: 'Dec. 28 – Jan. 01', type: 'exam', label: '📝 Examen Final' },
  { id: 'W19', name: 'Examen Final', dates: 'Jan. 04 – Jan. 08', type: 'exam', label: '📝 Examen Final' },
  { id: 'W20', name: 'Vacances', dates: 'Jan. 11 – Jan. 15', type: 'vacation', label: '🏖️ Vacances' },
  // Bloc 6
  { id: 'W21', name: 'Semaine 19', dates: 'Jan. 18 – Jan. 22', type: 'eval' },
  { id: 'W22', name: 'Semaine 20', dates: 'Jan. 25 – Jan. 29', type: 'eval' },
  { id: 'W23', name: 'Semaine 21', dates: 'Fev. 01 – Fev. 05', type: 'eval' },
  { id: 'W24', name: 'Semaine 22', dates: 'Fev. 08 – Fev. 12', type: 'eval' },
  // Bloc 7
  { id: 'W25', name: 'Semaine 23', dates: 'Fev. 15 – Fev. 19', type: 'eval' },
  { id: 'W26', name: 'Semaine 24', dates: 'Fev. 22 – Fev. 26', type: 'eval' },
  { id: 'W27', name: 'Semaine 25', dates: 'Mars 01 – Mars 05', type: 'eval' },
  { id: 'W28', name: 'Eid-ul-Fitr', dates: 'Mars 08 – Mars 12', type: 'vacation', label: '🌙 Vacances Eid-ul-Fitr' },
  // Bloc 8
  { id: 'W29', name: 'Eid-ul-Fitr', dates: 'Mars 15 – Mars 19', type: 'vacation', label: '🌙 Vacances Eid-ul-Fitr' },
  { id: 'W30', name: 'Eid-ul-Fitr', dates: 'Mars 22 – Mars 26', type: 'vacation', label: '🌙 Vacances Eid-ul-Fitr' },
  { id: 'W31', name: 'Semaine 26', dates: 'Mars 29 – Avril 02', type: 'eval' },
  { id: 'W32', name: 'Semaine 27', dates: 'Avril 05 – Avril 09', type: 'eval' },
  // Bloc 9
  { id: 'W33', name: 'Évaluations', dates: 'Avril 12 – Avril 16', type: 'orientation', label: '✅ Évaluations' },
  { id: 'W34', name: 'Semaine 29', dates: 'Avril 19 – Avril 23', type: 'eval' },
  { id: 'W35', name: 'Semaine 30', dates: 'Avril 26 – Avril 30', type: 'eval' },
  { id: 'W36', name: 'Semaine 31', dates: 'Mai 03 – Mai 07', type: 'eval' },
  // Bloc 10
  { id: 'W37', name: 'Semaine 32', dates: 'Mai 10 – Mai 14', type: 'eval' },
  { id: 'W38', name: 'Eid-ul-Adha', dates: 'Mai 17 – Mai 21', type: 'vacation', label: '🕌 Vacances Eid-ul-Adha' },
  { id: 'W39', name: 'Eid-ul-Adha', dates: 'Mai 24 – Mai 28', type: 'vacation', label: '🕌 Vacances Eid-ul-Adha' },
  { id: 'W40', name: 'Eid-ul-Adha', dates: 'Mai 31 – Juin 04', type: 'vacation', label: '🕌 Vacances Eid-ul-Adha' },
  // Bloc 11 - Examens finaux
  { id: 'W41', name: 'Examen Final', dates: 'Juin 07 – Juin 11', type: 'exam', label: '📝 Examen Final' },
  { id: 'W42', name: 'Examen Final', dates: 'Juin 14 – Juin 18', type: 'exam', label: '📝 Examen Final' }
];

// État global
let state = {
  classe: 'PEI1',
  matiereFilter: 'all',
  evaluations: []
};

// ============ UTILITAIRES ============
const esc = str => String(str || '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

const getMatiereClass = mat => ({
  'Français LL': 'francais',
  'Anglais AL': 'anglais',
  'Mathématiques': 'maths',
  'Sciences': 'sciences',
  'IS': 'is',
  'Arts': 'arts',
  'Design': 'design'
}[mat] || '');

const getEmoji = mat => ({
  'Français LL': '🇫🇷',
  'Anglais AL': '🇬🇧',
  'Mathématiques': '📐',
  'Sciences': '🔬',
  'IS': '🌍',
  'Arts': '🎨',
  'Design': '💡'
}[mat] || '📚');

// ============ NOTIFICATION ============
function showNotif(msg, type = 'success') {
  const notif = document.createElement('div');
  notif.className = `notification notif-${type}`;
  notif.textContent = msg;
  document.body.appendChild(notif);
  setTimeout(() => notif.remove(), 3000);
}

// ============ RENDU CALENDRIER ============
function renderCalendar() {
  const container = document.getElementById('calendarContent');
  if (!container) return;
  
  const filtered = state.matiereFilter === 'all' 
    ? state.evaluations 
    : state.evaluations.filter(e => e.matiere === state.matiereFilter);
  
  let html = '';
  
  WEEKS.forEach(week => {
    if (week.type === 'vacation') {
      html += `
        <div class="week-block vacation-block">
          <div class="week-header">
            <h2 class="week-title">${week.label || week.name}</h2>
            <span class="week-date">${week.dates}</span>
          </div>
        </div>
      `;
    } else if (week.type === 'exam') {
      html += `
        <div class="week-block exam-block">
          <div class="week-header">
            <h2 class="week-title">${week.label || week.name}</h2>
            <span class="week-date">${week.dates}</span>
          </div>
        </div>
      `;
    } else if (week.type === 'orientation') {
      html += `
        <div class="week-block orientation-block">
          <div class="week-header">
            <h2 class="week-title">${week.label || week.name}</h2>
            <span class="week-date">${week.dates}</span>
          </div>
        </div>
      `;
    } else {
      // Semaine avec évaluations
      const weekEvals = filtered.filter(e => e.semaine === week.id);
      
      let evalsHTML = '';
      weekEvals.forEach(ev => {
        evalsHTML += `
          <div class="eval-card eval-${getMatiereClass(ev.matiere)}">
            <div class="eval-matiere">${getEmoji(ev.matiere)} ${esc(ev.matiere)}</div>
            <div class="eval-info">📑 Unité: ${esc(ev.unite)}</div>
            <div class="eval-info">⭐ Critère: ${esc(ev.critere)}</div>
            <button class="btn-del" onclick="deleteEval('${ev._id}')">×</button>
          </div>
        `;
      });
      
      let formHTML = '';
      if (state.matiereFilter === 'all') {
        formHTML = `
          <div class="add-form-container">
            <div class="form-title">✏️ Ajouter une évaluation</div>
            <form onsubmit="addEval(event, '${week.id}')">
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
                  <option value="">Choisir</option>
                  <option>A</option><option>B</option><option>C</option><option>D</option>
                </select>
              </div>
              <button type="submit" class="btn-submit">💾 Enregistrer</button>
            </form>
          </div>
        `;
      } else {
        formHTML = `
          <div class="add-form-container">
            <div class="form-title">✏️ ${getEmoji(state.matiereFilter)} ${state.matiereFilter}</div>
            <form onsubmit="addEval(event, '${week.id}')">
              <input type="hidden" name="matiere" value="${state.matiereFilter}">
              <div class="form-group">
                <label class="form-label">📑 Unité / Thème</label>
                <input name="unite" class="form-input" required placeholder="Nom de l'unité">
              </div>
              <div class="form-group">
                <label class="form-label">⭐ Critère</label>
                <select name="critere" class="form-select" required>
                  <option value="">Choisir</option>
                  <option>A</option><option>B</option><option>C</option><option>D</option>
                </select>
              </div>
              <button type="submit" class="btn-submit">💾 Enregistrer</button>
            </form>
          </div>
        `;
      }
      
      html += `
        <div class="week-block">
          <div class="week-header">
            <h2 class="week-title">📅 ${week.name}</h2>
            <span class="week-date">${week.dates}</span>
          </div>
          <div class="evals-container">${evalsHTML}</div>
          ${formHTML}
        </div>
      `;
    }
  });
  
  container.innerHTML = html;
}

// ============ CHARGEMENT ============
async function loadEvals(classe) {
  try {
    const res = await fetch(`${API}?classe=${classe}`);
    if (!res.ok) throw new Error('Erreur');
    state.evaluations = await res.json();
    renderCalendar();
  } catch (err) {
    console.error(err);
    showNotif('❌ Erreur chargement', 'error');
  }
}

// ============ AJOUT ============
async function addEval(e, weekId) {
  e.preventDefault();
  const form = e.target;
  
  const data = {
    classe: state.classe,
    semaine: weekId,
    matiere: form.matiere.value.trim(),
    unite: form.unite.value.trim(),
    critere: form.critere.value.trim()
  };
  
  if (!data.matiere || !data.unite || !data.critere) {
    showNotif('⚠️ Tous les champs requis', 'warning');
    return;
  }
  
  try {
    const res = await fetch(API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    
    if (!res.ok) throw new Error('Erreur');
    
    const newEval = await res.json();
    state.evaluations.push(newEval);
    form.reset();
    renderCalendar();
    showNotif('✅ Évaluation enregistrée!', 'success');
  } catch (err) {
    console.error(err);
    showNotif('❌ Échec enregistrement', 'error');
  }
}

// ============ SUPPRESSION ============
async function deleteEval(id) {
  if (!confirm('Supprimer cette évaluation ?')) return;
  
  try {
    const res = await fetch(`${API}/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Erreur');
    
    state.evaluations = state.evaluations.filter(e => e._id !== id);
    renderCalendar();
    showNotif('✅ Évaluation supprimée', 'success');
  } catch (err) {
    console.error(err);
    showNotif('❌ Échec suppression', 'error');
  }
}

// ============ EXPORT WORD ============
function genWordHTML(evals, title) {
  const grouped = {};
  evals.forEach(e => {
    if (!grouped[e.semaine]) grouped[e.semaine] = [];
    grouped[e.semaine].push(e);
  });
  
  let html = `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <title>${title}</title>
  <style>
    body { font-family: Arial; padding: 30px; line-height: 1.6; }
    .header { text-align: center; border-bottom: 3px solid #003366; padding-bottom: 20px; margin-bottom: 30px; }
    h1 { color: #003366; font-size: 28px; margin: 10px 0; }
    .info { color: #666; margin: 5px 0; }
    .week { margin: 20px 0; border: 2px solid #EEE; border-radius: 10px; padding: 15px; page-break-inside: avoid; }
    .week h2 { background: linear-gradient(135deg, #003366, #0066CC); color: white; padding: 10px; border-radius: 8px; margin: 0 0 15px; }
    .eval { background: #F8F8F8; padding: 12px; margin: 10px 0; border-left: 4px solid #00CC66; border-radius: 6px; }
    .eval p { margin: 5px 0; }
    strong { color: #003366; }
  </style>
</head>
<body>
  <div class="header">
    <h1>📅 ${title}</h1>
    <p class="info"><strong>Classe:</strong> ${state.classe} | <strong>Année:</strong> 2025-2026</p>
    <p class="info">Kawthar International School</p>
  </div>`;
  
  Object.keys(grouped).sort().forEach(wid => {
    const week = WEEKS.find(w => w.id === wid);
    const weekTitle = week ? `${week.name} (${week.dates})` : wid;
    
    html += `<div class="week"><h2>📍 ${weekTitle}</h2>`;
    grouped[wid].forEach(e => {
      html += `<div class="eval">
        <p><strong>${getEmoji(e.matiere)} Matière:</strong> ${esc(e.matiere)}</p>
        <p><strong>📑 Unité:</strong> ${esc(e.unite)}</p>
        <p><strong>⭐ Critère:</strong> ${esc(e.critere)}</p>
      </div>`;
    });
    html += '</div>';
  });
  
  html += '</body></html>';
  return html;
}

function download(content, filename) {
  const blob = new Blob([content], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

async function exportZIP() {
  if (!state.evaluations.length) {
    showNotif('⚠️ Aucune évaluation', 'warning');
    return;
  }
  
  const zip = new JSZip();
  
  MATIERES.forEach(mat => {
    const evals = state.evaluations.filter(e => e.matiere === mat);
    if (evals.length) {
      const content = genWordHTML(evals, `Calendrier ${mat}`);
      zip.file(`${state.classe}_${mat.replace(/\s+/g, '_')}.html`, content);
    }
  });
  
  try {
    const blob = await zip.generateAsync({ type: 'blob' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Calendrier_${state.classe}_ZIP.zip`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showNotif('📦 ZIP généré!', 'success');
  } catch (err) {
    console.error(err);
    showNotif('❌ Erreur ZIP', 'error');
  }
}

function exportMatiere() {
  if (state.matiereFilter === 'all') {
    showNotif('⚠️ Sélectionnez une matière', 'warning');
    return;
  }
  
  const evals = state.evaluations.filter(e => e.matiere === state.matiereFilter);
  if (!evals.length) {
    showNotif('⚠️ Aucune évaluation', 'warning');
    return;
  }
  
  const content = genWordHTML(evals, `Calendrier ${state.matiereFilter}`);
  download(content, `${state.classe}_${state.matiereFilter.replace(/\s+/g, '_')}.html`);
  showNotif('📄 Document généré!', 'success');
}

function exportComplet() {
  if (!state.evaluations.length) {
    showNotif('⚠️ Aucune évaluation', 'warning');
    return;
  }
  
  const content = genWordHTML(state.evaluations, 'Calendrier Complet');
  download(content, `${state.classe}_Complet.html`);
  showNotif('📋 Document généré!', 'success');
}

// ============ INIT ============
document.addEventListener('DOMContentLoaded', () => {
  const classeSelect = document.getElementById('classeSelect');
  const btnExport = document.getElementById('btnExport');
  const modal = document.getElementById('exportModal');
  const closeModal = document.getElementById('closeModal');
  
  // Chargement initial
  loadEvals(state.classe);
  
  // Changement classe
  classeSelect.addEventListener('change', () => {
    state.classe = classeSelect.value;
    loadEvals(state.classe);
  });
  
  // Tabs matières
  document.querySelectorAll('.nav-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      const matiere = tab.dataset.matiere;
      state.matiereFilter = matiere;
      document.querySelectorAll('.nav-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      renderCalendar();
    });
  });
  
  // Modal
  btnExport.addEventListener('click', () => modal.classList.add('show'));
  closeModal.addEventListener('click', () => modal.classList.remove('show'));
  modal.addEventListener('click', e => {
    if (e.target === modal) modal.classList.remove('show');
  });
  
  // Export
  document.querySelectorAll('.export-card').forEach(card => {
    card.addEventListener('click', () => {
      modal.classList.remove('show');
      const type = card.dataset.export;
      if (type === 'zip') exportZIP();
      else if (type === 'matiere') exportMatiere();
      else if (type === 'complet') exportComplet();
    });
  });
});

// Exposition globale
window.addEval = addEval;
window.deleteEval = deleteEval;

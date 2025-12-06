// Configuration
const API = '/api/evaluations';
const MATIERES = ['Français LL', 'Anglais AL', 'Mathématiques', 'Sciences', 'IS', 'Arts', 'Design'];
const WEEKS = [
  { id: 'S2', title: 'Semaine 2', date: 'Sep. 07 – 11' },
  { id: 'S3', title: 'Semaine 3', date: 'Sep. 14 – 18' },
  { id: 'S4', title: 'Semaine 4', date: 'Sep. 21 – 25' },
  { id: 'S5', title: 'Semaine 5', date: 'Sep. 28 – Oct. 02' },
  { id: 'S6', title: 'Semaine 6', date: 'Oct. 05 – 09' },
  { id: 'S7', title: 'Semaine 7', date: 'Oct. 12 – 16' },
  { id: 'S8', title: 'Semaine 8', date: 'Oct. 19 – 23' },
  { id: 'S9', title: 'Semaine 9', date: 'Oct. 26 – 30' },
  { id: 'S10', title: 'Semaine 10', date: 'Nov. 02 – 06' },
  { id: 'S11', title: 'Semaine 11', date: 'Nov. 09 – 13' },
  { id: 'S12', title: 'Semaine 12', date: 'Nov. 16 – 20' },
  { id: 'S13', title: 'Semaine 13', date: 'Nov. 30 – Dec. 04' },
  { id: 'S14', title: 'Semaine 14', date: 'Dec. 07 – 11' },
  { id: 'S15', title: 'Semaine 15', date: 'Dec. 14 – 18' },
  { id: 'S19', title: 'Semaine 19', date: 'Jan. 18 – 22' },
  { id: 'S20', title: 'Semaine 20', date: 'Jan. 25 – 29' },
  { id: 'S21', title: 'Semaine 21', date: 'Fev. 01 – 05' },
  { id: 'S22', title: 'Semaine 22', date: 'Fev. 08 – 12' },
  { id: 'S23', title: 'Semaine 23', date: 'Fev. 15 – 19' },
  { id: 'S24', title: 'Semaine 24', date: 'Fev. 22 – 26' },
  { id: 'S25', title: 'Semaine 25', date: 'Mars 01 – 05' },
  { id: 'S26', title: 'Semaine 26', date: 'Mars 29 – Avril 02' },
  { id: 'S27', title: 'Semaine 27', date: 'Avril 05 – 09' },
  { id: 'S29', title: 'Semaine 29', date: 'Avril 19 – 23' },
  { id: 'S30', title: 'Semaine 30', date: 'Avril 26 – 30' },
  { id: 'S31', title: 'Semaine 31', date: 'Mai 03 – 07' },
  { id: 'S32', title: 'Semaine 32', date: 'Mai 10 – 14' }
];

// État
let state = {
  classe: 'PEI1',
  view: 'all',
  evaluations: []
};

// Utilitaires
const esc = (str) => String(str || '').replace(/[&<>"']/g, s => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
}[s]));

const getClass = (mat) => ({
  'Français LL': 'francais',
  'Anglais AL': 'anglais',
  'Mathématiques': 'maths',
  'Sciences': 'sciences',
  'IS': 'is',
  'Arts': 'arts',
  'Design': 'design'
}[mat] || '');

const getEmoji = (mat) => ({
  'Français LL': '🇫🇷',
  'Anglais AL': '🇬🇧',
  'Mathématiques': '📐',
  'Sciences': '🔬',
  'IS': '🌍',
  'Arts': '🎨',
  'Design': '💡'
}[mat] || '📚');

// Notifications
function notify(msg, type = 'info') {
  const n = document.createElement('div');
  n.className = `notification ${type}`;
  n.textContent = msg;
  document.body.appendChild(n);
  setTimeout(() => n.remove(), 3000);
}

// Stats
function updateStats() {
  const el = document.getElementById('stats');
  if (!el) return;
  
  const total = state.evaluations.length;
  const counts = {};
  MATIERES.forEach(m => counts[m] = 0);
  state.evaluations.forEach(e => counts[e.matiere]++);
  
  el.innerHTML = `
    <div class="stat">
      <div class="stat-number">${total}</div>
      <div class="stat-label">📊 Total</div>
    </div>
    ${MATIERES.map(m => `
      <div class="stat">
        <div class="stat-number">${counts[m]}</div>
        <div class="stat-label">${getEmoji(m)} ${m}</div>
      </div>
    `).join('')}
  `;
}

// Calendrier
function renderCalendar() {
  const el = document.getElementById('calendar');
  if (!el) return;
  
  const filtered = state.view === 'all' 
    ? state.evaluations 
    : state.evaluations.filter(e => e.matiere === state.view);
  
  el.innerHTML = WEEKS.map(week => {
    const evals = filtered.filter(e => e.semaine === week.id);
    
    const evalsHTML = evals.map(e => `
      <div class="eval ${getClass(e.matiere)}">
        <div class="eval-matiere">${getEmoji(e.matiere)} ${esc(e.matiere)}</div>
        <div class="eval-detail">📑 ${esc(e.unite)}</div>
        <div class="eval-detail">⭐ Critère ${esc(e.critere)}</div>
        <button class="del" onclick="deleteEval('${e._id}')">✖</button>
      </div>
    `).join('');
    
    const formHTML = state.view === 'all' ? `
      <div class="form">
        <div class="form-title">✏️ Ajouter une évaluation</div>
        <form onsubmit="addEval(event, '${week.id}')">
          <div class="form-group">
            <label>📖 Matière</label>
            <select name="matiere" required>
              <option value="">-- Choisir --</option>
              ${MATIERES.map(m => `<option>${m}</option>`).join('')}
            </select>
          </div>
          <div class="form-group">
            <label>📑 Unité / Thème</label>
            <input name="unite" required placeholder="Nom de l'unité"/>
          </div>
          <div class="form-group">
            <label>⭐ Critère</label>
            <select name="critere" required>
              <option value="">Choisir</option>
              <option>A</option>
              <option>B</option>
              <option>C</option>
              <option>D</option>
            </select>
          </div>
          <button type="submit" class="btn-submit">💾 Enregistrer</button>
        </form>
      </div>
    ` : `
      <div class="form">
        <div class="form-title">✏️ Ajouter ${getEmoji(state.view)} ${state.view}</div>
        <form onsubmit="addEval(event, '${week.id}')">
          <input type="hidden" name="matiere" value="${state.view}"/>
          <div class="form-group">
            <label>📑 Unité / Thème</label>
            <input name="unite" required placeholder="Nom de l'unité"/>
          </div>
          <div class="form-group">
            <label>⭐ Critère</label>
            <select name="critere" required>
              <option value="">Choisir</option>
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
    
    return `
      <div class="week">
        <div class="week-header">
          <div class="week-title">📅 ${week.title}</div>
          <div class="week-date">${week.date}</div>
        </div>
        <div class="evals">${evalsHTML}</div>
        ${formHTML}
      </div>
    `;
  }).join('');
}

// Charger évaluations
async function loadEvals(classe) {
  try {
    const res = await fetch(`${API}?classe=${classe}`);
    if (!res.ok) throw new Error('Erreur');
    state.evaluations = await res.json();
    renderCalendar();
    updateStats();
  } catch (err) {
    console.error(err);
    notify('❌ Erreur de chargement', 'error');
  }
}

// Ajouter évaluation
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
    notify('⚠️ Remplir tous les champs', 'warning');
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
    updateStats();
    notify('✅ Évaluation enregistrée!', 'success');
  } catch (err) {
    console.error(err);
    notify('❌ Échec enregistrement', 'error');
  }
}

// Supprimer évaluation
async function deleteEval(id) {
  if (!confirm('Supprimer cette évaluation ?')) return;
  
  try {
    const res = await fetch(`${API}/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Erreur');
    
    state.evaluations = state.evaluations.filter(e => e._id !== id);
    renderCalendar();
    updateStats();
    notify('✅ Évaluation supprimée', 'success');
  } catch (err) {
    console.error(err);
    notify('❌ Échec suppression', 'error');
  }
}

// Génération Word
function genWord(evals, title) {
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
    body { font-family: Arial; padding: 30px; }
    .header { text-align: center; border-bottom: 3px solid #2563eb; padding-bottom: 20px; margin-bottom: 30px; }
    h1 { color: #2563eb; font-size: 28px; }
    .week { margin: 25px 0; border: 2px solid #e2e8f0; border-radius: 12px; padding: 20px; }
    .week h2 { background: linear-gradient(135deg, #2563eb, #7c3aed); color: white; padding: 12px; border-radius: 8px; }
    .eval { background: #f8fafc; padding: 15px; margin: 12px 0; border-left: 4px solid #10b981; border-radius: 8px; }
  </style>
</head>
<body>
  <div class="header">
    <h1>📅 ${title}</h1>
    <p><strong>Classe:</strong> ${state.classe} | <strong>Année:</strong> 2025-2026</p>
  </div>`;
  
  Object.keys(grouped).sort().forEach(wk => {
    const week = WEEKS.find(w => w.id === wk);
    html += `<div class="week"><h2>${week ? week.title : wk}</h2>`;
    grouped[wk].forEach(e => {
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

async function exportZip() {
  if (!state.evaluations.length) {
    notify('⚠️ Aucune évaluation', 'warning');
    return;
  }
  
  const zip = new JSZip();
  
  MATIERES.forEach(mat => {
    const evals = state.evaluations.filter(e => e.matiere === mat);
    if (evals.length) {
      const content = genWord(evals, `Calendrier ${mat}`);
      const filename = `${state.classe}_${mat.replace(/\s+/g, '_')}.html`;
      zip.file(filename, content);
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
    notify('📦 ZIP généré!', 'success');
  } catch (err) {
    console.error(err);
    notify('❌ Erreur ZIP', 'error');
  }
}

function exportCurrent() {
  if (state.view === 'all') {
    notify('⚠️ Sélectionnez une matière', 'warning');
    return;
  }
  
  const evals = state.evaluations.filter(e => e.matiere === state.view);
  if (!evals.length) {
    notify('⚠️ Aucune évaluation', 'warning');
    return;
  }
  
  const content = genWord(evals, `Calendrier ${state.view}`);
  download(content, `${state.classe}_${state.view.replace(/\s+/g, '_')}.html`);
  notify('📄 Document généré!', 'success');
}

function exportAll() {
  if (!state.evaluations.length) {
    notify('⚠️ Aucune évaluation', 'warning');
    return;
  }
  
  const content = genWord(state.evaluations, 'Calendrier Complet');
  download(content, `${state.classe}_Complet.html`);
  notify('📋 Document généré!', 'success');
}

// Init
document.addEventListener('DOMContentLoaded', () => {
  const classeSelect = document.getElementById('classe');
  const btnExport = document.getElementById('btnExport');
  const modal = document.getElementById('modal');
  const closeModal = document.getElementById('closeModal');
  
  // Charger initial
  loadEvals(state.classe);
  
  // Changement classe
  classeSelect.addEventListener('change', () => {
    state.classe = classeSelect.value;
    loadEvals(state.classe);
  });
  
  // Onglets
  document.querySelectorAll('.tab').forEach(tab => {
    tab.addEventListener('click', () => {
      state.view = tab.dataset.view;
      document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      renderCalendar();
    });
  });
  
  // Modal
  btnExport.addEventListener('click', () => modal.classList.add('active'));
  closeModal.addEventListener('click', () => modal.classList.remove('active'));
  modal.addEventListener('click', (e) => {
    if (e.target === modal) modal.classList.remove('active');
  });
  
  // Export options
  document.querySelectorAll('.option').forEach(opt => {
    opt.addEventListener('click', () => {
      modal.classList.remove('active');
      const type = opt.dataset.type;
      if (type === 'zip') exportZip();
      else if (type === 'current') exportCurrent();
      else if (type === 'all') exportAll();
    });
  });
});

// Exposition globale
window.addEval = addEval;
window.deleteEval = deleteEval;

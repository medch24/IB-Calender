// ═══════════════════════════════════════════════════════════════
// CALENDRIER DES ÉVALUATIONS KIS - JAVASCRIPT
// ═══════════════════════════════════════════════════════════════

const API_URL = '/api/evaluations';
const API_TIMEOUT = 15000; // 15 secondes
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 seconde

// Configuration matières
const MATIERES = [
    'Français LL',
    'Anglais AL',
    'Mathématiques',
    'Sciences',
    'IS',
    'Arts',
    'Design'
];

// Configuration semaines (31 semaines) - Année scolaire 2025-2026
const SEMAINES = [
    // SEMESTRE 1
    { id: 'S1', label: 'Semaine 1', dates: '31 août - 4 sept', type: 'normale' },
    { id: 'S2', label: 'Semaine 2', dates: '7 - 11 sept', type: 'normale' },
    { id: 'S3', label: 'Semaine 3', dates: '14 - 18 sept', type: 'normale' },
    { id: 'S4', label: 'Semaine 4', dates: '21 - 25 sept', type: 'normale' },
    { id: 'S5', label: 'Semaine 5', dates: '28 sept - 2 oct', type: 'normale' },
    { id: 'S6', label: 'Semaine 6', dates: '5 - 9 oct', type: 'examens' },
    { id: 'S7', label: 'Semaine 7', dates: '12 - 16 oct', type: 'examens' },
    { id: 'S8', label: 'Semaine 8', dates: '19 - 23 oct', type: 'examens' },
    { id: 'S9', label: 'Semaine 9', dates: '26 - 30 oct', type: 'normale' },
    { id: 'S10', label: 'Semaine 10', dates: '2 - 6 nov', type: 'normale' },
    { id: 'S11', label: 'Semaine 11', dates: '9 - 13 nov', type: 'normale' },
    { id: 'S12', label: 'Semaine 12', dates: '16 - 20 nov', type: 'normale' },
    { id: 'S13', label: 'Semaine 13', dates: '23 - 27 nov', type: 'normale' },
    { id: 'S14', label: 'Semaine 14', dates: '30 nov - 4 déc', type: 'normale' },
    { id: 'S15', label: 'Semaine 15', dates: '7 - 11 déc', type: 'normale' },
    { id: 'S16', label: 'Semaine 16', dates: '14 - 18 déc', type: 'normale' },
    { id: 'S17', label: 'Semaine 17', dates: '21 - 25 déc', type: 'examens' },
    { id: 'EF1', label: 'Examen Final 1', dates: '28 déc - 8 jan', type: 'examens' },
    { id: 'VAC1', label: 'Vacances mi-année', dates: '11 - 15 jan', type: 'vacances' },
    
    // SEMESTRE 2
    { id: 'S18', label: 'Semaine 18', dates: '18 - 22 jan', type: 'normale' },
    { id: 'S19', label: 'Semaine 19', dates: '25 - 29 jan', type: 'normale' },
    { id: 'S20', label: 'Semaine 20', dates: '1 - 5 fév', type: 'normale' },
    { id: 'S21', label: 'Semaine 21', dates: '8 - 12 fév', type: 'normale' },
    { id: 'S22', label: 'Semaine 22', dates: '15 - 19 fév', type: 'normale' },
    { id: 'S23', label: 'Semaine 23', dates: '22 - 26 fév', type: 'normale' },
    { id: 'S24', label: 'Semaine 24', dates: '1 - 5 mars', type: 'normale' },
    { id: 'VAC2', label: 'Vacances Aïd Fitr', dates: '8 - 26 mars', type: 'vacances' },
    { id: 'S25', label: 'Semaine 25', dates: '29 mars - 2 avr', type: 'examens' },
    { id: 'S26', label: 'Semaine 26', dates: '5 - 9 avr', type: 'examens' },
    { id: 'S27', label: 'Semaine 27', dates: '12 - 16 avr', type: 'examens' },
    { id: 'S28', label: 'Semaine 28', dates: '19 - 23 avr', type: 'normale' },
    { id: 'S29', label: 'Semaine 29', dates: '26 - 30 avr', type: 'normale' },
    { id: 'S30', label: 'Semaine 30', dates: '3 - 7 mai', type: 'normale' },
    { id: 'S31', label: 'Semaine 31', dates: '10 - 14 mai', type: 'normale' },
    { id: 'VAC3', label: 'Vacances Aïd Adha', dates: '17 - 1 juin', type: 'vacances' },
    { id: 'EF2', label: 'Examen Final 2', dates: '2 - 18 juin', type: 'examens' }
];

// Variables globales
let classeActuelle = '';
let matiereActive = 'Français LL';
let evaluations = [];
let evaluationEnCoursModification = null; // Pour suivre l'évaluation en cours de modification

// ═══════════════════════════════════════════════════════════════
// INITIALISATION
// ═══════════════════════════════════════════════════════════════

document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 Initialisation Calendrier KIS');
    
    // Écouteurs d'événements
    document.getElementById('classeSelect').addEventListener('change', onClasseChange);
    document.getElementById('deleteAllBtn').addEventListener('click', deleteAllEvaluations);
    document.getElementById('exportBtn').addEventListener('click', () => {
        if (!classeActuelle) {
            showToast('Veuillez sélectionner une classe', 'warning');
            return;
        }
        document.getElementById('modalExport').style.display = 'flex';
    });
    
    // Tabs matières
    document.querySelectorAll('.subject-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            document.querySelectorAll('.subject-tab').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            matiereActive = tab.getAttribute('data-matiere');
            renderCalendrier();
        });
    });
    
    // Formulaire ajout/modification
    document.getElementById('evalForm').addEventListener('submit', onSubmitEvaluation);
    document.getElementById('annulerBtn').addEventListener('click', () => {
        document.getElementById('formAjout').style.display = 'none';
        evaluationEnCoursModification = null;
    });
    
    // Modal export
    document.getElementById('fermerModal').addEventListener('click', () => {
        document.getElementById('modalExport').style.display = 'none';
    });
    document.getElementById('exportZIP').addEventListener('click', exportZIP);
    document.getElementById('exportMatiere').addEventListener('click', exportMatiere);
    document.getElementById('exportComplet').addEventListener('click', exportComplet);
    
    console.log('✅ Initialisation terminée');
});

// ═══════════════════════════════════════════════════════════════
// GESTION CLASSE
// ═══════════════════════════════════════════════════════════════

function onClasseChange(e) {
    classeActuelle = e.target.value;
    console.log('📌 Classe sélectionnée:', classeActuelle);
    
    if (classeActuelle) {
        loadEvaluations();
    } else {
        evaluations = [];
        renderCalendrier();
    }
}

// ═══════════════════════════════════════════════════════════════
// API - CHARGER ÉVALUATIONS
// ═══════════════════════════════════════════════════════════════

async function loadEvaluations(retryCount = 0) {
    try {
        console.log(`📥 Chargement évaluations pour ${classeActuelle}... (tentative ${retryCount + 1}/${MAX_RETRIES})`);
        
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT);
        
        const response = await fetch(`${API_URL}?classe=${classeActuelle}`, {
            signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        
        if (!response.ok) {
            throw new Error(`Erreur HTTP ${response.status}`);
        }
        
        evaluations = await response.json();
        console.log(`✅ ${evaluations.length} évaluation(s) chargée(s)`);
        
        renderCalendrier();
        showToast(`${evaluations.length} évaluation(s) chargée(s)`, 'success');
    } catch (error) {
        console.error('❌ Erreur chargement:', error);
        
        // Retry logic
        if (retryCount < MAX_RETRIES - 1) {
            console.log(`⏳ Nouvelle tentative dans ${RETRY_DELAY}ms...`);
            showToast(`Erreur, nouvelle tentative... (${retryCount + 1}/${MAX_RETRIES})`, 'warning');
            setTimeout(() => loadEvaluations(retryCount + 1), RETRY_DELAY);
        } else {
            showToast('Erreur lors du chargement des évaluations. Vérifiez votre connexion.', 'error');
            evaluations = [];
            renderCalendrier();
        }
    }
}

// ═══════════════════════════════════════════════════════════════
// API - AJOUTER OU MODIFIER ÉVALUATION
// ═══════════════════════════════════════════════════════════════

async function onSubmitEvaluation(e) {
    e.preventDefault();
    
    const semaine = document.getElementById('semaineInput').value;
    const matiere = document.getElementById('matiereInput').value;
    const unite = document.getElementById('uniteInput').value.trim();
    const critere = document.getElementById('critereInput').value.trim();
    
    if (!unite || !critere) {
        showToast('Veuillez remplir tous les champs', 'warning');
        return;
    }
    
    if (evaluationEnCoursModification) {
        // Mode modification
        await updateEvaluation(evaluationEnCoursModification, { semaine, matiere, unite, critere });
    } else {
        // Mode ajout
        await addEvaluation({ semaine, matiere, unite, critere });
    }
}

async function addEvaluation(data) {
    try {
        console.log(`📤 Ajout évaluation: ${classeActuelle} - ${data.semaine} - ${data.matiere}`);
        
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT);
        
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                classe: classeActuelle,
                semaine: data.semaine,
                matiere: data.matiere,
                unite: data.unite,
                critere: data.critere
            }),
            signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || `Erreur HTTP ${response.status}`);
        }
        
        const newEval = await response.json();
        console.log('✅ Évaluation ajoutée:', newEval.id);
        
        evaluations.push(newEval);
        renderCalendrier();
        
        document.getElementById('formAjout').style.display = 'none';
        document.getElementById('evalForm').reset();
        evaluationEnCoursModification = null;
        
        showToast('Évaluation ajoutée avec succès !', 'success');
    } catch (error) {
        console.error('❌ Erreur ajout:', error);
        if (error.name === 'AbortError') {
            showToast('Timeout: La requête a pris trop de temps. Vérifiez votre connexion.', 'error');
        } else {
            showToast('Erreur lors de l\'ajout: ' + error.message, 'error');
        }
    }
}

async function updateEvaluation(id, data) {
    try {
        console.log(`📝 Modification évaluation: ${id}`);
        
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT);
        
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                classe: classeActuelle,
                semaine: data.semaine,
                matiere: data.matiere,
                unite: data.unite,
                critere: data.critere
            }),
            signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || `Erreur HTTP ${response.status}`);
        }
        
        const updatedEval = await response.json();
        console.log('✅ Évaluation modifiée:', updatedEval.id);
        
        // Mettre à jour dans le tableau local
        const index = evaluations.findIndex(e => e.id === id);
        if (index !== -1) {
            evaluations[index] = updatedEval;
        }
        
        renderCalendrier();
        
        document.getElementById('formAjout').style.display = 'none';
        document.getElementById('evalForm').reset();
        evaluationEnCoursModification = null;
        
        showToast('Évaluation modifiée avec succès !', 'success');
    } catch (error) {
        console.error('❌ Erreur modification:', error);
        if (error.name === 'AbortError') {
            showToast('Timeout: La requête a pris trop de temps. Vérifiez votre connexion.', 'error');
        } else {
            showToast('Erreur lors de la modification: ' + error.message, 'error');
        }
    }
}

// ═══════════════════════════════════════════════════════════════
// API - SUPPRIMER ÉVALUATION
// ═══════════════════════════════════════════════════════════════

async function deleteEvaluation(id) {
    if (!confirm('Supprimer cette évaluation ?')) return;
    
    try {
        console.log(`🗑️  Suppression évaluation: ${id}`);
        
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT);
        
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'DELETE',
            signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || `Erreur HTTP ${response.status}`);
        }
        
        console.log('✅ Évaluation supprimée');
        
        evaluations = evaluations.filter(e => e.id != id);
        renderCalendrier();
        
        showToast('Évaluation supprimée', 'success');
    } catch (error) {
        console.error('❌ Erreur suppression:', error);
        if (error.name === 'AbortError') {
            showToast('Timeout: La requête a pris trop de temps.', 'error');
        } else {
            showToast('Erreur lors de la suppression: ' + error.message, 'error');
        }
    }
}

// ═══════════════════════════════════════════════════════════════
// API - SUPPRIMER TOUTES LES ÉVALUATIONS D'UNE CLASSE
// ═══════════════════════════════════════════════════════════════

async function deleteAllEvaluations() {
    if (!classeActuelle) {
        showToast('Veuillez sélectionner une classe', 'warning');
        return;
    }
    
    const confirmation = confirm(
        `⚠️ ATTENTION ⚠️\n\n` +
        `Voulez-vous vraiment supprimer TOUTES les évaluations de ${classeActuelle} ?\n\n` +
        `Cette action est IRRÉVERSIBLE !\n\n` +
        `Nombre d'évaluations : ${evaluations.length}`
    );
    
    if (!confirmation) return;
    
    // Double confirmation pour éviter les erreurs
    const doubleConfirmation = confirm(
        `Dernière confirmation !\n\n` +
        `Êtes-vous ABSOLUMENT SÛR de vouloir supprimer les ${evaluations.length} évaluation(s) de ${classeActuelle} ?\n\n` +
        `Cliquez sur OK pour SUPPRIMER DÉFINITIVEMENT`
    );
    
    if (!doubleConfirmation) return;
    
    try {
        console.log(`🗑️🗑️🗑️ Suppression de TOUTES les évaluations de ${classeActuelle}`);
        
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT);
        
        const response = await fetch(`${API_URL}/classe/${classeActuelle}`, {
            method: 'DELETE',
            signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || `Erreur HTTP ${response.status}`);
        }
        
        const result = await response.json();
        console.log(`✅ ${result.count} évaluation(s) supprimée(s)`);
        
        evaluations = [];
        renderCalendrier();
        
        showToast(`✅ ${result.count} évaluation(s) supprimée(s) de ${classeActuelle}`, 'success');
    } catch (error) {
        console.error('❌ Erreur suppression en masse:', error);
        if (error.name === 'AbortError') {
            showToast('Timeout: La requête a pris trop de temps.', 'error');
        } else {
            showToast('Erreur lors de la suppression : ' + error.message, 'error');
        }
    }
}

// ═══════════════════════════════════════════════════════════════
// RENDU CALENDRIER
// ═══════════════════════════════════════════════════════════════

function renderCalendrier() {
    const container = document.getElementById('calendrier');
    
    if (!classeActuelle) {
        container.innerHTML = '<div class="empty-message">Veuillez sélectionner une classe</div>';
        return;
    }
    
    // Filtrer par matière active
    const evalsFiltered = evaluations.filter(e => e.matiere === matiereActive);
    
    let html = '';
    
    SEMAINES.forEach(semaine => {
        const evalsForWeek = evalsFiltered.filter(e => e.semaine === semaine.id);
        
        html += `
            <div class="week-card ${semaine.type}">
                <div class="week-header">
                    <div>
                        <div class="week-title">${semaine.label}</div>
                        <div class="week-dates">${semaine.dates}</div>
                    </div>
                    ${semaine.type === 'normale' || semaine.type === 'examens' ? 
                        `<button class="btn-add" onclick="openFormAjout('${semaine.id}', '${matiereActive}')">+</button>` : 
                        ''}
                </div>
                <div class="evaluations-list">
                    ${evalsForWeek.length > 0 ? 
                        evalsForWeek.map(e => `
                            <div class="evaluation-item">
                                <div class="evaluation-info">
                                    <div class="evaluation-unite">${e.unite}</div>
                                    <div class="evaluation-critere">Critère: ${e.critere}</div>
                                </div>
                                <div class="evaluation-actions">
                                    <button class="btn-edit" onclick="editEvaluation(${e.id})" title="Modifier">✏️</button>
                                    <button class="btn-delete" onclick="deleteEvaluation(${e.id})" title="Supprimer">✕</button>
                                </div>
                            </div>
                        `).join('') : 
                        ''}
                </div>
            </div>
        `;
    });
    
    container.innerHTML = html;
}

// ═══════════════════════════════════════════════════════════════
// FORMULAIRE AJOUT / MODIFICATION
// ═══════════════════════════════════════════════════════════════

function openFormAjout(semaine, matiere) {
    const semaineObj = SEMAINES.find(s => s.id === semaine);
    
    evaluationEnCoursModification = null;
    
    document.getElementById('semaineInput').value = semaine;
    document.getElementById('matiereInput').value = matiere;
    document.getElementById('semaineDisplay').value = `${semaineObj.label} (${semaineObj.dates})`;
    document.getElementById('matiereDisplay').value = matiere;
    document.getElementById('uniteInput').value = '';
    document.getElementById('critereInput').value = '';
    
    // Mettre à jour le titre du formulaire
    document.querySelector('#formAjout h3').textContent = 'Ajouter une évaluation';
    
    // Mettre à jour le texte du bouton
    document.querySelector('#evalForm button[type="submit"]').textContent = 'Ajouter';
    
    document.getElementById('formAjout').style.display = 'flex';
    document.getElementById('uniteInput').focus();
}

function editEvaluation(id) {
    const evaluation = evaluations.find(e => e.id === id);
    
    if (!evaluation) {
        showToast('Évaluation introuvable', 'error');
        return;
    }
    
    evaluationEnCoursModification = id;
    
    const semaineObj = SEMAINES.find(s => s.id === evaluation.semaine);
    
    document.getElementById('semaineInput').value = evaluation.semaine;
    document.getElementById('matiereInput').value = evaluation.matiere;
    document.getElementById('semaineDisplay').value = `${semaineObj.label} (${semaineObj.dates})`;
    document.getElementById('matiereDisplay').value = evaluation.matiere;
    document.getElementById('uniteInput').value = evaluation.unite;
    document.getElementById('critereInput').value = evaluation.critere;
    
    // Mettre à jour le titre du formulaire
    document.querySelector('#formAjout h3').textContent = 'Modifier l\'évaluation';
    
    // Mettre à jour le texte du bouton
    document.querySelector('#evalForm button[type="submit"]').textContent = 'Modifier';
    
    document.getElementById('formAjout').style.display = 'flex';
    document.getElementById('uniteInput').focus();
}

// ═══════════════════════════════════════════════════════════════
// EXPORT WORD (simplifié)
// ═══════════════════════════════════════════════════════════════

async function exportMatiere() {
    if (!classeActuelle) {
        showToast('Sélectionnez une classe', 'warning');
        return;
    }
    
    console.log('🔍 Export matière:', matiereActive);
    console.log('📊 Toutes les évaluations:', evaluations);
    
    const evalsMatiere = evaluations.filter(e => e.matiere === matiereActive);
    
    console.log('✅ Évaluations filtrées pour', matiereActive, ':', evalsMatiere);
    
    if (evalsMatiere.length === 0) {
        showToast('Aucune évaluation pour cette matière', 'warning');
        return;
    }
    
    await generateWordDoc(matiereActive, evalsMatiere);
    document.getElementById('modalExport').style.display = 'none';
}

async function exportComplet() {
    if (!classeActuelle) {
        showToast('Sélectionnez une classe', 'warning');
        return;
    }
    
    if (evaluations.length === 0) {
        showToast('Aucune évaluation à exporter', 'warning');
        return;
    }
    
    await generateWordDoc('TOUTES MATIÈRES', evaluations);
    document.getElementById('modalExport').style.display = 'none';
}

async function exportZIP() {
    if (!classeActuelle) {
        showToast('Sélectionnez une classe', 'warning');
        return;
    }
    
    showToast('Export ZIP : Génération en cours...', 'success');
    
    // Pour chaque matière, générer un document
    for (const matiere of MATIERES) {
        const evalsMatiere = evaluations.filter(e => e.matiere === matiere);
        if (evalsMatiere.length > 0) {
            await generateWordDoc(matiere, evalsMatiere);
            // Petit délai pour permettre les téléchargements multiples
            await new Promise(resolve => setTimeout(resolve, 500));
        }
    }
    
    document.getElementById('modalExport').style.display = 'none';
    showToast('Tous les documents ont été générés !', 'success');
}

async function generateWordDoc(titre, evals) {
    try {
        // Vérification et filtrage supplémentaire pour être sûr
        const evalsFiltrees = evals.filter(e => e.matiere === titre || titre === 'TOUTES MATIÈRES');
        
        console.log(`📄 Génération Word : ${titre}`);
        console.log(`📊 Nombre d'évaluations envoyées : ${evalsFiltrees.length}`);
        console.log(`📋 Détails :`, evalsFiltrees);
        
        showToast('Génération du document Word...', 'success');
        
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT * 2); // Timeout plus long pour export
        
        const response = await fetch('/api/export', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                classe: classeActuelle,
                matiere: titre,
                evaluations: evalsFiltrees
            }),
            signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Erreur génération');
        }
        
        // Télécharger le fichier
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Calendrier_${classeActuelle}_${titre.replace(/\s/g, '_')}_${Date.now()}.docx`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        
        console.log(`✅ Document Word téléchargé`);
        showToast(`Document ${titre} exporté !`, 'success');
        
    } catch (error) {
        console.error('❌ Erreur export Word:', error);
        if (error.name === 'AbortError') {
            showToast('Timeout: La génération du document a pris trop de temps.', 'error');
        } else {
            showToast('Erreur lors de l\'export: ' + error.message, 'error');
        }
    }
}

// ═══════════════════════════════════════════════════════════════
// NOTIFICATIONS TOAST
// ═══════════════════════════════════════════════════════════════

function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.className = `toast ${type} show`;
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

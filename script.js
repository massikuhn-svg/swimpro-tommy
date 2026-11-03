function showTab(tabId, e) {
    document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
    
    const targetTab = document.getElementById('tab-' + tabId);
    if (targetTab) {
        targetTab.classList.add('active');
    }
    
    if (e && e.currentTarget) {
        e.currentTarget.classList.add('active');
    }
}

// XP Gamification
let currentXP = parseInt(localStorage.getItem('tommy_xp') || '100');
function addXP(amount) {
    currentXP += amount;
    localStorage.setItem('tommy_xp', currentXP.toString());
    updateXPDisplay();
}

function updateXPDisplay() {
    const level = Math.floor(currentXP / 200) + 1;
    const xpRem = currentXP % 200;
    const pct = (xpRem / 200) * 100;
    
    const lvlEl = document.getElementById('user-level');
    const fillEl = document.getElementById('xp-fill');
    const textEl = document.getElementById('xp-text');

    if(lvlEl) lvlEl.innerText = level;
    if(fillEl) fillEl.style.width = pct + '%';
    if(textEl) textEl.innerText = `${xpRem} / 200 XP`;
}

// Stoppuhr
let timerInterval;
let timerTime = 0;
function startTimer() {
    clearInterval(timerInterval);
    const startTime = Date.now() - timerTime;
    timerInterval = setInterval(() => {
        timerTime = Date.now() - startTime;
        const m = Math.floor(timerTime / 60000).toString().padStart(2, '0');
        const s = Math.floor((timerTime % 60000) / 1000).toString().padStart(2, '0');
        const ms = Math.floor((timerTime % 1000) / 100);
        const valEl = document.getElementById('timer-val');
        if(valEl) valEl.innerText = `${m}:${s}.${ms}`;
    }, 100);
}
function stopTimer() { clearInterval(timerInterval); }
function resetTimer() { clearInterval(timerInterval); timerTime = 0; const valEl = document.getElementById('timer-val'); if(valEl) valEl.innerText = '00:00.0'; }

// Quiz System
const quizData = [
    { q: "Wie weit darfst du nach dem Startsprung unter Wasser bleiben?", opts: ["10 Meter", "15 Meter", "20 Meter"], a: 1 },
    { q: "Welcher Schweizer Schwimmer holte Olympia-Medaillen über Schmetterling?", opts: ["Noè Ponti", "Jeremy Desplanches", "Dominik Meichtry"], a: 0 }
];
let quizIdx = 0;
function renderQuiz() {
    const q = quizData[quizIdx];
    const qEl = document.getElementById('quiz-q');
    const optsEl = document.getElementById('quiz-opts');
    if(qEl) qEl.innerText = q.q;
    if(optsEl) {
        optsEl.innerHTML = q.opts.map((opt, i) => `
            <button class="btn-secondary" onclick="checkQuiz(${i})">${opt}</button>
        `).join('');
    }
}
function checkQuiz(idx) {
    if(idx === quizData[quizIdx].a) {
        alert("Richtig! +50 XP erhalten! 🎉");
        addXP(50);
    } else {
        alert("Leider falsch, probiere es nochmal! 😉");
    }
    quizIdx = (quizIdx + 1) % quizData.length;
    renderQuiz();
}

// Splitt Rechner
function calcSplits() {
    const t = parseFloat(document.getElementById('split-target').value);
    if(!t) return alert('Bitte Zeit eingeben!');
    const s1 = (t * 0.47).toFixed(2);
    const s2 = (t * 0.53).toFixed(2);
    document.getElementById('split-res').innerHTML = `<strong>Taktik-Splits für ${t}s:</strong><br>1. 25m Sprint: <strong>${s1}s</strong><br>2. 25m Finish: <strong>${s2}s</strong>`;
}

// Times Tracker
let savedTimes = JSON.parse(localStorage.getItem('tommy_times_v7') || '[]');
function renderTimes() {
    const list = document.getElementById('times-list');
    if (!list) return;
    if (savedTimes.length === 0) {
        list.innerHTML = '<p style="font-size: 12px; color: #64748b; text-align: center; padding: 12px 0;">Noch keine Bestzeiten eingetragen.</p>';
        return;
    }
    list.innerHTML = savedTimes.map((item, index) => {
        return `
            <div style="background: #030712; border: 1px solid #1f2937; padding: 10px; border-radius: 8px; margin-top: 8px;">
                <div style="display: flex; justify-content: space-between; font-weight: bold; color: #38bdf8;">
                    <span>${item.style}</span>
                    <button onclick="deleteTime(${index})" style="background: #ef4444; color: white; border: none; padding: 2px 6px; border-radius: 4px; font-size: 10px;">Löschen</button>
                </div>
                <div style="display: flex; justify-content: space-between; font-size: 11px; color: #9ca3af; margin: 4px 0;">
                    <span>Aktuell: ${item.time}s</span>
                    <span>Ziel: ${item.target}s</span>
                </div>
            </div>
        `;
    }).join('');
}

function addTimeLog() {
    const style = document.getElementById('sw-style').value;
    const time = parseFloat(document.getElementById('sw-time').value);
    const target = parseFloat(document.getElementById('sw-target').value);
    
    if (!time || !target) return alert('Bitte beide Zeiten eintragen!');

    savedTimes.push({ style, time, target });
    localStorage.setItem('tommy_times_v7', JSON.stringify(savedTimes));
    addXP(30);
    renderTimes();
}

function deleteTime(index) {
    savedTimes.splice(index, 1);
    localStorage.setItem('tommy_times_v7', JSON.stringify(savedTimes));
    renderTimes();
}

// Journal
let savedLogs = JSON.parse(localStorage.getItem('tommy_journal_v2') || '[]');
function renderJournal() {
    const list = document.getElementById('journal-list');
    if (!list) return;
    if (savedLogs.length === 0) {
        list.innerHTML = '<p style="font-size: 12px; color: #64748b; text-align: center; padding: 12px 0;">Noch keine Tagebucheinträge vorhanden.</p>';
        return;
    }
    list.innerHTML = savedLogs.map((item) => `
        <div class="article-box">
            <div class="article-title">${item.date}</div>
            <div class="article-body">${item.text}</div>
        </div>
    `).join('');
}

function addLogEntry() {
    const date = document.getElementById('log-date').value;
    const text = document.getElementById('log-text').value;
    if (!date || !text) return alert('Bitte Datum und Text ausfüllen!');

    savedLogs.unshift({ date, text });
    localStorage.setItem('tommy_journal_v2', JSON.stringify(savedLogs));
    addXP(50);
    document.getElementById('log-date').value = '';
    document.getElementById('log-text').value = '';
    renderJournal();
}

// Badges
let savedBadges = JSON.parse(localStorage.getItem('tommy_badges_v9') || '[]');
if(savedBadges.length < 16) savedBadges = new Array(16).fill(false);

function renderBadges() {
    let checkedCount = 0;
    savedBadges.forEach((val, idx) => {
        const el = document.getElementById('b' + idx);
        if (el) {
            el.checked = val;
            if (val) checkedCount++;
        }
    });
    const progressEl = document.getElementById('badge-progress-text');
    if (progressEl) {
        const pct = Math.round((checkedCount / savedBadges.length) * 100);
        progressEl.innerText = pct + '% Erreicht';
    }
}

function toggleBadge(idx) {
    savedBadges[idx] = !savedBadges[idx];
    localStorage.setItem('tommy_badges_v9', JSON.stringify(savedBadges));
    if(savedBadges[idx]) addXP(40);
    renderBadges();
}

// App-Inhalte beim Starten laden
updateXPDisplay();
renderQuiz();
renderTimes();
renderJournal();
renderBadges();

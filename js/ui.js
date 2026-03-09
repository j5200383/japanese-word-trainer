import { modeNames } from './data.js';

// ---- DOM Elements (動態獲取確保拿到最新) ----
export const els = {
    startScreen: () => document.getElementById('start-screen'),
    headerInfo: () => document.getElementById('header-info'),
    quizContainer: () => document.getElementById('quiz-container'),
    promptArea: () => document.getElementById('prompt-area'),
    badge: () => document.getElementById('question-type-badge'),
    jpInputContainer: () => document.getElementById('jp-input-container'),
    zhInputContainer: () => document.getElementById('zh-input-container'),
    inputJp: () => document.getElementById('input-jp'),
    inputZh: () => document.getElementById('input-zh'),
    submitBtn: () => document.getElementById('submit-btn'),
    feedbackBox: () => document.getElementById('feedback-box'),
    nextBtn: () => document.getElementById('next-btn'),
    endScreen: () => document.getElementById('end-screen'),
    historyScreen: () => document.getElementById('history-screen'),
    historyList: () => document.getElementById('history-list'),
    historyDetailScreen: () => document.getElementById('history-detail-screen'),
    historyDetailList: () => document.getElementById('history-detail-list'),
    progress: () => document.getElementById('progress'),
    score: () => document.getElementById('score'),
    jlptLevelSelect: () => document.getElementById('jlpt-level'),
    lessonSelect: () => document.getElementById('lesson-select'),
    questionCountSelect: () => document.getElementById('question-count'),
    totalWordsBadge: () => document.getElementById('total-words-badge'),
    customCountContainer: () => document.getElementById('custom-count-container'),
    customCountInput: () => document.getElementById('custom-count-input'),
    lessonContainer: () => document.getElementById('lesson-container'),
    startDescP: () => document.querySelector('#start-screen p'),
    ansWord: () => document.getElementById('ans-word'),
    ansKana: () => document.getElementById('ans-kana'),
    ansZh: () => document.getElementById('ans-zh'),
    feedbackTitle: () => document.getElementById('feedback-title'),
    finalScore: () => document.getElementById('final-score'),
    detailScoreBadge: () => document.getElementById('detail-score-badge')
};

export function hideAllScreens() {
    const screens = [
        els.startScreen(), els.headerInfo(), els.quizContainer(), 
        els.feedbackBox(), els.endScreen(), els.historyScreen(), els.historyDetailScreen()
    ];
    screens.forEach(s => {
        if(s) {
            s.classList.add('hidden');
            s.classList.remove('flex');
        }
    });
}

export function showScreen(screenEl, displayStyle = 'flex') {
    if (screenEl) {
        screenEl.classList.remove('hidden');
        screenEl.classList.add(displayStyle);
    }
}

export function updateLessonDropdown(lessonDataList) {
    const lessonContainerEl = els.lessonContainer();
    const lessonSelectEl = els.lessonSelect();
    
    if (lessonDataList && lessonDataList.length > 0) {
        lessonContainerEl.classList.remove('hidden');
        lessonSelectEl.innerHTML = '';
        lessonDataList.forEach(lesson => {
            const option = document.createElement('option');
            option.value = lesson.value;
            option.textContent = lesson.label;
            lessonSelectEl.appendChild(option);
        });
    } else {
        lessonContainerEl.classList.add('hidden');
        lessonSelectEl.innerHTML = '<option value="all">全部</option>';
    }
}

export function updateWordCountDisplay(count) {
    els.totalWordsBadge().textContent = `${count} 題`;
}

export function toggleCustomCount(selectedValue) {
    const customContainer = els.customCountContainer();
    if (selectedValue === 'custom') {
        customContainer.classList.remove('hidden');
        setTimeout(() => els.customCountInput().focus(), 100);
    } else {
        customContainer.classList.add('hidden');
    }
}

export function showStartWarning() {
    const descP = els.startDescP();
    const oldText = descP.textContent;
    descP.textContent = "⚠️ 此範圍目前沒有單字，請選擇其他級別或課別";
    descP.classList.add('text-rose-500', 'font-bold');
    descP.classList.remove('text-slate-500');
    setTimeout(() => {
        descP.textContent = "請選擇您想要練習的模式";
        descP.classList.remove('text-rose-500', 'font-bold');
        descP.classList.add('text-slate-500');
    }, 3000);
}

export function resetInputs() {
    const inputJp = els.inputJp();
    const inputZh = els.inputZh();
    inputJp.value = '';
    inputZh.value = '';
    inputJp.disabled = false;
    inputZh.disabled = false;
    els.submitBtn().classList.remove('hidden');
    els.quizContainer().scrollTop = 0;
}

export function focusInput(type) {
    if (type === 'zh-to-jp' || type === 'audio') {
        setTimeout(() => els.inputJp().focus(), 100);
    } else if (type === 'jp-to-zh') {
        setTimeout(() => els.inputZh().focus(), 100);
    }
}

export function renderQuestion(wordObj, type) {
    const badge = els.badge();
    const promptArea = els.promptArea();
    const jpInputContainer = els.jpInputContainer();
    const zhInputContainer = els.zhInputContainer();

    if (type === 'zh-to-jp') {
        badge.textContent = '📝 題型：看中文 ➔ 打日文';
        badge.className = 'px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold mb-4 shrink-0 mt-2';
        promptArea.innerHTML = `<h2 class="text-4xl font-bold text-slate-800">${wordObj.zh}</h2>`;
        jpInputContainer.classList.remove('hidden');
        zhInputContainer.classList.add('hidden');
    } else if (type === 'jp-to-zh') {
        badge.textContent = '📝 題型：看日文 ➔ 打中文';
        badge.className = 'px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-bold mb-4 shrink-0 mt-2';
        promptArea.innerHTML = `<h2 class="text-4xl font-bold text-slate-800">${wordObj.word}</h2>`;
        jpInputContainer.classList.add('hidden');
        zhInputContainer.classList.remove('hidden');
    } else if (type === 'audio') {
        badge.textContent = '🎧 題型：聽發音 ➔ 打日文與中文';
        badge.className = 'px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-bold mb-4 shrink-0 mt-2';
        promptArea.innerHTML = `
            <button id="play-audio-btn" class="flex items-center gap-3 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 border-2 border-indigo-200 px-6 py-4 rounded-2xl transition shadow-sm">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M11 5L6 9H2v6h4l5 4V5z" />
                </svg>
                <span class="text-xl font-bold">點擊播放發音</span>
            </button>
        `;
        jpInputContainer.classList.remove('hidden');
        zhInputContainer.classList.remove('hidden');
    }
}

export function renderFeedback(isCorrect, currentWord, newScore) {
    els.inputJp().disabled = true;
    els.inputZh().disabled = true;
    els.submitBtn().classList.add('hidden');
    
    const feedbackBox = els.feedbackBox();
    feedbackBox.classList.remove('hidden');
    feedbackBox.classList.add('flex');
    
    const titleEl = els.feedbackTitle();
    
    if (isCorrect) {
        els.score().textContent = `得分: ${newScore}`;
        feedbackBox.className = "flex w-full mt-auto p-5 rounded-xl border-2 flex-col border-emerald-300 bg-emerald-50 shrink-0";
        titleEl.innerHTML = `<span>✅ 答對了！</span>`;
        titleEl.className = "text-xl font-bold mb-3 flex items-center gap-2 text-emerald-700";
    } else {
        feedbackBox.className = "flex w-full mt-auto p-5 rounded-xl border-2 flex-col border-rose-300 bg-rose-50 shrink-0";
        titleEl.innerHTML = `<span>❌ 答錯了或不完整</span>`;
        titleEl.className = "text-xl font-bold mb-3 flex items-center gap-2 text-rose-700";
    }

    els.ansWord().textContent = currentWord.word;
    els.ansKana().textContent = currentWord.kana;
    els.ansZh().textContent = currentWord.zh;

    setTimeout(() => {
        const qc = els.quizContainer();
        qc.scrollTo({ top: qc.scrollHeight, behavior: 'smooth' });
    }, 50);
}

export function renderEndScreen(finalScore) {
    hideAllScreens();
    els.finalScore().textContent = finalScore;
    showScreen(els.endScreen());
}

export function renderHistoryList(history, showHistoryDetailCallback) {
    hideAllScreens();
    showScreen(els.historyScreen());
    const historyListEl = els.historyList();
    historyListEl.innerHTML = '';

    if (history.length === 0) {
        historyListEl.innerHTML = `<div class="text-center text-slate-400 py-10">目前還沒有測驗紀錄喔！<br>趕快去練習吧！</div>`;
        return;
    }

    history.forEach((record, index) => {
        const item = document.createElement('div');
        item.className = "bg-white border-2 border-slate-100 p-4 rounded-xl flex items-center justify-between cursor-pointer hover:border-indigo-300 hover:shadow-md transition";
        item.addEventListener('click', () => showHistoryDetailCallback(index));
        
        item.innerHTML = `
            <div>
                <div class="text-xs text-slate-400 mb-1">${record.date}</div>
                <div class="font-bold text-slate-700">${modeNames[record.mode] || '未知模式'}</div>
            </div>
            <div class="text-right">
                <div class="text-xl font-bold ${record.score === record.totalQuestions * 10 ? 'text-emerald-500' : 'text-indigo-600'}">${record.score} <span class="text-sm font-normal text-slate-400">分</span></div>
            </div>
        `;
        historyListEl.appendChild(item);
    });
}

export function renderHistoryDetail(record) {
    if (!record) return;
    hideAllScreens();
    showScreen(els.historyDetailScreen());

    els.detailScoreBadge().textContent = `${record.score} 分`;
    const historyDetailListEl = els.historyDetailList();
    historyDetailListEl.innerHTML = '';

    record.details.forEach((detail) => {
        const isCorr = detail.isCorrect;
        const card = document.createElement('div');
        card.className = `p-4 rounded-xl border-2 ${isCorr ? 'border-emerald-200 bg-emerald-50/30' : 'border-rose-200 bg-rose-50/50'}`;
        
        let userAnsHtml = '';
        if (detail.type === 'zh-to-jp') {
            userAnsHtml = `<p class="text-sm text-slate-600">你的輸入：<span class="font-bold ${isCorr ? 'text-emerald-700' : 'text-rose-600'}">${detail.userJp || '(未填寫)'}</span></p>`;
        } else if (detail.type === 'jp-to-zh') {
            userAnsHtml = `<p class="text-sm text-slate-600">你的輸入：<span class="font-bold ${isCorr ? 'text-emerald-700' : 'text-rose-600'}">${detail.userZh || '(未填寫)'}</span></p>`;
        } else {
            userAnsHtml = `
                <p class="text-sm text-slate-600">日文輸入：<span class="font-bold ${detail.userJp ? (isCorr ? 'text-emerald-700' : 'text-rose-600') : 'text-rose-600'}">${detail.userJp || '(未填寫)'}</span></p>
                <p class="text-sm text-slate-600">中文輸入：<span class="font-bold ${detail.userZh ? (isCorr ? 'text-emerald-700' : 'text-rose-600') : 'text-rose-600'}">${detail.userZh || '(未填寫)'}</span></p>
            `;
        }

        const modeBadgeLabel = modeNames[detail.type] ? modeNames[detail.type].split('➔')[0] : '聽力';

        card.innerHTML = `
            <div class="flex items-start gap-3">
                <div class="text-2xl mt-1">${isCorr ? '✅' : '❌'}</div>
                <div class="flex-grow space-y-2">
                    <div class="flex items-center gap-2">
                        <span class="bg-slate-200 text-slate-600 text-[10px] px-2 py-0.5 rounded">${modeBadgeLabel}</span>
                        <span class="font-bold text-slate-800">${detail.wordObj.word} (${detail.wordObj.kana})</span>
                    </div>
                    <div class="text-sm text-slate-500 mb-2">正確意思：${detail.wordObj.zh}</div>
                    
                    <div class="bg-white p-2 rounded-lg border border-slate-100">
                        ${userAnsHtml}
                    </div>
                </div>
            </div>
        `;
        historyDetailListEl.appendChild(card);
    });
}

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
    historyFilterSelect: () => document.getElementById('history-filter'),
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
    detailScoreBadge: () => document.getElementById('detail-score-badge'),

    // --- Vocab List Elements ---
    vocabScreen: () => document.getElementById('vocab-screen'),
    vocabList: () => document.getElementById('vocab-list'),
    vocabLevelSelect: () => document.getElementById('vocab-level'),
    vocabLessonContainer: () => document.getElementById('vocab-lesson-container'),
    vocabLessonSelect: () => document.getElementById('vocab-lesson'),
    btnBrowseVocab: () => document.getElementById('btn-browse-vocab'),
    btnBackFromVocab: () => document.getElementById('btn-back-from-vocab'),

    // --- Flashcard Elements ---
    flashcardContainer: () => document.getElementById('flashcard-container'),
    flashcardBox: () => document.getElementById('flashcard-box'),
    flashcardInner: () => document.getElementById('flashcard-inner'),
    fcFrontWord: () => document.getElementById('fc-front-word'),
    fcBackWord: () => document.getElementById('fc-back-word'),
    fcBackKana: () => document.getElementById('fc-back-kana'),
    fcBackZh: () => document.getElementById('fc-back-zh'),
    fcControlsFront: () => document.getElementById('fc-controls-front'),
    fcControlsBack: () => document.getElementById('fc-controls-back'),
    btnFcFlip: () => document.getElementById('btn-fc-flip'),
    btnFcForgot: () => document.getElementById('btn-fc-forgot'),
    btnFcRemembered: () => document.getElementById('btn-fc-remembered'),
    fcPlayFront: () => document.getElementById('fc-play-front'),
    fcPlayBack: () => document.getElementById('fc-play-back')
};

export function hideAllScreens() {
    const screens = [
        els.startScreen(), els.headerInfo(), els.quizContainer(),
        els.feedbackBox(), els.endScreen(), els.historyScreen(), els.historyDetailScreen(),
        els.flashcardContainer(), els.vocabScreen()
    ];
    screens.forEach(s => {
        if (s) {
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

export function updateVocabLessonDropdown(lessonDataList) {
    const lessonContainerEl = els.vocabLessonContainer();
    const lessonSelectEl = els.vocabLessonSelect();

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

export function renderFlashcard(wordObj, isFlipped) {
    els.fcFrontWord().textContent = wordObj.word;
    els.fcBackWord().textContent = wordObj.word;
    els.fcBackKana().textContent = wordObj.kana;
    els.fcBackZh().textContent = wordObj.zh;

    const inner = els.flashcardInner();
    const ctrlFront = els.fcControlsFront();
    const ctrlBack = els.fcControlsBack();

    if (isFlipped) {
        inner.classList.add('rotate-y-180');
        ctrlFront.classList.add('hidden');
        ctrlBack.classList.remove('hidden');
    } else {
        if (inner.classList.contains('rotate-y-180')) {
            inner.style.transition = 'none';
            inner.classList.remove('rotate-y-180');
            // Force reflow allowing exact rendering frame without transition
            void inner.offsetWidth;
            inner.style.transition = '';
        }
        ctrlFront.classList.remove('hidden');
        ctrlBack.classList.add('hidden');
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

export function renderEndScreen(results) {
    hideAllScreens();
    els.finalScore().textContent = results.score;

    // 判斷是否要顯示錯題重測按鈕
    const btnRetry = document.getElementById('btn-retry-mistakes');
    if (btnRetry) {
        // 如果分數不是滿分，代表有錯題
        if (results.score < 100) {
            btnRetry.classList.remove('hidden');
            btnRetry.classList.add('flex');
        } else {
            btnRetry.classList.add('hidden');
            btnRetry.classList.remove('flex');
        }
    }

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
        item.addEventListener('click', () => showHistoryDetailCallback(record));

        item.innerHTML = `
            <div>
                <div class="text-xs text-slate-400 mb-1">${record.date}</div>
                <div class="font-bold text-slate-700">${modeNames[record.mode] || '未知模式'}</div>
            </div>
            <div class="text-right">
                <div class="text-xl font-bold ${record.score === 100 ? 'text-emerald-500' : 'text-indigo-600'}">${record.score} <span class="text-sm font-normal text-slate-400">分</span></div>
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

    // 檢查是否已經有重新作答按鈕，沒有就加上去
    let headerContainer = els.historyDetailScreen().querySelector('.flex.items-center.mb-4');
    let retryBtn = headerContainer.querySelector('#btn-retry-record');
    let retryMistakesBtn = headerContainer.querySelector('#btn-retry-record-mistakes');

    if (!retryBtn) {
        retryBtn = document.createElement('button');
        retryBtn.id = 'btn-retry-record';
        retryBtn.className = 'ml-auto bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border-2 border-indigo-200 px-3 py-1.5 rounded-lg text-sm font-bold shadow-sm transition whitespace-nowrap shrink-0';
        retryBtn.textContent = '重新作答全卷';
        headerContainer.insertBefore(retryBtn, els.detailScoreBadge());
    }

    if (!retryMistakesBtn) {
        retryMistakesBtn = document.createElement('button');
        retryMistakesBtn.id = 'btn-retry-record-mistakes';
        retryMistakesBtn.className = 'ml-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border-2 border-rose-200 px-3 py-1.5 rounded-lg text-sm font-bold shadow-sm transition mr-2 whitespace-nowrap shrink-0';
        retryMistakesBtn.textContent = '只練錯題';
        headerContainer.insertBefore(retryMistakesBtn, els.detailScoreBadge());
    }

    // 如果滿分，就隱藏「只練錯題」按鈕
    if (record.score === 100) {
        retryMistakesBtn.classList.add('hidden');
    } else {
        retryMistakesBtn.classList.remove('hidden');
    }

    els.detailScoreBadge().classList.remove('ml-auto');
    els.detailScoreBadge().classList.add('ml-2', 'whitespace-nowrap', 'shrink-0');

    // 使 header 可以橫向捲動，避免過窄時按鈕太擠
    headerContainer.classList.add('overflow-x-auto', 'pb-1');

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
        } else if (detail.type !== 'flashcard') {
            userAnsHtml = `
                <p class="text-sm text-slate-600">日文輸入：<span class="font-bold ${detail.userJp ? (isCorr ? 'text-emerald-700' : 'text-rose-600') : 'text-rose-600'}">${detail.userJp || '(未填寫)'}</span></p>
                <p class="text-sm text-slate-600">中文輸入：<span class="font-bold ${detail.userZh ? (isCorr ? 'text-emerald-700' : 'text-rose-600') : 'text-rose-600'}">${detail.userZh || '(未填寫)'}</span></p>
            `;
        }

        const modeBadgeLabel = modeNames[detail.type] ? modeNames[detail.type].split('➔')[0] : '聽力';

        let userInputBoxHtml = '';
        if (detail.type !== 'flashcard') {
            userInputBoxHtml = `
                    <div class="bg-white p-2 rounded-lg border border-slate-100 mt-2">
                        ${userAnsHtml}
                    </div>
            `;
        }

        card.innerHTML = `
            <div class="flex items-start gap-3">
                <div class="text-2xl mt-1">${isCorr ? '✅' : '❌'}</div>
                <div class="flex-grow space-y-2 pr-2 bg-transparent">
                    <div class="flex items-center gap-2 flex-wrap">
                        <span class="bg-slate-200 text-slate-600 text-[10px] px-2 py-0.5 rounded">${modeBadgeLabel}</span>
                        <span class="font-bold text-slate-800">${detail.wordObj.word} (${detail.wordObj.kana})</span>
                    </div>
                    <div class="text-sm text-slate-500 mb-2">正確意思：${detail.wordObj.zh}</div>
                    ${userInputBoxHtml}
                </div>
            </div>
        `;

        historyDetailListEl.appendChild(card);
    });
}

export function renderVocabList(words) {
    const listEl = els.vocabList();
    listEl.innerHTML = '';

    if (words.length === 0) {
        listEl.innerHTML = `<div class="text-center text-slate-400 py-10">此範圍目前沒有單字</div>`;
        return;
    }

    words.forEach((wordObj, index) => {
        const item = document.createElement('div');
        item.className = "bg-white border-2 border-slate-100 p-4 rounded-xl flex items-center justify-between hover:border-indigo-300 transition shadow-sm relative min-h-[100px]";

        let levelBadge = '';
        const levelText = wordObj.level ? `${wordObj.level} 第${wordObj.lesson || '?'}課` : '未分類';
        levelBadge = `<span class="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded font-bold mb-2 inline-block">${levelText}</span>`;

        // 判斷是否需要顯示 Ruby (漢字上方平假名)
        let wordHtml = '';
        if (wordObj.word !== wordObj.kana) {
            wordHtml = `<ruby class="text-2xl font-bold text-slate-800">${wordObj.word}<rt class="text-xs text-indigo-500 font-bold mb-1">${wordObj.kana}</rt></ruby>`;
        } else {
            wordHtml = `<span class="text-2xl font-bold text-slate-800">${wordObj.word}</span>`;
        }

        item.innerHTML = `
            <div class="flex-grow pr-4">
                <div class="mb-1">
                    ${wordHtml}
                </div>
                <div class="text-slate-600 text-sm mt-2">${wordObj.zh}</div>
            </div>
            <div class="flex flex-col items-end shrink-0">
                ${levelBadge}
                <button class="btn-play-vocab bg-indigo-50 hover:bg-indigo-100 text-indigo-600 p-3 rounded-full transition shadow-sm border border-indigo-100 mt-1" data-word="${wordObj.word}" title="播放發音">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M11 5L6 9H2v6h4l5 4V5z" />
                    </svg>
                </button>
            </div>
        `;
        listEl.appendChild(item);
    });
}

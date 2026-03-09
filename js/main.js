import { lessonData } from './data.js';
import * as quizService from './quizService.js';
import * as storageService from './storage.js';
import * as audioService from './audio.js';
import * as ui from './ui.js';

// ---- 初始化綁定事件 ----
function setupEventListeners() {
    // 下拉選單連動
    ui.els.jlptLevelSelect().addEventListener('change', handleLevelChange);
    ui.els.lessonSelect().addEventListener('change', handleLessonChange);
    ui.els.questionCountSelect().addEventListener('change', handleCountModeChange);

    // 鍵盤 Enter 支援
    document.addEventListener('keydown', handleKeydown);

    // 遊戲重置/退出
    const quitBtn = document.querySelector('button[onclick="quitQuiz()"]');
    if(quitBtn) quitBtn.onclick = quitQuiz;
    
    // 綁定首頁模式按鈕 (取代 HTML 上的 onclick='startGame(...)')
    const modeBtns = ui.els.startScreen().querySelectorAll('button[onclick^="startGame"]');
    modeBtns.forEach(btn => {
        const mode = btn.getAttribute('onclick').match(/'([^']+)'/)[1];
        btn.onclick = () => startGame(mode);
    });

    // 綁定測驗介面按鈕
    ui.els.submitBtn().onclick = handleSubmitAnswer;
    ui.els.nextBtn().onclick = loadNextQuestion;

    // 閃卡模式按鈕
    const fcBox = ui.els.flashcardBox();
    if(fcBox) fcBox.onclick = handleFlipFlashcard;
    const btnFlip = ui.els.btnFcFlip();
    if(btnFlip) btnFlip.onclick = handleFlipFlashcard;
    const btnForgot = ui.els.btnFcForgot();
    if(btnForgot) btnForgot.onclick = () => handleFlashcardResult(false);
    const btnRemembered = ui.els.btnFcRemembered();
    if(btnRemembered) btnRemembered.onclick = () => handleFlashcardResult(true);

    const checkAudioHit = (e) => {
        e.stopPropagation();
        const qData = quizService.getCurrentQuestion();
        if(qData) audioService.playAudio(qData.word.word);
    };
    
    const fcPlayFront = ui.els.fcPlayFront();
    if (fcPlayFront) fcPlayFront.onclick = checkAudioHit;
    const fcPlayBack = ui.els.fcPlayBack();
    if (fcPlayBack) fcPlayBack.onclick = checkAudioHit;

    // 歷史紀錄按鈕
    const viewHistoryBtn = ui.els.startScreen().querySelector('button[onclick="showHistoryList()"]');
    if(viewHistoryBtn) viewHistoryBtn.onclick = handleShowHistoryList;
    
    // 初始化 filter 監聽器
    const historyFilter = ui.els.historyFilterSelect();
    if (historyFilter) historyFilter.addEventListener('change', handleShowHistoryList);

    const backMenuFromHistory = document.querySelector('button[onclick="backToMenuFromHistory()"]');
    if(backMenuFromHistory) backMenuFromHistory.onclick = backToMenu;

    const backListFromDetail = document.querySelector('button[onclick="backToHistoryList()"]');
    if(backListFromDetail) backListFromDetail.onclick = handleShowHistoryList;

    // 單字庫按鈕與篩選器
    const browseVocabBtn = ui.els.btnBrowseVocab();
    if(browseVocabBtn) browseVocabBtn.onclick = handleShowVocabList;

    const backFromVocabBtn = ui.els.btnBackFromVocab();
    if(backFromVocabBtn) backFromVocabBtn.onclick = backToMenu;

    const vocabLevelSelect = ui.els.vocabLevelSelect();
    if(vocabLevelSelect) vocabLevelSelect.addEventListener('change', handleVocabLevelChange);

    const vocabLessonSelect = ui.els.vocabLessonSelect();
    if(vocabLessonSelect) vocabLessonSelect.addEventListener('change', handleVocabLessonChange);

    // 單字庫內的發音按鈕 (事件委任)
    const vocabListEl = ui.els.vocabList();
    if(vocabListEl) {
        vocabListEl.addEventListener('click', (e) => {
            const btn = e.target.closest('.btn-play-vocab');
            if(btn) {
                const word = btn.getAttribute('data-word');
                if(word) audioService.playAudio(word);
            }
        });
    }

    // 結束畫面按鈕
    const reviewBtn = document.querySelector('button[onclick="showLatestHistoryDetail()"]');
    if(reviewBtn) reviewBtn.onclick = () => {
        const history = storageService.getHistory();
        if(history.length > 0) handleShowHistoryDetail(history[0]);
    };

    const restartBtn = document.querySelector('button[onclick="restartSameMode()"]');
    if(restartBtn) restartBtn.onclick = () => startGame(quizService.getGameResults().mode);

    const backMenuBtn = document.querySelector('button[onclick="backToMenu()"]');
    if(backMenuBtn) backMenuBtn.onclick = backToMenu;
}

// ---- 控制器邏輯 ----

function handleLevelChange() {
    const level = ui.els.jlptLevelSelect().value;
    ui.updateLessonDropdown(lessonData[level]);
    updateWordCount();
}

function handleLessonChange() {
    updateWordCount();
}

function updateWordCount() {
    const level = ui.els.jlptLevelSelect().value;
    const lesson = ui.els.lessonSelect().value;
    const count = quizService.getFilteredWords(level, lesson).length;
    ui.updateWordCountDisplay(count);
}

function handleCountModeChange(e) {
    ui.toggleCustomCount(e.target.value);
}

function startGame(mode) {
    const level = ui.els.jlptLevelSelect().value;
    const lesson = ui.els.lessonSelect().value;
    const filteredWords = quizService.getFilteredWords(level, lesson);

    if (filteredWords.length === 0) {
        ui.showStartWarning();
        return;
    }

    const countSelect = ui.els.questionCountSelect().value;
    const customCount = ui.els.customCountInput().value;

    quizService.startNewGame(mode, countSelect, customCount, filteredWords);
    
    ui.els.score().textContent = `得分: 0`;
    ui.hideAllScreens();
    ui.showScreen(ui.els.headerInfo());

    if (mode === 'flashcard') {
        ui.showScreen(ui.els.flashcardContainer());
        isFlashcardFlipped = false;
        loadFlashcard();
    } else {
        ui.showScreen(ui.els.quizContainer());
        loadQuestion();
    }
}

let isFlashcardFlipped = false;

function loadFlashcard() {
    const qData = quizService.getCurrentQuestion();
    if (!qData) {
        handleEndGame();
        return;
    }
    
    ui.els.progress().textContent = `進度: ${qData.index + 1} / ${qData.total}`;
    isFlashcardFlipped = false;
    ui.renderFlashcard(qData.word, isFlashcardFlipped);
    
    // 自動唸字
    audioService.playAudio(qData.word.word);
}

function handleFlipFlashcard() {
    if (isFlashcardFlipped) return; // 已翻開就不再翻
    isFlashcardFlipped = true;
    const qData = quizService.getCurrentQuestion();
    ui.renderFlashcard(qData.word, isFlashcardFlipped);
    
    // 翻開後發音
    audioService.playAudio(qData.word.word);
}

function handleFlashcardResult(knewIt) {
    quizService.handleFlashcardAnswer(knewIt);
    quizService.moveToNextQuestion();
    loadFlashcard();
}

function loadQuestion() {
    const qData = quizService.getCurrentQuestion();
    
    if (!qData) {
        handleEndGame();
        return;
    }

    ui.els.progress().textContent = `進度: ${qData.index + 1} / ${qData.total}`;
    
    ui.resetInputs();
    ui.hideAllScreens();
    ui.showScreen(ui.els.headerInfo());
    ui.showScreen(ui.els.quizContainer());
    
    ui.renderQuestion(qData.word, qData.type);
    
    if (qData.type === 'audio') {
        const audioBtn = document.getElementById('play-audio-btn');
        if (audioBtn) {
            audioBtn.onclick = () => audioService.playAudio(qData.word.word);
        }
        audioService.playAudio(qData.word.word);
    }
    
    ui.focusInput(qData.type);
}

function handleSubmitAnswer() {
    const jpVal = ui.els.inputJp().value.trim();
    const zhVal = ui.els.inputZh().value.trim();
    
    const result = quizService.checkAnswer(jpVal, zhVal);
    ui.renderFeedback(result.isCorrect, result.currentWord, result.newScore);
    
    audioService.playAudio(result.currentWord.word);
}

function loadNextQuestion() {
    quizService.moveToNextQuestion();
    loadQuestion();
}

function handleEndGame() {
    const results = quizService.getGameResults();
    storageService.saveToHistory(
        storageService.createRecord(results.mode, results.score, results.totalQuestions, results.details)
    );
    ui.renderEndScreen(results.score);
}

function handleShowHistoryList() {
    let history = storageService.getHistory();
    const filterSelect = ui.els.historyFilterSelect();
    if (filterSelect && filterSelect.value !== 'all') {
        history = history.filter(record => record.mode === filterSelect.value);
    }
    ui.renderHistoryList(history, handleShowHistoryDetail);
}

function handleShowHistoryDetail(record) {
    ui.renderHistoryDetail(record);
}

// ---- 單字庫邏輯 ----
function handleShowVocabList() {
    ui.hideAllScreens();
    ui.showScreen(ui.els.vocabScreen());
    
    // 初始化單字庫的下拉選單並渲染
    handleVocabLevelChange();
}

function handleVocabLevelChange() {
    const level = ui.els.vocabLevelSelect().value;
    ui.updateVocabLessonDropdown(lessonData[level]);
    updateVocabList();
}

function handleVocabLessonChange() {
    updateVocabList();
}

function updateVocabList() {
    const level = ui.els.vocabLevelSelect().value;
    const lesson = ui.els.vocabLessonSelect().value;
    const filteredWords = quizService.getFilteredWords(level, lesson);
    ui.renderVocabList(filteredWords);
}

function backToMenu() {
    audioService.stopAudio();
    ui.hideAllScreens();
    ui.showScreen(ui.els.startScreen());
    handleLevelChange(); // 同步畫面狀態
}

function quitQuiz() {
    audioService.stopAudio();
    backToMenu();
}

function handleKeydown(event) {
    if (event.isComposing || event.keyCode === 229) return;
    if (event.repeat) return;

    if (event.key === 'Enter') {
        const quizContainer = ui.els.quizContainer();
        const fcContainer = ui.els.flashcardContainer();
        const feedbackBox = ui.els.feedbackBox();

        // 閃卡模式下的處理
        if (fcContainer && !fcContainer.classList.contains('hidden')) {
            event.preventDefault();
            if (!isFlashcardFlipped) {
                handleFlipFlashcard();
            } else {
                handleFlashcardResult(true); // 預設 Enter 代表「記得」
            }
            return;
        }

        const qData = quizService.getCurrentQuestion(); // 用來判斷目前是在測驗中

        if (!quizContainer.classList.contains('hidden') && feedbackBox.classList.contains('hidden')) {
            // 在輸入狀態，必須有填東西才能送出
            const jpVal = ui.els.inputJp().value.trim();
            const zhVal = ui.els.inputZh().value.trim();
            const type = qData ? qData.type : 'zh-to-jp';
            
            let canSubmit = false;
            if (type === 'zh-to-jp') canSubmit = (jpVal !== '');
            else if (type === 'jp-to-zh') canSubmit = (zhVal !== '');
            else if (type === 'audio') canSubmit = (jpVal !== '' && zhVal !== '');

            if (canSubmit) {
                event.preventDefault();
                handleSubmitAnswer();
            }
        } 
        else if (!quizContainer.classList.contains('hidden') && !feedbackBox.classList.contains('hidden')) {
            // 在看答案狀態，按 Enter 到下一題
            event.preventDefault();
            loadNextQuestion();
        }
    }
}

// 頁面載入完成後初始化
window.addEventListener('DOMContentLoaded', () => {
    setupEventListeners();
    handleLevelChange(); // 初始化下拉選項與題數
});
/*! 主程式進入點載入完畢 */

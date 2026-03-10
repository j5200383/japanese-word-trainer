import { wordList } from './data.js';

let currentIndex = 0;
let correctCount = 0;
let initialTotalQuestions = 0;
let selectedMode = 'mixed';
let currentQuestionType = 'zh-to-jp';
let currentSessionDetails = [];
let currentQuizList = [];

export function getFilteredWords(level, lesson) {
    if (level === 'all') return wordList;
    let filtered = wordList.filter(w => w.level === level);
    if (lesson !== 'all') {
        filtered = filtered.filter(w => w.lesson === lesson);
    }
    return filtered;
}

export function startNewGame(mode, countSelect, customCount, filteredWords) {
    selectedMode = mode;
    currentIndex = 0;
    correctCount = 0;
    currentSessionDetails = [];

    let count;
    if (countSelect === 'all') {
        count = filteredWords.length;
    } else if (countSelect === 'custom') {
        const customInput = parseInt(customCount, 10);
        if (isNaN(customInput) || customInput < 1) {
            count = Math.min(5, filteredWords.length);
        } else if (customInput > filteredWords.length) {
            count = filteredWords.length;
        } else {
            count = customInput;
        }
    } else {
        count = parseInt(countSelect, 10);
        if (count > filteredWords.length) count = filteredWords.length;
    }

    let shuffled = [...filteredWords].sort(() => 0.5 - Math.random());
    currentQuizList = shuffled.slice(0, count);

    initialTotalQuestions = currentQuizList.length;

    return {
        totalQuestions: initialTotalQuestions
    };
}

export function getCurrentQuestion() {
    if (currentIndex >= currentQuizList.length) {
        return null; // 測驗結束
    }

    const currentWord = currentQuizList[currentIndex];

    if (selectedMode === 'mixed') {
        const types = ['zh-to-jp', 'jp-to-zh', 'audio'];
        currentQuestionType = types[Math.floor(Math.random() * types.length)];
    } else {
        currentQuestionType = selectedMode;
    }

    return {
        word: currentWord,
        type: currentQuestionType,
        index: currentIndex,
        total: currentQuizList.length
    };
}

export function checkAnswer(userJp, userZh) {
    const currentWord = currentQuizList[currentIndex];

    let isCorrect = false;
    // 判斷日文輸入是否正確 (可接受漢字或平假名)
    const jpCorrect = (userJp === currentWord.word || userJp === currentWord.kana);
    // 判斷中文輸入是否正確 (包含即可)
    const zhCorrect = (userZh !== '' && currentWord.zh.includes(userZh));

    if (currentQuestionType === 'zh-to-jp') isCorrect = jpCorrect;
    else if (currentQuestionType === 'jp-to-zh') isCorrect = zhCorrect;
    else if (currentQuestionType === 'audio') isCorrect = jpCorrect && zhCorrect;

    if (isCorrect) correctCount++;

    currentSessionDetails.push({
        wordObj: currentWord,
        type: currentQuestionType,
        userJp: userJp,
        userZh: userZh,
        isCorrect: isCorrect
    });

    const currentScore = initialTotalQuestions > 0 ? Math.round((correctCount / initialTotalQuestions) * 100) : 0;

    return {
        isCorrect: isCorrect,
        currentWord: currentWord,
        newScore: currentScore
    };
}

export function handleFlashcardAnswer(knewIt) {
    const currentWord = currentQuizList[currentIndex];

    // 尋找是否歷史紀錄中已經有這題 (代表之前選過不熟)
    const existingDetailIndex = currentSessionDetails.findIndex(detail => detail.wordObj.word === currentWord.word);

    if (knewIt) {
        correctCount++;
        if (existingDetailIndex !== -1) {
            // 更新已存在的紀錄
            currentSessionDetails[existingDetailIndex].userJp = '(記得)';
            currentSessionDetails[existingDetailIndex].userZh = '(記得)';
            currentSessionDetails[existingDetailIndex].isCorrect = true;
        } else {
            // 新增紀錄
            currentSessionDetails.push({
                wordObj: currentWord,
                type: 'flashcard',
                userJp: '(記得)',
                userZh: '(記得)',
                isCorrect: true
            });
        }
    } else {
        // 如果不熟，塞回陣列尾端，之後會再測到
        currentQuizList.push(currentWord);

        if (existingDetailIndex === -1) {
            // 只有第一次選不熟時，才加入歷史紀錄
            currentSessionDetails.push({
                wordObj: currentWord,
                type: 'flashcard',
                userJp: '(不熟)',
                userZh: '(不熟)',
                isCorrect: false
            });
        }
    }

    const currentScore = initialTotalQuestions > 0 ? Math.round((correctCount / initialTotalQuestions) * 100) : 0;
    return currentScore;
}

export function moveToNextQuestion() {
    currentIndex++;
}

export function startMistakesGame() {
    // 篩選出剛才答錯的題目
    const mistakes = currentSessionDetails
        .filter(detail => !detail.isCorrect)
        .map(detail => detail.wordObj);

    // 移除陣列中可能重複的物件 (因為閃卡可能同一個單字錯多次)
    const uniqueMistakes = Array.from(new Set(mistakes));

    if (uniqueMistakes.length === 0) return false;

    // 將錯題重新洗牌作為新的考題
    currentQuizList = [...uniqueMistakes].sort(() => 0.5 - Math.random());
    currentIndex = 0;
    correctCount = 0;
    initialTotalQuestions = currentQuizList.length;
    currentSessionDetails = []; // 清空之前的紀錄，開始新的回合

    return {
        totalQuestions: initialTotalQuestions
    };
}

export function getGameResults() {
    const finalScore = initialTotalQuestions > 0 ? Math.round((correctCount / initialTotalQuestions) * 100) : 0;
    return {
        score: finalScore,
        mode: selectedMode,
        totalQuestions: initialTotalQuestions,
        details: currentSessionDetails
    };
}

import { wordList } from './data.js';

let currentIndex = 0;
let score = 0;
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
    score = 0;
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
    
    return {
        totalQuestions: currentQuizList.length
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

    if (isCorrect) score += 10;

    currentSessionDetails.push({
        wordObj: currentWord,
        type: currentQuestionType,
        userJp: userJp,
        userZh: userZh,
        isCorrect: isCorrect
    });

    return {
        isCorrect: isCorrect,
        currentWord: currentWord,
        newScore: score
    };
}

export function moveToNextQuestion() {
    currentIndex++;
}

export function getGameResults() {
    return {
        score: score,
        mode: selectedMode,
        totalQuestions: currentQuizList.length,
        details: currentSessionDetails
    };
}

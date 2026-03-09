// 管理歷史成績與 LocalStorage
import { modeNames } from './data.js';

const STORAGE_KEY = 'jpTypingHistory';

export function saveToHistory(record) {
    let history = getHistory();
    history.unshift(record);
    if (history.length > 50) history.pop(); 
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
}

export function getHistory() {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
}

export function createRecord(mode, score, totalQuestions, details) {
    return {
        id: Date.now(),
        date: new Date().toLocaleString('zh-TW', { month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' }),
        mode: mode,
        score: score,
        totalQuestions: totalQuestions,
        details: details
    };
}

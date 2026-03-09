// 管理語音發音 (改用更自然的 Google Translate TTS API)
let currentAudio = null;

// 為了相容原本的架構，保留此空函式，避免其他檔案呼叫出錯
export function initVoices() {
    // 不再需要實作，因為我們不依賴 Web Speech API 語音包了
}

export function playAudio(text) {
    if (!text) return;
    
    // 如果目前有音檔正在播放，先暫停它
    if (currentAudio) {
        currentAudio.pause();
        currentAudio.currentTime = 0;
    }

    // 呼叫非官方 Google Translate TTS 介面
    // client=gtx 是一個未公開但穩定、廣泛使用的參數，可免除 API key
    const encodedText = encodeURIComponent(text);
    const url = `https://translate.googleapis.com/translate_tts?ie=UTF-8&q=${encodedText}&tl=ja&client=gtx`;

    currentAudio = new Audio(url);
    
    // 可選：若覺得念太快，可稍微放慢。Google TTS 節奏通常很好，預設 1.0 即可
    // currentAudio.playbackRate = 0.9; 

    // 播放音檔並加上簡易的錯誤處理
    currentAudio.play().catch(error => {
        console.warn("自動播放語音可能被瀏覽器阻擋，或網路發生錯誤:", error);
    });
}

export function stopAudio() {
    if (currentAudio) {
        currentAudio.pause();
        currentAudio.currentTime = 0;
    }
}

// 管理語音發音：混合式雙保險方案
let preferedVoice = null;
let currentAudio = null;

// 判斷是否為 Safari 瀏覽器 (用於後續特定參數微調)
const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

// 初始化語音庫 (為原生語音備援做準備)
function loadVoices() {
    if (!window.speechSynthesis) return;
    const voices = window.speechSynthesis.getVoices();

    // Safari 偶發性抓不到語音的防呆機制
    if (voices.length === 0) {
        setTimeout(loadVoices, 100);
        return;
    }

    const jpVoices = voices.filter(voice => voice.lang === 'ja-JP' || voice.lang === 'ja_JP');

    if (jpVoices.length > 0) {
        // 針對高音質語音進行更精準的排序篩選
        preferedVoice =
            // 1. Apple 系統的高音質女聲/男聲 (如果使用者有下載)
            jpVoices.find(v => v.name.includes('Kyoko') && v.name.includes('Premium')) ||
            jpVoices.find(v => v.name.includes('Otoya') && v.name.includes('Premium')) ||
            jpVoices.find(v => v.name.includes('Premium')) ||
            // 2. Google 高音質語音 (Android/Chrome環境)
            jpVoices.find(v => v.name.includes('Google')) ||
            jpVoices.find(v => v.name.includes('Natural')) ||
            // 3. Apple 系統標準聲音 (備援)
            jpVoices.find(v => v.name.includes('Kyoko')) ||
            jpVoices.find(v => v.name.includes('Otoya')) ||
            // 4. 其他
            jpVoices[0];
    }
}

if (window.speechSynthesis) {
    // 綁定事件並手動觸發一次
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
        window.speechSynthesis.onvoiceschanged = loadVoices;
    }
    loadVoices();
}

/**
 * 核心播放邏輯：嘗試 Google，失敗則 Fallback
 */
export function playAudio(text) {
    if (!text) return;

    stopAudio();

    const encodedText = encodeURIComponent(text);
    const googleUrl = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodedText}&tl=ja&client=tw-ob`;

    currentAudio = new Audio(googleUrl);

    let hasPlayed = false;
    const fallbackTimer = setTimeout(() => {
        if (!hasPlayed) {
            console.warn("Google TTS 響應逾時，切換至原生語音備援");
            playNativeSpeech(text);
        }
    }, 1200);

    currentAudio.play()
        .then(() => {
            hasPlayed = true;
            clearTimeout(fallbackTimer);
        })
        .catch(err => {
            console.warn("Google TTS 播放受阻，切換至原生語音:", err);
            clearTimeout(fallbackTimer);
            if (!hasPlayed) playNativeSpeech(text);
        });
}

/**
 * 方案 B：系統原生語音 (SpeechSynthesis)
 */
function playNativeSpeech(text) {
    if (!window.speechSynthesis) return;

    // 每次播放前確保語音庫已載入
    if (!preferedVoice) loadVoices();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'ja-JP';
    if (preferedVoice) utterance.voice = preferedVoice;

    // 💡 關鍵修正：Safari 盡量保持 1.0，否則會破壞韻律導致機器人聲
    utterance.rate = isSafari ? 1.0 : 0.92;
    utterance.pitch = 1.0;

    // 解決部分 iOS 設備會吃字的 Bug，可以加入微小的延遲
    setTimeout(() => {
        window.speechSynthesis.speak(utterance);
    }, 50);
}

export function stopAudio() {
    if (currentAudio) {
        currentAudio.pause();
        currentAudio.src = '';
        currentAudio = null;
    }
    if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
    }
}
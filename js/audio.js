// 管理 Web Speech API 語音發音
let preferredVoice = null;

export function initVoices() {
    const voices = window.speechSynthesis.getVoices();
    const jpVoices = voices.filter(voice => voice.lang.includes('ja'));
    if (jpVoices.length > 0) {
        preferredVoice = jpVoices.find(voice => voice.name.includes('Natural')) ||
                         jpVoices.find(voice => voice.name.includes('Google')) ||
                         jpVoices.find(voice => voice.name.includes('Premium')) ||
                         jpVoices.find(voice => voice.name.includes('Kyoko')) ||
                         jpVoices.find(voice => voice.name.includes('Otoya')) ||
                         jpVoices[0];
    }
}

// 註冊語音載入完成的事件
window.speechSynthesis.onvoiceschanged = initVoices;

export function playAudio(text) {
    window.speechSynthesis.cancel();
    if (!text) return;
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "ja-JP"; 
    if (preferredVoice) utterance.voice = preferredVoice;
    utterance.rate = 0.85; 
    window.speechSynthesis.speak(utterance);
}

export function stopAudio() {
    window.speechSynthesis.cancel();
}

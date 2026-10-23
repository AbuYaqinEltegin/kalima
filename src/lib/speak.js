// Озвучка через Web Speech API. Арабский голос есть на Android, iOS и macOS;
// на Windows его нужно установить: Параметры → Время и язык → Речь.
const synth = typeof window !== 'undefined' ? window.speechSynthesis : undefined
let voice

const pickVoice = () => (voice = synth?.getVoices().find((v) => v.lang.startsWith('ar')))
synth?.addEventListener?.('voiceschanged', pickVoice)
pickVoice()

export function speak(text) {
  if (!synth) return
  synth.cancel()
  const u = new SpeechSynthesisUtterance(text)
  u.lang = voice?.lang ?? 'ar-SA'
  if (voice) u.voice = voice
  u.rate = 0.8
  synth.speak(u)
}

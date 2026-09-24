import { Dialect } from '../../types';

export class ArabicTTSProvider {
  private static isSpeaking = false;

  /**
   * Speaks Arabic text with dialect-appropriate speech synthesis parameters.
   */
  static speak(text: string, dialect: Dialect, onEnd?: () => void): void {
    if (typeof window === 'undefined') return;

    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      
      // Select Arabic locale
      switch (dialect) {
        case 'gulf':
          utterance.lang = 'ar-SA';
          utterance.rate = 1.0;
          utterance.pitch = 1.05;
          break;
        case 'iraqi':
          utterance.lang = 'ar-IQ';
          utterance.rate = 0.95;
          utterance.pitch = 0.95;
          break;
        case 'egyptian':
          utterance.lang = 'ar-EG';
          utterance.rate = 1.1;
          utterance.pitch = 1.1;
          break;
        case 'levantine':
          utterance.lang = 'ar-LB';
          utterance.rate = 1.0;
          utterance.pitch = 1.0;
          break;
        case 'modern_standard':
        default:
          utterance.lang = 'ar';
          utterance.rate = 0.9;
          utterance.pitch = 0.95;
          break;
      }

      // Try finding an Arabic voice installed in browser
      const voices = window.speechSynthesis.getVoices();
      const arabicVoice = voices.find((v) => v.lang.startsWith('ar'));
      if (arabicVoice) {
        utterance.voice = arabicVoice;
      }

      utterance.onend = () => {
        ArabicTTSProvider.isSpeaking = false;
        if (onEnd) onEnd();
      };

      utterance.onerror = () => {
        ArabicTTSProvider.isSpeaking = false;
        if (onEnd) onEnd();
      };

      ArabicTTSProvider.isSpeaking = true;
      window.speechSynthesis.speak(utterance);
    } else {
      console.warn('Speech synthesis not supported on this browser.');
      if (onEnd) onEnd();
    }
  }

  static stop(): void {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      ArabicTTSProvider.isSpeaking = false;
    }
  }

  static isCurrentlySpeaking(): boolean {
    return ArabicTTSProvider.isSpeaking;
  }
}

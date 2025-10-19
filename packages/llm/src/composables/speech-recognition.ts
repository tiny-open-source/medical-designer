import type { Ref } from 'vue';
import { onMounted, onUnmounted, readonly, ref } from 'vue';

interface SpeechRecognitionEvent {
  results: SpeechRecognitionResultList;
  resultIndex: number;
}

declare global {
  interface SpeechRecognitionErrorEvent extends Event {
    error: string;
  }
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

interface SpeechRecognition {
  lang: string;
  interimResults: boolean;
  continuous: boolean;
  maxAlternatives: number;
  grammars: any;
  onresult: (event: SpeechRecognitionEvent) => void;
  onerror: (event: Event) => void;
  onend: () => void;
  start: () => void;
  stop: () => void;
}

interface SpeechRecognitionProps {
  onEnd?: () => void;
  onResult?: (transcript: string) => void;
  onError?: (event: Event) => void;
  autoStop?: boolean;
  autoStopTimeout?: number;
  autoSubmit?: boolean;
}

interface ListenArgs {
  lang?: string;
  interimResults?: boolean;
  continuous?: boolean;
  maxAlternatives?: number;
  grammars?: any;
  autoStop?: boolean;
  autoStopTimeout?: number;
  autoSubmit?: boolean;
}

interface SpeechRecognitionHook {
  start: (args?: ListenArgs) => void;
  isListening: Readonly<Ref<boolean>>;
  stop: () => void;
  supported: Readonly<Ref<boolean>>;
  transcript: Readonly<Ref<string>>;
  resetTranscript: () => void;
}

export function useSpeechRecognition(props: SpeechRecognitionProps = {}): SpeechRecognitionHook {
  const {
    onEnd = () => {},
    onResult = () => {},
    onError = () => {},
    autoStop = false,
    autoStopTimeout = 5000,
    autoSubmit = false,
  } = props;

  const recognition = ref<SpeechRecognition | null>(null);
  const listening = ref<boolean>(false);
  const supported = ref<boolean>(false);
  const liveTranscript = ref<string>('');
  const silenceTimer = ref<NodeJS.Timeout | null>(null);
  const lastTranscriptRef = ref<string>('');

  onMounted(() => {
    if (typeof window === 'undefined')
      return;

    window.SpeechRecognition
      = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (window.SpeechRecognition) {
      supported.value = true;
      recognition.value = new window.SpeechRecognition();
    }
  });

  const resetTranscript = () => {
    liveTranscript.value = '';
    lastTranscriptRef.value = '';
  };
  const stop = () => {
    if (!listening.value || !supported.value)
      return;

    if (silenceTimer.value) {
      clearTimeout(silenceTimer.value);
      silenceTimer.value = null;
    }

    if (recognition.value) {
      recognition.value.onresult = () => {};
      recognition.value.onend = () => {};
      recognition.value.onerror = () => {};
      listening.value = false;
      recognition.value.stop();
    }
    onEnd();
  };
  const processResult = (
    event: SpeechRecognitionEvent,
    shouldAutoStop: boolean,
    shouldAutoSubmit: boolean,
  ) => {
    const transcript = Array.from(event.results)
      .map(result => result[0])
      .map(result => result.transcript)
      .join('');

    onResult(transcript);

    // Reset silence timer if transcript changed
    if (shouldAutoStop && transcript !== lastTranscriptRef.value) {
      lastTranscriptRef.value = transcript;

      if (silenceTimer.value) {
        clearTimeout(silenceTimer.value);
      }

      silenceTimer.value = setTimeout(() => {
        stop();
        if (shouldAutoSubmit) {
          // Submit the final transcript
          onResult(transcript);
        }
      }, autoStopTimeout);
    }
  };

  const handleError = (event: Event) => {
    if ((event as SpeechRecognitionErrorEvent).error === 'not-allowed') {
      if (recognition.value) {
        recognition.value.onend = () => {};
      }
      listening.value = false;
    }
    onError(event);
  };

  const listen = (args: ListenArgs = {}) => {
    if (listening.value || !supported.value)
      return;

    const {
      lang = '',
      interimResults = true,
      continuous = false,
      maxAlternatives = 1,
      grammars,
      autoStop: argAutoStop = autoStop,
      autoSubmit: argAutoSubmit = autoSubmit,
    } = args;

    listening.value = true;
    liveTranscript.value = '';
    lastTranscriptRef.value = '';

    if (recognition.value) {
      recognition.value.lang = lang;
      recognition.value.interimResults = interimResults;
      recognition.value.onresult = (event) => {
        processResult(event, argAutoStop, argAutoSubmit);
        const transcript = Array.from(event.results)
          .map(result => result[0])
          .map(result => result.transcript)
          .join('');
        liveTranscript.value = transcript;
      };
      recognition.value.onerror = handleError;
      recognition.value.continuous = continuous;
      recognition.value.maxAlternatives = maxAlternatives;

      if (grammars) {
        recognition.value.grammars = grammars;
      }
      recognition.value.onend = () => {
        if (recognition.value && !argAutoStop) {
          recognition.value.start();
        }
        else {
          onEnd();
        }
      };
      if (recognition.value) {
        recognition.value.start();
      }
    }
  };

  // Clean up timer on unmount
  onUnmounted(() => {
    if (silenceTimer.value) {
      clearTimeout(silenceTimer.value);
    }
  });

  return {
    start: listen,
    isListening: readonly(listening),
    stop,
    supported: readonly(supported),
    transcript: readonly(liveTranscript),
    resetTranscript,
  };
}

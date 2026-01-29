import { create } from "zustand";
import { Howl } from "howler";

interface HowlerState {
  currentSound: {
    handle: Howl;
    url: string;
    onEnd: (() => void) | null;
  } | null;
  volume: number;
  setVolume: (v: number) => void;
  playSound: (url: string, onEnd?: () => void) => void;
  stopSound: () => void;
}

export const useHowlerStore = create<HowlerState>((set, get) => ({
  currentSound: null,
  volume: 1,

  setVolume: (v) => {
    Howler.volume(v);
    set({ volume: v });
  },

  playSound: (url: string, onEnd?: () => void) => {
    const { currentSound } = get();

    // 기존 사운드가 있으면 stop + 기존 onEnd 호출
    if (currentSound) {
      currentSound.handle.stop();
      if (currentSound.url !== url) {
        currentSound.onEnd?.();
      }
      set({ currentSound: null });
    }

    const sound = new Howl({
      src: [url],
      html5: true,
      onend: () => {
        // 현재 sound가 동일할 때만 null 처리
        if (get().currentSound?.url === url) {
          set({ currentSound: null });
        }
        if (onEnd) onEnd();
      },
    });

    sound.play();
    set({
      currentSound: {
        handle: sound,
        onEnd: onEnd ?? null,
        url,
      },
    });
  },
  stopSound: () => {
    const { currentSound } = get();
    if (currentSound) {
      currentSound.handle?.stop();
      currentSound.onEnd?.();
      set({ currentSound: null });
    }
  },
}));

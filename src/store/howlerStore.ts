import { create } from "zustand";
import { Howl } from "howler";

interface HowlerState {
  currentSound: Howl | null;
  playSound: (url: string, onEnd?: () => void) => void;
  stopSound: () => void;
}

export const useHowlerStore = create<HowlerState>((set, get) => ({
  currentSound: null,
  playSound: (url: string, onEnd?: () => void) => {
    const { currentSound } = get();

    // 기존 사운드가 있으면 stop + 기존 onEnd 호출
    if (currentSound) {
      const previousOnEnd = (currentSound as any)._onendCallback; // 저장해둔 콜백 호출
      currentSound.stop();
      if (previousOnEnd) previousOnEnd();
      set({ currentSound: null });
    }

    const sound = new Howl({
      src: [url],
      html5: true,
      onend: () => {
        // 현재 sound가 동일할 때만 null 처리
        if (get().currentSound === sound) {
          set({ currentSound: null });
        }
        if (onEnd) onEnd();
      },
    });

    // onEnd 콜백을 sound에 안전하게 저장
    (sound as any)._onendCallback = onEnd;

    sound.play();
    set({ currentSound: sound });
  },
  stopSound: () => {
    const { currentSound } = get();
    if (currentSound) {
      const previousOnEnd = (currentSound as any)._onendCallback;
      currentSound.stop();
      if (previousOnEnd) previousOnEnd();
      set({ currentSound: null });
    }
  },
}));

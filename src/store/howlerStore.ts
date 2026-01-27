import { create } from "zustand";
import { Howl } from "howler";

interface HowlerState {
  currentSound: Howl | null;
  playSound: (url: string) => void;
}

export const useHowlerStore = create<HowlerState>((set, get) => ({
  currentSound: null,
  playSound: (url: string) => {
    const { currentSound } = get();

    if (currentSound && currentSound.playing()) {
      currentSound.stop();
    }

    const sound = new Howl({
      src: [url],
      html5: true,
      onend: () => set({ currentSound: null }),
    });

    sound.play();
    set({ currentSound: sound });
  },
}));


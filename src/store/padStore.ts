import { create } from "zustand";
import {
  persist,
  createJSONStorage,
  type StateStorage,
} from "zustand/middleware";
import {
  get as idbGet,
  set as idbSet,
  del as idbDel,
  createStore,
} from "idb-keyval";
import type { Pad } from "../types/pad";

import { v4 as uuidv4 } from "uuid";

const generateId = () => uuidv4();

interface PadState {
  pads: Pad[];
  addPad: (pad: Omit<Pad, "id">) => void;
  removePad: (id: string) => void;
  updatePad: (id: string, newPad: Partial<Pad>) => void;
  reorderPads: (newPads: Pad[]) => void;
  loadAudioFiles: () => Promise<void>;
}

// Store for persisted JSON (pads list)
const customStore = createStore("pad-db", "pad-store");

const idbStorage: StateStorage = {
  getItem: async (name: string): Promise<string | null> => {
    console.log(name, "has been retrieved");
    return (await idbGet(name, customStore)) || null;
  },
  setItem: async (name: string, value: string): Promise<void> => {
    console.log(name, "has been saved");
    await idbSet(name, value, customStore);
  },
  removeItem: async (name: string): Promise<void> => {
    console.log(name, "has been deleted");
    await idbDel(name, customStore);
  },
};

// Separate store for raw audio blobs (use a different DB to avoid schema mismatch)
const audioStore = createStore("pad-audio-db", "pad-audio");

const buildAudioKey = (padId: string): string => `audio-${padId}`;

const saveAudioFile = async (padId: string, file: Blob): Promise<void> => {
  const key = buildAudioKey(padId);
  await idbSet(key, file, audioStore);
};

export const usePadStore = create<PadState>()(
  persist(
    (set, get) => ({
      pads: [],
      addPad: (pad) => {
        const id = generateId();
        const hasFile = Boolean(pad.audioFile);
        const localAudioId = hasFile ? buildAudioKey(id) : undefined;

        if (pad.audioFile && localAudioId) {
          // Fire and forget: actual blob persistence in IndexedDB
          void saveAudioFile(id, pad.audioFile);
        }

        set((state) => ({
          pads: [
            ...state.pads,
            {
              ...pad,
              id,
              localAudioId,
            },
          ],
        }));
      },
      removePad: (id) => {
        const currentPads = get().pads;
        const padToRemove = currentPads.find((pad) => pad.id === id);
        if (padToRemove?.localAudioId) {
          // Fire and forget: delete associated audio blob from IndexedDB
          void idbDel(padToRemove.localAudioId, audioStore);
        }

        set({
          pads: currentPads.filter((pad) => pad.id !== id),
        });
      },
      updatePad: (id, newPad) => {
        const hasFile = Boolean(newPad.audioFile);
        const localAudioId = hasFile ? buildAudioKey(id) : undefined;

        if (newPad.audioFile && localAudioId) {
          void saveAudioFile(id, newPad.audioFile);
        }

        set((state) => ({
          pads: state.pads.map((pad) =>
            pad.id === id
              ? {
                  ...pad,
                  ...newPad,
                  localAudioId: localAudioId ?? pad.localAudioId,
                }
              : pad
          ),
        }));
      },
      reorderPads: (newPads) => set({ pads: newPads }),
      loadAudioFiles: async () => {
        const currentPads = get().pads;
        const updatedPads = await Promise.all(
          currentPads.map(async (pad) => {
            if (!pad.localAudioId) {
              return pad;
            }

            const blob = await idbGet(pad.localAudioId, audioStore);
            if (!blob) {
              return pad;
            }

            return {
              ...pad,
              audioFile: blob as Blob,
            };
          })
        );

        set({ pads: updatedPads });
      },
    }),
    {
      name: "pad-storage",
      storage: createJSONStorage(() => idbStorage),
      // Blob은 JSON으로 직렬화할 수 없으므로 저장 대상에서 제외
      partialize: (state) => ({
        pads: state.pads.map(
          ({ audioFile: _audioFile, ...rest }): Pad => ({
            ...rest,
          })
        ),
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          void state.loadAudioFiles();
        }
      },
    }
  )
);


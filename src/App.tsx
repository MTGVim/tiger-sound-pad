import { useEffect, useState } from "react";
import { usePadStore } from "./store/padStore";
import { PadGrid } from "./components/PadGrid";
import { AddPadModal } from "./components/AddPadModal";
import type { Pad } from "./types/pad";
import { useHowlerStore } from "./store/howlerStore";

export default function App() {
  const pads = usePadStore((state) => state.pads);
  const addPad = usePadStore((state) => state.addPad);
  const reorderPads = usePadStore((state) => state.reorderPads);
  const loadAudioFiles = usePadStore((state) => state.loadAudioFiles);
  const removePad = usePadStore((state) => state.removePad);
  const stopSound = useHowlerStore((state) => state.stopSound);

  const [showAddPadModal, setShowAddPadModal] = useState(false);
  const [isDeleteMode, setIsDeleteMode] = useState(false);
  const [isReorderMode, setIsReorderMode] = useState(false);

  const handleAddPad = (label: string, audioUrl?: string, audioFile?: Blob) => {
    addPad({ label, audioUrl, audioFile });
    setShowAddPadModal(false);
  };

  useEffect(() => {
    // Load audio blobs for pads that reference local files
    void loadAudioFiles();
  }, [loadAudioFiles]);

  useEffect(() => {
    const stopOnBackground = () => {
      if (document.visibilityState === "hidden") {
        stopSound();
      }
    };

    const stopOnPageHide = () => stopSound();

    document.addEventListener("visibilitychange", stopOnBackground);
    window.addEventListener("pagehide", stopOnPageHide);

    return () => {
      document.removeEventListener("visibilitychange", stopOnBackground);
      window.removeEventListener("pagehide", stopOnPageHide);
    };
  }, [stopSound]);

  const handleReorder = (newPads: Pad[]) => {
    reorderPads(newPads);
  };

  const handleRemovePad = (id: string) => {
    removePad(id);
  };

  const handleToggleDeleteMode = () => {
    setIsDeleteMode((prev) => !prev);
    setIsReorderMode(false);
  };

  const handleToggleReorderMode = () => {
    setIsReorderMode((prev) => !prev);
    setIsDeleteMode(false);
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between bg-gray-900 text-white">
      <PadGrid
        pads={pads}
        onReorderPads={handleReorder}
        onRemovePad={handleRemovePad}
        isDeleteMode={isDeleteMode}
        onToggleDeleteMode={handleToggleDeleteMode}
        isReorderMode={isReorderMode}
        onToggleReorderMode={handleToggleReorderMode}
      />

      <div
        className="sticky bottom-0 z-30 w-full flex items-center justify-center
            bg-linear-to-t from-gray-800/80 to-from-gray-800/0"
      >
        <button
          onClick={() => setShowAddPadModal(true)}
          className="p-2 mb-8 m-4 bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
        >
          버튼 추가
        </button>

        {showAddPadModal && (
          <AddPadModal
            onClose={() => setShowAddPadModal(false)}
            onAddPad={handleAddPad}
          />
        )}
      </div>
    </main>
  );
}

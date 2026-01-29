import { useEffect, useState } from "react";
import { usePadStore } from "./store/padStore";
import { PadGrid } from "./components/PadGrid";
import { AddPadModal } from "./components/AddPadModal";
import type { Pad } from "./types/pad";

export default function App() {
  const pads = usePadStore((state) => state.pads);
  const addPad = usePadStore((state) => state.addPad);
  const reorderPads = usePadStore((state) => state.reorderPads);
  const loadAudioFiles = usePadStore((state) => state.loadAudioFiles);
  const removePad = usePadStore((state) => state.removePad);

  const [showAddPadModal, setShowAddPadModal] = useState(false);
  const [isDeleteMode, setIsDeleteMode] = useState(false);
  const [isReorderMode, setIsReorderMode] = useState(false);

  const handleAddPad = (label: string, audioUrl?: string, audioFile?: Blob) => {
    addPad({ label, audioUrl, audioFile, width: 100, height: 100 });
    setShowAddPadModal(false);
  };

  useEffect(() => {
    // Load audio blobs for pads that reference local files
    void loadAudioFiles();
  }, [loadAudioFiles]);

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
      <button
        onClick={() => setShowAddPadModal(true)}
        className="sticky bottom-4 mt-8 p-2 m-4 bg-blue-600 rounded-md hover:bg-blue-700 transition-colors z-30"
      >
        Add New Pad
      </button>

      {showAddPadModal && (
        <AddPadModal
          onClose={() => setShowAddPadModal(false)}
          onAddPad={handleAddPad}
        />
      )}
    </main>
  );
}

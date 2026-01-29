import React, { useState } from "react";

interface AddPadModalProps {
  onClose: () => void;
  onAddPad: (label: string, audioUrl?: string, audioFile?: Blob) => void;
}

export const AddPadModal: React.FC<AddPadModalProps> = ({
  onClose,
  onAddPad,
}) => {
  const [label, setLabel] = useState("");
  const [audioUrl, setAudioUrl] = useState("");
  const [audioFile, setAudioFile] = useState<File | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (label && (audioUrl || audioFile)) {
      onAddPad(label, audioUrl || undefined, audioFile || undefined);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setAudioFile(file);
      setAudioUrl("");
      setLabel(file.name ?? "");
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-bold mb-4">Add New Sound Pad</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="label"
              className="block text-sm font-medium text-gray-300"
            >
              Label
            </label>
            <input
              type="text"
              id="label"
              className="mt-1 block w-full p-2 bg-gray-700 border border-gray-600 rounded-md text-white"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="audioUrl"
              className="block text-sm font-medium text-gray-300"
            >
              Audio URL
            </label>
            <input
              type="url"
              id="audioUrl"
              className="mt-1 block w-full p-2 bg-gray-700 border border-gray-600 rounded-md text-white"
              value={audioUrl}
              onChange={(e) => {
                setAudioUrl(e.target.value);
                setAudioFile(null);
              }}
              required={!audioFile}
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="audioFile"
              className="block text-sm font-medium text-gray-300"
            >
              Or Upload Audio File
            </label>
            <input
              type="file"
              id="audioFile"
              accept="audio/*"
              className="mt-1 block w-full p-2 bg-gray-700 border border-gray-600 rounded-md text-white"
              onChange={handleFileChange}
              required={!audioUrl}
            />
          </div>
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-600 rounded-md hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
            >
              Add Pad
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};


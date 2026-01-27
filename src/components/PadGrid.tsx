import React from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  horizontalListSortingStrategy,
} from "@dnd-kit/sortable";
import type { Pad as PadType } from "../types/pad";
import { SortablePad } from "./SortablePad";

interface PadGridProps {
  pads: PadType[];
  onReorderPads: (newPads: PadType[]) => void;
  onRemovePad: (id: string) => void;
  isDeleteMode: boolean;
  onToggleDeleteMode: () => void;
}

interface TrashButtonProps {
  isActive: boolean;
  onToggle: () => void;
}

const TrashButton: React.FC<TrashButtonProps> = ({ isActive, onToggle }) => {
  const baseClasses =
    "fixed top-4 right-4 z-20 flex items-center justify-center w-12 h-12 rounded-full shadow-lg border border-gray-500 cursor-pointer transition-colors";
  const colorClasses = isActive ? " bg-red-600" : " bg-gray-800";

  return (
    <button
      type="button"
      onClick={onToggle}
      className={baseClasses + colorClasses}
      aria-pressed={isActive}
      aria-label="Delete pads"
      title={isActive ? "삭제 모드 해제" : "삭제 모드 활성화"}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="w-6 h-6 text-white"
      >
        <path d="M3 6h18" />
        <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
        <path d="M10 11v6" />
        <path d="M14 11v6" />
        <path d="M5 6l1 14a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2l1-14" />
      </svg>
    </button>
  );
};

export const PadGrid: React.FC<PadGridProps> = ({
  pads,
  onReorderPads,
  onRemovePad,
  isDeleteMode,
  onToggleDeleteMode,
}) => {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) {
      return;
    }

    if (active.id !== over.id) {
      const oldIndex = pads.findIndex((pad) => pad.id === active.id);
      const newIndex = pads.findIndex((pad) => pad.id === over.id);

      const newPads = arrayMove(pads, oldIndex, newIndex);
      onReorderPads(newPads);
    }
  };

  const arrayMove = <T,>(array: T[], from: number, to: number) => {
    const newArray = [...array];
    const [movedItem] = newArray.splice(from, 1);
    newArray.splice(to, 0, movedItem);
    return newArray;
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <TrashButton isActive={isDeleteMode} onToggle={onToggleDeleteMode} />
      <div className="flex flex-wrap gap-4 p-4">
        <SortableContext
          items={pads.map((pad) => pad.id)}
          strategy={horizontalListSortingStrategy}
        >
          {pads.map((pad) => (
            <SortablePad
              key={pad.id}
              pad={pad}
              isDeleteMode={isDeleteMode}
              onDeletePad={onRemovePad}
            />
          ))}
        </SortableContext>
      </div>
    </DndContext>
  );
};


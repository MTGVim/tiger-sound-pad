import React, { PropsWithChildren } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  TouchSensor,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  horizontalListSortingStrategy,
  rectSortingStrategy,
} from "@dnd-kit/sortable";
import type { Pad as PadType } from "../types/pad";
import { SortablePad } from "./SortablePad";
import { TopMenu } from "./TopMenu";

interface PadGridProps {
  pads: PadType[];
  onReorderPads: (newPads: PadType[]) => void;
  onRemovePad: (id: string) => void;
  isDeleteMode: boolean;
  onToggleDeleteMode: () => void;
  isReorderMode: boolean;
  onToggleReorderMode: () => void;
}

export const PadGrid: React.FC<PadGridProps> = ({
  pads,
  onReorderPads,
  onRemovePad,
  isDeleteMode,
  onToggleDeleteMode,
  isReorderMode,
  onToggleReorderMode,
}) => {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 150,
        tolerance: 5,
        allowTouchMove: true, // 터치 스크롤 허용
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
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
      <TopMenu
        isDeleteMode={isDeleteMode}
        isReorderMode={isReorderMode}
        onToggleDeleteMode={onToggleDeleteMode}
        onToggleReorderMode={onToggleReorderMode}
      />
      <div className="grid grid-cols-4 gap-6 py-4 px-8 items-center justify-center">
        <SortableContext
          items={pads.map((pad) => pad.id)}
          strategy={rectSortingStrategy}
        >
          {pads.map((pad) => (
            <SortablePad
              key={pad.id}
              pad={pad}
              isDeleteMode={isDeleteMode}
              isReorderMode={isReorderMode}
              onDeletePad={onRemovePad}
            />
          ))}
        </SortableContext>
      </div>
    </DndContext>
  );
};

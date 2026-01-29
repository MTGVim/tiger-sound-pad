import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { Pad as PadType } from "../types/pad";
import { Pad } from "./Pad";

interface SortablePadProps {
  pad: PadType;
  isDeleteMode: boolean;
  isReorderMode: boolean;
  onDeletePad: (id: string) => void;
}

export const SortablePad: React.FC<SortablePadProps> = ({
  pad,
  isDeleteMode,
  isReorderMode,
  onDeletePad,
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({
    id: pad.id,
    disabled: !isReorderMode, // 정렬 모드 아닐 땐 드래그 비활성화
  });

  return (
    <div
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        position: "relative",
        touchAction: "none", // ⭐ 모바일 핵심
      }}
      {...attributes}
      {...listeners}   // ⭐ div 전체가 drag target
    >
      <Pad
        pad={pad}
        isDeleteMode={isDeleteMode}
        onDeletePad={onDeletePad}
        isReorderMode={isReorderMode}
      />
    </div>
  );
};

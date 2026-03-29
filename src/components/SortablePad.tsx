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
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({
      id: pad.id,
      disabled: !isReorderMode, // 정렬 모드 아닐 땐 드래그 비활성화
    });

  return (
    <div
      ref={setNodeRef}
      data-testid="sortable-pad"
      data-pad-id={pad.id}
      data-pad-label={pad.label ?? ""}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        position: "relative",
        // ⭐ 모바일 핵심
        touchAction: isReorderMode ? "none" : "auto", // ✅ 변경
      }}
      {...attributes}
      {...listeners} // ⭐ div 전체가 drag target
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

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
    useSortable({ id: pad.id });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    position: "relative"
  };

  return (
    <div ref={setNodeRef} style={style}>
      <Pad pad={pad}
        isDeleteMode={isDeleteMode}
        onDeletePad={onDeletePad}
        isReorderMode={isReorderMode}
      />
      {isReorderMode && <div className="absolute top-2 left-2 cursor-pointer"><span {...attributes} {...listeners}>☰</span></div>}
    </div>
  );
};


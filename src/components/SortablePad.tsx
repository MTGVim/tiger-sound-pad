import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { Pad as PadType } from "../types/pad";
import { Pad } from "./Pad";

interface SortablePadProps {
  pad: PadType;
  isDeleteMode: boolean;
  onDeletePad: (id: string) => void;
}

export const SortablePad: React.FC<SortablePadProps> = ({
  pad,
  isDeleteMode,
  onDeletePad,
}) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: pad.id, disabled: isDeleteMode });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <Pad pad={pad} isDeleteMode={isDeleteMode} onDeletePad={onDeletePad} />
    </div>
  );
};


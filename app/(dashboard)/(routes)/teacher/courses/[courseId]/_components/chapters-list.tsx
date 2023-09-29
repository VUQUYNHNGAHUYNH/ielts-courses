"use client";

import { Chapter } from "@prisma/client";
import { useEffect, useState } from "react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";
import { FileEdit, TableProperties } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface ChaptersListProps {
  items: Chapter[];
  onReorder: (updateData: { id: string; position: number }[]) => void;
  onEdit: (id: string) => void;
}

const ChaptersList = ({ items, onReorder, onEdit }: ChaptersListProps) => {
  const [isMounted, setIsMounted] = useState(false);
  const [chapters, setChapters] = useState(items);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    setChapters(items);
  }, [items]);

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const items = Array.from(chapters);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    const startIndex = Math.min(result.source.index, result.destination.index);
    const endIndex = Math.max(result.source.index, result.destination.index);

    const updatedChapters = items.slice(startIndex, endIndex + 1);

    setChapters(items);

    const bulkUpdateData = updatedChapters.map((chapter) => ({
      id: chapter.id,
      position: items.findIndex((item) => item.id === chapter.id),
    }));

    onReorder(bulkUpdateData);
  };

  if (!isMounted) {
    return null;
  }

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="chapters">
        {(provided) => (
          <div {...provided.droppableProps} ref={provided.innerRef}>
            {chapters.map((chapter, index) => (
              <Draggable
                key={chapter.id}
                draggableId={chapter.id}
                index={index}
              >
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    className={` flex items-center gap-x-2 bg-slate-50 border border-slate-200
                     text-slate-700 rounded-md mb-4 px-2 py-2 ${
                       chapter.isPublished &&
                       "bg-sky-100 border-sky-200 text-primary"
                     }`}
                  >
                    <TableProperties className="h-4 w-4" />
                    <div className="capitalize"> {chapter.title}</div>
                    <div className="ml-auto pr-2 flex items-center gap-x-2">
                      {chapter.isFree && (
                        <Badge
                          variant="outline"
                          className="bg-slate-500 text-white"
                        >
                          Free
                        </Badge>
                      )}
                      <Badge
                        variant="outline"
                        className={cn(
                          "bg-yellow-500 text-white",
                          chapter.isPublished && "bg-blue"
                        )}
                      >
                        {chapter.isPublished ? "Publish" : "Draft"}
                      </Badge>
                      <FileEdit
                        onClick={() => onEdit(chapter.id)}
                        className="w-5 h-5 cursor-pointer hover:opacity-80 transition"
                      />
                    </div>
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};

export default ChaptersList;

"use client";

import * as z from "zod";
import MuxPlayer from "@mux/mux-player-react";
import axios from "axios";
import { FileEdit, PlaySquare, VideoIcon } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Chapter, MuxData } from "@prisma/client";
import { FileUpload } from "@/components/file-upload";
import { Button } from "@/components/ui/button";

interface ChapterVideoProps {
  initialData: Chapter & { muxData?: MuxData | null };
  courseId: string;
  chapterId: string;
}

const formSchema = z.object({
  videoUrl: z.string().min(1),
});

const ChapterVideo = ({
  initialData,
  courseId,
  chapterId,
}: ChapterVideoProps) => {
  const [isEditing, setIsEditing] = useState(false);

  const toggleEdit = () => setIsEditing((current) => !current);

  const router = useRouter();

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.patch(
        `/api/courses/${courseId}/chapters/${chapterId}`,
        values
      );
      toast.success("video updated");
      toggleEdit();
      router.refresh();
    } catch {
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="mt-2 border rounded-md p-4">
      {/* title */}
      <div className="font-medium flex items-center justify-between">
        Chapter video
        <Button onClick={toggleEdit} variant="ghost" size="sm">
          {isEditing && <>Cancel</>}

          {!isEditing && !initialData.videoUrl && (
            <>
              <PlaySquare className="h-4 w-4 mr-1" /> Add
            </>
          )}

          {!isEditing && initialData.videoUrl && (
            <>
              <FileEdit className="h-4 w-4 mr-1" />
              Edit
            </>
          )}
        </Button>
      </div>

      {/* image */}
      {!isEditing &&
        (!initialData.videoUrl ? (
          <div className="flex items-center justify-center h-60 mt-4 bg-slate-100 rounded-md">
            <VideoIcon className="h-10 w-10 text-slate-500" />
          </div>
        ) : (
          <div className="relative aspect-video mt-4">
            <MuxPlayer playbackId={initialData?.muxData?.playbackId || ""} />
          </div>
        ))}

      {/*upload  */}

      {isEditing && (
        <div>
          <FileUpload
            endpoint="chapterVideo"
            onChange={(url) => {
              if (url) {
                onSubmit({ videoUrl: url });
              }
            }}
          />
          {initialData.videoUrl && !isEditing && (
            <div className="text-xs text-muted-foreground mt-2">
              Videos can take a few minutes to process. Refresh the page if
              video does not appear.
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ChapterVideo;

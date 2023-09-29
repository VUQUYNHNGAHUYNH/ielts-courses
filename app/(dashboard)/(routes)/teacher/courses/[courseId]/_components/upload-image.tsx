"use client";

import * as z from "zod";
import axios from "axios";
import { ImageIcon, FileEdit, ImagePlus } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Course } from "@prisma/client";
import Image from "next/image";
import { FileUpload } from "@/components/file-upload";
import { Button } from "@/components/ui/button";

interface ImageFormProps {
  initialData: Course;
  courseId: string;
}

const formSchema = z.object({
  imageUrl: z.string().min(1, {
    message: "Image is required",
  }),
});

const ImageForm = ({ initialData, courseId }: ImageFormProps) => {
  const [isEditing, setIsEditing] = useState(false);

  const toggleEdit = () => setIsEditing((current) => !current);

  const router = useRouter();

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.patch(`/api/courses/${courseId}`, values);
      toast.success("Image updated");
      toggleEdit();
      router.refresh();
    } catch {
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="mt-6 border rounded-md p-4">
      {/* title */}
      <div className="font-medium flex items-center justify-between">
        Image
        <Button onClick={toggleEdit} variant="ghost">
          {isEditing && <>Cancel</>}

          {!isEditing && !initialData.imageUrl && (
            <>
              <ImagePlus className="h-4 w-4 mr-1" /> Add
            </>
          )}

          {!isEditing && initialData.imageUrl && (
            <>
              <FileEdit className="h-4 w-4 mr-1" />
              Edit
            </>
          )}
        </Button>
      </div>

      {/* image */}
      {!isEditing &&
        (!initialData.imageUrl ? (
          <div className="flex items-center justify-center h-60 mt-4 bg-slate-200 rounded-md">
            <ImageIcon className="h-10 w-10 text-slate-500" />
          </div>
        ) : (
          <div className="relative aspect-video mt-4">
            <Image
              alt="Upload"
              fill
              className="object-contain rounded-md"
              src={initialData.imageUrl}
            />
          </div>
        ))}

      {/*upload  */}
      {isEditing && (
        <div>
          <FileUpload
            endpoint="courseImage"
            onChange={(url) => {
              if (url) {
                onSubmit({ imageUrl: url });
              }
            }}
          />
        </div>
      )}
    </div>
  );
};

export default ImageForm;

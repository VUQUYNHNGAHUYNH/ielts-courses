import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import Link from "next/link";
import {
  ArrowBigLeftDash,
  CheckCircle,
  EyeIcon,
  ListChecks,
  ShieldAlert,
  VideoIcon,
} from "lucide-react";

import { db } from "@/lib/db";
import ChapterTitle from "./_components/chapter-title";
import ChapterDescription from "./_components/chapter-desc";
import ChapterAcess from "./_components/chapter-access";
import ChapterVideo from "./_components/chapter-video";
import ChapterAction from "./_components/chapter-actions";

const ChapterIdPage = async ({
  params,
}: {
  params: { courseId: string; chapterId: string };
}) => {
  const { userId } = auth();

  if (!userId) {
    return redirect("/");
  }

  const chapter = await db.chapter.findUnique({
    where: {
      id: params.chapterId,
      courseId: params.courseId,
    },
    include: {
      muxData: true,
    },
  });

  if (!chapter) {
    return redirect("/");
  }

  const requiredFields = [chapter.title, chapter.description, chapter.videoUrl];

  const totalFields = requiredFields.length;
  const completedFields = requiredFields.filter(Boolean).length;

  const completionText = `(${completedFields}/${totalFields})`;

  const isComplete = requiredFields.every(Boolean);

  return (
    <>
      {/* banner for publish */}
      {!chapter.isPublished ? (
        <div className="p-2 text-sm  gap-x-2 flex items-center justify-center mx-auto w-full sticky bg-yellow-100">
          <ShieldAlert />
          This chapter is unpublished. It will not be visible in the course
        </div>
      ) : (
        <div className="p-2 text-sm gap-x-2 flex items-center justify-center mx-auto w-full bottom-8 sticky bg-sky-200">
          <CheckCircle />
          This chapter is published. It will be visible in the course
        </div>
      )}
      {/* chapter creation */}
      <div className="p-6">
        <div className="flex flex-col items-start justify-center space-y-8 w-full">
          <div className="flex items-center justify-between mx-auto w-[90%]">
            <div>
              <Link
                href={`/teacher/courses/${params.courseId}`}
                className="flex items-center text-slate-500 text-sm hover:text-slate-800 transition"
              >
                <ArrowBigLeftDash className="h-5 w-5 mr-1" />
                Back to course setup
              </Link>
              <h1 className="text-2xl font-semibold text-primary mt-2">
                Chapter Creation
              </h1>
              <span className="text-sm text-blue font-medium">
                Complete all fields {completionText}
              </span>
            </div>
            <div>
              <ChapterAction
                disabled={!isComplete}
                courseId={params.courseId}
                chapterId={params.chapterId}
                isPublished={chapter.isPublished}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 w-[90%] mx-auto lg:grid-cols-2 space-y-10 lg:space-y-0 lg:space-x-16">
            <div className="space-y-6">
              {/* title */}
              <div className="flex items-center gap-x-2">
                <ListChecks />
                <h2 className="text-xl font-medium">Customize your chapter</h2>
              </div>
              {/* name and desc */}
              <ChapterTitle
                initialData={chapter}
                courseId={params.courseId}
                chapterId={params.chapterId}
              />

              <ChapterDescription
                initialData={chapter}
                courseId={params.courseId}
                chapterId={params.chapterId}
              />
              {/* access setting */}
              <div>
                <div className="flex items-center gap-x-2">
                  <EyeIcon />
                  <h2 className="text-xl font-medium">Access settings</h2>
                </div>
                <ChapterAcess
                  initialData={chapter}
                  courseId={params.courseId}
                  chapterId={params.chapterId}
                />
              </div>
            </div>

            {/* video */}
            <div className="space-y-6">
              <div className="flex items-center gap-x-2">
                <VideoIcon />
                <h2 className="text-xl font-medium">Add a video</h2>
              </div>
              <ChapterVideo
                initialData={chapter}
                courseId={params.courseId}
                chapterId={params.chapterId}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ChapterIdPage;

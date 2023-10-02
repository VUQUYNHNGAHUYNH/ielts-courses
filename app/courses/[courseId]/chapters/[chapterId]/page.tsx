import { getChapter } from "@/actions/get-chapters";
import { Preview } from "@/components/preview";
import { auth } from "@clerk/nextjs";
import { CheckCircle, File } from "lucide-react";
import { redirect } from "next/navigation";
import { toast } from "react-hot-toast";
import { CourseEnrollButton } from "./_components/enroll-button";
import CourseProgressButton from "./_components/progress-button";
import { VideoPlayer } from "./_components/video-player";

const ChapterIdPage = async ({
  params,
}: {
  params: { courseId: string; chapterId: string };
}) => {
  const { userId } = auth();

  if (!userId) {
    return redirect("/");
  }

  const {
    chapter,
    course,
    muxData,
    attachments,
    nextChapter,
    userProgress,
    purchase,
  } = await getChapter({
    userId,
    chapterId: params.chapterId,
    courseId: params.courseId,
  });

  if (!chapter || !course) {
    return redirect("/");
  }

  const isLocked = !chapter.isFree && !purchase;
  const completeOnEnd = Boolean(purchase) && !userProgress?.isCompleted;

  return (
    <div>
      {userProgress?.isCompleted && (
        <div className="p-2 text-sm gap-x-2 flex items-center justify-center mx-auto w-full sticky bg-emerald-200">
          <CheckCircle />
          {chapter.title} completed!
        </div>
      )}

      {isLocked && toast.error("You need to purchase this chapter")}

      <div className="flex flex-col mx-auto max-x-4xl gap-y-2">
        <div className="p-4">
          <VideoPlayer
            chapterId={params.chapterId}
            title={chapter.title}
            courseId={params.courseId}
            nextChapterId={nextChapter?.id}
            playbackId={muxData?.playbackId!}
            isLocked={isLocked}
            completeOnEnd={completeOnEnd}
          />
        </div>
        <div className="p-4 flex flex-col items-center justify-between md:flex-row gap-y-4 ">
          <div className="text-2xl capitalize">{chapter.title}</div>
          {purchase ? (
            <CourseProgressButton
              chapterId={params.chapterId}
              courseId={params.courseId}
              nextChapterId={nextChapter?.id}
              isCompleted={!!userProgress?.isCompleted}
            />
          ) : (
            <CourseEnrollButton
              courseId={params.courseId}
              price={course.price!}
            />
          )}
        </div>
        <div>
          <Preview value={chapter.description!} />
        </div>
        {!!attachments.length && (
          <>
            <div className="p-4">
              {attachments.map((attachment) => (
                <a
                  href={attachment.url}
                  target="_blank"
                  key={attachment.id}
                  className="flex items-center p-3 w-full bg-sky-200 border text-sky-700 rounded-md hover:underline"
                >
                  <File />
                  <p className="line-clamp-1">{attachment.name}</p>
                </a>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ChapterIdPage;

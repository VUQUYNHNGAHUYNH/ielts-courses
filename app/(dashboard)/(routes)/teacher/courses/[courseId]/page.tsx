import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { ListChecks, Receipt, ScrollText, ShieldAlert } from "lucide-react";
import TitleForm from "./_components/title-form";
import DescriptionForm from "./_components/description-form";
import ImageForm from "./_components/upload-image";
import CategoryForm from "./_components/category-form";
import ChaptersForm from "./_components/chapters-form";
import PriceForm from "./_components/price-form";
import AttachmentForm from "./_components/attachment-form";
import Actions from "./_components/actions";

const CourseIdPage = async ({ params }: { params: { courseId: string } }) => {
  const { userId } = auth();

  if (!userId) {
    return redirect("/");
  }

  const course = await db.course.findUnique({
    where: { id: params.courseId, userId },
    include: {
      attachments: {
        orderBy: {
          createdAt: "desc",
        },
      },
      chapters: {
        orderBy: {
          position: "asc",
        },
      },
    },
  });

  const categories = await db.category.findMany({
    orderBy: {
      name: "asc",
    },
  });

  if (!course) {
    return redirect("/");
  }

  const requiredFields = [
    course.title,
    course.description,
    course.imageUrl,
    course.price,
    course.categoryId,
    course.chapters.some((chapter) => chapter.isPublished),
  ];

  const totalFields = requiredFields.length;
  const completedFields = requiredFields.filter(Boolean).length;

  const completionText = `(${completedFields}/${totalFields})`;

  const isComplete = requiredFields.every(Boolean);

  return (
    <div className="p-6">
      {/* banner for publish */}
      {!course.isPublished && (
        <div className="p-2 text-sm gap-x-2 flex items-center justify-center mx-auto w-full sticky bg-yellow-100">
          <ShieldAlert />
          This course is unpublished.
        </div>
      )}

      <div className="flex flex-col justify-center items-center mx-auto gap-6">
        <div>
          <h1 className="text-2xl font-semibold mx-auto text-primary mt-4">
            Course setup
          </h1>
          <span className="text-sm text-slate-700 font-medium">
            Complete all fields {completionText}
          </span>
        </div>

        <Actions
          disabled={!isComplete}
          courseId={params.courseId}
          isPublished={course.isPublished}
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 space-y-10 lg:space-y-0 lg:space-x-16 w-[90%]">
          <div>
            <div className="flex items-center gap-x-2">
              <ListChecks />
              <h2 className="text-xl font-semibold ">Customize your course</h2>
            </div>
            <div className="space-y-4">
              <TitleForm initialData={course} courseId={course.id} />
              <DescriptionForm initialData={course} courseId={course.id} />
              <ImageForm initialData={course} courseId={course.id} />

              <CategoryForm
                initialData={course}
                courseId={course.id}
                options={categories.map((item) => ({
                  label: item.name,
                  value: item.id,
                }))}
              />
            </div>
          </div>

          <div className="flex flex-col space-y-8">
            <div>
              <div className="flex items-center gap-x-2">
                <ListChecks />
                <h2 className="text-xl font-semibold">Course chapters</h2>
              </div>
              <ChaptersForm initialData={course} courseId={course.id} />
            </div>

            <div>
              <div className="flex items-center gap-x-2">
                <Receipt />
                <h2 className="text-xl font-semibold">Sell your course </h2>
              </div>
              <PriceForm initialData={course} courseId={course.id} />
            </div>

            <div>
              <div className="flex items-center gap-x-2">
                <ScrollText />
                <h2 className="text-xl font-semibold">
                  Resources and Attachments{" "}
                </h2>
              </div>
              <AttachmentForm initialData={course} courseId={course.id} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseIdPage;

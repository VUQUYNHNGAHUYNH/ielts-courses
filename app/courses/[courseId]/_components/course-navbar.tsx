import NavbarRoutes from "@/app/(dashboard)/_components/navbar-routes";
import { Chapter, Course, UserProgress } from "@prisma/client";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { CourseSidebar } from "./course-sidebar";

interface CourseNavbarProps {
  course: Course & {
    chapters: (Chapter & {
      userProgress: UserProgress[] | null;
    })[];
  };
  progressCount: number;
}

const CourseNavbar = ({ course, progressCount }: CourseNavbarProps) => {
  return (
    <div className="p-3 border-b h-full flex items-center shadow-sm bg-white">
      {/* course mobile sidebar */}
      <Sheet>
        <SheetTrigger className="md:hidden pr-4 hover:opacity-75 transition">
          <Menu />
        </SheetTrigger>
        <SheetContent side="left" className="p-0 bg-white w-72">
          <CourseSidebar course={course} progressCount={progressCount} />
        </SheetContent>
      </Sheet>

      {/* log out and user button */}
      <NavbarRoutes />
    </div>
  );
};

export default CourseNavbar;

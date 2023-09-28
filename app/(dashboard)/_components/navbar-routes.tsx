"use client";

import { usePathname, useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { UserButton } from "@clerk/nextjs";

const NavbarRoutes = () => {
  const pathname = usePathname();
  const router = useRouter();

  const isTeacherPage = pathname?.startsWith("/teacher");
  const isStudentPage = pathname?.startsWith("/student");

  return (
    <div className="flex gap-x-2 ml-auto">
      {isTeacherPage || isStudentPage ? (
        <Button>
          <LogOut />
          LogOut
        </Button>
      ) : (
        <Link href="/teacher/courses">
          <Button>Teacher mode</Button>
        </Link>
      )}
      <UserButton afterSignOutUrl="/" />
    </div>
  );
};

export default NavbarRoutes;

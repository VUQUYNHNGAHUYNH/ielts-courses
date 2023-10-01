"use client";

import { usePathname, useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { UserButton } from "@clerk/nextjs";
import SearchInput from "../(routes)/search/_components/search-input";

const NavbarRoutes = () => {
  const pathname = usePathname();

  const isTeacherPage = pathname?.startsWith("/teacher");
  const isCoursePage = pathname?.startsWith("/courses");
  const isSearchPage = pathname === "/search";

  return (
    <>
      {isSearchPage && (
        <div className="hidden md:block">
          <SearchInput />
        </div>
      )}
      <div className="flex gap-x-2 ml-auto">
        {isTeacherPage || isCoursePage ? (
          <Button size="sm">
            <LogOut />
            LogOut
          </Button>
        ) : (
          <Link href="/teacher/courses">
            <Button size="sm">Teacher mode</Button>
          </Link>
        )}
        <UserButton afterSignOutUrl="/" />
      </div>
    </>
  );
};

export default NavbarRoutes;

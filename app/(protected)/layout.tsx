import { redirect } from "next/navigation";
import { AppNav } from "@/components/AppNav";
import { AppSidebar } from "@/components/AppSidebar";
import { isAuthenticated } from "@/lib/auth";

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  if (!(await isAuthenticated())) {
    redirect("/login");
  }

  return (
    <>
      <AppSidebar />
      <div className="app-frame">
        <div className="app-frame-scroll">{children}</div>
        <AppNav />
      </div>
    </>
  );
}

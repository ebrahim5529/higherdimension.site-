import { ReactNode, useEffect } from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Link, usePage } from "@inertiajs/react";
import {
  LayoutDashboard,
  BookOpen,
  FileText,
  Video,
  BookMarked,
  MessageSquare,
  Sparkles,
  Users,
  LogOut,
  Settings,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Toaster, toast } from "@/components/ui/sonner";

interface AdminLayoutProps {
  children: ReactNode;
}

const menuItems = [
  {
    title: "لوحة التحكم",
    icon: LayoutDashboard,
    url: "/admin",
  },
  {
    title: "الكتب",
    icon: BookOpen,
    url: "/admin/books",
  },
  {
    title: "المقالات",
    icon: FileText,
    url: "/admin/articles",
  },
  {
    title: "الفيديوهات",
    icon: Video,
    url: "/admin/videos",
  },
  {
    title: "القصص",
    icon: BookMarked,
    url: "/admin/stories",
  },
  {
    title: "الاستشارات",
    icon: MessageSquare,
    url: "/admin/consultations",
  },
  {
    title: "الرسائل",
    icon: MessageSquare,
    url: "/admin/messages",
  },
  {
    title: "بطاقات التحفيز",
    icon: Sparkles,
    url: "/admin/motivating-energies",
  },
  {
    title: "المستخدمين",
    icon: Users,
    url: "/admin/users",
  },
];

export function AdminLayout({ children }: AdminLayoutProps) {
  const { url, props } = usePage();
  const flash = (props as any).flash as { success?: string; error?: string } | undefined;

  useEffect(() => {
    if (flash?.success) {
      toast.success(flash.success);
    }
    if (flash?.error) {
      toast.error(flash.error);
    }
  }, [flash]);

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <Sidebar side="right" className="border-l hidden md:flex" collapsible="offcanvas">
          <SidebarHeader className="border-b p-4">
            <Link href="/admin" className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-background flex items-center justify-center overflow-hidden border border-border">
                <img src="/logo.png" alt="شعار د. آسيا خليفة طلال الجري" className="w-full h-full object-contain" />
              </div>
              <div>
                <h2 className="font-bold text-lg">لوحة التحكم</h2>
                <p className="text-xs text-muted-foreground">إدارة الموقع</p>
              </div>
            </Link>
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>القائمة الرئيسية</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu className="space-y-2">
                  {menuItems.map((item) => (
                    <SidebarMenuItem key={item.url}>
                      <SidebarMenuButton
                        asChild
                        isActive={url === item.url}
                        className="mb-1"
                      >
                        <Link href={item.url}>
                          <item.icon className="w-4 h-4" />
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
          <SidebarFooter className="border-t p-4">
            <Button variant="ghost" className="w-full justify-start" asChild>
              <Link href="/">
                <LogOut className="w-4 h-4 ml-2" />
                <span>العودة للموقع</span>
              </Link>
            </Button>
          </SidebarFooter>
        </Sidebar>
        <SidebarInset className="flex-1">
          <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background px-4">
            <SidebarTrigger className="hidden md:flex" />
            <div className="flex flex-1 items-center justify-end gap-4">
              <Button variant="outline" size="sm">
                <Settings className="w-4 h-4 ml-2" />
                الإعدادات
              </Button>
            </div>
          </header>
          <main className="p-6">{children}</main>
        </SidebarInset>
      </div>
      <Toaster position="top-center" dir="rtl" />
    </SidebarProvider>
  );
}


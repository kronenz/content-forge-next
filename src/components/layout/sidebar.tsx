"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Rss,
  Workflow,
  FileText,
  ClipboardCheck,
  Send,
  BarChart3,
  Settings,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "대시보드", href: "/", icon: LayoutDashboard },
  { label: "소스", href: "/sources", icon: Rss },
  { label: "파이프라인", href: "/pipelines", icon: Workflow },
  { label: "콘텐츠", href: "/contents", icon: FileText },
  { label: "검토", href: "/reviews", icon: ClipboardCheck },
  { label: "발행", href: "/publish", icon: Send },
  { label: "분석", href: "/analytics", icon: BarChart3 },
  { label: "설정", href: "/settings", icon: Settings },
];

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar>
      <SidebarHeader className="px-4 py-4">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground font-bold text-sm">
            CF
          </div>
          <span className="font-semibold text-sm">Content Forge</span>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => {
                const isActive =
                  item.href === "/"
                    ? pathname === "/"
                    : pathname.startsWith(item.href);
                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      isActive={isActive}
                      render={
                        <Link
                          href={item.href}
                          className={cn(
                            "flex items-center gap-3",
                            isActive && "font-medium"
                          )}
                        />
                      }
                    >
                      <item.icon className="h-4 w-4" />
                      <span>{item.label}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="px-4 py-3">
        <p className="text-xs text-muted-foreground">v0.1.0</p>
      </SidebarFooter>
    </Sidebar>
  );
}

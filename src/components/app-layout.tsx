'use client';
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
  SidebarFooter,
} from '@/components/ui/sidebar';
import {
  Timer,
  User,
  Shield,
  LayoutDashboard,
  CreditCard,
  BookText,
  CalendarPlus,
} from 'lucide-react';

const Logo = () => (
    <div className="flex h-16 items-center justify-center">
      <Link href="/" className="text-xl font-bold text-foreground tracking-tight">
        WhistleWise
      </Link>
    </div>
);

export function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader className="p-0 border-b">
          <Logo />
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={pathname === '/'} tooltip={{children: 'Dashboard'}}>
                <Link href="/">
                  <LayoutDashboard />
                  <span>Dashboard</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={pathname.startsWith('/live-match')} tooltip={{children: 'Live Match'}}>
                <Link href="/live-match">
                  <Timer />
                  <span>Live Match</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={pathname.startsWith('/profile')} tooltip={{children: 'Profile'}}>
                <Link href="/profile">
                  <User />
                  <span>Profile</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={pathname.startsWith('/matches')} tooltip={{children: 'Past Matches'}}>
                <Link href="/matches">
                  <Shield />
                  <span>Past Matches</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={pathname.startsWith('/diary')} tooltip={{children: 'My Diary'}}>
                <Link href="/diary">
                  <BookText />
                  <span>My Diary</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={pathname.startsWith('/planning')} tooltip={{children: 'Planning'}}>
                <Link href="/planning">
                  <CalendarPlus />
                  <span>Planning</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
             <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={pathname.startsWith('/subscription')} tooltip={{children: 'Subscription'}}>
                <Link href="/subscription">
                  <CreditCard />
                  <span>Subscription</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter>
          <div className="text-center text-xs text-muted-foreground p-4">
            <p>Built by Coding Hub</p>
          </div>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>{children}</SidebarInset>
    </SidebarProvider>
  );
}

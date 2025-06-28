'use client';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { LogOut } from 'lucide-react';

type PageHeaderProps = {
  title: string;
  children?: React.ReactNode;
};

export function PageHeader({ title, children }: PageHeaderProps) {
  const router = useRouter();

  const handleLogout = () => {
    sessionStorage.removeItem('isAuthenticated');
    router.push('/login');
  };

  return (
    <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background/80 backdrop-blur-sm px-4 md:px-6">
      <div className="flex items-center gap-2">
         <SidebarTrigger className="md:hidden" />
         <h1 className="text-xl font-semibold md:text-2xl">{title}</h1>
      </div>
      <div className="ml-auto flex items-center gap-4">
        {children}
        <Button variant="outline" onClick={handleLogout}>
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </Button>
      </div>
    </header>
  );
}

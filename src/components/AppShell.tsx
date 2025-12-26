import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Menu,
  X,
  ChevronDown,
  Bell,
  User,
  Settings,
  LogOut,
  HelpCircle,
} from 'lucide-react';

export interface NavigationItem {
  name: string;
  href: string;
  icon?: React.ComponentType<{ className?: string }>;
  badge?: string | number;
}

export interface Suite {
  id: string;
  name: string;
  description: string;
  href: string;
}

interface AppShellProps {
  children: React.ReactNode;
  currentSuite: 'os' | 'ops' | 'lab' | 'connect' | 'flow';
  navigation?: NavigationItem[];
  userName?: string;
  userEmail?: string;
  userAvatar?: string;
  className?: string;
}

const suites: Suite[] = [
  {
    id: 'os',
    name: 'OS',
    description: 'Operating System - Inventory & Production',
    href: '/os',
  },
  {
    id: 'ops',
    name: 'OPS',
    description: 'Operations - Orders & Fulfillment',
    href: '/ops',
  },
  {
    id: 'lab',
    name: 'Lab',
    description: 'Laboratory - Quality & Testing',
    href: '/lab',
  },
  {
    id: 'connect',
    name: 'Connect',
    description: 'Integration Hub',
    href: '/connect',
  },
  {
    id: 'flow',
    name: 'Flow',
    description: 'Workflow Automation',
    href: '/flow',
  },
];

export default function AppShell({
  children,
  currentSuite,
  navigation = [],
  userName = 'User',
  userEmail = 'user@bevforge.com',
  userAvatar,
  className,
}: AppShellProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationCount] = useState(3);
  const location = useLocation();

  const currentSuiteData = suites.find((s) => s.id === currentSuite);
  const userInitials = userName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase();

  const isActiveRoute = (href: string) => {
    return location.pathname === href || location.pathname.startsWith(href + '/');
  };

  return (
    <div className={cn('min-h-screen bg-background', className)}>
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="mr-2 lg:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>

          {/* Logo/Brand */}
          <div className="mr-4 flex items-center space-x-2">
            <Link to="/" className="flex items-center space-x-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground font-bold text-sm">
                BF
              </div>
              <span className="hidden font-bold sm:inline-block">BevForge</span>
            </Link>
          </div>

          {/* Suite Selector */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2">
                <span className="font-semibold">{currentSuiteData?.name}</span>
                <ChevronDown className="h-4 w-4 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-64">
              <DropdownMenuLabel>Switch Suite</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {suites.map((suite) => (
                <DropdownMenuItem key={suite.id} asChild>
                  <Link
                    to={suite.href}
                    className={cn(
                      'flex flex-col items-start',
                      suite.id === currentSuite && 'bg-accent'
                    )}
                  >
                    <div className="font-medium">{suite.name}</div>
                    <div className="text-xs text-muted-foreground">{suite.description}</div>
                  </Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex lg:flex-1 lg:items-center lg:gap-6 lg:ml-6">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = isActiveRoute(item.href);
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  className={cn(
                    'flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary',
                    isActive ? 'text-foreground' : 'text-muted-foreground'
                  )}
                >
                  {Icon && <Icon className="h-4 w-4" />}
                  {item.name}
                  {item.badge !== undefined && (
                    <span className="ml-1 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-primary px-1.5 text-xs text-primary-foreground">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right Side Actions */}
          <div className="flex flex-1 items-center justify-end space-x-2">
            {/* Notifications */}
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-4 w-4" />
              {notificationCount > 0 && (
                <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-destructive text-[10px] font-medium text-destructive-foreground flex items-center justify-center">
                  {notificationCount > 9 ? '9+' : notificationCount}
                </span>
              )}
            </Button>

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  {userAvatar ? (
                    <img
                      src={userAvatar}
                      alt={userName}
                      className="h-8 w-8 rounded-full"
                    />
                  ) : (
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-medium">
                      {userInitials}
                    </div>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{userName}</p>
                    <p className="text-xs leading-none text-muted-foreground">{userEmail}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <HelpCircle className="mr-2 h-4 w-4" />
                  <span>Help</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="border-t lg:hidden">
            <nav className="container grid gap-2 py-4">
              {navigation.map((item) => {
                const Icon = item.icon;
                const isActive = isActiveRoute(item.href);
                return (
                  <Link
                    key={item.href}
                    to={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={cn(
                      'flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent',
                      isActive ? 'bg-accent text-accent-foreground' : 'text-muted-foreground'
                    )}
                  >
                    {Icon && <Icon className="h-4 w-4" />}
                    {item.name}
                    {item.badge !== undefined && (
                      <span className="ml-auto flex h-5 min-w-[20px] items-center justify-center rounded-full bg-primary px-1.5 text-xs text-primary-foreground">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="container py-6">{children}</main>
    </div>
  );
}

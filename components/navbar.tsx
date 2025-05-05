'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import {
  Home,
  Search,
  MapPin,
  MessageSquare,
  User,
  LogOut,
  Settings,
  Menu,
  X,
  Building2,
  Map,
  Info,
  Phone,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Logo } from '@/components/logo';

export function Navbar() {
  const { data: session } = useSession();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/listings', label: 'Listings', icon: Building2 },
    { href: '/map', label: 'Map', icon: Map },
    { href: '/about', label: 'About', icon: Info },
    { href: '/contact', label: 'Contact', icon: Phone },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white shadow-sm">
      <div className="container flex h-16 items-center justify-between px-4">
        <Logo />

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-2 text-sm font-medium text-gray-600 transition-colors hover:text-primary">
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Desktop Auth/User Menu */}
        <div className="hidden md:flex items-center gap-4">
          {session ? (
            <>
              <Button variant="ghost" size="icon" asChild>
                <Link href="/messages">
                  <MessageSquare className="h-5 w-5" />
                </Link>
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <User className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/profile">
                      <User className="mr-2 h-4 w-4" />
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/settings">
                      <Settings className="mr-2 h-4 w-4" />
                      Settings
                    </Link>
                  </DropdownMenuItem>
                  {session.user.role === 'ADMIN' && (
                    <DropdownMenuItem asChild>
                      <Link href="/admin">
                        <Settings className="mr-2 h-4 w-4" />
                        Admin Dashboard
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="text-red-600"
                    onClick={() => signOut()}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="text-sm font-medium text-gray-600 transition-colors hover:text-primary">
                Log in
              </Link>
              <Button asChild>
                <Link href="/signup">Sign up</Link>
              </Button>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          {isMobileMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </Button>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden transition-all duration-200 ease-in-out ${
          isMobileMenuOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
        } overflow-hidden bg-white border-t`}>
        <div className="container space-y-4 px-4 py-4">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-2 text-sm font-medium text-gray-600 transition-colors hover:text-primary"
              onClick={() => setIsMobileMenuOpen(false)}>
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          ))}
          {session ? (
            <>
              <Link
                href="/messages"
                className="flex items-center gap-2 text-sm font-medium text-gray-600 transition-colors hover:text-primary"
                onClick={() => setIsMobileMenuOpen(false)}>
                <MessageSquare className="h-4 w-4" />
                Messages
              </Link>
              <Link
                href="/profile"
                className="flex items-center gap-2 text-sm font-medium text-gray-600 transition-colors hover:text-primary"
                onClick={() => setIsMobileMenuOpen(false)}>
                <User className="h-4 w-4" />
                Profile
              </Link>
              {session.user.role === 'ADMIN' && (
                <Link
                  href="/admin"
                  className="flex items-center gap-2 text-sm font-medium text-gray-600 transition-colors hover:text-primary"
                  onClick={() => setIsMobileMenuOpen(false)}>
                  <Settings className="h-4 w-4" />
                  Admin Dashboard
                </Link>
              )}
              <button
                className="flex items-center gap-2 w-full text-left text-sm font-medium text-red-600 transition-colors hover:text-red-700"
                onClick={() => {
                  signOut();
                  setIsMobileMenuOpen(false);
                }}>
                <LogOut className="h-4 w-4" />
                Log out
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="flex items-center gap-2 text-sm font-medium text-gray-600 transition-colors hover:text-primary"
                onClick={() => setIsMobileMenuOpen(false)}>
                <User className="h-4 w-4" />
                Log in
              </Link>
              <Button asChild className="w-full">
                <Link href="/signup" onClick={() => setIsMobileMenuOpen(false)}>
                  Sign up
                </Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

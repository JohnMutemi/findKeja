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
    { href: '#featured', label: 'Featured' },
    { href: '#map', label: 'Explore Kitengela' },
    { href: '#how-it-works', label: 'How It Works' },
    { href: '#testimonials', label: 'Testimonials' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Logo />

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium hover:underline">
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
                className="text-sm font-medium hover:underline">
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
      {isMobileMenuOpen && (
        <div className="md:hidden">
          <div className="container space-y-4 py-4">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="block text-sm font-medium hover:underline"
                onClick={() => setIsMobileMenuOpen(false)}>
                {item.label}
              </Link>
            ))}
            {session ? (
              <>
                <Link
                  href="/messages"
                  className="block text-sm font-medium hover:underline"
                  onClick={() => setIsMobileMenuOpen(false)}>
                  Messages
                </Link>
                <Link
                  href="/profile"
                  className="block text-sm font-medium hover:underline"
                  onClick={() => setIsMobileMenuOpen(false)}>
                  Profile
                </Link>
                {session.user.role === 'ADMIN' && (
                  <Link
                    href="/admin"
                    className="block text-sm font-medium hover:underline"
                    onClick={() => setIsMobileMenuOpen(false)}>
                    Admin Dashboard
                  </Link>
                )}
                <button
                  className="block w-full text-left text-sm font-medium text-red-600 hover:underline"
                  onClick={() => {
                    signOut();
                    setIsMobileMenuOpen(false);
                  }}>
                  Log out
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="block text-sm font-medium hover:underline"
                  onClick={() => setIsMobileMenuOpen(false)}>
                  Log in
                </Link>
                <Button asChild className="w-full">
                  <Link
                    href="/signup"
                    onClick={() => setIsMobileMenuOpen(false)}>
                    Sign up
                  </Link>
                </Button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

import Link from 'next/link';
import {
  ArrowRight,
  Home,
  Search,
  MapPin,
  Bed,
  Bath,
  Users,
  Star,
  Filter,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Map } from '@/components/map';

export default function Home() {
  return (
    <div className="relative min-h-screen">
      {/* Hero Section with Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2073&q=80')",
          filter: "brightness(0.7)"
        }}
      />

      {/* Content */}
      <div className="relative z-10 flex min-h-screen flex-col">
        {/* Navigation */}
        <nav className="container flex items-center justify-between py-4">
          <Link href="/" className="text-2xl font-bold text-white">
            FindKeja
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/auth/login">
              <Button variant="ghost" className="text-white hover:bg-white/10">
                Login
              </Button>
            </Link>
            <Link href="/auth/register">
              <Button className="bg-white text-primary hover:bg-white/90">
                Sign Up
              </Button>
            </Link>
          </div>
        </nav>

        {/* Hero Content */}
        <div className="flex flex-1 flex-col items-center justify-center px-4 text-center">
          <h1 className="mb-6 text-4xl font-bold text-white sm:text-5xl md:text-6xl">
            Find Your Dream Home
          </h1>
          <p className="mb-8 max-w-2xl text-lg text-white/90">
            Discover the perfect property that matches your lifestyle. Whether you're looking to rent or buy, we've got you covered.
          </p>

          {/* Search Bar */}
          <div className="w-full max-w-2xl">
            <div className="flex gap-2 rounded-lg bg-white p-2 shadow-lg">
              <Input
                type="text"
                placeholder="Enter location, property type, or keywords..."
                className="border-0 focus-visible:ring-0"
              />
              <Button size="lg" className="px-6">
                <Search className="mr-2 h-5 w-5" />
                Search
              </Button>
            </div>
          </div>

          {/* Quick Links */}
          <div className="mt-12 flex gap-4">
            <Link href="/properties?type=rent">
              <Button variant="outline" className="bg-white/10 text-white hover:bg-white/20">
                For Rent
              </Button>
            </Link>
            <Link href="/properties?type=sale">
              <Button variant="outline" className="bg-white/10 text-white hover:bg-white/20">
                For Sale
              </Button>
            </Link>
            <Link href="/properties/new">
              <Button variant="outline" className="bg-white/10 text-white hover:bg-white/20">
                List Property
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

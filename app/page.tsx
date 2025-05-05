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
  Building2,
  Map,
  Info,
  Phone,
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
    <div className="flex min-h-screen flex-col">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-600 to-blue-800 py-20 md:py-32">
        <div className="container px-4">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="mb-6 text-4xl font-bold text-white md:text-5xl lg:text-6xl">
              Find Your Perfect Home
            </h1>
            <p className="mb-8 text-lg text-white/90 md:text-xl">
              Discover the best properties in Kitengela. Whether you're looking to rent or buy, we've got you covered.
            </p>

            {/* Search Bar */}
            <div className="mx-auto max-w-2xl">
              <div className="flex flex-col gap-4 rounded-lg bg-white p-4 shadow-lg sm:flex-row">
                <div className="flex-1">
                  <Input
                    type="text"
                    placeholder="Enter location, property type, or keywords..."
                    className="border-0 focus-visible:ring-0"
                  />
                </div>
                <Button size="lg" className="px-8">
                  <Search className="mr-2 h-5 w-5" />
                  Search
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Properties */}
      <section className="py-16 md:py-24">
        <div className="container px-4">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold md:text-4xl">Featured Properties</h2>
            <p className="text-gray-600">Discover our handpicked selection of premium properties</p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {/* Property Card 1 */}
            <Card className="overflow-hidden">
              <div className="aspect-video bg-gray-200">
                <img
                  src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2073&q=80"
                  alt="Property"
                  className="h-full w-full object-cover"
                />
              </div>
              <CardHeader>
                <CardTitle>Modern Apartment in Kitengela</CardTitle>
                <CardDescription>2 Beds • 2 Baths • 1200 sqft</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold">$1,200/mo</span>
                  <Button variant="outline" size="sm">
                    View Details
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Property Card 2 */}
            <Card className="overflow-hidden">
              <div className="aspect-video bg-gray-200">
                <img
                  src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2073&q=80"
                  alt="Property"
                  className="h-full w-full object-cover"
                />
              </div>
              <CardHeader>
                <CardTitle>Luxury Villa with Pool</CardTitle>
                <CardDescription>4 Beds • 3 Baths • 2500 sqft</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold">$2,500/mo</span>
                  <Button variant="outline" size="sm">
                    View Details
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Property Card 3 */}
            <Card className="overflow-hidden">
              <div className="aspect-video bg-gray-200">
                <img
                  src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2073&q=80"
                  alt="Property"
                  className="h-full w-full object-cover"
                />
              </div>
              <CardHeader>
                <CardTitle>Cozy Studio Apartment</CardTitle>
                <CardDescription>1 Bed • 1 Bath • 600 sqft</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold">$800/mo</span>
                  <Button variant="outline" size="sm">
                    View Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="mt-12 text-center">
            <Button size="lg" asChild>
              <Link href="/listings">
                View All Properties
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-gray-50 py-16 md:py-24">
        <div className="container px-4">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold md:text-4xl">How It Works</h2>
            <p className="text-gray-600">Find your dream home in three simple steps</p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                <Search className="h-8 w-8" />
              </div>
              <h3 className="mb-2 text-xl font-semibold">Search</h3>
              <p className="text-gray-600">Browse through our extensive collection of properties</p>
            </div>

            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                <MapPin className="h-8 w-8" />
              </div>
              <h3 className="mb-2 text-xl font-semibold">Visit</h3>
              <p className="text-gray-600">Schedule a visit to your favorite properties</p>
            </div>

            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                <Home className="h-8 w-8" />
              </div>
              <h3 className="mb-2 text-xl font-semibold">Move In</h3>
              <p className="text-gray-600">Complete the process and move into your new home</p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-blue-600 py-16 md:py-24">
        <div className="container px-4">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="mb-4 text-3xl font-bold text-white md:text-4xl">
              Ready to Find Your Dream Home?
            </h2>
            <p className="mb-8 text-lg text-white/90">
              Join thousands of satisfied customers who found their perfect home with us.
            </p>
            <Button size="lg" variant="secondary" asChild>
              <Link href="/listings">
                Start Your Search
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}

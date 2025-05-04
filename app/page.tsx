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

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Home className="h-6 w-6" />
            <span className="text-xl font-bold">FindKeja</span>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <Link
              href="#featured"
              className="text-sm font-medium hover:underline">
              Featured
            </Link>
            <Link href="#map" className="text-sm font-medium hover:underline">
              Explore Kitengela
            </Link>
            <Link
              href="#how-it-works"
              className="text-sm font-medium hover:underline">
              How It Works
            </Link>
            <Link
              href="#testimonials"
              className="text-sm font-medium hover:underline">
              Testimonials
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            <Link
              href="/login"
              className="text-sm font-medium hover:underline hidden sm:inline-flex">
              Log in
            </Link>
            <Button asChild>
              <Link href="/signup">Sign up</Link>
            </Button>
          </div>
        </div>
      </header>
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative h-[600px] flex items-center justify-center bg-gradient-to-r from-blue-600 to-blue-800">
          <div className="absolute inset-0 bg-black/50" />
          <div className="container relative z-10">
            <div className="mx-auto max-w-3xl text-center text-white">
              <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
                Find Your Perfect Home in Kitengela
              </h1>
              <p className="mt-6 text-lg leading-8 text-gray-200">
                Discover the best rental properties in Kitengela. From cozy
                apartments to spacious houses, we've got you covered.
              </p>
              <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:justify-center">
                <div className="flex-1 max-w-xl">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <Input
                      type="search"
                      placeholder="Search by street, landmark, or property type..."
                      className="w-full pl-10 bg-white/90 backdrop-blur"
                    />
                  </div>
                </div>
                <Button
                  size="lg"
                  className="bg-white text-blue-600 hover:bg-gray-100">
                  Search
                </Button>
              </div>
              <div className="mt-4 flex flex-wrap justify-center gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  className="bg-white/20 hover:bg-white/30">
                  <Filter className="mr-2 h-4 w-4" />
                  Filters
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  className="bg-white/20 hover:bg-white/30">
                  Price Range
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  className="bg-white/20 hover:bg-white/30">
                  Property Type
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  className="bg-white/20 hover:bg-white/30">
                  Bedrooms
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Map Section */}
        <section id="map" className="container py-16 md:py-24">
          <div className="flex flex-col gap-8">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold tracking-tight">
                  Explore Kitengela
                </h2>
                <p className="text-muted-foreground">
                  Find properties near popular landmarks and areas
                </p>
              </div>
            </div>
            <Map />
          </div>
        </section>

        {/* Featured Properties */}
        <section id="featured" className="container py-16 md:py-24">
          <div className="flex flex-col gap-8">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold tracking-tight">
                  Featured Properties
                </h2>
                <p className="text-muted-foreground">
                  Discover our handpicked selection of premium rentals in
                  Kitengela
                </p>
              </div>
              <Button variant="outline" asChild>
                <Link href="/properties">
                  View all
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="overflow-hidden">
                  <div className="aspect-video bg-muted" />
                  <CardHeader>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      <span>Kitengela Town Center</span>
                    </div>
                    <CardTitle className="text-xl">
                      Modern 3-Bedroom Apartment
                    </CardTitle>
                    <CardDescription>Ksh 85,000/month</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Bed className="h-4 w-4" />
                        <span>3 beds</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Bath className="h-4 w-4" />
                        <span>2 baths</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        <span>4 guests</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section id="how-it-works" className="bg-muted/50 py-16 md:py-24">
          <div className="container">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold tracking-tight">
                How It Works
              </h2>
              <p className="mt-4 text-muted-foreground">
                Finding your perfect home in Kitengela is just a few steps away
              </p>
            </div>
            <div className="mx-auto mt-16 grid max-w-5xl grid-cols-1 gap-8 md:grid-cols-3">
              {[
                {
                  title: 'Search',
                  description:
                    'Browse through our extensive collection of verified properties in Kitengela',
                },
                {
                  title: 'Connect',
                  description:
                    'Get in touch with property owners and schedule viewings',
                },
                {
                  title: 'Move In',
                  description:
                    'Complete the paperwork and move into your new home',
                },
              ].map((step, i) => (
                <Card key={i} className="relative">
                  <CardHeader>
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground">
                      {i + 1}
                    </div>
                    <CardTitle className="mt-4">{step.title}</CardTitle>
                    <CardDescription>{step.description}</CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section id="testimonials" className="container py-16 md:py-24">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight">
              What Our Users Say
            </h2>
            <p className="mt-4 text-muted-foreground">
              Hear from people who found their perfect homes in Kitengela
            </p>
          </div>
          <div className="mx-auto mt-16 grid max-w-5xl grid-cols-1 gap-8 md:grid-cols-3">
            {[
              {
                name: 'Sarah M.',
                role: 'Tenant',
                content:
                  'Found my dream apartment in Kitengela Town Center. The process was smooth and the property was exactly as described.',
                rating: 5,
              },
              {
                name: 'John K.',
                role: 'Landlord',
                content:
                  "As a property owner, I've had great success listing my properties on FindKeja. The platform is easy to use and reaches the right audience.",
                rating: 5,
              },
              {
                name: 'Mary W.',
                role: 'Tenant',
                content:
                  'The map feature helped me find a property near my workplace. The location was perfect and the price was right!',
                rating: 5,
              },
            ].map((testimonial, i) => (
              <Card key={i}>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <div className="flex-1">
                      <CardTitle className="text-lg">
                        {testimonial.name}
                      </CardTitle>
                      <CardDescription>{testimonial.role}</CardDescription>
                    </div>
                    <div className="flex items-center gap-1">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star
                          key={i}
                          className="h-4 w-4 fill-yellow-400 text-yellow-400"
                        />
                      ))}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{testimonial.content}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="container py-16 md:py-24">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight">
              Ready to find your perfect home in Kitengela?
            </h2>
            <p className="mt-4 text-muted-foreground">
              Join thousands of happy renters who found their dream homes
              through FindKeja
            </p>
            <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center">
              <Button size="lg" asChild>
                <Link href="/signup">
                  Get Started
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/properties">Browse Properties</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      <footer className="border-t bg-muted/50">
        <div className="container flex flex-col gap-6 py-8 md:flex-row md:items-center md:justify-between md:py-12">
          <div className="flex items-center gap-2">
            <Home className="h-6 w-6" />
            <span className="text-xl font-bold">FindKeja</span>
          </div>
          <nav className="flex flex-wrap gap-4 sm:gap-6">
            <Link href="#" className="text-sm hover:underline">
              Terms
            </Link>
            <Link href="#" className="text-sm hover:underline">
              Privacy
            </Link>
            <Link href="#" className="text-sm hover:underline">
              Contact
            </Link>
          </nav>
          <div className="text-sm text-muted-foreground">
            © 2024 FindKeja. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}

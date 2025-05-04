import Image from "next/image"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { MapPin } from "lucide-react"

import { Button } from "@/components/ui/button"

export function HeroSection() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
      <div className="container px-4 md:px-6">
        <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
          <div className="flex flex-col justify-center space-y-4">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                Connect Caretakers with Renters
              </h1>
              <p className="max-w-[600px] text-muted-foreground md:text-xl">
                Our platform makes it easy to find and list rental properties with advanced map-based navigation and
                quality verification.
              </p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Button asChild size="lg">
                <Link href="/signup">
                  Get Started
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link href="/explore">Explore Properties</Link>
              </Button>
            </div>
          </div>
          <div className="relative flex items-center justify-center">
            <div className="relative h-[300px] w-full overflow-hidden rounded-xl md:h-[400px] lg:h-[500px]">
              <Image
                src="/placeholder.svg?height=500&width=500"
                alt="Map view of rental properties"
                fill
                className="object-cover"
                priority
              />
            </div>
            <div className="absolute -bottom-6 -left-6 h-[150px] w-[200px] overflow-hidden rounded-xl border bg-background p-3 shadow-xl md:h-[200px] md:w-[250px]">
              <div className="flex h-full flex-col justify-between">
                <div className="space-y-1">
                  <div className="text-sm font-medium">Lakeside Cottage</div>
                  <div className="flex items-center text-xs text-muted-foreground">
                    <MapPin className="mr-1 h-3 w-3" />
                    <span>Lake District, UK</span>
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="text-lg font-bold">£120/night</div>
                  <div className="text-xs text-muted-foreground">Available now</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

import Image from "next/image"
import { MapPin } from "lucide-react"

export function RecentListings() {
  const listings = [
    {
      id: 1,
      title: "Lakeside Cottage",
      location: "Lake District, UK",
      price: "£120/night",
      image: "/placeholder.svg?height=100&width=150",
    },
    {
      id: 2,
      title: "Mountain Cabin",
      location: "Scottish Highlands, UK",
      price: "£95/night",
      image: "/placeholder.svg?height=100&width=150",
    },
    {
      id: 3,
      title: "City Apartment",
      location: "London, UK",
      price: "£150/night",
      image: "/placeholder.svg?height=100&width=150",
    },
  ]

  return (
    <div className="space-y-4">
      {listings.map((listing) => (
        <div key={listing.id} className="flex items-center gap-4">
          <div className="relative h-16 w-24 overflow-hidden rounded-md">
            <Image src={listing.image || "/placeholder.svg"} alt={listing.title} fill className="object-cover" />
          </div>
          <div className="flex-1 space-y-1">
            <h4 className="font-medium">{listing.title}</h4>
            <div className="flex items-center text-xs text-muted-foreground">
              <MapPin className="mr-1 h-3 w-3" />
              <span>{listing.location}</span>
            </div>
          </div>
          <div className="text-sm font-medium">{listing.price}</div>
        </div>
      ))}
    </div>
  )
}

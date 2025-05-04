"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { MapPin, Upload } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"

export default function CreateListingPage() {
  const router = useRouter()
  const [images, setImages] = useState<string[]>([])

  // This would be replaced with actual image upload functionality
  const handleImageUpload = () => {
    // Simulate adding a placeholder image
    setImages([...images, "/placeholder.svg?height=200&width=300"])
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission
    router.push("/dashboard")
  }

  return (
    <DashboardShell>
      <DashboardHeader heading="Create New Listing" text="Add a new property to your listings." />
      <form onSubmit={handleSubmit}>
        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Property Details</CardTitle>
              <CardDescription>Enter the basic information about your property.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-3">
                <Label htmlFor="title">Property Title</Label>
                <Input id="title" placeholder="e.g. Cozy Lakeside Cottage" />
              </div>
              <div className="grid gap-3">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Describe your property in detail..."
                  className="min-h-[150px]"
                />
              </div>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="grid gap-3">
                  <Label htmlFor="property-type">Property Type</Label>
                  <Select>
                    <SelectTrigger id="property-type">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="house">House</SelectItem>
                      <SelectItem value="apartment">Apartment</SelectItem>
                      <SelectItem value="cottage">Cottage</SelectItem>
                      <SelectItem value="cabin">Cabin</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="price">Price per Night (£)</Label>
                  <Input id="price" type="number" placeholder="e.g. 120" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Location</CardTitle>
              <CardDescription>Specify where your property is located.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-3">
                <Label htmlFor="address">Address</Label>
                <Input id="address" placeholder="Street address" />
              </div>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <div className="grid gap-3">
                  <Label htmlFor="city">City</Label>
                  <Input id="city" placeholder="City" />
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="region">Region</Label>
                  <Input id="region" placeholder="Region/State" />
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="postal-code">Postal Code</Label>
                  <Input id="postal-code" placeholder="Postal code" />
                </div>
              </div>
              <div className="grid gap-3">
                <Label>Map Location</Label>
                <div className="relative h-[200px] w-full rounded-md border bg-muted flex items-center justify-center">
                  <div className="flex flex-col items-center gap-2 text-muted-foreground">
                    <MapPin className="h-8 w-8" />
                    <p className="text-sm">Click on the map to set location or use manual pin drop</p>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">
                  For rural areas, you can manually adjust the pin location for better accuracy.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Images</CardTitle>
              <CardDescription>Upload high-quality images of your property (minimum 1200x800px).</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-3">
                <Label>Property Photos</Label>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
                  {images.map((image, index) => (
                    <div key={index} className="relative h-[150px] overflow-hidden rounded-md border">
                      <img
                        src={image || "/placeholder.svg"}
                        alt={`Property ${index + 1}`}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    className="h-[150px] flex flex-col items-center justify-center gap-2"
                    onClick={handleImageUpload}
                  >
                    <Upload className="h-8 w-8" />
                    <span>Upload Image</span>
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Images will be optimized automatically. We enforce minimum quality standards to ensure your listing
                  looks great.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Amenities & Features</CardTitle>
              <CardDescription>Highlight what makes your property special.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                <div className="flex items-center space-x-2">
                  <input type="checkbox" id="wifi" className="h-4 w-4 rounded border-gray-300" />
                  <Label htmlFor="wifi" className="text-sm font-normal">
                    WiFi
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <input type="checkbox" id="parking" className="h-4 w-4 rounded border-gray-300" />
                  <Label htmlFor="parking" className="text-sm font-normal">
                    Parking
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <input type="checkbox" id="kitchen" className="h-4 w-4 rounded border-gray-300" />
                  <Label htmlFor="kitchen" className="text-sm font-normal">
                    Kitchen
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <input type="checkbox" id="tv" className="h-4 w-4 rounded border-gray-300" />
                  <Label htmlFor="tv" className="text-sm font-normal">
                    TV
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <input type="checkbox" id="washer" className="h-4 w-4 rounded border-gray-300" />
                  <Label htmlFor="washer" className="text-sm font-normal">
                    Washer
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <input type="checkbox" id="ac" className="h-4 w-4 rounded border-gray-300" />
                  <Label htmlFor="ac" className="text-sm font-normal">
                    Air Conditioning
                  </Label>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" type="button" onClick={() => router.back()}>
                Cancel
              </Button>
              <Button type="submit">Create Listing</Button>
            </CardFooter>
          </Card>
        </div>
      </form>
    </DashboardShell>
  )
}

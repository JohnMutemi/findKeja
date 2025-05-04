import { CheckCircle, MapPin, Shield, Upload, Users, MessageSquare } from "lucide-react"

export function FeatureSection() {
  return (
    <section id="features" className="container py-12 md:py-24 lg:py-32">
      <div className="mx-auto flex flex-col items-center justify-center gap-4 text-center md:max-w-[58rem]">
        <h2 className="text-3xl font-bold leading-tight tracking-tighter md:text-5xl">Features designed for success</h2>
        <p className="max-w-[85%] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
          Our platform offers everything you need to connect caretakers and renters efficiently.
        </p>
      </div>
      <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 py-12 md:grid-cols-2 lg:grid-cols-3">
        <div className="flex flex-col items-center gap-2 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <MapPin className="h-8 w-8 text-primary" />
          </div>
          <h3 className="text-xl font-bold">Map-based Navigation</h3>
          <p className="text-muted-foreground">
            Easily find properties with our interactive map interface, including manual pin drop for rural areas.
          </p>
        </div>
        <div className="flex flex-col items-center gap-2 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <Upload className="h-8 w-8 text-primary" />
          </div>
          <h3 className="text-xl font-bold">Quality Listings</h3>
          <p className="text-muted-foreground">
            Enforced minimum quality standards for property images with cloud optimization.
          </p>
        </div>
        <div className="flex flex-col items-center gap-2 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <Shield className="h-8 w-8 text-primary" />
          </div>
          <h3 className="text-xl font-bold">Spam Protection</h3>
          <p className="text-muted-foreground">
            Admin verification and listing limits to ensure only legitimate properties are listed.
          </p>
        </div>
        <div className="flex flex-col items-center gap-2 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <Users className="h-8 w-8 text-primary" />
          </div>
          <h3 className="text-xl font-bold">User Profiles</h3>
          <p className="text-muted-foreground">
            Detailed profiles for both caretakers and renters to build trust and transparency.
          </p>
        </div>
        <div className="flex flex-col items-center gap-2 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <MessageSquare className="h-8 w-8 text-primary" />
          </div>
          <h3 className="text-xl font-bold">Inquiry System</h3>
          <p className="text-muted-foreground">
            Streamlined communication between renters and caretakers with notification system.
          </p>
        </div>
        <div className="flex flex-col items-center gap-2 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <CheckCircle className="h-8 w-8 text-primary" />
          </div>
          <h3 className="text-xl font-bold">Analytics Dashboard</h3>
          <p className="text-muted-foreground">
            Track your success with comprehensive analytics on user engagement and listing performance.
          </p>
        </div>
      </div>
    </section>
  )
}

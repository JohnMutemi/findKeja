import Image from "next/image"

export function HowItWorks() {
  return (
    <section id="how-it-works" className="container py-12 md:py-24 lg:py-32 bg-muted/50">
      <div className="mx-auto flex flex-col items-center justify-center gap-4 text-center md:max-w-[58rem]">
        <h2 className="text-3xl font-bold leading-tight tracking-tighter md:text-5xl">How It Works</h2>
        <p className="max-w-[85%] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
          Our simple process connects caretakers and renters in just a few steps.
        </p>
      </div>
      <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 py-12 md:grid-cols-3">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="relative h-[200px] w-full overflow-hidden rounded-xl">
            <Image src="/placeholder.svg?height=200&width=300" alt="Sign up process" fill className="object-cover" />
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-xl font-bold text-primary-foreground">
            1
          </div>
          <h3 className="text-xl font-bold">Create an Account</h3>
          <p className="text-muted-foreground">
            Sign up as a caretaker or renter and complete your profile with relevant details.
          </p>
        </div>
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="relative h-[200px] w-full overflow-hidden rounded-xl">
            <Image
              src="/placeholder.svg?height=200&width=300"
              alt="Listing or searching process"
              fill
              className="object-cover"
            />
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-xl font-bold text-primary-foreground">
            2
          </div>
          <h3 className="text-xl font-bold">List or Search</h3>
          <p className="text-muted-foreground">
            Caretakers can list properties while renters can search using our map-based navigation.
          </p>
        </div>
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="relative h-[200px] w-full overflow-hidden rounded-xl">
            <Image src="/placeholder.svg?height=200&width=300" alt="Connection process" fill className="object-cover" />
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-xl font-bold text-primary-foreground">
            3
          </div>
          <h3 className="text-xl font-bold">Connect and Rent</h3>
          <p className="text-muted-foreground">
            Send inquiries, communicate through our platform, and finalize rental agreements.
          </p>
        </div>
      </div>
    </section>
  )
}

import type React from "react"
interface DashboardShellProps {
  children: React.ReactNode
}

export function DashboardShell({ children }: DashboardShellProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center">
          <div className="mr-4 hidden md:flex">
            <nav className="flex items-center space-x-4 lg:space-x-6">
              <a href="/dashboard" className="text-sm font-medium transition-colors hover:text-primary">
                Dashboard
              </a>
              <a
                href="/dashboard/listings"
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
              >
                Listings
              </a>
              <a
                href="/dashboard/inquiries"
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
              >
                Inquiries
              </a>
              <a
                href="/dashboard/profile"
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
              >
                Profile
              </a>
            </nav>
          </div>
          <div className="ml-auto flex items-center space-x-4">
            <div className="w-10 h-10 rounded-full bg-muted"></div>
          </div>
        </div>
      </header>
      <main className="flex-1 space-y-4 p-8 pt-6">
        <div className="container">{children}</div>
      </main>
    </div>
  )
}

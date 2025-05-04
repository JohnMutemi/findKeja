import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export function RecentInquiries() {
  const inquiries = [
    {
      id: 1,
      name: "Alex Johnson",
      message: "Is the Lakeside Cottage available next weekend?",
      time: "2 hours ago",
      initials: "AJ",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    {
      id: 2,
      name: "Sam Taylor",
      message: "I'm interested in the Mountain Cabin for a week in July.",
      time: "5 hours ago",
      initials: "ST",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    {
      id: 3,
      name: "Jamie Smith",
      message: "Does the City Apartment have parking available?",
      time: "Yesterday",
      initials: "JS",
      avatar: "/placeholder.svg?height=32&width=32",
    },
  ]

  return (
    <div className="space-y-4">
      {inquiries.map((inquiry) => (
        <div key={inquiry.id} className="flex items-start gap-4">
          <Avatar className="h-8 w-8">
            <AvatarImage src={inquiry.avatar || "/placeholder.svg"} alt={inquiry.name} />
            <AvatarFallback>{inquiry.initials}</AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-1">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium">{inquiry.name}</p>
              <span className="text-xs text-muted-foreground">{inquiry.time}</span>
            </div>
            <p className="text-sm text-muted-foreground">{inquiry.message}</p>
          </div>
        </div>
      ))}
    </div>
  )
}

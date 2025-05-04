export function UserStats() {
  const stats = [
    { label: "Profile Completion", value: "85%" },
    { label: "Response Rate", value: "92%" },
    { label: "Average Response Time", value: "2.5 hours" },
    { label: "Listing Views (30 days)", value: "1,245" },
    { label: "Map Navigation Usage", value: "High" },
  ]

  return (
    <div className="space-y-4">
      {stats.map((stat, index) => (
        <div key={index} className="flex items-center justify-between">
          <span className="text-sm">{stat.label}</span>
          <span className="text-sm font-medium">{stat.value}</span>
        </div>
      ))}
    </div>
  )
}

import { ChevronRight } from "lucide-react"
import Link from "next/link"
import type React from "react" // Added import for React

interface InfoCardProps {
  title: string
  description: string
  icon: React.ReactNode
  href: string
}

export function InfoCard({ title, description, icon, href }: InfoCardProps) {
  return (
    <Link
      href={href}
      className="relative p-6 rounded-lg border-2 border-black/20 group hover:border-black hover:shadow-md transition-all duration-200 block"
    >
      <div className="flex items-start gap-4 pr-8">
        <div className="p-3 rounded-full bg-black text-white shrink-0 group-hover:scale-110 transition-transform duration-200">
          {icon}
        </div>
        <div className="space-y-1.5 flex-grow">
          <h3 className="font-semibold group-hover:text-black/80">{title}</h3>
          <p className="text-sm text-gray-600">{description}</p>
        </div>
      </div>
      <div className="absolute right-4 top-1/2 -translate-y-1/2 transition-all opacity-0 group-hover:opacity-100 group-hover:right-3 duration-200">
        <div className="p-2 rounded-full bg-black text-white">
          <ChevronRight className="w-4 h-4" />
        </div>
      </div>
    </Link>
  )
}

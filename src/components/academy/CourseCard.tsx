"use client"

import Image from "next/image"
import { Clock, BarChart } from "lucide-react"
import { useRouter } from "next/navigation"

interface CourseCardProps {
    imageUrl: string
    title: string
    description: string
    duration: string
    level: string
    ctaText: string
    onCtaClick?: () => void
}

export default function CourseCard({
    imageUrl,
    title,
    description,
    duration,
    level,
    ctaText = "Enroll Now",
    // onCtaClick,
}: CourseCardProps) {
  const router = useRouter()

  return (
    <div className="bg-gray-900 rounded-xl overflow-hidden flex flex-col md:flex-row max-w-3xl">
      {/* Image Section */}
      <div className="md:w-2/5 relative h-60 md:h-auto m-6 max-md:mb-0 md:mr-0">
        <Image src={imageUrl || "/images/course-placeholder"} alt={title} fill className="object-cover rounded-2xl" />
      </div>

      {/* Content Section */}
      <div className="md:w-3/5 p-6 flex flex-col justify-between">
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-white">{title}</h2>
          <p className="text-gray-300 text-sm">{description}</p>
        </div>

        {/* Course Details */}
        <div className="mt-6 space-y-4">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 text-gray-300">
              <Clock className="w-5 h-5 text-chambray-600" />
              <span>{duration}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-300">
              <BarChart className="w-5 h-5 text-chambray-600" />
              <span>{level}</span>
            </div>
          </div>

          {/* CTA Button */}
          <button
            onClick={() => router.push("#contact")} //{onCtaClick}
            className="bg-white text-chambray-800 px-6 py-2 rounded-full font-medium hover:bg-gray-100 transition-colors"
          >
            {ctaText}
          </button>
        </div>
      </div>
    </div>
  )
} 
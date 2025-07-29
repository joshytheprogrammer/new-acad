import { GraduationCapIcon, PencilRulerIcon, TrendingUpIcon } from 'lucide-react'
import React from 'react'

export default function OurReasons() {
    return (
      <section className='flex flex-col items-center p-6 md:p-12 lg:p-20 lg:px-12 max-md:py-16 bg-white'>
        <h2 className="text-3xl lg:text-4xl font-bold text-left md:text-center">Why This Isn't Your Average Classroom</h2>
        <p className="text-lg text-gray-500 text-left md:text-center mt-4 mb-12">We're not here to teach theory. We're here to help you build, brand, and break into the industry with real tools, real mentors, and real results.</p>
        <div className='w-full flex max-md:flex-col justify-evenly lg:justify-between gap-4'>
            <div className="flex flex-col items-start bg-gray-50 rounded-2xl p-6 w-full space-y-8">
                <div className="bg-chambray-800 text-white rounded-xs flex items-center justify-center size-14 mr-4">
                    <GraduationCapIcon  />
                </div>
                <div>
                    <div className="font-medium text-lg mb-1">Industry-Recognized Certification</div>
                    <div className="text-gray-500 text-sm md:text-base">Graduate with credentials respected by top employers.</div>
                </div>
            </div>
            <div className="flex flex-col items-start bg-gray-50 rounded-2xl p-6 w-full space-y-8">
                <div className="bg-chambray-800 text-white rounded-xs flex items-center justify-center size-14 mr-4">
                    <PencilRulerIcon  />
                </div>
                <div>
                    <div className="font-medium text-lg mb-1">Practical, Real-World Projects</div>
                    <div className="text-gray-500 text-sm md:text-base">Work on campaigns that mirror actual client briefs.</div>
                </div>
            </div>
            <div className="flex flex-col items-start bg-gray-50 rounded-2xl p-6 w-full space-y-8">
                <div className="bg-chambray-800 text-white rounded-xs flex items-center justify-center size-14 mr-4">
                    <TrendingUpIcon  />
                </div>
                <div>
                    <div className="font-medium text-lg mb-1">Career Advancement</div>
                    <div className="text-gray-500 text-sm md:text-base">85% of our graduates receive promotions within 6 months.</div>
                </div>
            </div>
        </div>
      </section>
  )
} 
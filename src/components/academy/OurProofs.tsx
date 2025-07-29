import React from 'react'
import { NumberTicker } from '../magicui/number-ticker'

export default function OurProofs() {
  return (
    <section className='flex flex-col items-center p-6 md:p-12 lg:p-20 lg:px-12 max-md:py-16' id="testimonials">
        <h2 className="text-3xl lg:text-4xl font-bold text-left md:text-center">The Proof{"'"}s in the Projects.</h2>
        <p className="text-lg text-gray-500 text-left md:text-center mt-4">{"We don't just talk impact, we measure it. Here's what we've built together so far."}</p>
        <div className="grid grid-cols-2 md:grid-cols-4 bg-gray-100 md:justify-start items-center mt-12 lg:mt-12 gap-px w-full">
            <div className="bg-background siz-full aspect-[2/1] p-4 py-6 !rounded-none grid place-content-center flex-col items-center gap-1">
                <span className="text-3xl lg:text-5xl font-bold text-gray-950 flex justify-center items-center whitespace-pre-wrap tracking-tighter">
                    <NumberTicker
                        value={100}
                        className="whitespace-pre-wrap tracking-normal font-satoshi text-gray-950 "
                    />+
                </span>
                <p className="font-medium text-xs text-center md:text-sm text-gray-600">Students Trained</p>
            </div>
            <div className="bg-background siz-full aspect-[2/1] p-4 py-6 !rounded-none grid place-content-center flex-col items-center gap-1">
                <span className="text-3xl lg:text-5xl font-bold text-gray-950 flex justify-center items-center whitespace-pre-wrap tracking-tighter">
                    <NumberTicker
                        value={15}
                        className="whitespace-pre-wrap tracking-normal font-satoshi text-gray-950 "
                    />+
                </span>
                <p className="font-medium text-xs text-center md:text-sm text-gray-600">Creative Courses</p>
            </div>
            <div className="bg-background siz-full aspect-[2/1] p-4 py-6 !rounded-none grid place-content-center flex-col items-center gap-1">
                <span className="text-3xl lg:text-5xl font-bold text-gray-950 flex justify-center items-center whitespace-pre-wrap tracking-tighter">
                    <NumberTicker
                        value={95}
                        className="whitespace-pre-wrap tracking-normal font-satoshi text-gray-950 "
                    />%
                </span>
                <p className="font-medium text-xs text-center md:text-sm text-gray-600">Job Placement Rate</p>
            </div>
            <div className="bg-background siz-full aspect-[2/1] p-4 py-6 !rounded-none grid place-content-center flex-col items-center gap-1">
                <span className="text-3xl lg:text-5xl font-bold text-gray-950 flex justify-center items-center whitespace-pre-wrap tracking-tighter">
                    <NumberTicker
                        value={98}
                        className="whitespace-pre-wrap tracking-normal font-satoshi text-gray-950 "
                    />%
                </span>
                <p className="font-medium text-xs text-center md:text-sm text-gray-600">Satisfaction Score</p>
            </div>
        </div>
    </section>
  )
} 
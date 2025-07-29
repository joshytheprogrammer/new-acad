import Image from 'next/image'

export default function Offerings() {
    return (
        <section className="bg-white text-xl md:text-3xl p-6 md:p-12 lg:p-20 lg:px-12 max-lg:py-12 space-y-16" id="programs">
            <div className="">
                <h2 className="text-3xl lg:text-4xl font-bold text-left md:text-center">Built for the Brave. Designed for Doers.</h2>
                <p className="text-lg text-gray-500 text-left md:text-center mt-4">Whether you want to master design, dominate digital marketing, or write words that move millions, we've got a seat for you</p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-6 max-lg:grid-rows-6 lg:auto-rows-[120px] gap-4">
                <div className="bg-chambray-50 max-md:h-[400px] p-6 lg:col-span-2 lg:col-start-1 lg:row-span-5 flex flex-col items-center relative overflow-hidden hover:bg-sand-black group transition-colors duration-300">
                    <div>
                        <h3 className="text-2xl lg:text-3xl !text-left font-medium group-hover:text-white">Certification Programs</h3>
                        <p className="mt-2 text-gray-500 text-sm group-hover:text-gray-100 mb-6">Gain industry-recognized certifications that validate your skills and expertise, helping you stand out in the job market and advance your career. </p>
                    </div>
                    <div className="w-full grow h-80 relative">
                        <Image 
                            src="/images/dude-on-a-laptop.webp"
                            alt="coworkers"
                            className='object-cover rounded-2xl'
                            fill
                        />
                    </div>
                </div>
                <div className="bg-chambray-50 max-md:h-[400px] p-6 lg:col-span-full max-lg:flex-col-reverse gap-6 lg:col-start-3 lg:row-span-2 flex flex-col lg:flex-row items-center relative overflow-hidden hover:bg-sand-black group transition-colors duration-300">
                    <div className="w-full grow h-56 relative">
                        <Image 
                            src="/images/certificate-pic.webp"
                            alt="coworkers"
                            className='object-cover rounded-2xl'
                            fill
                        />
                    </div>
                    <div>
                        <h3 className="text-2xl lg:text-3xl !text-left font-medium group-hover:text-white">Certificates</h3>
                        <p className="mt-2 text-gray-500 text-sm group-hover:text-gray-100 mb-6">Earn professional certificates upon completing specialized courses designed to enhance your knowledge and skillset in various fields.</p>
                    </div>
                </div>
                <div className="bg-chambray-50 max-md:h-[400px] p-6 lg:p-8 lg:col-span-2 lg:col-start-3 lg:row-span-3 flex flex-col items-center relative overflow-hidden hover:bg-sand-black group transition-colors duration-300">
                    <div>
                        <h3 className="text-2xl lg:text-3xl !text-left font-medium group-hover:text-white">Corporate Training</h3>
                        <p className="mt-2 text-gray-500 text-sm group-hover:text-gray-100 mb-6">Customized training solutions for organizations looking to upskill their workforce, improve efficiency, and stay competitive in the industry.</p>
                    </div>
                    <div className="w-full grow h-80 relative">
                        <Image 
                            src="/images/people-looking-at-monitor.webp"
                            alt="coworkers"
                            className='object-cover rounded-2xl'
                            fill
                        />
                    </div>
                </div>
                <div className="bg-chambray-50 max-md:h-[400px] p-6 lg:col-span-2 lg:col-start-5 lg:row-span-3 flex flex-col items-center relative overflow-hidden hover:bg-sand-black group transition-colors duration-300">
                    <div>
                        <h3 className="text-2xl lg:text-3xl !text-left font-medium group-hover:text-white">Bootcamps</h3>
                        <p className="mt-2 text-gray-500 text-sm group-hover:text-gray-100 mb-6">Intensive, hands-on learning experiences designed to equip participants with practical skills in a short time, making them job-ready in their chosen field.</p>
                    </div>
                    <div className="w-full grow h-80 relative">
                        <Image 
                            src="/images/people-looking-at-laptop.webp"
                            alt="coworkers"
                            className='object-cover rounded-2xl'
                            fill
                        />
                    </div>
                </div>
                <div className="bg-chambray-50 max-md:h-[400px] p-6 lg:col-span-3 lg:col-start-1 lg:row-span-3 flex flex-col items-center relative overflow-hidden hover:bg-sand-black group transition-colors duration-300">
                    <div>
                        <h3 className="text-2xl lg:text-3xl !text-left font-medium group-hover:text-white">IT Training and Placements</h3>
                        <p className="mt-2 text-gray-500 text-sm group-hover:text-gray-100 mb-6">Comprehensive IT courses paired with job placement support to help learners secure roles in top tech companies and advance in the digital economy.</p>
                    </div>
                    <div className="w-full grow h-80 relative">
                        <Image 
                            src="/images/teacher-high-fiving-student.webp"
                            alt="coworkers"
                            className='object-cover rounded-2xl'
                            fill
                        />
                    </div>

                </div>
                <div className="bg-chambray-50 max-md:h-[400px] p-6 lg:col-span-3 lg:col-start-4 lg:row-span-3 flex flex-col items-center relative overflow-hidden hover:bg-sand-black group transition-colors duration-300">
                    <div>
                        <h3 className="text-2xl lg:text-3xl !text-left font-medium group-hover:text-white">Secondary School Training</h3>
                        <p className="mt-2 text-gray-500 text-sm group-hover:text-gray-100 mb-6">Empowering students with foundational and advanced learning tailored to prepare them for higher education and future careers.</p>
                    </div>
                    <div className="w-full grow h-80 relative">
                        <Image 
                            src="/images/girl-on-laptop.webp"
                            alt="coworkers"
                            className='object-cover rounded-2xl'
                            fill
                        />
                    </div>

                </div>
            </div>
        </section>
    )
} 
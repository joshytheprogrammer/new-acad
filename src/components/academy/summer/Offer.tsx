import { Briefcase, InfinityIcon, Smartphone, ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

interface ValueCardProps {
    icon: React.ReactNode;
    title: string;
    description: string;
    value: string;
    bgColor: string;
    iconColor: string;
}

const ValueCard = ({ icon, title, description, value, bgColor, iconColor }: ValueCardProps) => (
    <div className={`rounded-xl p-6 text-left ${bgColor} text-black`}>
      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${iconColor} bg-white mb-4`}>
        {icon}
      </div>
      <h3 className="font-bold text-lg">{title}</h3>
      <p className="text-sm mt-1">{description}</p>
      <p className="font-bold text-2xl mt-4">{value}</p>
    </div>
  );

export default function Offer() {

    const scrollToEnrollment = () => {
          const enrollmentSection = document.getElementById('enrollment');
          if (enrollmentSection) {
            enrollmentSection.scrollIntoView({ 
              behavior: 'smooth',
              block: 'start'
            });
          }
        };

  return (
    <section className="py-20 px-4 lg:px-8 xl:px-24 relative overflow-hidden bg-white">
      <div className="relative">
        <h2 className="text-3xl md:text-5xl font-bold">
          The Unbeatable Value
          <br />
          <span className="text-4xl md:text-6xl text-chambray-600">You&apos;re Getting This Summer</span>
        </h2>
        {/* <div className="absolute -top-10 right-0">
            <Image src="/images/swirl-arrow.svg" alt="arrow" width={80} height={80} />
        </div> */}

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
            <ValueCard 
                icon={<Briefcase size={24} />}
                title="Expert-Led Summer Camp"
                description="Learn from expert instructors. Build projects that last!"
                value="₦150,000"
                bgColor="bg-pink-200/20 backdrop-blur-sm border border-pink-300/50"
                iconColor="text-pink-500"
            />
            <ValueCard 
                icon={<Briefcase size={24} />}
                title="Digital Portfolio Kit"
                description="Create a real project to showcase to future employers."
                value="₦30,000"
                bgColor="bg-yellow-200/20 backdrop-blur-sm border border-yellow-300/50"
                iconColor="text-yellow-500"
            />
            <ValueCard 
                icon={<InfinityIcon size={24} />}
                title="Lifetime Course Access"
                description="Access advanced materials after Camp."
                value="₦100,000"
                bgColor="bg-purple-200/20 backdrop-blur-sm border border-purple-300/50"
                iconColor="text-purple-500"
            />
            <ValueCard 
                icon={<Smartphone size={24} />}
                title="Future-Proof Parent Guide"
                description="Support your child's digital journey with our resources."
                value="₦15,000"
                bgColor="bg-indigo-200/20 backdrop-blur-sm border border-indigo-300/50"
                iconColor="text-indigo-500"
            />
        </div>

        <div className="mt-8 bg-chambray-600/20 backdrop-blur-sm border border-cyan-300/50 rounded-lg py-4 px-8 text-center">
            <p className="text-3xl font-bold text-black">Total Real-World Value: <span className="text-chambray-600">₦300,000+</span></p>
        </div>

        <div className="mt-8 bg-sand-black text-center border border-gray-700 rounded-3xl p-8 md:p-12 relative">
            <div className="absolute -top-8 left-1/2 -translate-x-1/2">
                <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center animate-pulse">
                    <span className="text-5xl">💥</span>
                </div>
            </div>
             <div className="absolute -top-8 right-10">
                <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center animate-pulse">
                    <span className="text-5xl">💥</span>
                </div>
            </div>

            <p className="text-3xl md:text-4xl text-white">All can be yours for Just</p>
            
            <div className="my-6">
                <div className="inline-block bg-gradient-to-r from-green-400 to-teal-400 rounded-2xl px-12 py-4 shadow-lg">
                    <p className="text-5xl md:text-7xl font-black text-white tracking-wider">₦50,000!</p>
                </div>
            </div>

            <p className="text-4xl font-bold text-chambray-600">+</p>

            <p className="text-2xl md:text-3xl font-semibold mt-4">The Most Improved Student Wins a Brand New LAPTOP!</p>
            
            <div className="relative mt-8 w-full max-w-md mx-auto">
                <Image src="/images/laptop2.png" alt="Laptop prize" width={400} height={250} className="mx-auto" />
                <div className="absolute -bottom-4 -left-4 text-5xl text-pink-500">X</div>
                <div className="absolute -top-4 -right-4 w-20 h-20 border-4 border-yellow-400 rounded-full"></div>
            </div>

            <div className="mt-12">
                <button  onClick={scrollToEnrollment} className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold py-4 px-8 rounded-full text-lg shadow-lg hover:scale-105 transition-transform">
                    Secure Your Child&apos;s Spot
                    <ArrowRight size={20} />
                </button>
            </div>
        </div>
      </div>
    </section>
  );
}


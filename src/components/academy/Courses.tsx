import { ArrowRightIcon } from "lucide-react";
import Button from "../LinkButton";
import CourseCard from "./CourseCard";

const courses = [
    {
        imageUrl: "/images/digi-market.png",
        title: "Digital Marketing for Beginners",
        description: "Learn the essentials of digital marketing, from social media strategy to paid ads and email campaigns. Perfect for aspiring marketers ready to grow brands online.",
        duration: "6 Weeks",
        level: "Beginner",
        ctaText: "Enroll Now",
    },
    {
        imageUrl: "/images/seo-acaad.png",
        title: "SEO for Beginners",
        description: "Master the fundamentals of search engine optimization to boost website visibility and traffic. Ideal for beginners wanting to improve rankings and drive results.",
        duration: "6 Weeks",
        level: "Beginner",
        ctaText: "Enroll Now",
    },
    {
        imageUrl: "/images/web-dev-acad.png",
        title: "Web Development for Beginners",
        description: "Discover how to build responsive websites using HTML, CSS, and JavaScript. Great for aspiring developers eager to start creating projects from scratch.",
        duration: "6 Weeks",
        level: "Beginner",
        ctaText: "Enroll Now",
    },
    {
        imageUrl: "/images/grap-acad.jpg",
        title: "Graphic Design for Beginners",
        description: "Explore the core principles of visual design using tools like Photoshop and Illustrator. Perfect for creatives looking to craft stunning visuals and portfolios.",
        duration: "6 Weeks",
        level: "Beginner",
        ctaText: "Enroll Now",
    }]

export default function Courses() {
    return (
        <section className="bg-sand-black p-6 md:p-12 lg:p-20 lg:px-12 max-lg:py-12 text-white" id="programs">
            <div className="flex max-md:flex-col justify-start md:justify-between items-center gap-y-8 lg:gap-24">
                <div>
                    <h2 className="text-3xl lg:text-4xl font-bold text-left">Skill Tracks That Hit Different</h2>
                    <p className="text-gray-300 text-lg text-left mt-4">Whether you're into design, strategy, media, or storytelling, we've got the program to turn your hustle into high-impact creative work.</p>
                </div>
                <Button href="#contact">
                    View Courses
                    <ArrowRightIcon className="w-5 h-5 transition-transform duration-300 group-hover/linkbtn:translate-x-0.5" />
                </Button>
            </div>
            <div className="mt-16 grid grid-cols-1 lg:grid-cols-2 gap-6">
                {courses.map((course, index) => (
                    <CourseCard
                        key={index}
                        imageUrl={course.imageUrl}
                        title={course.title}
                        description={course.description}
                        duration={course.duration}
                        level={course.level}
                        ctaText={course.ctaText}
                        // onCtaClick={() => console.log("Enroll button clicked")}
                    />))}
            </div>
        </section>
    )
} 
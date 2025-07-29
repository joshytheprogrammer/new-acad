import Image from "next/image";

export default function Solution() {
  return (
    <section className="bg-white py-24 px-4 text-center text-gray-800">
        <div className="max-w-5xl mx-auto">
          <h2 className="font-bebas text-4xl md:text-5xl font-bold tracking-tight text-gray-900">
            Your Child&apos;s Digital Future Starts This Summer
          </h2>
          <p className="mt-6 text-lg text-gray-600 max-w-3xl mx-auto">
            We understand your concerns because we share them. At{" "}
            <span className="text-chambry-600 font-bold">
              Walls and Gates Academy
            </span>
            , we transform unproductive screen time into powerful, future-proof
            skills. We are your trusted guide on this journey.
          </p>
          <div className="mt-16 grid md:grid-cols-2 gap-12 text-left">
            <div className="bg-gray-50 p-8 rounded-lg">
              <div className="flex-shrink-0">
                <svg
                  className="w-8 h-8 text-chambray-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                  ></path>
                </svg>
              </div>
              <h3 className="mt-4 font-bebas text-2xl font-bold text-gray-900">
                Web Development Track
              </h3>
              <p className="mt-2 text-gray-600">
                Your child will learn to build websites and web applications
                from scratch, mastering the fundamentals of HTML, CSS, and
                JavaScript.
              </p>
            </div>
            <div className="bg-gray-50 p-8 rounded-lg">
              <div className="flex-shrink-0">
                <svg
                  className="w-8 h-8 text-chambray-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L15.232 5.232z"
                  ></path>
                </svg>
              </div>
              <h3 className="mt-4 font-bebas text-2xl font-bold text-gray-900">
                Graphic Design Track
              </h3>
              <p className="mt-2 text-gray-600">
                Your child will explore the principles of design, learning to
                create stunning visuals with industry-standard tools like Adobe
                Photoshop and Illustrator.
              </p>
            </div>
          </div>
          <div className="mt-16 relative h-120 rounded-lg overflow-hidden">
            <Image
              src="/images/study-group-african-people.jpg" // Replace with a vibrant image of kids learning
              alt="Happy students learning"
              fill
              style={{ objectFit: "cover" }}
            />
          </div>
        </div>
      </section>
  );
}
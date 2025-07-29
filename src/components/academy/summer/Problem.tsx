import Image from "next/image";

export default function Problem() {
  return (
    <section className="bg-sand-black py-32 px-12">
            <div className="max-w-6xl mx-auto text-center">
              <h2 className="font-bebas text-4xl md:text-5xl font-bold tracking-tight leading-snug">
                While Others Are Building...{" "}
                <span className="text-chambray-600">
                  Is Your Child Being Left Behind?
                </span>
              </h2>
              <div className="mt-16 grid md:grid-cols-2 gap-12 items-center">
                <div className="text-left">
                  <ul className="space-y-6">
                    <li className="flex items-start">
                      <div className="flex-shrink-0">
                        <svg
                          className="w-6 h-6 text-urgent-red"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          ></path>
                        </svg>
                      </div>
                      <p className="ml-4 text-gray-300">
                        <span className="font-bold text-white">
                          Lost Opportunities:
                        </span>{" "}
                        Every day spent scrolling is a day opportunities for growth
                        and learning are lost.
                      </p>
                    </li>
                    <li className="flex items-start">
                      <div className="flex-shrink-0">
                        <svg
                          className="w-6 h-6 text-urgent-red"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          ></path>
                        </svg>
                      </div>
                      <p className="ml-4 text-gray-300">
                        <span className="font-bold text-white">
                          The Digital Skills Gap:
                        </span>{" "}
                        85% of jobs by 2030 will require digital skills. Is your
                        child prepared?
                      </p>
                    </li>
                    <li className="flex items-start">
                      <div className="flex-shrink-0">
                        <svg
                          className="w-6 h-6 text-urgent-red"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          ></path>
                        </svg>
                      </div>
                      <p className="ml-4 text-gray-300">
                        <span className="font-bold text-white">
                          Unproductive Screen Time:
                        </span>{" "}
                        Nigerian teens spend over 7 hours online daily. Let&apos;s
                        make it productive.
                      </p>
                    </li>
                  </ul>
                </div>
                <div className="relative h-80 rounded-lg overflow-hidden">
                  <Image
                    src="/images/bored.jpg"
                    alt="Child looking bored at a screen"
                    fill
                    style={{ objectFit: "cover" }}
                    className="opacity-70"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-sand-black to-transparent"></div>
                </div>
              </div>
            </div>
          </section>
  );
}
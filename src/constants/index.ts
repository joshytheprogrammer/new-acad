export interface FAQItem {
  id: number;
  question: string;
  answer: string;
  category: string;
}

export const faqData: FAQItem[] = [
  // About the Program & Curriculum
  {
    id: 1,
    category: "About the Program & Curriculum",
    question: "What is the Walls and Gates Academy Summer Program?",
    answer: "It's an intensive, hands-on digital skills program for young learners, focusing on either Web Development or Graphic Design, designed to transform unproductive screen time into valuable, future-proof skills."
  },
  {
    id: 2,
    category: "About the Program & Curriculum",
    question: "What age group is this summer program designed for?",
    answer: "The program is specifically tailored for children aged 12-18 years old. We group students by age and experience level to ensure optimal learning."
  },
  {
    id: 3,
    category: "About the Program & Curriculum",
    question: "What specific skills will my child learn in the Web Development track?",
    answer: "Students will learn foundational concepts of web design, including HTML, CSS, basic JavaScript, and how to build simple, responsive web pages. They'll also understand user interface (UI) principles."
  },
  {
    id: 4,
    category: "About the Program & Curriculum",
    question: "What specific skills will my child learn in the Graphic Design track?",
    answer: "Students will explore principles of design, color theory, typography, and learn to use industry-standard tools (e.g., Figma/Canva for beginners, potentially Adobe basics) to create logos, social media graphics, and digital art."
  },
  {
    id: 5,
    category: "About the Program & Curriculum",
    question: "Is previous coding/design experience required for my child to join?",
    answer: "No, this program is designed for beginners! We start from the fundamentals, making it accessible for children with no prior experience. Experienced students will be given advanced challenges."
  },
  {
    id: 6,
    category: "About the Program & Curriculum",
    question: "How is the curriculum structured? Is it project-based?",
    answer: "Yes, our curriculum is highly project-based and hands-on. Students will work on practical projects daily, building a portfolio piece by the end of the program to demonstrate their new skills."
  },
  {
    id: 7,
    category: "About the Program & Curriculum",
    question: "What makes Walls and Gates Academy different from other summer camps?",
    answer: "We combine an aggressive, results-driven curriculum with a fun, supportive environment, expert instructors, a focus on real-world portfolio building, and an unmatched value proposition including our laptop prize and 10-day guarantee."
  },
  {
    id: 8,
    category: "About the Program & Curriculum",
    question: "Will my child receive a certificate upon completion?",
    answer: "Yes, all students who successfully complete the program will receive a Certificate of Completion from Walls and Gates Academy."
  },
  {
    id: 9,
    category: "About the Program & Curriculum",
    question: "What is the daily schedule like?",
    answer: "Morning Session (9 AM - 12 PM): Theory & Guided Practice; Break (12 PM - 1 PM): Lunch & Recreation; Afternoon Session (1 PM - 4 PM): Project Work & Instructor Support."
  },
  {
    id: 10,
    category: "About the Program & Curriculum",
    question: "How many hours per day will my child be learning?",
    answer: "The program runs for 6 hours per day (breaks not included), 5 days a week, focusing on active learning and project development."
  },
  {
    id: 11,
    category: "About the Program & Curriculum",
    question: "Will there be different levels for different age groups or skill levels?",
    answer: "Yes, while we cater to beginners, students are grouped by age, and instructors are trained to provide differentiated instruction and challenges for those who grasp concepts quickly or have some prior experience."
  },

  // Logistics & Location
  {
    id: 12,
    category: "Logistics & Location",
    question: "Where is the summer program physically located?",
    answer: "The program is exclusively held at our dedicated learning center at 33, Adegoke Surulere, Lagos."
  },
  {
    id: 13,
    category: "Logistics & Location",
    question: "What are the exact dates of the summer program?",
    answer: "The program runs from July 30th to August 25th. Please note the enrollment deadline of August 4th."
  },
  {
    id: 14,
    category: "Logistics & Location",
    question: "What are the class sizes?",
    answer: "We maintain small class sizes to ensure personalized attention and effective learning. Each session is capped to maximize instructor-student interaction."
  },
  {
    id: 15,
    category: "Logistics & Location",
    question: "What equipment or materials does my child need to bring?",
    answer: "Students are encouraged to bring their own laptop (Windows or Mac compatible). We will provide all necessary software tools and materials within the classroom."
  },
  {
    id: 16,
    category: "Logistics & Location",
    question: "Are laptops provided if my child doesn't have one?",
    answer: "While bringing their own is encouraged, we have a limited number of systems available on-site for use during class hours. Please inform us if your child will require one."
  },
  {
    id: 17,
    category: "Logistics & Location",
    question: "Is transportation provided to the Surulere location?",
    answer: "No, transportation to and from the 33, Adegoke Surulere location is the responsibility of the parent/guardian."
  },
  {
    id: 18,
    category: "Logistics & Location",
    question: "Are meals or snacks provided during the program?",
    answer: "Meals are not provided. Students are advised to bring their own packed lunch and snacks. There will be designated break times."
  },
  {
    id: 19,
    category: "Logistics & Location",
    question: "What are the safety measures in place at the facility?",
    answer: "Our facility at 33, Adegoke Surulere is secure and supervised."
  },
  {
    id: 20,
    category: "Logistics & Location",
    question: "What happens if my child misses a day or a session?",
    answer: "We encourage consistent attendance for optimal learning. If a session is missed, our instructors will do their best to help them catch up, but make-up sessions are not guaranteed."
  },

  // Enrollment & Payment
  {
    id: 21,
    category: "Enrollment & Payment",
    question: "What is the total cost of the Walls and Gates Academy Summer Program?",
    answer: "The program is incredibly priced at just N50,000 for a limited time."
  },
  {
    id: 22,
    category: "Enrollment & Payment",
    question: "What does the N50,000 fee include?",
    answer: "The N50,000 fee includes full access to the expert-led Web Development or Graphic Design program, a digital portfolio kickstart, lifetime access to advanced online courses, and the \"Future-Proof Parent\" online resource guide (valued at over N300,000 in total)."
  },
  {
    id: 23,
    category: "Enrollment & Payment",
    question: "What payment methods are accepted?",
    answer: "We accept payments securely via Paystack, which supports various payment options including bank transfer, card payments, and USSD."
  },
  {
    id: 24,
    category: "Enrollment & Payment",
    question: "Is there a payment plan available?",
    answer: "Due to the highly discounted, limited-time offer and the short duration of the program, we are currently only accepting full upfront payments."
  },
  {
    id: 25,
    category: "Enrollment & Payment",
    question: "What is the deadline for enrollment?",
    answer: "The absolute deadline for enrollment is August 4th, 2025. Spots are filling up extremely fast!"
  },
  {
    id: 26,
    category: "Enrollment & Payment",
    question: "Why is there such a strict deadline of August 4th?",
    answer: "This deadline is in place to finalize preparations, secure instructor assignments, and ensure all students are onboarded smoothly before the program commences, maintaining the quality of our intensive curriculum."
  },
  {
    id: 27,
    category: "Enrollment & Payment",
    question: "How many slots are available for the program?",
    answer: "There are LESS THAN 30 slots available specifically for our 33, Adegoke Surulere location. These are expected to sell out very quickly."
  },
  {
    id: 28,
    category: "Enrollment & Payment",
    question: "How can I confirm if there are still slots available?",
    answer: "Our website will have the most up-to-date count of available slots. The \"Only X Slots Remaining\" counter on our homepage and landing page is actively updated."
  },
  {
    id: 29,
    category: "Enrollment & Payment",
    question: "What is the \"10-Day Digital Confidence Guarantee\"?",
    answer: "We are so confident in our program that if, after the first 10 days, you don't see tangible progress in your child's skills and a noticeable boost in their digital confidence, we will give you a full refund. No questions asked. The risk is entirely on us."
  },
  {
    id: 30,
    category: "Enrollment & Payment",
    question: "How do I claim the 10-Day Digital Confidence Guarantee?",
    answer: "If you are not satisfied after 10 days, simply contact our support team at academy@wandggroup.com before the 10-day mark expires, and we will process your full refund."
  },
  {
    id: 31,
    category: "Enrollment & Payment",
    question: "What if the program is cancelled or dates change?",
    answer: "In the unlikely event that Walls and Gates Academy cancels the program, a full refund will be issued to all enrolled students. We will provide ample notice for any changes."
  },

  // Benefits, Outcomes & The Laptop Prize
  {
    id: 32,
    category: "Benefits, Outcomes & The Laptop Prize",
    question: "What are the long-term benefits of this program for my child?",
    answer: "Your child will gain essential 21st-century digital skills, critical thinking, problem-solving abilities, creativity, and a foundational understanding of tech that prepares them for future academic and career success in the digital economy."
  },
  {
    id: 33,
    category: "Benefits, Outcomes & The Laptop Prize",
    question: "Will my child have a portfolio of work after the program?",
    answer: "Yes! A core outcome is helping your child kickstart their digital portfolio with actual projects they built during the program."
  },
  {
    id: 34,
    category: "Benefits, Outcomes & The Laptop Prize",
    question: "Tell me more about the \"Lifetime Access to Advanced Courses\" bonus.",
    answer: "After the summer program, your child will receive access to an exclusive online library of more advanced courses in Web Development or Graphic Design, allowing them to continue learning and deepen their skills at their own pace."
  },
  {
    id: 35,
    category: "Benefits, Outcomes & The Laptop Prize",
    question: "What is the \"Future-Proof Parent Guide\"?",
    answer: "This is a special digital resource designed for parents, offering insights and strategies on how to further support your child's digital learning journey, choose future tech pathways, and stay informed about the digital landscape."
  },
  {
    id: 36,
    category: "Benefits, Outcomes & The Laptop Prize",
    question: "How can this program help my child prepare for future jobs?",
    answer: "Digital skills like web development and graphic design are in extremely high demand globally. This program gives them a competitive edge, fostering skills that are crucial for 85% of jobs by 2030."
  },
  {
    id: 37,
    category: "Benefits, Outcomes & The Laptop Prize",
    question: "What is the laptop prize? Who is eligible?",
    answer: "The most improved student from each session will win a brand new laptop! This isn't about being the \"smartest\" at the start, but about demonstrating the most growth, effort, and dedication throughout the program."
  },
  {
    id: 38,
    category: "Benefits, Outcomes & The Laptop Prize",
    question: "How is the \"most improved student\" determined for the laptop prize?",
    answer: "Our instructors will assess students based on their progress from their starting point, their effort, engagement, problem-solving approach, and the quality of their final project, recognizing true growth."
  },
  {
    id: 39,
    category: "Benefits, Outcomes & The Laptop Prize",
    question: "Is the laptop prize guaranteed for every student?",
    answer: "No, the laptop is a special incentive awarded to the most improved student from each program session to celebrate dedication and progress."
  },

  // Instructors & Learning Environment
  {
    id: 40,
    category: "Instructors & Learning Environment",
    question: "Who are the instructors? What are their qualifications?",
    answer: "Our instructors are experienced tech professionals and educators with a passion for teaching young minds. They have practical industry experience in web development and graphic design and are skilled in making complex topics engaging and easy to understand."
  },
  {
    id: 41,
    category: "Instructors & Learning Environment",
    question: "What is the teaching methodology like?",
    answer: "We use a blend of interactive lectures, live coding/design demonstrations, hands-on projects, collaborative activities, and personalized feedback sessions to ensure deep understanding and practical application."
  },
  {
    id: 42,
    category: "Instructors & Learning Environment",
    question: "How will my child receive support outside of class hours?",
    answer: "Our instructors are available during class hours for one-on-one support. Students also gain access to a private online community for peer support and resource sharing."
  },
  {
    id: 43,
    category: "Instructors & Learning Environment",
    question: "Is the learning environment supportive and encouraging?",
    answer: "Absolutely. We foster a positive, inclusive, and fun learning environment where creativity is encouraged, mistakes are learning opportunities, and every child feels empowered to explore and grow."
  },

  // Post-Program & Community
  {
    id: 44,
    category: "Post-Program & Community",
    question: "What opportunities are available after the summer program?",
    answer: "Beyond the lifetime access to advanced courses, students can join our alumni network, receive updates on tech events, and have pathways to explore further advanced programs with Walls and Gates Academy."
  },
  {
    id: 45,
    category: "Post-Program & Community",
    question: "Is there a community for students to connect after the program?",
    answer: "Yes, we encourage students to join our private online community where they can continue to collaborate, share projects, and get support from peers and Walls and Gates Academy mentors."
  },
  {
    id: 46,
    category: "Post-Program & Community",
    question: "How can I track my child's progress during the program?",
    answer: "We will provide periodic updates on your child's progress. You can also communicate with our instructors during designated times or through our support channels."
  },

  // General Inquiries
  {
    id: 47,
    category: "General Inquiries",
    question: "What if I have more questions not covered here?",
    answer: "Please feel free to reach out to us directly! You can WhatsApp us at 08081787841 or send an email to academy@wandggroup.com."
  },
  {
    id: 48,
    category: "General Inquiries",
    question: "Can I visit the Surulere facility before enrolling?",
    answer: "Due to the intensive nature of the program setup and security, unscheduled visits are not permitted. However, you can contact us to inquire about virtual tours or scheduled open days if available."
  },
  {
    id: 49,
    category: "General Inquiries",
    question: "Is this program suitable for children who are not very tech-savvy?",
    answer: "Yes, definitely! Our program is designed to spark interest and build confidence from the ground up. Many students start with limited tech knowledge and leave feeling empowered and excited about digital creation."
  },
  {
    id: 50,
    category: "General Inquiries",
    question: "How quickly do slots typically fill up for your programs?",
    answer: "Given the high demand for quality tech education and our limited-time offer, our programs, especially those with incentives like the laptop prize, tend to fill up very quickly. We highly recommend enrolling as soon as possible to secure a spot before the August 4th deadline."
  }
]; 
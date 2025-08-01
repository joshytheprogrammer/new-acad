"use client"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import { faqData, FAQItem } from "@/constants";

// Group FAQs by category
const groupedFAQs = faqData.reduce((acc, faq) => {
  if (!acc[faq.category]) {
    acc[faq.category] = [];
  }
  acc[faq.category].push(faq);
  return acc;
}, {} as Record<string, FAQItem[]>);

export default function FAQ() {
  // Get all FAQs in a flat array for numbering
  const allFAQs = Object.values(groupedFAQs).flat();

  const categoryColors: Record<string, string> = {
    'About the Program & Curriculum': 'bg-yellow-400',
    'Logistics & Location': 'bg-red-400', 
    'Enrollment & Payment': 'bg-purple-400',
    'Benefits, Outcomes & The Laptop Prize': 'bg-orange-400',
    'Instructors & Learning Environment': 'bg-blue-400',
    'Post-Program & Community': 'bg-yellow-400'
  };

  // Function to get color for FAQ based on its category
  const getFAQColor = (faq: FAQItem) => {
    return categoryColors[faq.category] || 'bg-gray-400';
  };

  // Function to scroll to a specific FAQ section
  const scrollToCategory = (category: string) => {
    const element = document.getElementById(`category-${category.replace(/\s+/g, '-').toLowerCase()}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <section className="bg-gray-50 py-24 px-4 md:px-8 lg:px-24">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Find answers to common questions about our academy program
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Sidebar - Category Navigation */}
          <div className="lg:col-span-3">
            <div className="sticky top-24 space-y-3 bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h3 className="font-semibold text-gray-900 mb-4 text-sm uppercase tracking-wide">Categories</h3>
              {Object.keys(groupedFAQs).map((category) => (
                <div 
                  key={category} 
                  className="flex items-center space-x-3 py-3 px-2 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                  onClick={() => scrollToCategory(category)}
                >
                  <div className={`w-4 h-4 rounded-full ${categoryColors[category] || 'bg-gray-400'} shadow-sm`}></div>
                  <span className="font-satoshi text-sm font-medium text-gray-700 leading-tight">
                    {category}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Content Area */}
          <div className="lg:col-span-9">
            
            {/* All FAQ List - Including First One */}
            <div className="space-y-3">
              {allFAQs.map((faq, index) => {
                const questionNumber = index + 1; // Start from 1
                const colorClass = getFAQColor(faq);
                const isFirst = index === 0;
                
                return (
                  <div key={faq.id} id={`category-${faq.category.replace(/\s+/g, '-').toLowerCase()}`}>
                    <Accordion type="single" collapsible className="w-full" defaultValue={isFirst ? `item-${faq.id}` : undefined}>
                      <AccordionItem value={`item-${faq.id}`} className="border-0 bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200">
                        <AccordionTrigger className="px-6 py-5 hover:no-underline group data-[state=open]:pb-3">
                          <div className="flex items-center space-x-4 w-full">
                            <div className={`w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-sm ${colorClass} group-hover:scale-105 transition-transform shadow-sm`}>
                              {questionNumber}
                            </div>
                            <span className="font-satoshi text-left font-semibold text-gray-900 group-hover:text-gray-700 transition-colors leading-tight">
                              {faq.question}
                            </span>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="px-16 pb-6 pt-0">
                          <div className="pl-4 ml-1">
                            <p className="font-satoshi text-gray-600 leading-relaxed text-base">
                              {faq.answer}
                            </p>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
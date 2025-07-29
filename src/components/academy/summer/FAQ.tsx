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

  return (
    <section className="bg-white py-24 px-4 md:px-8 lg:px-24 text-center text-gray-800">
      <div className="">
        <h2 className="font-bebas text-4xl md:text-5xl font-bold tracking-tight text-gray-900">
          Have Questions? We&apos;ve Got Answers.
        </h2>
        
        <div className="mt-12 text-left space-y-12">
          {Object.entries(groupedFAQs).map(([category, faqs]) => (
            <div key={category} className="category-section">
              <h3 className="font-bebas text-2xl md:text-3xl font-bold text-gray-900 mb-6 border-b-2 border-gray-200 pb-2">
                {category}
              </h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {faqs.map((faq) => (
                  <Accordion key={faq.id} type="single" collapsible className="w-full">
                    <AccordionItem value={`item-${faq.id}`} className="border-b-0">
                      <AccordionTrigger className="font-bebas text-lg md:text-xl text-left bg-gray-50 p-6 rounded-lg hover:bg-gray-100 transition-colors">
                        {faq.question}
                      </AccordionTrigger>
                      <AccordionContent className="font-satoshi p-6 bg-gray-50 rounded-b-lg text-gray-700 leading-relaxed">
                        {faq.answer}
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
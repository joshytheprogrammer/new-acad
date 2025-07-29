"use client"

import { appendAcademyContactFormToSheet } from "@/lib/googleSheetsAcademContactForm";
import { MailIcon, UserIcon } from "lucide-react"
import { toast } from "sonner";

export default function AcademyContactForm() {
    async function handleContactEntryforAcademy(data: FormData) {
        toast.promise(appendAcademyContactFormToSheet(data), {
            loading: "Submitting contact form...",
            success: (e) => `${e.message}`,
            error: (e) =>`${e.message}`,
        });
        }
    
    return (
    <form className="space-y-6" action={handleContactEntryforAcademy}>
    <div>
        <label className="block text-sm text-gray-200 mb-2">
            Name
        </label>
        <div className="relative">
            <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
            type="text"
            placeholder="Jane Doe"
            name="name"
            required
            className="w-full bg-[#282828] text-white rounded-lg pl-10 pr-3 py-3 outline-none border-none placeholder-gray-400"
            />
        </div>
    </div>
    
    <div>
        <label className="block text-sm text-gray-200 mb-2">
            Email address
        </label>
        <div className="relative">
            <MailIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
            type="email"
            placeholder="janedoe@xmail.com"
            name="email"
            required
            className="w-full bg-[#282828] text-white rounded-lg pl-10 pr-3 py-3 outline-none border-none placeholder-gray-400"
            />
        </div>
        </div>
        
        <div>
        <label className="block text-sm text-gray-200 mb-2">
            Your message
        </label>
        <div className="relative">
            <textarea
            placeholder="How can we help you?"
            name="message"
            className="w-full bg-[#282828] text-white rounded-lg p-3 outline-none border-none placeholder-gray-400 min-h-[120px] resize-none"
            />
        </div>
        </div>
        
        <button
        type="submit"
        className="bg-chambray-800 text-white hover:bg-chambray-700 shadow-md hover:shadow-lg active:scale-95 z-20 text-nowrap max-md:w-full group px-6 py-3 rounded-full font-medium flex items-center justify-center gap-2 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2"
        >
        Send message
        </button>
    </form>
    )
} 
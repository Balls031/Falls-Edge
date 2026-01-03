<<<<<<< HEAD
import Link from 'next/link';
import { Phone } from 'lucide-react';

export default function StickyNote() {
    return (
        <div className="fixed bottom-10 right-6 md:right-10 z-[60] rotate-3 hover:rotate-0 transition-transform duration-300 origin-center group cursor-pointer">
            <a href="tel:+16054137661" className="block relative">
                {/* Shadow */}
                <div className="absolute inset-0 bg-black/20 translate-x-2 translate-y-2 blur-sm rounded-sm group-hover:opacity-0 transition-opacity duration-300" />

                {/* Note Body */}
                <div className="relative bg-[#fef08a] text-black font-sketch p-6 w-[220px] shadow-sm rounded-[1px] border border-yellow-400/30">
                    {/* Tape highlight */}
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-16 h-6 bg-[#ffffff]/30 -rotate-2 backdrop-blur-[1px] shadow-sm border border-white/20" />

                    <p className="text-xl font-bold mb-2 text-center leading-none mt-2">Questions?</p>
                    <p className="text-sm text-center mb-1 font-sans text-gray-800">Call David</p>
                    <div className="flex items-center justify-center gap-2 font-bold text-lg whitespace-nowrap">
                        <Phone size={16} className="fill-black/10" />
                        <span>605-413-7661</span>
                    </div>
                </div>
            </a>
        </div>
    )
}
=======
import Link from 'next/link';
import { Phone } from 'lucide-react';

export default function StickyNote() {
    return (
        <div className="fixed bottom-10 right-6 md:right-10 z-[60] rotate-3 hover:rotate-0 transition-transform duration-300 origin-center group cursor-pointer">
            <a href="tel:+16054137661" className="block relative">
                {/* Shadow */}
                <div className="absolute inset-0 bg-black/20 translate-x-2 translate-y-2 blur-sm rounded-sm group-hover:opacity-0 transition-opacity duration-300" />

                {/* Note Body */}
                <div className="relative bg-[#fef08a] text-black font-sketch p-6 w-[220px] shadow-sm rounded-[1px] border border-yellow-400/30">
                    {/* Tape highlight */}
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-16 h-6 bg-[#ffffff]/30 -rotate-2 backdrop-blur-[1px] shadow-sm border border-white/20" />

                    <p className="text-xl font-bold mb-2 text-center leading-none mt-2">Questions?</p>
                    <p className="text-sm text-center mb-1 font-sans text-gray-800">Call David</p>
                    <div className="flex items-center justify-center gap-2 font-bold text-lg whitespace-nowrap">
                        <Phone size={16} className="fill-black/10" />
                        <span>605-413-7661</span>
                    </div>
                </div>
            </a>
        </div>
    )
}
>>>>>>> f23c7ec5816116c984b5737788af5cbb8de299c1

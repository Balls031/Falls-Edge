'use client';

interface RealtorProps {
    name?: string;
    phone?: string;
    title?: string;
    image?: string;
    agency?: string;
}

interface ContactCardProps {
    realtor?: RealtorProps | null;
    className?: string;
    // Fallback props
    name?: string;
    phone?: string;
    title?: string;
    image?: string;
    agency?: string;
}

export default function ContactCard({ realtor, className = '', name, phone, title, image, agency }: ContactCardProps) {
    const data = realtor || {
        name: name || 'David',
        phone: phone || '(605) 413-7661',
        title: title || 'Project Lead / Builder',
        image,
        agency
    };

    const phoneHref = (data.phone || '').replace(/[^0-9]/g, '');

    return (
        <div className={`relative border border-blueprint-line p-6 w-full text-center bg-blueprint/70 backdrop-blur-md group text-white flex flex-col justify-center ${className}`}>
            {/* Technical corners */}
            <div className="absolute -top-1 -left-1 w-3 h-3 border-t border-l border-white/50" />
            <div className="absolute -top-1 -right-1 w-3 h-3 border-t border-r border-white/50" />
            <div className="absolute -bottom-1 -left-1 w-3 h-3 border-b border-l border-white/50" />
            <div className="absolute -bottom-1 -right-1 w-3 h-3 border-b border-r border-white/50" />

            <div className="flex items-center gap-4 text-left">
                {/* Photo */}
                {data.image ? (
                    <img src={data.image} alt={data.name} className="w-16 h-16 rounded-full object-cover border border-blueprint-accent/50" />
                ) : (
                    <div className="w-16 h-16 rounded-full bg-blueprint-line flex items-center justify-center border border-white/10">
                        <span className="text-xl font-bold text-white/30">{data.name?.charAt(0)}</span>
                    </div>
                )}

                {/* Details */}
                <div className="flex-1">
                    <h3 className="font-sketch text-xl text-white font-bold leading-none mb-1">{data.name}</h3>
                    <p className="font-tech text-xs text-blueprint-accent tracking-[0.2em] uppercase mb-1">{data.title}</p>
                    {data.agency && (
                        <p className="font-mono text-[10px] text-white/60 mb-1 uppercase tracking-wider">{data.agency}</p>
                    )}
                    <a href={`tel:+1${phoneHref}`} className="block text-lg font-tech text-white hover:text-blueprint-accent transition-colors">
                        {data.phone}
                    </a>
                </div>
            </div>

            {/* CTA Button - kept valid for main contact card? Or conditionally hide? 
                User didn't specify removing it, but "second realtor size of design narrative" 
                might imply compact. Let's keep it but make it possibly optional if we supported that.
                For now, keeping it as it looks good.
            */}
            <div className="mt-6 pt-4 border-t border-blueprint-line/30">
                <button className="relative w-full py-2 border border-blueprint-accent text-blueprint-accent hover:text-black font-bold uppercase tracking-widest text-[10px] overflow-hidden group transition-colors">
                    <span className="relative z-10 group-hover:text-black transition-colors">Request a Build</span>
                    <div className="absolute inset-0 bg-blueprint-accent translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out z-0" />
                </button>
            </div>
        </div>
    )
}

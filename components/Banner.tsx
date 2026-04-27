import Image from "next/image";

export default function Banner() {
    return (
        <section className="relative w-full h-[450px] sm:h-[500px] md:h-[600px] overflow-hidden">
            {/* Background Image */}
            <Image
                src="https://content.jdmagicbox.com/v2/comp/madurai/l2/0452px452.x452.250409040028.q5l2/catalogue/haya-fashion-anna-nagar-madurai-readymade-garment-retailers-8r8a79urlq.jpg"
                alt="Luxury Boutique Interior"
                fill
                className="object-cover"
                priority
            />

            {/* Overlay */}
            {/* <div className="absolute inset-0 bg-black/20 flex flex-col items-center justify-center text-center px-4 sm:px-6">
                <div className="max-w-4xl animate-in fade-in slide-in-from-bottom-8 duration-1000">
                    <span className="text-white/90 text-[10px] sm:text-sm tracking-[0.3em] font-medium uppercase mb-3 sm:mb-4 block">
                        New Arrivals
                    </span>
                    <h1 className="text-3xl sm:text-6xl md:text-7xl font-serif text-white mb-6 sm:mb-8 leading-tight">
                        Timeless Elegance <br /> for Modern Grace
                    </h1>
                    <button className="bg-white text-[#0a5328] px-6 sm:px-12 py-3 sm:py-4 text-xs sm:text-base font-semibold tracking-widest uppercase hover:bg-[#0a5328] hover:text-white transition-all duration-300 shadow-xl">
                        Explore Collection
                    </button>
                </div>
            </div>

            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/20 to-transparent pointer-events-none"></div>
         */}

        </section>
    );
}

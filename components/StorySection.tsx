import Image from "next/image";

interface StorySectionProps {
    title: string;
    description: string;
    buttonText: string;
    imageSrc: string;
    imageLeft?: boolean;
}

export default function StorySection({
    title,
    description,
    buttonText,
    imageSrc,
    imageLeft = false
}: StorySectionProps) {
    return (
        <section className="max-w-[1440px] mx-auto px-4 sm:px-12 py-12 sm:py-18">
            <div className={`flex flex-col ${imageLeft ? 'md:flex-row-reverse' : 'md:flex-row'} bg-[#f9f8f4] rounded-[1.5rem] sm:rounded-[2rem] overflow-hidden shadow-sm`}>

                {/* Text Content */}
                <div className="flex-1 p-8 sm:p-16 lg:p-20 flex flex-col justify-center items-start order-2 md:order-1">
                    <h2 className="text-2xl sm:text-4xl font-serif text-[#5a4636] mb-4 sm:mb-6 italic tracking-wide">
                        {title}
                    </h2>
                    <p className="text-xs sm:text-base text-[#7a6a5a] leading-relaxed tracking-wide mb-8 sm:mb-10 max-w-md italic">
                        {description}
                    </p>
                    <button className="bg-[#5a4636] text-white px-8 sm:px-10 py-2.5 sm:py-3 rounded-full text-xs sm:text-sm font-medium hover:opacity-90 transition-all italic shadow-lg">
                        {buttonText}
                    </button>
                </div>

                {/* Image Content */}
                <div className="flex-1 relative h-[300px] sm:h-[400px] md:h-[500px] order-1 md:order-2">
                    <Image
                        src={imageSrc}
                        alt={title}
                        fill
                        className="object-cover"
                    />
                </div>

            </div>
        </section>
    );
}

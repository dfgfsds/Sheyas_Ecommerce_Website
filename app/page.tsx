import EleganceSection from "@/components/EleganceSection";
import Banner from "@/components/Banner";
import ProductCard from "@/components/ProductCard";
import StorySection from "@/components/StorySection";
import { products } from "@/data/products";

export default function Home() {
  const featuredProducts = products.slice(0, 4);

  return (
    <div className="bg-white">
      <EleganceSection />
      
      <Banner />

      {/* Featured Collection Section */}
      <section className="max-w-[1440px] mx-auto px-4 sm:px-12 py-12 sm:py-16">
        <div className="flex items-center justify-between mb-8 sm:mb-10">
          <h2 className="text-xl sm:text-3xl font-serif text-[#031c06] italic">Eid Collection Highlights</h2>
          <a href="/eid-collection" className="text-xs sm:text-base text-[#031c06] border-b border-[#031c06] pb-1 hover:opacity-70 transition-all italic whitespace-nowrap">
            View All
          </a>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Story Sections */}
      <StorySection 
        title="Exquisite Craftsmanship"
        description="Each abaya is thoughtfully designed to enhance your grace and confidence."
        buttonText="Contact Us"
        imageSrc="/craftsmanship.png"
      />

      <StorySection 
        title="About Us"
        description="At Sakina Abaya, we believe an abaya is more than just clothing – it's an expression of faith, grace, and individuality."
        buttonText="Shop all"
        imageSrc="/about_us.png"
        imageLeft={true}
      />
      
    </div>
  );
}

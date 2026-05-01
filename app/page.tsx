"use client";

import EleganceSection from "@/components/EleganceSection";
import Banner from "@/components/Banner";
import ProductCard, { Product } from "@/components/ProductCard";
import StorySection from "@/components/StorySection";
import { useProducts } from "@/context/ProductsContext";

export default function Home() {
  const { products: apiProducts, isLoading } = useProducts();

  const displayProducts = apiProducts?.length > 0 ? apiProducts.map((p: any) => {
    let imageUrl = (p.image_urls && p.image_urls[0]) || p.product_image || "/placeholder-image.jpg";
    if (imageUrl.includes("http://ip/")) {
      imageUrl = imageUrl.replace("http://ip/", "http://82.29.161.36/");
    }

    return {
      id: p.id,
      name: p.name || p.product_name || "Unnamed Product",
      oldPrice: `₹${p.discount || p.price}`,
      newPrice: `₹${p.price}`,
      rating: p.ratings || 0,
      reviews: 0,
      image: imageUrl,
      onSale: p.discount ? parseFloat(p.discount) > parseFloat(p.price) : false,
      categoryName: p.category_name || "Collection",
    };
  }) : [] as Product[];

  const featuredProducts = displayProducts.slice(0, 4);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#000000]"></div>
      </div>
    );
  }

  return (
    <div className="bg-white">
      <EleganceSection />

      <Banner />

      {/* Featured Collection Section */}
      <section className="max-w-[1440px] mx-auto px-4 sm:px-12 py-12 sm:py-16">
        <div className="flex items-center justify-between mb-8 sm:mb-10">
          <h2 className="text-xl sm:text-3xl font-serif text-[#000000] italic">Eid Collection Highlights</h2>
          <a href="/eid-collection" className="text-xs sm:text-base text-[#000000] border-b border-[#000000] pb-1 hover:opacity-70 transition-all italic whitespace-nowrap">
            View All
          </a>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {featuredProducts.map((product: Product) => (
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
        description="At Sheyas, we believe an abaya is more than just clothing – it's an expression of faith, grace, and individuality."
        buttonText="Shop all"
        imageSrc="/about_us.png"
        imageLeft={true}
      />

    </div>
  );
}

"use client";

import EleganceSection from "@/components/EleganceSection";
import Banner from "@/components/Banner";
import ProductCard, { Product } from "@/components/ProductCard";
import CategoryCard from "@/components/CategoryCard";
import StorySection from "@/components/StorySection";
import AboutSection from "@/components/AboutSection";
import { motion } from "framer-motion";
import { useProducts } from "@/context/ProductsContext";
import { useCategories } from "@/context/CategoriesContext";
import Link from "next/link";

export default function Home() {
  const { products: apiProducts, isLoading } = useProducts();
  const { categories: apiCategories, isLoading: isCategoriesLoading } = useCategories();

  const categoriesArray = apiCategories?.data || apiCategories || [];
  const displayCategories = categoriesArray?.length > 0 ? categoriesArray.map((c: any) => {
    let imageUrl = c.image || "/placeholder-image.jpg";
    if (imageUrl.includes("http://ip/")) {
      imageUrl = imageUrl.replace("http://ip/", "http://82.29.161.36/");
    }
    return {
      id: c.id,
      name: c.name || "Unnamed Category",
      slug: c.slug || c.name?.toLowerCase().replace(/\s+/g, '-'),
      image: imageUrl,
    };
  }) : [];
  const featuredCategories = displayCategories.slice(0, 4);

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


      {/* Categories Section */}
      {featuredCategories.length > 0 && (
        <section className="max-w-[1440px] mx-auto px-4 sm:px-12 py-12 sm:py-16">
          <motion.div
            className="flex items-center justify-between mb-8 sm:mb-10"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-xl sm:text-3xl font-serif text-[#000000] italic">Shop by Category</h2>
            <Link href="/categories" className="px-6 sm:px-8 py-3 sm:py-4 bg-black text-white rounded-full text-[10px] sm:text-xs font-bold shadow-xl hover:opacity-90 transition-all flex items-center justify-center uppercase tracking-widest whitespace-nowrap">
              View All
            </Link>
          </motion.div>

          <motion.div
            className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6"
            initial="hidden"
            whileInView="visible"
            viewport={{ margin: "-100px" }}
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: { staggerChildren: 0.1 }
              }
            }}
          >
            {featuredCategories.map((category: any) => (
              <motion.div
                key={category.id}
                variants={{
                  hidden: { opacity: 0, y: 30 },
                  visible: { opacity: 1, y: 0 }
                }}
                transition={{ duration: 0.5 }}
              >
                <CategoryCard category={category} />
              </motion.div>
            ))}
          </motion.div>
        </section>
      )}

      {/* Featured Collection Section */}
      {featuredProducts.length > 0 && (
        <section className="max-w-[1440px] mx-auto px-4 sm:px-12 pt-6 pb-12 sm:py-8 sm:pb-16">
          <motion.div
            className="flex items-center justify-between mb-8 sm:mb-10"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-xl sm:text-3xl font-serif text-[#000000] italic">Explore Our Collections</h2>
            <a href="/products" className="px-6 sm:px-8 py-3 sm:py-4 bg-black text-white rounded-full text-[10px] sm:text-xs font-bold shadow-xl hover:opacity-90 transition-all flex items-center justify-center uppercase tracking-widest whitespace-nowrap">
              View All
            </a>
          </motion.div>

          <motion.div
            className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6"
            initial="hidden"
            whileInView="visible"
            viewport={{ margin: "-100px" }}
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.1
                }
              }
            }}
          >
            {featuredProducts.map((product: Product) => (
              <motion.div
                key={product.id}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0 }
                }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </motion.div>
        </section>
      )}

      {/* Story Sections */}
      <StorySection
        title="About Us"
        description="At Sheyas, we believe an abaya is more than just clothing - it's an expression of faith, grace, and individuality."
        buttonText="Shop all"
        buttonLink="/products"
        imageSrc="/about_us.png"
        imageLeft={true}
      />

      <AboutSection
        title="Exquisite Craftsmanship"
        description="Each abaya is thoughtfully designed to enhance your grace and confidence."
        buttonText="Contact Us"
        buttonLink="/contact"
        imageSrc="/craftsmanship.png"
      />

    </div>
  );
}

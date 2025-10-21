import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import ProductCard from "@/components/ProductCard";
import { extendedProducts } from "@/lib/extendedMockData";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import heroBanner from "@/assets/hero-banner.jpg";
import menCategory from "@/assets/categories/men.jpg";
import womenCategory from "@/assets/categories/women.jpg";
import unisexCategory from "@/assets/categories/unisex.jpg";

const Home = () => {
  const featuredProducts = extendedProducts
    .filter((p) => p.isFeatured)
    .slice(0, 4);
  const newProducts = extendedProducts.filter((p) => p.isNew).slice(0, 4);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section
        className="relative bg-gradient-to-br from-primary/5 to-secondary py-20 md:py-32 overflow-hidden"
        style={{
          backgroundImage: `linear-gradient(135deg, hsl(var(--primary) / 0.05), hsl(var(--secondary))), url(${heroBanner})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl"
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">
              Elevate Your
              <br />
              Everyday Style
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl">
              Discover our curated collection of contemporary clothing designed
              for the modern wardrobe.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button size="lg" asChild>
                <Link to="/new">
                  Shop New Arrivals
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to="/women">Explore Collections</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { title: "Men", path: "/men", image: menCategory },
              { title: "Women", path: "/women", image: womenCategory },
              { title: "Unisex", path: "/unisex", image: unisexCategory },
            ].map((category, index) => (
              <motion.div
                key={category.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <Link
                  to={category.path}
                  className="group block relative overflow-hidden rounded-lg aspect-[4/5] hover-lift"
                >
                  <img
                    src={category.image}
                    alt={category.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-6 left-6">
                    <h3 className="text-2xl font-semibold text-white mb-2">
                      {category.title}
                    </h3>
                    <span className="text-white/90 text-sm flex items-center">
                      Shop Now <ArrowRight className="ml-2 h-4 w-4" />
                    </span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* New Arrivals */}
      <section className="py-16 bg-secondary/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold mb-2">New Arrivals</h2>
              <p className="text-muted-foreground">Fresh styles just landed</p>
            </div>
            <Button variant="outline" asChild>
              <Link to="/new">View All</Link>
            </Button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {newProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h2 className="text-3xl font-bold mb-2">Featured</h2>
            <p className="text-muted-foreground">Handpicked favorites</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;

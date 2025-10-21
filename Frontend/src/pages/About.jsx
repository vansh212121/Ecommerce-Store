import { motion } from "framer-motion";

const About = () => {
  return (
    <div className="min-h-screen py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          <div>
            <h1 className="text-4xl font-bold mb-4">About Atelier</h1>
            <p className="text-xl text-muted-foreground">
              Redefining contemporary fashion with timeless elegance
            </p>
          </div>

          <div className="space-y-6 text-muted-foreground">
            <p className="text-lg">
              Founded in 2025, Atelier emerged from a simple vision: to create
              clothing that transcends trends while embracing modern
              sensibilities. We believe that true style is personal,
              intentional, and enduring.
            </p>

            <p>
              Our curated collections blend classic silhouettes with
              contemporary details, crafted from premium materials sourced
              responsibly from around the world. Each piece is designed to
              become a staple in your wardrobe—versatile, refined, and built to
              last.
            </p>

            <p>
              We're committed to sustainable practices throughout our supply
              chain, from ethical manufacturing to minimal packaging. Fashion
              should feel good in every sense of the word.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 pt-8">
            <div>
              <h3 className="text-xl font-semibold mb-2">Quality First</h3>
              <p className="text-muted-foreground">
                Premium materials and expert craftsmanship in every piece
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">Timeless Design</h3>
              <p className="text-muted-foreground">
                Classic styles that evolve with you, not fast fashion
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">Sustainability</h3>
              <p className="text-muted-foreground">
                Ethical production and responsible sourcing practices
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default About;

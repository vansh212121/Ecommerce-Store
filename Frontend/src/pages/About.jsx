import { motion } from "framer-motion";

const About = () => {
  return (
    <div className="min-h-screen py-16 bg-gradient-to-b from-background to-secondary/20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-12"
        >
          {/* Header Section */}
          <div className="text-center space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-4">
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span className="text-sm font-medium text-primary">Our Story</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
              About Atelier
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Redefining contemporary fashion with timeless elegance
            </p>
          </div>

          {/* Main Content */}
          <div className="space-y-8">
            <div className="bg-card rounded-2xl p-8 border border-border hover-lift">
              <div className="space-y-6">
                <p className="text-lg leading-relaxed text-muted-foreground">
                  Founded in 2025, Atelier emerged from a simple vision: to create
                  clothing that transcends trends while embracing modern
                  sensibilities. We believe that true style is personal,
                  intentional, and enduring.
                </p>

                <p className="leading-relaxed text-muted-foreground">
                  Our curated collections blend classic silhouettes with
                  contemporary details, crafted from premium materials sourced
                  responsibly from around the world. Each piece is designed to
                  become a staple in your wardrobe—versatile, refined, and built to
                  last.
                </p>

                <p className="leading-relaxed text-muted-foreground">
                  We're committed to sustainable practices throughout our supply
                  chain, from ethical manufacturing to minimal packaging. Fashion
                  should feel good in every sense of the word.
                </p>
              </div>
            </div>

            {/* Values Grid */}
            <div className="grid md:grid-cols-3 gap-6 pt-4">
              <div className="bg-card rounded-xl p-6 border border-border hover-lift group">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <div className="w-6 h-6 rounded-full bg-primary/60" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Quality First</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Premium materials and expert craftsmanship in every piece
                </p>
              </div>
              
              <div className="bg-card rounded-xl p-6 border border-border hover-lift group">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <div className="w-6 h-3 bg-primary/60 rounded-full" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Timeless Design</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Classic styles that evolve with you, not fast fashion
                </p>
              </div>
              
              <div className="bg-card rounded-xl p-6 border border-border hover-lift group">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <div className="w-4 h-4 border-2 border-primary/60 rounded-full" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Sustainability</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Ethical production and responsible sourcing practices
                </p>
              </div>
            </div>
          </div>

          {/* Stats Section */}
          <div className="bg-card rounded-2xl p-8 border border-border">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              <div>
                <div className="text-2xl font-bold text-foreground">50+</div>
                <div className="text-sm text-muted-foreground mt-1">Styles</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-foreground">3</div>
                <div className="text-sm text-muted-foreground mt-1">Collections</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-foreground">15+</div>
                <div className="text-sm text-muted-foreground mt-1">Countries</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-foreground">2025</div>
                <div className="text-sm text-muted-foreground mt-1">Founded</div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default About;
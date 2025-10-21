import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { motion } from "framer-motion";
import { HelpCircle, MessageCircle, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState } from "react";

const FAQ = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const faqs = [
    {
      question: "What is your return policy?",
      answer:
        "We offer a 30-day return policy for all unworn items with original tags attached. Returns are free for exchanges, or a $10 shipping fee applies for refunds.",
      category: "orders",
    },
    {
      question: "How long does shipping take?",
      answer:
        "Standard shipping takes 5-7 business days. Express shipping (2-3 days) is available at checkout. International orders typically arrive within 10-14 business days.",
      category: "shipping",
    },
    {
      question: "Do you ship internationally?",
      answer:
        "Yes! We ship to over 50 countries worldwide. Shipping costs and delivery times vary by destination and will be calculated at checkout.",
      category: "shipping",
    },
    {
      question: "How do I track my order?",
      answer:
        "Once your order ships, you'll receive a tracking number via email. You can also view tracking information in your account under Order History.",
      category: "orders",
    },
    {
      question: "What sizes do you offer?",
      answer:
        "We offer sizes XS-XXL for most items. Detailed size charts are available on each product page. If you need help finding your size, contact our customer service team.",
      category: "products",
    },
    {
      question: "Are your products sustainable?",
      answer:
        "Yes, sustainability is core to our mission. We use organic and recycled materials wherever possible and work with ethical manufacturers. Each product page includes sustainability information.",
      category: "products",
    },
    {
      question: "How can I contact customer service?",
      answer:
        "You can reach us at support@atelier.com or call +1 (555) 123-4567 Monday-Friday, 9am-6pm EST. We typically respond to emails within 24 hours.",
      category: "support",
    },
    {
      question: "Do you offer gift cards?",
      answer:
        "Yes! Digital gift cards are available in denominations from $25 to $500. They never expire and can be used online or in-store.",
      category: "orders",
    },
  ];

  const filteredFaqs = faqs.filter(
    (faq) =>
      faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const categories = [
    {
      name: "orders",
      label: "Orders & Returns",
      count: faqs.filter((f) => f.category === "orders").length,
    },
    {
      name: "shipping",
      label: "Shipping",
      count: faqs.filter((f) => f.category === "shipping").length,
    },
    {
      name: "products",
      label: "Products",
      count: faqs.filter((f) => f.category === "products").length,
    },
    {
      name: "support",
      label: "Support",
      count: faqs.filter((f) => f.category === "support").length,
    },
  ];

  return (
    <div className="min-h-screen py-16 bg-gradient-to-b from-background to-secondary/20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-4">
            <HelpCircle className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-primary">FAQ</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Find answers to common questions about orders, shipping, and more
          </p>
        </motion.div>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search questions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 pr-4 py-3 bg-card border-border rounded-xl"
            />
          </div>
        </motion.div>

        {/* FAQ Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-6"
        >
          {/* Categories */}
          <div className="flex flex-wrap gap-3 justify-center mb-8">
            {categories.map((category) => (
              <button
                key={category.name}
                className="px-4 py-2 rounded-full bg-secondary text-sm font-medium text-muted-foreground hover:bg-primary/10 hover:text-primary transition-colors"
              >
                {category.label} ({category.count})
              </button>
            ))}
          </div>

          {/* FAQ Accordion */}
          <div className="space-y-4">
            {filteredFaqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + index * 0.05 }}
              >
                <Accordion type="single" collapsible>
                  <AccordionItem
                    value={`item-${index}`}
                    className="bg-card border border-border rounded-xl px-6 hover-lift"
                  >
                    <AccordionTrigger className="text-left font-semibold hover:no-underline py-4">
                      <div className="flex items-start gap-4">
                        <div className="p-2 bg-primary/10 rounded-lg mt-1">
                          <HelpCircle className="h-4 w-4 text-primary" />
                        </div>
                        <span>{faq.question}</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground pb-4 pl-12">
                      <div className="border-l-2 border-primary/20 pl-4">
                        {faq.answer}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </motion.div>
            ))}
          </div>

          {filteredFaqs.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <div className="bg-card rounded-2xl p-8 border border-border">
                <MessageCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No results found</h3>
                <p className="text-muted-foreground mb-4">
                  We couldn't find any questions matching "{searchTerm}"
                </p>
                <button
                  onClick={() => setSearchTerm("")}
                  className="text-primary hover:underline font-medium"
                >
                  Clear search and show all questions
                </button>
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-16 text-center"
        >
          <div className="bg-card rounded-2xl p-8 border border-border max-w-2xl mx-auto">
            <h3 className="text-xl font-semibold mb-3">
              Still have questions?
            </h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Can't find the answer you're looking for? Our support team is here
              to help.
            </p>
            <a
              href="/contact"
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
            >
              <MessageCircle className="h-4 w-4" />
              Contact Support
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default FAQ;

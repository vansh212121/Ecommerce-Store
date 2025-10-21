import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { motion } from "framer-motion";

const FAQ = () => {
  const faqs = [
    {
      question: "What is your return policy?",
      answer:
        "We offer a 30-day return policy for all unworn items with original tags attached. Returns are free for exchanges, or a $10 shipping fee applies for refunds.",
    },
    {
      question: "How long does shipping take?",
      answer:
        "Standard shipping takes 5-7 business days. Express shipping (2-3 days) is available at checkout. International orders typically arrive within 10-14 business days.",
    },
    {
      question: "Do you ship internationally?",
      answer:
        "Yes! We ship to over 50 countries worldwide. Shipping costs and delivery times vary by destination and will be calculated at checkout.",
    },
    {
      question: "How do I track my order?",
      answer:
        "Once your order ships, you'll receive a tracking number via email. You can also view tracking information in your account under Order History.",
    },
    {
      question: "What sizes do you offer?",
      answer:
        "We offer sizes XS-XXL for most items. Detailed size charts are available on each product page. If you need help finding your size, contact our customer service team.",
    },
    {
      question: "Are your products sustainable?",
      answer:
        "Yes, sustainability is core to our mission. We use organic and recycled materials wherever possible and work with ethical manufacturers. Each product page includes sustainability information.",
    },
    {
      question: "How can I contact customer service?",
      answer:
        "You can reach us at support@atelier.com or call +1 (555) 123-4567 Monday-Friday, 9am-6pm EST. We typically respond to emails within 24 hours.",
    },
    {
      question: "Do you offer gift cards?",
      answer:
        "Yes! Digital gift cards are available in denominations from $25 to $500. They never expire and can be used online or in-store.",
    },
  ];

  return (
    <div className="min-h-screen py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-xl text-muted-foreground">
            Find answers to common questions
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="border border-border rounded-lg px-6"
              >
                <AccordionTrigger className="text-left font-medium">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-12 text-center"
        >
          <p className="text-muted-foreground mb-4">Still have questions?</p>
          <a
            href="/contact"
            className="text-primary hover:underline font-medium"
          >
            Contact our support team →
          </a>
        </motion.div>
      </div>
    </div>
  );
};

export default FAQ;

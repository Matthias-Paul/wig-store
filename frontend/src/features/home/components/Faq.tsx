import { Accordion } from "@/src/components/ui/Accordion";

const FAQ_ITEMS = [
  {
    question: "How long does delivery take?",
    answer:
      "Orders within Lagos typically arrive within 2-3 business days. Deliveries to other states may take 3-7 business days depending on your location.",
  },
  {
    question: "Is the hair 100% human hair?",
    answer:
      "Except the Hair blend category which is a mixture of human hair and synthetic, All our bundles, closures, and wigs are made from premium quality human hair, carefully sourced and processed for durability and a natural look.",
  },
  {
    question: "Is delivery free ?",
    answer: "No, you do have to pay delivery fee and prices vary by state.",
  },
  {
    question: "Can I return or exchange an item?",
    answer:
      "Due to the nature of hair products, we only accept returns for items that are unopened, unused, and in their original packaging, within 3 days of delivery. Contact us before initiating a return.",
  },
  {
    question: "What payment methods do you accept?",
    answer:
      "We accept card payments, bank transfers, and USSD through our secure payment partner, Paystack.",
  },
  {
    question: "How do I track my order?",
    answer:
      "Once logged in, go to 'My Orders' to see the current status of your order — from processing, to shipped, to delivered. You'll also receive email updates at each stage.",
  },
  {
    question: "Do I need an account to shop?",
    answer:
      "You can browse and add items to your cart without an account, but you'll need to sign in with Google to complete checkout — it only takes one click.",
  },
];

export default function FAQPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <h1 className="font-heading text-3xl text-center text-gray-900">
        Frequently Asked Questions
      </h1>
      <p className="text-gray-500 text-sm text-center mt-2">
        Everything you need to know before you shop.
      </p>

      <div className="mt-10">
        <Accordion items={FAQ_ITEMS} />
      </div>

      <div className="text-center mt-10">
        <p className="text-sm text-gray-500">Still have questions?</p>
        <a
          href="mailto:support@rockshairmpire.com"
          className="text-brand text-sm font-medium hover:underline"
        >
          Contact our support team
        </a>
      </div>
    </div>
  );
}

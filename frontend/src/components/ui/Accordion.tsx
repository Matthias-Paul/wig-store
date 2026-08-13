"use client";

import { useState, ReactNode } from "react";
import { ChevronDown } from "lucide-react";
import { clsx } from "clsx";

interface AccordionItem {
  question: string;
  answer: ReactNode;
}

export function Accordion({ items }: { items: AccordionItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  function toggle(index: number) {
    setOpenIndex((current) => (current === index ? null : index));
  }

  return (
    <div className="divide-y divide-gray-200 border-t border-b border-gray-200">
      {items.map((item, index) => {
        const isOpen = openIndex === index;
        return (
          <div key={index}>
            <button
              onClick={() => toggle(index)}
              aria-expanded={isOpen}
              className="w-full flex items-center justify-between py-4 text-left"
            >
              <span className="font-medium text-gray-900 pr-4">
                {item.question}
              </span>
              <ChevronDown
                size={18}
                className={clsx(
                  "flex-shrink-0 text-gray-400 transition-transform",
                  isOpen && "rotate-180",
                )}
              />
            </button>
            <div
              className={clsx(
                "grid transition-all duration-200 ease-in-out",
                isOpen
                  ? "grid-rows-[1fr] opacity-100"
                  : "grid-rows-[0fr] opacity-0",
              )}
            >
              <div className="overflow-hidden">
                <p className="text-sm text-gray-600 pb-4 leading-relaxed">
                  {item.answer}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

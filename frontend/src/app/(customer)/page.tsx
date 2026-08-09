'use client';

import { Avatar } from "@/src/components/ui/Avatar";
import { Badge } from "@/src/components/ui/Badge";
import { Button } from "@/src/components/ui/Button";
import { Card } from "@/src/components/ui/Card";
import { DateTimePicker } from "@/src/components/ui/DatePicker";
import { EmptyState } from "@/src/components/ui/EmptyState";
import { Input } from "@/src/components/ui/Input";
// import { Modal } from "@/src/components/ui/Modal";
import { SearchInput } from "@/src/components/ui/SearchInput";
import { Select } from "@/src/components/ui/Select";
import { Skeleton } from "@/src/components/ui/Skeleton";
import { Spinner } from "@/src/components/ui/Spinner";
import { Textarea } from "@/src/components/ui/Textarea";
import Image from "next/image";
import {AuthStatus} from "@/src/features/auth/AuthTest"

export default function Home() {
  return (
    <div className="flex pb-100 flex-col space-y-10 flex-1 items-center bg-white justify-center">
      <h1 className="font-heading text-4xl text-brand">
        Welcome to Rockshairmpire
      </h1>
      <p className="font-sans text-gray-600">
        Quality hair, delivered with care.
      </p>
      <Button variant="gold" size="lg">
        Click me
      </Button>
      <Button variant="outline" className="w-full max-w-md">
        Click me
      </Button>

      <Input label="Email" type="email" placeholder="Enter your email" />
      <SearchInput placeholder="Search..." />
      <Select
        label="Country"
        options={[
          { label: "United States", value: "us" },
          { label: "Canada", value: "ca" },
          { label: "United Kingdom", value: "uk" },
        ]}
      />

      <Textarea label="Message" placeholder="Enter your message" />
      <DateTimePicker label="Appointment" />

      <Card padding="none" className="overflow-hidden">
        <Image
          src="https://res.cloudinary.com/drkxtuaeg/image/upload/v1785842112/lxvaiiwhocdppargd5bc.jpg"
          alt="Kimkay Closure"
          width={500}
          height={300}
          className="w-full h-48 object-cover"
        />
        <div className="p-4">
          <h3 className="font-heading text-black text-lg">Kimkay Closure</h3>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-brand font-semibold">₦20,000</span>
            <span className="text-gray-400 line-through text-sm">₦25,000</span>
            <Badge variant="gold">20% OFF</Badge>
          </div>
          <Button variant="primary" className="w-full mt-3">
            Add to Cart
          </Button>
        </div>
      </Card>

      <Skeleton className="w-64 h-8" />
      <Skeleton className="w-64 h-4" />
      <Skeleton className="w-64 h-4" />
      <Skeleton className="w-64 h-4" />

      <Spinner size="md" className="text-brand" />

      {/* <Modal isOpen={true} onClose={() => {}} title="Sample Modal">
        <p>This is a sample modal content.</p>
      </Modal> */}

      <Avatar name="John Doe" size="md" />

      <EmptyState
        icon={<div className="text-gray-300">🔍</div>}
        title="No results found"
        description="Try adjusting your search or filter to find what you're looking for."
        action={<Button variant="primary">Browse Products</Button>}
      />

      <AuthStatus />
    </div>
  );
}

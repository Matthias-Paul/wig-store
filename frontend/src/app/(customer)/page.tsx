import { Button } from "@/src/components/ui/Button";


export default function Home() {
  return (
    <div className="flex pb-100 flex-col space-y-10 flex-1 items-center bg-white justify-center">
      <h1 className="font-heading text-4xl text-brand">
        Welcome to Rockshairmpire
      </h1>
      <p className="font-sans text-gray-600">
        Quality hair, delivered with care.
      </p>
      <Button>Click me</Button>
    </div>
  );
}

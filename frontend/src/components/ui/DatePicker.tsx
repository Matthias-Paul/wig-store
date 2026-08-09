import { Input } from "./Input";

export function DateTimePicker(props: React.ComponentProps<typeof Input>) {
  return <Input type="datetime-local" {...props} />;
}

import { AddConcertForm } from "@/components/AddConcertForm";
import { PageHeader } from "@/components/ui/PageHeader";

export default function AddConcertPage() {
  return (
    <div>
      <PageHeader
        title="Add Concert"
        subtitle="Log a show you attended — we'll add up costs and fun value for you"
      />
      <AddConcertForm />
    </div>
  );
}

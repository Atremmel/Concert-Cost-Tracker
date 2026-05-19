import { ConcertsList } from "@/components/ConcertsList";
import { PageHeader } from "@/components/ui/PageHeader";

export default function MyConcertsPage() {
  return (
    <div>
      <PageHeader
        title="My Concerts"
        subtitle="Every show you've logged, with costs and fun scores"
      />
      <ConcertsList />
    </div>
  );
}

import { ConcertDetail } from "@/components/ConcertDetail";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function ConcertDetailPage({ params }: PageProps) {
  const { id } = await params;
  return <ConcertDetail concertId={id} />;
}

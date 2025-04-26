import { redirect } from 'next/navigation';

export default async function PortfolioCategoryPage({
  params,
}: {
  params: { category: string };
}) {
  redirect(`/en/portfolio/${params.category}`);
}

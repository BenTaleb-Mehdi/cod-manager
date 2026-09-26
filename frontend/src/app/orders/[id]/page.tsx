import { redirect } from "next/navigation";

export default function OrderDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  redirect(`/orders/${params.id}/tracking`);
}

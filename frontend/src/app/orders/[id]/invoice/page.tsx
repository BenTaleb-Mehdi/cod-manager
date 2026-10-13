import React from "react";
import { getInvoicePrintDataAction } from "@/actions/invoices";
import { notFound } from "next/navigation";
import { InvoiceView } from "@/components/invoices/InvoiceView";

export default async function InvoicePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const result = await getInvoicePrintDataAction(id);

  if (!result.success || !result.data) {
    notFound();
  }

  const { invoice, order, store } = result.data;

  return (
    <InvoiceView invoice={invoice} order={order} store={store} />
  );
}

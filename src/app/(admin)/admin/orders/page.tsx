import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { PageHeader } from "@/components/ui/page-header";

export const dynamic = "force-dynamic";

export default async function AdminOrdersPage() {
  const supabase = getSupabaseAdmin();

  const { data: orders, error } = await supabase
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return (
      <div>
        <PageHeader
          title="Orders"
          description="Manage and track customer orders."
        />
        <p>Error: {error.message}</p>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="Orders"
        description="Manage and track customer orders."
      />

      {orders && orders.length > 0 ? (
        <div className="mt-6 overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b">
                <th className="p-3 text-left">Order</th>
                <th className="p-3 text-left">Customer</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-left">Payment</th>
                <th className="p-3 text-right">Total</th>
              </tr>
            </thead>

            <tbody>
              {orders?.map((order: any) => (
                <tr key={order.id} className="border-b">
                  <td className="p-3">{order.order_number}</td>

                  <td className="p-3">{order.customer_email}</td>

                  <td className="p-3">{order.status}</td>

                  <td className="p-3">{order.payment_status}</td>

                  <td className="p-3 text-right">
                    ${Number(order.total).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="mt-6 text-sm text-muted-foreground">No orders found.</p>
      )}
    </div>
  );
}

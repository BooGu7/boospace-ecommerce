import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { PageHeader } from "@/components/ui/page-header";

export const dynamic = "force-dynamic";

export default async function AdminCustomersPage() {
  const supabase = getSupabaseAdmin();

  const { data: orders, error } = await supabase
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return (
      <div>
        <PageHeader
          title="Customers"
          description="View and manage your customer base."
        />
        <p>Error: {error.message}</p>
      </div>
    );
  }

  // ✅ group customers đúng chuẩn
  const customerMap = new Map<
    string,
    {
      email: string;
      orderCount: number;
      lastOrder: string;
    }
  >();

  (orders || []).forEach((order: any) => {
    const email = order.customer_email;

    if (!email) return;

    const existing = customerMap.get(email);

    if (existing) {
      existing.orderCount += 1;

      if (new Date(order.created_at) > new Date(existing.lastOrder)) {
        existing.lastOrder = order.created_at;
      }
    } else {
      customerMap.set(email, {
        email,
        orderCount: 1,
        lastOrder: order.created_at,
      });
    }
  });

  const customers = Array.from(customerMap.values());

  return (
    <div>
      <PageHeader
        title="Customers"
        description="View and manage your customer base."
      />

      {customers.length > 0 ? (
        <div className="mt-6 overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b">
                <th className="p-3 text-left">Email</th>
                <th className="p-3 text-left">Orders</th>
                <th className="p-3 text-left">Last Order</th>
              </tr>
            </thead>

            <tbody>
              {customers.map((customer: any) => (
                <tr key={customer.email} className="border-b">
                  <td className="p-3">{customer.email}</td>

                  <td className="p-3">{customer.orderCount}</td>

                  <td className="p-3">
                    {new Date(customer.lastOrder).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="mt-6 text-sm text-muted-foreground">
          No customers found.
        </p>
      )}
    </div>
  );
}

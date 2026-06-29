import { getSupabaseAdmin } from "@/lib/supabase/admin";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";

import { DollarSign, Package, ShoppingCart, Users } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const supabase = getSupabaseAdmin();

  // chạy song song để nhanh hơn
  const [productsRes, ordersRes, ordersForStats, recentOrdersRes] =
    await Promise.all([
      supabase.from("products").select("*", { count: "exact", head: true }),

      supabase.from("orders").select("*", { count: "exact", head: true }),

      supabase.from("orders").select("customer_email,total"),

      supabase
        .from("orders")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(10),
    ]);

  const products = productsRes.count ?? 0;
  const orders = ordersRes.count ?? 0;

  const customers = new Set(ordersForStats.data?.map((o) => o.customer_email))
    .size;

  const revenue =
    ordersForStats.data?.reduce((sum, o) => sum + Number(o.total || 0), 0) ?? 0;

  const stats = [
    {
      name: "Total Revenue",
      value: `$${revenue.toLocaleString()}`,
      icon: DollarSign,
    },
    {
      name: "Orders",
      value: orders,
      icon: ShoppingCart,
    },
    {
      name: "Products",
      value: products,
      icon: Package,
    },
    {
      name: "Customers",
      value: customers,
      icon: Users,
    },
  ];

  return (
    <div>
      <PageHeader
        title="Dashboard"
        description="Overview of your store performance."
      />

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.name}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.name}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>

            <CardContent>
              <p className="text-2xl font-bold">{stat.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Recent Orders</CardTitle>
        </CardHeader>

        <CardContent>
          {recentOrdersRes.data?.length ? (
            <div className="space-y-3">
              {recentOrdersRes.data.map((order: any) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between border-b pb-2"
                >
                  <div>
                    <div className="font-medium">{order.order_number}</div>
                    <div className="text-sm text-muted-foreground">
                      {order.customer_email}
                    </div>
                  </div>

                  <div className="text-right">
                    <div>${Number(order.total).toLocaleString()}</div>
                    <div className="text-sm text-muted-foreground">
                      {order.status}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No orders found.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

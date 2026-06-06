import { createSupabaseServerClient } from "@/lib/supabase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import {
  DollarSign,
  Package,
  ShoppingCart,
  Users,
} from "lucide-react";

export default async function AdminDashboardPage() {
  const supabase = createSupabaseServerClient();

  // Products
  const { count: products } = await supabase
    .from("ecommerce_products_rows")
    .select("*", {
      count: "exact",
      head: true,
    });

  // Orders
  const { count: orders } = await supabase
    .from("ecommerce_orders_rows")
    .select("*", {
      count: "exact",
      head: true,
    });

  // Customers (unique email từ orders)
  const { data: customerRows } = await supabase
    .from("ecommerce_orders_rows")
    .select("customer_email");

  const customers =
    new Set(
      customerRows?.map((row) => row.customer_email)
    ).size;

  // Revenue
  const { data: revenueRows } = await supabase
    .from("ecommerce_orders_rows")
    .select("total");

  const revenue =
    revenueRows?.reduce(
      (sum, row) => sum + Number(row.total || 0),
      0
    ) || 0;

  // Recent Orders
  const { data: recentOrders } = await supabase
    .from("ecommerce_orders_rows")
    .select("*")
    .order("created_at", {
      ascending: false,
    })
    .limit(10);

  const stats = [
    {
      name: "Total Revenue",
      value: `$${revenue.toLocaleString()}`,
      icon: DollarSign,
    },
    {
      name: "Orders",
      value: orders ?? 0,
      icon: ShoppingCart,
    },
    {
      name: "Products",
      value: products ?? 0,
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
              <p className="text-2xl font-bold">
                {stat.value}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Recent Orders</CardTitle>
        </CardHeader>

        <CardContent>
          {recentOrders && recentOrders.length > 0 ? (
            <div className="space-y-3">
              {recentOrders.map((order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between border-b pb-2"
                >
                  <div>
                    <div className="font-medium">
                      {order.order_number}
                    </div>

                    <div className="text-sm text-muted-foreground">
                      {order.customer_email}
                    </div>
                  </div>

                  <div className="text-right">
                    <div>
                      ${Number(order.total).toLocaleString()}
                    </div>

                    <div className="text-sm text-muted-foreground">
                      {order.status}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              No orders found.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
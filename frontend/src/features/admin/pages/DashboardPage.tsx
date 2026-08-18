import { useEffect, useState } from 'react';
import { Package, ClipboardList, Users, Tags } from 'lucide-react';
import { Card } from '@/shared/components/Card';
import { PageLoader } from '@/shared/components/Spinner';
import { productService } from '@/features/products/services/productService';
import { categoryService } from '@/features/categories/services/categoryService';
import { orderService } from '@/features/orders/services/orderService';
import { userService } from '@/features/users/services/userService';

interface Counts {
  products: number;
  categories: number;
  pendingOrders: number;
  users: number;
}

export function DashboardPage() {
  const [counts, setCounts] = useState<Counts | null>(null);

  useEffect(() => {
    Promise.all([
      productService.listAllAdmin(),
      categoryService.list(),
      orderService.listAll(),
      userService.listAll(),
    ])
      .then(([products, categories, orders, users]) => {
        const pendingOrders = orders.filter(
          (order) =>
            order.status !== 'DELIVERED' && order.status !== 'CANCELLED',
        ).length;
        setCounts({
          products: products.length,
          categories: categories.length,
          pendingOrders,
          users: users.length,
        });
      })
      .catch(() => undefined);
  }, []);

  if (!counts) return <PageLoader />;

  const cards = [
    { label: 'Productos', value: counts.products, icon: Package },
    { label: 'Categorías', value: counts.categories, icon: Tags },
    {
      label: 'Pedidos activos',
      value: counts.pendingOrders,
      icon: ClipboardList,
    },
    { label: 'Usuarios', value: counts.users, icon: Users },
  ];

  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-heading text-2xl font-bold text-white">
        Panel de control
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map(({ label, value, icon: Icon }) => (
          <Card key={label} className="p-5 flex items-center gap-4">
            <div className="w-11 h-11 rounded-full bg-primary/15 flex items-center justify-center text-primary shrink-0">
              <Icon size={20} />
            </div>
            <div>
              <p className="text-2xl font-heading font-bold text-white">
                {value}
              </p>
              <p className="text-sm text-beige/60">{label}</p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

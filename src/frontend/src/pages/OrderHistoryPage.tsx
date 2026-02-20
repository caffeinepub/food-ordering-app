import { useNavigate } from '@tanstack/react-router';
import { useGetOrderHistory } from '../hooks/useQueries';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import OrderCard from '../components/OrderCard';
import { Button } from '@/components/ui/button';
import { Loader2, ShoppingBag } from 'lucide-react';

export default function OrderHistoryPage() {
  const navigate = useNavigate();
  const { identity } = useInternetIdentity();
  const { data: orders = [], isLoading } = useGetOrderHistory();

  const isAuthenticated = !!identity;

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <ShoppingBag className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
        <h2 className="text-2xl font-bold mb-2">Please Login</h2>
        <p className="text-muted-foreground mb-6">You need to be logged in to view your orders</p>
        <Button onClick={() => navigate({ to: '/' })}>Go to Home</Button>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-16 flex justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-orange-600" />
      </div>
    );
  }

  const sortedOrders = [...orders].sort((a, b) => Number(b.id) - Number(a.id));

  if (sortedOrders.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <ShoppingBag className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
        <h2 className="text-2xl font-bold mb-2">No orders yet</h2>
        <p className="text-muted-foreground mb-6">Start ordering delicious food today!</p>
        <Button onClick={() => navigate({ to: '/products' })} className="bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-700 hover:to-orange-600">
          Browse Menu
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Order History</h1>
      <div className="space-y-4">
        {sortedOrders.map((order) => (
          <OrderCard key={order.id.toString()} order={order} />
        ))}
      </div>
    </div>
  );
}

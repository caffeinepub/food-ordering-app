import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { OrderRecord, OrderStatus } from '../backend';

const statusConfig: Record<OrderStatus, { label: string; className: string }> = {
  [OrderStatus.pending]: { label: 'Pending', className: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400' },
  [OrderStatus.confirmed]: { label: 'Confirmed', className: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400' },
  [OrderStatus.preparing]: { label: 'Preparing', className: 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400' },
  [OrderStatus.delivered]: { label: 'Delivered', className: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' },
};

interface OrderCardProps {
  order: OrderRecord;
}

export default function OrderCard({ order }: OrderCardProps) {
  const status = statusConfig[order.status];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Order #{order.id.toString()}</CardTitle>
          <Badge className={status.className}>{status.label}</Badge>
        </div>
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>{order.items.length} items</span>
          <span className="text-lg font-bold text-orange-600">${order.totalPrice.toFixed(2)}</span>
        </div>
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible>
          <AccordionItem value="items" className="border-none">
            <AccordionTrigger className="text-sm hover:no-underline">
              View Order Details
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-3 pt-2">
                {order.items.map((item, index) => (
                  <div key={index} className="flex items-center gap-3 pb-3 border-b last:border-0">
                    <img
                      src={item.foodItem.imageUrl}
                      alt={item.foodItem.name}
                      className="w-16 h-16 object-cover rounded"
                      onError={(e) => {
                        e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="64" height="64"%3E%3Crect fill="%23f97316" width="64" height="64"/%3E%3C/svg%3E';
                      }}
                    />
                    <div className="flex-1">
                      <p className="font-medium">{item.foodItem.name}</p>
                      <p className="text-sm text-muted-foreground">
                        Qty: {item.quantity.toString()} × ${item.foodItem.price.toFixed(2)}
                      </p>
                    </div>
                    <span className="font-semibold">
                      ${(item.foodItem.price * Number(item.quantity)).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  );
}

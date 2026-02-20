import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { CartItem as CartItemType } from '../backend';

interface CartItemProps {
  item: CartItemType;
  onUpdateQuantity: (foodId: bigint, quantity: number) => void;
  onRemove: (foodId: bigint) => void;
  isUpdating: boolean;
}

export default function CartItem({ item, onUpdateQuantity, onRemove, isUpdating }: CartItemProps) {
  const quantity = Number(item.quantity);
  const itemTotal = item.foodItem.price * quantity;

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex gap-4">
          <img
            src={item.foodItem.imageUrl}
            alt={item.foodItem.name}
            className="w-24 h-24 object-cover rounded-lg"
            onError={(e) => {
              e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100"%3E%3Crect fill="%23f97316" width="100" height="100"/%3E%3C/svg%3E';
            }}
          />

          <div className="flex-1">
            <h3 className="font-semibold text-lg mb-1">{item.foodItem.name}</h3>
            <p className="text-sm text-muted-foreground mb-3 line-clamp-1">
              {item.foodItem.description}
            </p>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => onUpdateQuantity(item.foodItem.id, quantity - 1)}
                  disabled={quantity <= 1 || isUpdating}
                >
                  <Minus className="w-4 h-4" />
                </Button>
                <span className="w-8 text-center font-medium">{quantity}</span>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => onUpdateQuantity(item.foodItem.id, quantity + 1)}
                  disabled={isUpdating}
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>

              <div className="flex items-center gap-4">
                <span className="text-lg font-bold text-orange-600">
                  ${itemTotal.toFixed(2)}
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onRemove(item.foodItem.id)}
                  disabled={isUpdating}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

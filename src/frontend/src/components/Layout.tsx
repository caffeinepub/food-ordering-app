import { Outlet, useNavigate } from '@tanstack/react-router';
import { ShoppingCart, UtensilsCrossed } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import LoginButton from './LoginButton';
import ProfileSetup from './ProfileSetup';
import InitializeData from './InitializeData';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetCart } from '../hooks/useQueries';
import { SiX, SiFacebook, SiInstagram } from 'react-icons/si';

export default function Layout() {
  const navigate = useNavigate();
  const { identity } = useInternetIdentity();
  const isAuthenticated = !!identity;
  const { data: cartItems = [] } = useGetCart();
  const cartCount = cartItems.reduce((sum, item) => sum + Number(item.quantity), 0);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-background to-secondary/20">
      <ProfileSetup />
      <InitializeData />
      
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <button
            onClick={() => navigate({ to: '/' })}
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-lg">
              <UtensilsCrossed className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-orange-600 to-orange-500 bg-clip-text text-transparent">
              FoodHub
            </span>
          </button>

          <nav className="hidden md:flex items-center gap-6">
            <button
              onClick={() => navigate({ to: '/' })}
              className="text-sm font-medium hover:text-orange-600 transition-colors"
            >
              Home
            </button>
            <button
              onClick={() => navigate({ to: '/products' })}
              className="text-sm font-medium hover:text-orange-600 transition-colors"
            >
              Menu
            </button>
            {isAuthenticated && (
              <button
                onClick={() => navigate({ to: '/orders' })}
                className="text-sm font-medium hover:text-orange-600 transition-colors"
              >
                Orders
              </button>
            )}
          </nav>

          <div className="flex items-center gap-3">
            {isAuthenticated && (
              <Button
                variant="ghost"
                size="icon"
                className="relative"
                onClick={() => navigate({ to: '/cart' })}
              >
                <ShoppingCart className="w-5 h-5" />
                {cartCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-orange-600 hover:bg-orange-600">
                    {cartCount}
                  </Badge>
                )}
              </Button>
            )}
            <LoginButton />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="border-t border-border/40 bg-card/50 backdrop-blur">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center">
                  <UtensilsCrossed className="w-5 h-5 text-white" />
                </div>
                <span className="font-bold text-lg">FoodHub</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Your trusted partner for delicious food delivery. We work honestly to bring you the best meals.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <button onClick={() => navigate({ to: '/' })} className="hover:text-orange-600 transition-colors">
                    Home
                  </button>
                </li>
                <li>
                  <button onClick={() => navigate({ to: '/products' })} className="hover:text-orange-600 transition-colors">
                    Menu
                  </button>
                </li>
                {isAuthenticated && (
                  <li>
                    <button onClick={() => navigate({ to: '/orders' })} className="hover:text-orange-600 transition-colors">
                      Orders
                    </button>
                  </li>
                )}
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Connect With Us</h3>
              <div className="flex gap-3">
                <a href="#" className="w-9 h-9 rounded-full bg-muted hover:bg-orange-600 hover:text-white flex items-center justify-center transition-colors">
                  <SiFacebook className="w-4 h-4" />
                </a>
                <a href="#" className="w-9 h-9 rounded-full bg-muted hover:bg-orange-600 hover:text-white flex items-center justify-center transition-colors">
                  <SiX className="w-4 h-4" />
                </a>
                <a href="#" className="w-9 h-9 rounded-full bg-muted hover:bg-orange-600 hover:text-white flex items-center justify-center transition-colors">
                  <SiInstagram className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-border/40 text-center text-sm text-muted-foreground">
            <p>
              © {new Date().getFullYear()} FoodHub. Built with ❤️ using{' '}
              <a
                href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-orange-600 hover:underline"
              >
                caffeine.ai
              </a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

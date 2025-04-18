
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { LogOut, Menu, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { getCurrentUser, logout, hasPermission } from "@/utils/auth";
import { useNavigate } from "react-router-dom";

const NavBar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = getCurrentUser();
  const [showMobileMenu, setShowMobileMenu] = React.useState(false);
  
  const isAdmin = user?.role === "admin";

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // Function to check if a user has permission to access a route
  const canAccess = (path: string): boolean => {
    switch(path) {
      case "/dashboard":
        return hasPermission("dashboard");
      case "/activities":
        return hasPermission("activities");
      case "/ledger":
        return hasPermission("ledger");
      case "/admin":
        return hasPermission("admin");
      default:
        return true;
    }
  };

  return (
    <header className="border-b bg-white shadow-sm">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <Link to="/" className="flex items-center">
            <span className="text-farm-green font-bold text-xl">Farm Ledger</span>
          </Link>
        </div>

        {/* Desktop menu */}
        <nav className="hidden md:flex items-center space-x-4">
          {canAccess("/dashboard") && (
            <Link 
              to="/dashboard" 
              className={cn(
                "px-3 py-2 rounded-md text-sm font-medium",
                location.pathname === "/dashboard" 
                  ? "bg-farm-green text-white" 
                  : "text-gray-700 hover:bg-gray-100"
              )}
            >
              Dashboard
            </Link>
          )}
          
          {canAccess("/activities") && (
            <Link 
              to="/activities" 
              className={cn(
                "px-3 py-2 rounded-md text-sm font-medium",
                location.pathname === "/activities" 
                  ? "bg-farm-green text-white" 
                  : "text-gray-700 hover:bg-gray-100"
              )}
            >
              Activities
            </Link>
          )}
          
          {canAccess("/ledger") && (
            <Link 
              to="/ledger" 
              className={cn(
                "px-3 py-2 rounded-md text-sm font-medium",
                location.pathname === "/ledger" 
                  ? "bg-farm-green text-white" 
                  : "text-gray-700 hover:bg-gray-100"
              )}
            >
              Ledger
            </Link>
          )}
          
          {canAccess("/admin") && (
            <Link 
              to="/admin" 
              className={cn(
                "px-3 py-2 rounded-md text-sm font-medium",
                location.pathname === "/admin" 
                  ? "bg-farm-green text-white" 
                  : "text-gray-700 hover:bg-gray-100"
              )}
            >
              Administration
            </Link>
          )}
        </nav>

        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-2">
            <div className="text-sm text-gray-700">
              <span className="block font-medium">{user?.name}</span>
              <span className="block text-xs text-gray-500">{user?.farmName}</span>
            </div>
            <Button variant="ghost" size="icon" onClick={handleLogout}>
              <LogOut className="h-5 w-5" />
            </Button>
          </div>

          {/* Mobile menu button */}
          <Button 
            variant="ghost" 
            size="icon" 
            className="md:hidden" 
            onClick={() => setShowMobileMenu(!showMobileMenu)}
          >
            <Menu className="h-6 w-6" />
          </Button>
        </div>
      </div>

      {/* Mobile menu */}
      {showMobileMenu && (
        <div className="md:hidden border-t">
          <div className="container mx-auto px-4 py-2 space-y-1">
            {canAccess("/dashboard") && (
              <Link 
                to="/dashboard" 
                className={cn(
                  "block px-3 py-2 rounded-md text-base font-medium",
                  location.pathname === "/dashboard" 
                    ? "bg-farm-green text-white" 
                    : "text-gray-700 hover:bg-gray-100"
                )}
                onClick={() => setShowMobileMenu(false)}
              >
                Dashboard
              </Link>
            )}
            
            {canAccess("/activities") && (
              <Link 
                to="/activities" 
                className={cn(
                  "block px-3 py-2 rounded-md text-base font-medium",
                  location.pathname === "/activities" 
                    ? "bg-farm-green text-white" 
                    : "text-gray-700 hover:bg-gray-100"
                )}
                onClick={() => setShowMobileMenu(false)}
              >
                Activities
              </Link>
            )}
            
            {canAccess("/ledger") && (
              <Link 
                to="/ledger" 
                className={cn(
                  "block px-3 py-2 rounded-md text-base font-medium",
                  location.pathname === "/ledger" 
                    ? "bg-farm-green text-white" 
                    : "text-gray-700 hover:bg-gray-100"
                )}
                onClick={() => setShowMobileMenu(false)}
              >
                Ledger
              </Link>
            )}
            
            {canAccess("/admin") && (
              <Link 
                to="/admin" 
                className={cn(
                  "block px-3 py-2 rounded-md text-base font-medium",
                  location.pathname === "/admin" 
                    ? "bg-farm-green text-white" 
                    : "text-gray-700 hover:bg-gray-100"
                )}
                onClick={() => setShowMobileMenu(false)}
              >
                Administration
              </Link>
            )}
            
            <div className="border-t pt-2 mt-2">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-700">
                  <span className="block font-medium">{user?.name}</span>
                  <span className="block text-xs text-gray-500">{user?.farmName}</span>
                </div>
                <Button variant="ghost" size="sm" onClick={handleLogout}>
                  Logout
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default NavBar;

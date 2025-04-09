
import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Bell, Calendar, Home, LogOut, Menu, MessageSquare, Settings, User } from "lucide-react";
import { getNotifications } from "@/services/mockData";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  href: string;
  active: boolean;
  badge?: number;
}

const NavItem: React.FC<NavItemProps> = ({ icon, label, href, active, badge }) => {
  return (
    <Link 
      to={href} 
      className={cn(
        "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
        active 
          ? "bg-fras-blue text-white" 
          : "text-gray-700 hover:bg-fras-blue/10"
      )}
    >
      {icon}
      <span>{label}</span>
      {badge && badge > 0 ? (
        <Badge variant="destructive" className="ml-auto">{badge}</Badge>
      ) : null}
    </Link>
  );
};

const DashboardLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [unreadNotifications, setUnreadNotifications] = useState(0);
  
  useEffect(() => {
    // Count unread notifications
    const notifications = getNotifications();
    setUnreadNotifications(notifications.filter(n => !n.read).length);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };

  const navItems = [
    {
      icon: <Home className="h-5 w-5" />,
      label: "Dashboard",
      href: "/dashboard",
      badge: 0
    },
    {
      icon: <Calendar className="h-5 w-5" />,
      label: "Attendance History",
      href: "/attendance",
      badge: 0
    },
    {
      icon: <MessageSquare className="h-5 w-5" />,
      label: "Report Issue",
      href: "/report-issue",
      badge: 0
    },
    {
      icon: <Bell className="h-5 w-5" />,
      label: "Notifications",
      href: "/notifications",
      badge: unreadNotifications
    },
    {
      icon: <Settings className="h-5 w-5" />,
      label: "Settings",
      href: "/settings",
      badge: 0
    }
  ];

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-gray-200 p-4">
        <div className="flex items-center mb-8">
          <h1 className="text-2xl font-bold text-fras-blue">FRAS</h1>
          <span className="text-xs ml-2 bg-fras-teal text-white px-2 py-0.5 rounded-full">
            {user?.role}
          </span>
        </div>
        
        <div className="flex flex-col gap-2 flex-1">
          {navItems.map((item) => (
            <NavItem 
              key={item.href}
              icon={item.icon}
              label={item.label}
              href={item.href}
              active={location.pathname === item.href}
              badge={item.badge}
            />
          ))}
        </div>
        
        <Separator className="my-4" />
        
        <div className="flex items-center justify-between mt-auto">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage src={user?.profilePicture} />
              <AvatarFallback>{user?.name ? getInitials(user.name) : "US"}</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium">{user?.name}</p>
              <p className="text-xs text-gray-500">{user?.role}</p>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={handleLogout}>
            <LogOut className="h-5 w-5" />
          </Button>
        </div>
      </aside>
      
      {/* Mobile Sidebar */}
      <Sheet open={isMobileOpen} onOpenChange={setIsMobileOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="lg:hidden absolute top-4 left-4 z-10">
            <Menu className="h-6 w-6" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-0">
          <div className="flex flex-col h-full p-4">
            <div className="flex items-center mb-8">
              <h1 className="text-2xl font-bold text-fras-blue">FRAS</h1>
              <span className="text-xs ml-2 bg-fras-teal text-white px-2 py-0.5 rounded-full">
                {user?.role}
              </span>
            </div>
            
            <div className="flex flex-col gap-2 flex-1">
              {navItems.map((item) => (
                <NavItem 
                  key={item.href}
                  icon={item.icon}
                  label={item.label}
                  href={item.href}
                  active={location.pathname === item.href}
                  badge={item.badge}
                  
                />
              ))}
            </div>
            
            <Separator className="my-4" />
            
            <div className="flex items-center justify-between mt-auto">
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage src={user?.profilePicture} />
                  <AvatarFallback>{user?.name ? getInitials(user.name) : "US"}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium">{user?.name}</p>
                  <p className="text-xs text-gray-500">{user?.role}</p>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={handleLogout}>
                <LogOut className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
      
      {/* Main Content */}
      <main className="flex-1 p-4 lg:p-8 overflow-auto">
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout;

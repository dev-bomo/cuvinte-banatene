import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import {
  Search,
  User,
  LogOut,
  BookOpen,
  Users,
  Home,
  Menu,
  X,
} from "lucide-react";

export function Header() {
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout, isAuthenticated } = useAuth();

  const isHomepage = location.pathname === "/";

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
    }
  };

  const navigationItems = [
    { path: "/", label: "Acasă", icon: Home },
    { path: "/alphabetical", label: "Alfabetic", icon: BookOpen },
    ...(isAuthenticated &&
    (user?.role === "admin" || user?.role === "contributor")
      ? [{ path: "/admin", label: "Dicționar", icon: null }]
      : []),
    ...(isAuthenticated && user?.role === "admin"
      ? [{ path: "/users", label: "Utilizatori", icon: Users }]
      : []),
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="relative">
              <img
                src="/images/logo.png"
                alt="Cuvinte Banatene"
                className="h-10 w-10 rounded-lg shadow-md group-hover:shadow-lg transition-shadow"
              />
              <div className="absolute -top-1 -right-1 h-4 w-4 bg-emerald-500 rounded-full animate-pulse"></div>
            </div>
            <div>
              <span className="text-xl font-bold bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">
                Cuvinte Banatene
              </span>
              <p className="text-xs text-gray-500 -mt-1">Dicționar</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;

              return (
                <Button
                  key={item.path}
                  asChild
                  variant={isActive ? "default" : "ghost"}
                  size="sm"
                  className={`${
                    isActive
                      ? "bg-emerald-600 text-white shadow-md"
                      : "text-gray-600 hover:text-emerald-600 hover:bg-emerald-50"
                  } transition-all duration-200`}
                >
                  <Link to={item.path} className="flex items-center space-x-1">
                    {Icon && <Icon className="h-4 w-4" />}
                    <span>{item.label}</span>
                  </Link>
                </Button>
              );
            })}
          </nav>

          {/* Search Bar */}
          <div className="hidden lg:flex items-center space-x-4">
            {!isHomepage && (
              <form
                onSubmit={handleSearch}
                className="flex items-center space-x-2"
              >
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Caută cuvinte..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-64 pl-10 border-emerald-200 focus:border-emerald-400 rounded-lg"
                  />
                </div>
                <Button
                  type="submit"
                  size="sm"
                  className="bg-emerald-600 hover:bg-emerald-700"
                >
                  <Search className="h-4 w-4" />
                </Button>
              </form>
            )}
          </div>

          {/* User Section */}
          <div className="flex items-center space-x-3">
            {isAuthenticated ? (
              <div className="flex items-center space-x-3">
                <div className="hidden sm:flex items-center space-x-2">
                  <div className="flex items-center space-x-1 px-3 py-1 bg-emerald-50 rounded-full">
                    <User className="h-4 w-4 text-emerald-600" />
                    <span className="text-sm font-medium text-emerald-700">
                      {user?.username}
                    </span>
                    {user?.role === "admin" && (
                      <Badge variant="secondary" className="text-xs">
                        Admin
                      </Badge>
                    )}
                  </div>
                </div>
                <Button
                  onClick={logout}
                  variant="outline"
                  size="sm"
                  className="border-emerald-200 text-emerald-600 hover:bg-emerald-50"
                >
                  <LogOut className="h-4 w-4" />
                  <span className="hidden sm:inline ml-1">Ieșire</span>
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Button asChild variant="outline" size="sm">
                  <Link to="/register">Înregistrare</Link>
                </Button>
                <Button
                  asChild
                  size="sm"
                  className="bg-emerald-600 hover:bg-emerald-700"
                >
                  <Link to="/login">Conectare</Link>
                </Button>
              </div>
            )}

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 bg-white">
            <div className="px-4 py-4 space-y-3">
              {/* Mobile Navigation */}
              <nav className="space-y-2">
                {navigationItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.path;

                  return (
                    <Button
                      key={item.path}
                      asChild
                      variant={isActive ? "default" : "ghost"}
                      className={`w-full justify-start ${
                        isActive
                          ? "bg-emerald-600 text-white"
                          : "text-gray-600 hover:text-emerald-600 hover:bg-emerald-50"
                      }`}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <Link
                        to={item.path}
                        className="flex items-center space-x-2"
                      >
                        {Icon && <Icon className="h-4 w-4" />}
                        <span>{item.label}</span>
                      </Link>
                    </Button>
                  );
                })}
              </nav>

              {/* Mobile Search */}
              {!isHomepage && (
                <form onSubmit={handleSearch} className="space-y-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      type="text"
                      placeholder="Caută cuvinte..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 border-emerald-200 focus:border-emerald-400"
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-emerald-600 hover:bg-emerald-700"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Search className="mr-2 h-4 w-4" />
                    Caută
                  </Button>
                </form>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

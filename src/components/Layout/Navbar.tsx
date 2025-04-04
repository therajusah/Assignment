
import { Link } from "react-router-dom";
import { ModeToggle } from "./ModeToggle";
import { Search, Barcode, Home } from "lucide-react";
import { motion } from "framer-motion";

const Navbar = () => {
  return (
    <motion.nav 
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="sticky top-4 z-50 mx-4 md:mx-8 mt-2"
    >
      <div className="backdrop-blur-xl bg-background/80 border border-border/40 shadow-lg rounded-full px-4 md:px-6 py-3">
        <div className="container mx-auto">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="bg-food-green p-2 rounded-md group-hover:scale-105 transition-transform">
                <Barcode size={24} className="text-white" />
              </div>
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/80">FoodFinder</span>
            </Link>
            
            <div className="flex items-center gap-3 md:gap-6">
              <Link 
                to="/" 
                className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
              >
                <Home size={18} />
                <span>Home</span>
              </Link>
              <Link 
                to="/search" 
                className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
              >
                <Search size={18} />
                <span>Search</span>
              </Link>
              <Link 
                to="/barcode" 
                className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
              >
                <Barcode size={18} />
                <span>Barcode</span>
              </Link>
              
              {/* Mobile navigation */}
              <div className="md:hidden flex items-center gap-4">
                <Link 
                  to="/" 
                  className="flex items-center justify-center p-2 rounded-full hover:bg-muted transition-colors"
                  aria-label="Home"
                >
                  <Home size={20} />
                </Link>
                <Link 
                  to="/search" 
                  className="flex items-center justify-center p-2 rounded-full hover:bg-muted transition-colors"
                  aria-label="Search"
                >
                  <Search size={20} />
                </Link>
                <Link 
                  to="/barcode" 
                  className="flex items-center justify-center p-2 rounded-full hover:bg-muted transition-colors"
                  aria-label="Barcode"
                >
                  <Barcode size={20} />
                </Link>
              </div>
              
              <div className="border-l border-border/60 h-6 mx-1 hidden md:block"></div>
              <ModeToggle />
            </div>
          </div>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;

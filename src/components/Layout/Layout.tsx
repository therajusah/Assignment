
import Navbar from "./Navbar";
import { lazy, Suspense } from "react";
import { Loader2 } from "lucide-react";


interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-8 mt-2">
        <Suspense fallback={
          <div className="flex justify-center items-center h-32">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        }>
          {children}
        </Suspense>
      </main>
      <footer className="bg-muted py-4 mt-auto">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>
            Food data provided by{" "}
            <a 
              href="https://world.openfoodfacts.org/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Open Food Facts
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;

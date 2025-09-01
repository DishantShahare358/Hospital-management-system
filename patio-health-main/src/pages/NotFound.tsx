import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-primary/10">
      <div className="text-center max-w-md mx-auto p-8">
        <div className="bg-gradient-hero bg-clip-text text-transparent text-8xl font-bold mb-4">
          404
        </div>
        <h1 className="text-2xl font-bold text-foreground mb-4">Oops! Page not found</h1>
        <p className="text-muted-foreground mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <a href="/" className="inline-block">
          <Button variant="hero" size="lg">
            Return to Home
          </Button>
        </a>
      </div>
    </div>
  );
};

export default NotFound;

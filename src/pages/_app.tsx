// pages/_app.tsx
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../lib/firebase";
import "../styles/globals.css";
import { OrbitProgress } from "react-loading-indicators";
import { ThemeProvider } from "@/context/ThemeContext"; // ✅ import provider

function MyApp({ Component, pageProps }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      const publicPaths = ["/login"];
      const pathIsProtected = !publicPaths.includes(router.pathname);

      if (!user && pathIsProtected) {
        // preserve the intended URL
        router.push(`/login?returnUrl=${encodeURIComponent(router.asPath)}`);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  if (loading)
    return (
        <main className="flex items-center justify-center min-h-screen">
          <OrbitProgress dense color="#5246FF" size="medium" text="" textColor="" />
        </main>
    );

  return (
      // ✅ wrap app in ThemeProvider so useTheme() works everywhere
      <ThemeProvider>
        <Component {...pageProps} />
      </ThemeProvider>
  );
}

export default MyApp;

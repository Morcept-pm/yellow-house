import { Route, Switch, useLocation } from "wouter";
import { useEffect } from "react";
import { MotionConfig } from "motion/react";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import { BackToTop } from "./components/BackToTop";
import { FloatingSocial } from "./components/FloatingSocial";
import { SEOManager } from "./components/SEOManager";
import { Home } from "./pages/Home";
import { Services } from "./pages/Services";
import { Company } from "./pages/Company";
import { Cases } from "./pages/Cases";
import { CaseDetail } from "./pages/CaseDetail";
import { Properties } from "./pages/Properties";
import { PropertyDetail } from "./pages/PropertyDetail";
import { News } from "./pages/News";
import { NewsDetail } from "./pages/NewsDetail";
import { Contact } from "./pages/Contact";
import { LanguageProvider } from "./lib/LanguageContext";
import { CurrencyProvider } from "./lib/CurrencyContext";
import { AuthProvider } from "./lib/AuthContext";
import { AdminRoutes } from "./admin/AdminRoutes";

function ScrollToTop() {
  const [pathname] = useLocation();
  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "instant" as ScrollBehavior,
    });
  }, [pathname]);
  return null;
}

export default function App() {
  const [location] = useLocation();

  // /admin/* is a separate, single-language (zh) internal tool: no locale
  // prefix, no marketing chrome (Header/Footer/FloatingSocial), so it must
  // sit outside <LanguageProvider> — that provider force-redirects any
  // non-locale-prefixed path, which would otherwise break /admin routes.
  if (location.startsWith("/admin")) {
    return (
      <MotionConfig reducedMotion="user">
        <AuthProvider>
          <AdminRoutes />
        </AuthProvider>
      </MotionConfig>
    );
  }

  return (
    <MotionConfig reducedMotion="user">
      <LanguageProvider>
        <CurrencyProvider>
          <div className="flex flex-col min-h-screen">
            <ScrollToTop />
            <SEOManager />
            <Header />
            <main className="flex-grow">
              <Switch>
                <Route path="/:locale/services" component={Services} />
                <Route path="/:locale/company" component={Company} />
                <Route path="/:locale/cases/:slug" component={CaseDetail} />
                <Route path="/:locale/cases" component={Cases} />
                <Route path="/:locale/properties/:slug" component={PropertyDetail} />
                <Route path="/:locale/properties" component={Properties} />
                <Route path="/:locale/news/:slug" component={NewsDetail} />
                <Route path="/:locale/news" component={News} />
                <Route path="/:locale/contact" component={Contact} />
                <Route path="/:locale" component={Home} />
                {/* Bare/unknown paths are redirected to a locale-prefixed URL by LanguageProvider */}
                <Route component={Home} />
              </Switch>
            </main>
            <Footer />
            <FloatingSocial />
            <BackToTop />
          </div>
        </CurrencyProvider>
      </LanguageProvider>
    </MotionConfig>
  );
}

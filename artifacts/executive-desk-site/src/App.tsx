import { Switch, Route, Router as WouterRouter, useLocation } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/lib/theme-provider";
import { PortalAuthProvider, usePortalAuth } from "@/lib/portal-auth";
import { PortalDataProvider } from "@/lib/portal-data";
import { PortalLayout } from "@/components/portal-layout";
import { Layout } from "@/components/layout";
import { ScrollToTop } from "@/components/scroll-to-top";
import { BackToTop } from "@/components/back-to-top";
import NotFound from "@/pages/not-found";

// Marketing pages
import Home from "@/pages/home";
import About from "@/pages/about";
import Services from "@/pages/services";
import Testimonials from "@/pages/testimonials";
import Blog from "@/pages/blog";
import BlogPost from "@/pages/blog-post";
import FAQ from "@/pages/faq";
import Contact from "@/pages/contact";

// Portal pages
import PortalLogin from "@/pages/portal/login";
import Dashboard from "@/pages/portal/dashboard";
import TimeTracking from "@/pages/portal/time-tracking";
import Tasks from "@/pages/portal/tasks";
import Approvals from "@/pages/portal/approvals";
import Billing from "@/pages/portal/billing";
import Clients from "@/pages/portal/clients";
import Team from "@/pages/portal/team";
import CRM from "@/pages/portal/crm";
import Reports from "@/pages/portal/reports";
import AuditLog from "@/pages/portal/audit";
import AccessControl from "@/pages/portal/access";
import Profile from "@/pages/portal/profile";

const queryClient = new QueryClient();

function PortalRoutes() {
  const { user } = usePortalAuth();

  if (!user) {
    return <PortalLogin />;
  }

  return (
    <PortalLayout>
      <Switch>
        <Route path="/portal" component={Dashboard} />
        <Route path="/portal/dashboard" component={Dashboard} />
        <Route path="/portal/time-tracking" component={TimeTracking} />
        <Route path="/portal/tasks" component={Tasks} />
        <Route path="/portal/approvals" component={Approvals} />
        <Route path="/portal/billing" component={Billing} />
        <Route path="/portal/clients" component={Clients} />
        <Route path="/portal/team" component={Team} />
        <Route path="/portal/crm" component={CRM} />
        <Route path="/portal/reports" component={Reports} />
        <Route path="/portal/audit" component={AuditLog} />
        <Route path="/portal/access" component={AccessControl} />
        <Route path="/portal/profile" component={Profile} />
        <Route component={NotFound} />
      </Switch>
    </PortalLayout>
  );
}

function MarketingRoutes() {
  return (
    <Layout>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/about" component={About} />
        <Route path="/services" component={Services} />
        <Route path="/testimonials" component={Testimonials} />
        <Route path="/blog" component={Blog} />
        <Route path="/blog/:slug" component={BlogPost} />
        <Route path="/faq" component={FAQ} />
        <Route path="/contact" component={Contact} />
        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
}

function AppRouter() {
  const [location] = useLocation();
  const isPortal = location === "/portal" || location.startsWith("/portal/");

  if (isPortal) {
    return (
      <PortalAuthProvider>
        <PortalDataProvider>
          <PortalRoutes />
        </PortalDataProvider>
      </PortalAuthProvider>
    );
  }

  return <MarketingRoutes />;
}

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="executive-desk-theme">
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
            <ScrollToTop />
            <AppRouter />
          </WouterRouter>
          <BackToTop />
          <Toaster />
        </TooltipProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;

// routes
import Router from "./routes";
// theme
import ThemeConfig from "./theme";
// components
import ScrollToTop from "./components/ScrollToTop";
import { AuthProvider } from "src/authentication/AuthContext.js";

// ----------------------------------------------------------------------

export default function App() {
  return (
    <AuthProvider>
      <ThemeConfig>
        <ScrollToTop />
        <Router />
      </ThemeConfig>
    </AuthProvider>
  );
}

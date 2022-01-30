// routes
import Router from "./routes";
// theme
import ThemeConfig from "./theme";
// components
import ScrollToTop from "./components/ScrollToTop";
import { AuthProvider } from "src/authentication/AuthContext.js";
import DateAdapter from "@material-ui/lab/AdapterDateFns";
import { LocalizationProvider } from "@material-ui/lab";

// ----------------------------------------------------------------------

export default function App() {
  return (
    <AuthProvider>
      <ThemeConfig>
        <LocalizationProvider dateAdapter={DateAdapter}>
          <ScrollToTop />
          <Router />
        </LocalizationProvider>
      </ThemeConfig>
    </AuthProvider>
  );
}

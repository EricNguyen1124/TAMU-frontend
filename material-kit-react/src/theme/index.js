import PropTypes from "prop-types";
import { useMemo, useState, useContext, createContext } from "react";
// material
import { CssBaseline } from "@material-ui/core";
import {
  ThemeProvider,
  createTheme,
  StyledEngineProvider,
} from "@material-ui/core/styles";
//
import shape from "./shape";
import palette from "./palette";
import typography from "./typography";
import breakpoints from "./breakpoints";
import GlobalStyles from "./globalStyles";
import componentsOverride from "./overrides";
import shadows, { customShadows } from "./shadows";
// ----------------------------------------------------------------------
import Loading from "src/components/@material-extend/Loading";
import { AuthProvider } from "src/authentication/AuthContext.js";

ThemeConfig.propTypes = {
  children: PropTypes.node,
};

export default function ThemeConfig({ children }) {
  const themeOptions = useMemo(
    () => ({
      palette,
      shape,
      typography,
      breakpoints,
      shadows,
      customShadows,
    }),
    []
  );

  const theme = createTheme(themeOptions);
  theme.components = componentsOverride(theme);

  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <GlobalStyles />
        {children}
      </ThemeProvider>
    </StyledEngineProvider>
  );
}

// context
const Context = createContext();
export function contexts() {
  return useContext(Context);
}

export function ContextProvider({ children }) {
  const [loading, setLoading] = useState(false);
  const value = {
    setLoading,
  };

  return (
    <Context.Provider value={value}>
      <Loading loading={loading} />
      {children}
    </Context.Provider>
  );
}

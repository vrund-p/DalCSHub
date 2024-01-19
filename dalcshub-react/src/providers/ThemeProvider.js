//Author: Shiwen(Lareina) Yang
import { generateTheme } from "../utils";
import {
  ThemeProvider as MuiThemeProvider,
  StyledEngineProvider,
} from "@mui/material";
import { useMode } from "../providers";

/**
 * Wraps children component and injects theme support into the component.
 * @param MaterialUiProviderProps.children
 * Contains the node holding the children to inject material-ui support into.
 * @return - The provider wrapping the children.
 */
export const ThemeProvider = ({ children }) => {

  const { mode: darkMode } = useMode();
  const theme = generateTheme(darkMode);

  return (
    <StyledEngineProvider injectFirst>
      <MuiThemeProvider theme={theme}>{children}</MuiThemeProvider>
    </StyledEngineProvider>
  );
};

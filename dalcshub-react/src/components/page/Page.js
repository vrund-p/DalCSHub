//Author: Shiwen(Lareina) Yang
import { styled, useTheme } from "@mui/material/styles";
import { useMediaQuery } from "@mui/material";

const PageDiv = styled("div")(({ smallScreen }) => ({
  margin: smallScreen ? "20px" : "20px 50px",
  height: "100%",
  overflow: "auto",
}));

export const Page = ({ children }) => {
  const theme = useTheme();
  const smallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <PageDiv id="page-div" smallScreen={smallScreen}>
      {children}
    </PageDiv>
  );
};

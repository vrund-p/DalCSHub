//Author: Shiwen(Lareina) Yang
import { styled } from "@mui/material/styles";
import { CircularProgress as MCircularProgress, Grid } from "@mui/material";

const CircularProgressDiv = styled("div")(({ fullScreen }) => ({
  display: fullScreen ? "flex" : "block",
  width: fullScreen ? "100%" : "auto",
  height: fullScreen ? "80vh" : "auto",
  flexGrow: fullScreen ? 1 : "auto",
}));

export const CircularProgress = ({ fullScreen = false, size = 50 }) => {
  return (
    <CircularProgressDiv fullScreen={fullScreen}>
      <Grid
        container
        direction="column"
        justifyContent="center"
        alignItems="center"
      >
        <MCircularProgress size={size} />
      </Grid>
    </CircularProgressDiv>
  );
};

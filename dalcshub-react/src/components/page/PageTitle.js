//Author: Shiwen(Lareina) Yang
import { Grid, Typography } from "@mui/material";
import { Link } from "react-router-dom";

export const PageTitle = ({
  link,
  title,
  subTitle,
  paddingTop = "20px",
  paddingBottom = "20px",
  center = false,
  children,
}) => {
  return (
    <Grid
      container
      direction="row"
      justifyContent={center ? "center" : "space-between"}
      alignContent="center"
      style={{ paddingTop: paddingTop, paddingBottom: paddingBottom }}
    >
      <Grid item>
        <Link to={link} style={{ textDecoration: "none" }}>
          <Typography
            color="textPrimary"
            variant="h1"
            style={{
              textDecoration: "none",
            }}
          >
            {title}
          </Typography>
        </Link>
        <Typography color="secondary" variant="h2">
          {subTitle}
        </Typography>
      </Grid>
      <Grid item>{children}</Grid>
    </Grid>
  );
};

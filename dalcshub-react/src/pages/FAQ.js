//Author:
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Page, PageTitle } from "../components";
import { useTheme } from "@mui/material/styles";
import "../App.css";

export const FAQ = () => {
  const theme = useTheme();

  return (
    <Page>
      <PageTitle title={"Frequently Asked Questions"} link={"/faq"} />
      <Typography variant="body1">
        <p>Here you will find the most common questions about our website.</p>
      </Typography>

      <Accordion>
        <AccordionSummary
          sx={{ backgroundColor: theme.palette.background.dark }}
          id="panel1a-header"
          aria-controls="panel1a-content"
          expandIcon={<ExpandMoreIcon />}
        >
          <Typography variant="h3" color="primary">
            Is this a service provided by Dalhousie University?
          </Typography>
        </AccordionSummary>
        <AccordionDetails sx={{ boxShadow: 5 }}>
          <Typography variant="body1">
            No. This website was built and maintained by Dalhousie students for
            Dalhousie students to provide them with a community and various
            resources to help them make the best decision in choosing their
            courses on their academic journey.
          </Typography>
        </AccordionDetails>
      </Accordion>

      <Accordion>
        <AccordionSummary
          sx={{ backgroundColor: theme.palette.background.dark }}
          id="panel2a-header"
          aria-controls="panel2a-content"
          expandIcon={<ExpandMoreIcon />}
        >
          <Typography variant="h3" color="primary">
            How can I keep track of my courses of interest?
          </Typography>
        </AccordionSummary>
        <AccordionDetails sx={{ boxShadow: 5 }}>
          <Typography variant="body1">
            You can follow the courses you are interested in, where you will see
            them show in the Main Feed. Also, you can save specific posts to
            return to them later.
          </Typography>
        </AccordionDetails>
      </Accordion>

      <Accordion>
        <AccordionSummary
          sx={{ backgroundColor: theme.palette.background.dark }}
          id="panel3a-header"
          aria-controls="panel3a-content"
          expandIcon={<ExpandMoreIcon />}
        >
          <Typography variant="h3" color="primary">
            What if I can't find the information I am looking for?
          </Typography>
        </AccordionSummary>
        <AccordionDetails sx={{ boxShadow: 5 }}>
          <Typography variant="body1">
            You can always create your own post and hopefully a student or
            instructor from the community can help answer your question.
          </Typography>
        </AccordionDetails>
      </Accordion>
    </Page>
  );
};

// Author: Kent Chew

import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Typography, useMediaQuery, TextField, Grid, Divider, Button, Stack, Chip } from "@mui/material";
import { Page } from "../components";
import { API_URL } from "../utils";
import { useTheme } from "@mui/material/styles";
import { useUser, useSnackbar } from "../providers";

import "../App.css";
// [4] Default Course Background Image from :
// https://www.buytvinternetphone.com/blog/images/programming-the-rca-universal-remote-without-a-code-search-button.jpg
import defaultCoursebg from "../assets/images/default-course-bg.jpeg";

export const CreatePost = () => {
  const theme = useTheme();
  const smallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const { openSnackbar } = useSnackbar();
  const { user: currentUser} = useUser();
  const { firstName, lastName } = currentUser;

  const { courseNumber } = useParams();
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [course, setCourse] = useState({});
  const navigate = useNavigate();

  // get and identify course to display based on course number
  const getCourseDetails = async (courseNumber) => {
    try {
      const response = await fetch(`${API_URL}/api/course/${courseNumber}`);
      if (response.status === 200) {
        const result = await response.json();
        setCourse(result.data);
      } else {
        console.error("Failed");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleTitleChange = (event) => {
    setTitle(event.target.value);
  };

  const handleMessageChange = (event) => {
    setMessage(event.target.value);
  };
  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const res = await fetch(`${API_URL}/api/post/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: title,
          message: message,
          author: firstName + " " + lastName,
          date: new Date().toLocaleString(),
          courseId: course.number,
        }),
      });

      const data = await res.json();
      console.log("Successfully created post: ", data);

      if (res.status === 200) {
        openSnackbar("Post created successfully", "success");
        // clear form after successful submission
        setTitle("");
        setMessage("");
      } else {
        openSnackbar("Failed to create post", "error");
      }
    } catch (error) {
      console.error("Error creating post:", error);
    }
  };

  const handleBackButtonClick = () => {
    navigate(`/course-details/${courseNumber}`);
  };

  useEffect(() => {
    getCourseDetails(courseNumber);
  }, [courseNumber]);

  return (
    <Page>
      <Grid
        container
        style={{
          backgroundImage: `url(${course.image ?? defaultCoursebg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          width: "100%",
          height: "25vh",
          padding: "30px",
          marginBottom: "30px",
        }}
      >
        <Grid
          item
          xs={12}
          style={{ display: "flex", alignItems: "center" }}
          sx={{ textAlign: "left", marginBottom: "0px" }}
        >
          <Typography
            variant="h2"
            gutterBottom
            sx={{
              textShadow: "1px 1px 3px rgba(0, 0, 0, 1)",
              color: "white",
              fontWeight: 500,
              fontSize: smallScreen ? "2em" : "3em",
            }}
          >
            {course.title}
          </Typography>
        </Grid>
      </Grid>

      <Grid container spacing={2} style={{ padding: "1em", marginBottom: "15px" }}>
        <Grid item sm={3} xs={12}>
        <Typography variant="body1" gutterBottom>
            <b>Number:</b> {course.subject} {course.number}
          </Typography>
          <Typography variant="body1" gutterBottom>
            <b>Credit Hours: </b>{course.credit_hours}
          </Typography>
          <Typography variant="body1" gutterBottom>
            <b>Flags:</b>
          </Typography>
          <Stack
            direction="column"
            justifyContent="flex-start"
            alignItems="flex-start"
            spacing={1}
          >
            {course.flags?.map((flag) => (
              <Chip
                key={course.number + flag}
                label={flag}
                color="primary"
                size="small"
                variant="outlined"
              />
            ))}
          </Stack>
        </Grid>
        <Grid item sm={9} xs={12}>
          <Typography variant="body1" gutterBottom>
            {course.description}
          </Typography>
        </Grid>
      </Grid>

      <Divider />

      <Grid
        container
        style={{
          backgroundColor: theme.palette.mode === 'light' ? theme.palette.background.dark : theme.palette.grey[900],
          marginTop: "15px",
          padding: "3em",
        }}
      >
        <Grid item sm={12}>
          <Typography variant="h4" gutterBottom>
            Create a New Post
          </Typography>

          <Divider />

          <form onSubmit={handleSubmit}>
            <TextField
              style={{ margin: "1em 0 1em 0" }}
              label="Title"
              variant="outlined"
              required
              fullWidth
              value={title}
              onChange={handleTitleChange}
            />
            <TextField
              style={{ marginBottom: "1em" }}
              label="Message"
              multiline
              rows={4}
              variant="outlined"
              required
              fullWidth
              value={message}
              onChange={handleMessageChange}
            />
            <Button
              type="submit"
              size="large"
              variant="contained"
              style={{ margin: "0 1em 1em 0" }}
            >
              Submit
            </Button>
            <Button
              onClick={handleBackButtonClick}
              size="large"
              variant="contained"
              style={{ margin: "0 1em 1em 0" }}
            >
              Back
            </Button>
          </form>
        </Grid>
      </Grid>
    </Page>
  );
};

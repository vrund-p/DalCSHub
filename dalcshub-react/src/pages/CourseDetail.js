// Author: Kent Chew
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Typography, useMediaQuery, Grid, Divider, Button, Chip, Stack } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { Page, Post, CircularProgress } from "../components";
import { useUser, useSnackbar } from "../providers";
import { handleFollowOrUnfollowQuery, API_URL } from "../utils";
import "../App.css";
// [4] Default Course Background Image from :
// https://www.buytvinternetphone.com/blog/images/programming-the-rca-universal-remote-without-a-code-search-button.jpg
import defaultCoursebg from "../assets/images/default-course-bg.jpeg";

export const CourseDetail = () => {
  const theme = useTheme();
  const smallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const { openSnackbar } = useSnackbar();
  const { user: currentUser, userDetailRefresh } = useUser();
  const { _id: userId, followedCourses: followedCoursesIds } = currentUser;

  const { courseNumber } = useParams();
  const [posts, setPosts] = useState([]);
  const [course, setCourse] = useState({});
  const [loading, setLoading] = useState(true);
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

  // get post based on course number
  // TODO: determine if this is the best way to get author details, given the GuardedRoute in place
  const getPostsByCourse = async (courseNumber) => {
    try {
      const response = await fetch(`${API_URL}/api/post/course/${courseNumber}`);
      if (response.status === 200) {
        const result = await response.json();
        setPosts(result.data);
      } else {
        console.error("Failed");
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      await getCourseDetails(courseNumber);
      await getPostsByCourse(courseNumber);
      setLoading(false);
    };
    fetchData();
  }, [courseNumber]);

  const handlePostClick = (post_id) => {
    navigate(`/comment/${post_id}`);
  };

  const handleCreatePostClick = () => {
    navigate(`/create-post/${courseNumber}`);
  };

  const followOrUnfollowOnclick = async (courseId) => {
    const response = await handleFollowOrUnfollowQuery(
      userId,
      courseId,
      !followedCoursesIds.includes(courseId),
      userDetailRefresh
    );
    openSnackbar(response.message, response.success ? "success" : "error");
  };

  if (loading) return <CircularProgress fullScreen />;

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
            variant="h1"
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
        <Grid item xs={12} sm={5} md={3}>
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
            {course.flags.map((flag) => (
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
        <Grid item xs={12} sm={7} md={6}>
          <Typography variant="body1" gutterBottom>
            {course.description}
          </Typography>
        </Grid>
        <Grid item xs={12} sm={12} md={3}>
          <Button
            style={{ marginBottom: "1em" }}
            variant="contained"
            size="large"
            onClick={handleCreatePostClick}
            fullWidth
          >
            Create Post
          </Button>
          <Button
            variant="contained"
            size="large"
            onClick={() => followOrUnfollowOnclick(course._id)}
            fullWidth
          >
            {followedCoursesIds.includes(course._id) ? "Unfollow" : "Follow"}
          </Button>
        </Grid>
      </Grid>

      <Divider />

      {posts.map((post) => (
        <Post
          key={post._id}
          postId={post._id}
          postTitle={post.postTitle}
          postDate={post.timeCreated}
          postAuthor={post.postAuthor}
          postDescription={post.postDescription}
          postRating={post.postRating}
        >
          <Button variant="outlined" onClick={() => handlePostClick(post._id)}>
            Details
          </Button>
        </Post>
      ))}
      {posts.length === 0 && (
        <Typography variant="body1" sx={{ paddingTop: "20px" }}>
          There are no posts yet!
        </Typography>
      )}
    </Page>
  );
};

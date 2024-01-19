//Author: Shiwen(Lareina) Yang & Khaled Al-Mahbashi
import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from "react";
import { Tabs, Tab, Typography, Box, Grid, Button } from "@mui/material";
import { Page, Post, PageTitle, CourseCard, CircularProgress } from "../components";
import { useUser } from '../providers';
import { API_URL } from "../utils";

const TabPanel = (props) => {
  const { children, value, index, ...other } = props;

  return (
    <div role="tabpanel" hidden={value !== index} {...other}>
      {value === index && (
        <Box sx={{ pt: 3, pb: "10px" }}>
          {children}
        </Box>
      )}
    </div>
  );
};

export const MainFeed = () => {
  const navigate = useNavigate();

  const { user: currentUser } = useUser();
  const { _id: userId, followedCourses: followedCoursesIds, savedPosts: savedPostIds } = currentUser;

  const [tabIndex, setTabIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [followedCourses, setFollowedCourses] = useState([]);
  const [savedPosts, setSavedPosts] = useState([]); // Khaled

  const fetchFollowedCourses = async (followedCoursesIds) => {
    try {
      const response = await fetch(`${API_URL}/api/course/get_by_ids`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ courseIds: followedCoursesIds }),
      });
      if (response.status === 200) {
        const result = await response.json();
        setFollowedCourses(result.data);
      } else {
        console.error("Failed to fetch courses");
      }
      setLoading(false);
    } catch (error) {
      console.error(error);
    }
  };

  // Khaled: Function to fetch the saved post IDs from the Post API
  const fetchSavedPosts = async (savedPostIds) => {
    try {
      const response = await fetch(`${API_URL}/api/post/get_by_ids`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ postIds: savedPostIds }),
      });
      if (response.status === 200) {
        const result = await response.json();
        setSavedPosts(result.data);
      } else {
        console.error("Failed to fetch posts");
      }
      setLoading(false);
    } catch (error) {
      console.error(error);
    }
  };


  useEffect(() => {
    fetchFollowedCourses(followedCoursesIds);
    fetchSavedPosts(savedPostIds);
  }, [followedCoursesIds, savedPostIds]);

  return (
    <Page>
      <PageTitle title={"Main Feed"} link={"/"} />

      <Box sx={{ width: "100%" }}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs
            value={tabIndex}
            onChange={(_, newIndex) => setTabIndex(newIndex)}
            textColor="secondary"
            indicatorColor="secondary"
          >
            <Tab label="My Courses" />
            <Tab label="Saved Posts" />
          </Tabs>
        </Box>
        <TabPanel value={tabIndex} index={0}>
          {loading && <CircularProgress fullScreen />}
          {!loading && followedCourses.length > 0 && (
            <Grid container direction="row" justifyContent="flex-start" spacing={2}>
              {followedCourses.map((course) => (
                <Grid item key={course._id} xs={12} sm={6} md={4} lg={3}>
                  <CourseCard
                    userId={userId}
                    courseId={course._id}
                    courseNumber={course.number}
                    title={course.subject + " " + course.number + " " + course.title}
                    creditHours={course.credit_hours}
                    flags={course.flags}
                    followed={true}
                    bgImage={null}
                  />
                </Grid>
              ))}
            </Grid>
          )}
          {!loading && followedCourses.length === 0 && (
            <Typography>
              No course has been followed yet ! Go to{" "}
              <Link to={"/browse-courses"}>Browse Courses Page</Link> !
            </Typography>
          )}
        </TabPanel>
        <TabPanel value={tabIndex} index={1}>
          {loading && <CircularProgress fullScreen />}
          {!loading && savedPosts.length === 0 && <Typography>No post has been saved yet !</Typography> }
          {!loading && savedPosts.length !== 0 && 
            savedPosts.map((post) => 
              <Post
                key={post._id}
                postId={post._id}
                postTitle={post.postTitle}
                postDate={post.timeCreated}
                postAuthor={post.postAuthor}
                postDescription={post.postDescription}
                postRating={post.postRating}
              >
                <Button variant="outlined" onClick={() => navigate(`/comment/${post._id}`)}>
                  Details
                </Button>
              </Post>
          )}          
        </TabPanel>
      </Box>
    </Page>
  );
};

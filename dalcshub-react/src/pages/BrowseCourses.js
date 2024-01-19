//Author: Shiwen(Lareina) Yang
import { useState, useEffect } from "react";
import {
  Grid,
  Button,
  TextField,
  InputAdornment,
  Card,
  Typography,
  CardContent,
  CardActionArea,
  CardActions,
  Stack,
  IconButton,
  Chip,
} from "@mui/material";
import { useNavigate } from 'react-router-dom';
import { Page, PageTitle, CircularProgress } from "../components";
import { useUser, useSnackbar } from '../providers';
import { handleFollowOrUnfollowQuery, API_URL } from "../utils"
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";

export const BrowseCourses = () => {
  const navigate = useNavigate();
  const { openSnackbar } = useSnackbar();
  const { user : currentUser, userDetailRefresh } = useUser();
  const { _id: userId, followedCourses : followedCoursesIds } = currentUser;

  const [loading, setLoading] = useState(true);
  const [searchKey, setSearchKey] = useState("");
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);

  const fetchCourses = async () => {
    try {
      const response = await fetch(`${API_URL}/api/course/all`);
      if (response.status === 200) {
        const result = await response.json();
        setCourses(result.data);
      } else {
        console.error("Failed to fetch courses");
      }
      setLoading(false);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  useEffect(() => {
    const newfilteredCourses = courses.filter((course) => {
      const courseDetails = `${course.subject} ${course.number} ${
        course.title
      } ${course.description} ${course.flags.join(" ")}`;

      return courseDetails.toLowerCase().includes(searchKey?.toLowerCase() ?? '');
    });
    setFilteredCourses(newfilteredCourses);
  }, [searchKey, courses]);

  const followOrUnfollowOnclick = async (event, courseId) => {
    event.stopPropagation(); // Prevent the event from propagating to the parent CardActionArea
    const response = await handleFollowOrUnfollowQuery(
        userId, 
        courseId, 
        !followedCoursesIds.includes(courseId), 
        userDetailRefresh
    )
    openSnackbar(response.message, response.success ? "success" : "error");
  };

  const flagOnClick = (event, flag) => {
    event.stopPropagation(); // Prevent the event from propagating to the parent CardActionArea
    setSearchKey(flag);
  }

  const courseCardOnclick = (courseNumber) => {
    navigate(`/course-details/${courseNumber}`)
  };

  return (
    <Page>
      <PageTitle title={"Browse Courses"} link={"/browse-courses"} />
      <TextField
        fullWidth
        value={searchKey}
        variant="outlined"
        type="text"
        placeholder="Enter specific course details..."
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
          endAdornment: (
            <InputAdornment position="end">
              <IconButton disableRipple onClick={() => setSearchKey("")}>
                <ClearIcon />
              </IconButton>
            </InputAdornment>
          ),
        }}
        onChange={(event) => setSearchKey(event.target.value)}
      />

      {loading && <CircularProgress fullScreen />}
      {!loading &&
        filteredCourses.length > 0 &&
        filteredCourses.map((course) => (
          // TODO: Lareina - refactor <CardActionArea> and <CardActions> layout
          <Card key={course._id} variant="outlined">
            <CardActionArea 
              onClick={() => courseCardOnclick(course.number)} 
              disableRipple
            >
              <Grid
                container
                direction="row"
                justifyContent="space-between"
                alignItems="center"
              >
                <Grid item xs={12} sm>
                  <CardContent>
                    <Stack
                      direction="row"
                      justifyContent="flex-start"
                      alignItems="center"
                      spacing={1}
                      flexWrap="wrap"
                      sx={{ marginBottom: "10px" }}
                    >
                      <Typography variant="h4">
                        {course.subject} {course.number} | {course.title}{" "}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {/* TODO: Lareina - count the number of followers for each course */}
                      </Typography>
                    </Stack>
                    <Typography variant="body2">
                      {course.description}
                    </Typography>
                    <Stack
                      direction="row"
                      justifyContent="flex-start"
                      alignItems="center"
                      spacing={1}
                      flexWrap="wrap"
                      sx={{ marginTop: "10px" }}
                    >
                      {course.flags.map((flag) => (
                        <Chip
                          key={course.number + flag}
                          label={flag}
                          color="primary"
                          size="small"
                          variant="outlined"
                          onClick={(event) => flagOnClick(event, flag)}
                        />
                      ))}
                    </Stack>
                  </CardContent>
                </Grid>
                <Grid item>
                  <CardActions>
                    <Button
                      disableRipple
                      size="small"
                      variant="outlined"
                      color={followedCoursesIds.includes(course._id) ? "info" : "primary"}
                      onClick={(event) => followOrUnfollowOnclick(event, course._id)}
                    >
                      {followedCoursesIds.includes(course._id) ? "Unfollow" : "Follow" }
                    </Button>
                  </CardActions>
                </Grid>
              </Grid>
            </CardActionArea>
          </Card>
        ))}
      {!loading && filteredCourses.length === 0 && (
        <Typography variant="body1" sx={{ paddingTop: "20px" }}>
          {" "}
          No results found, please try another search query.
        </Typography>
      )}
    </Page>
  );
};

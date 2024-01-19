//Authors: Kent Chew, Khaled, Meet Kumar Patel
import { Grid, Divider, IconButton, Typography } from "@mui/material";
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import BookmarkIcon from '@mui/icons-material/Bookmark';
import { useUser, useSnackbar } from '../providers';
import { API_URL } from "../utils";
import { useState, useEffect } from "react";
import { useTheme } from "@mui/material/styles";
import { format } from 'date-fns';

export const Post = (props) => {
  const theme = useTheme();
  const { openSnackbar } = useSnackbar();
  const { postId, postTitle, postAuthor, postDate, postDescription, postRating, children } = props;
  const [rating, setRating] = useState(postRating);
  const [posts, setPosts] = useState([]);

  // convert postDate to just show MMM dd, y HH:mm as string
  const formattedDate = format(new Date(postDate), 'MMM dd, y HH:mm');

  const { user: currentUser, userDetailRefresh } = useUser();
  const { _id: userId, savedPosts: savedPostIds } = currentUser;
  const isSaved = savedPostIds.includes(postId);

  const disableHeart = posts.find((post) => post.postTitle === postTitle)?.disableHeart || false;
  const checkIsLiked = (likedByArray) => {
    return likedByArray.includes(currentUser._id);
  };

  // Author : Meet Kumar Patel : liking and disliking of a post
  const handleLike = async (title) => {
    await getLatest();
    let requiredPost = posts.filter((post) => post.postTitle === title);
    let isLiked = false;

    if (requiredPost.length > 0) {
      const updatedLikedBy = [...requiredPost[0].likedBy];
      isLiked = checkIsLiked(updatedLikedBy);

      if (!isLiked) {
        updatedLikedBy.push(userId);
        requiredPost[0].likedBy = updatedLikedBy;
      } else {
        
        const index = updatedLikedBy.indexOf(userId);
        if (index !== -1) {
          updatedLikedBy.splice(index, 1);
          requiredPost[0].likedBy = updatedLikedBy;
        }
      }

      var alreadyLiked = '';
      try {
        const res = await fetch(`${API_URL}/api/post/updateLikedBy`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId: userId,
            postId: requiredPost[0]._id,
          }),
        });

        alreadyLiked = await res.json();

        if (alreadyLiked.message !== 'User has already liked the post') {
          setRating(Math.max(0, parseInt(rating, 10) + 1));
          try {
            await fetch(`${API_URL}/api/post/updatePostRating`, {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                rating: Math.max(0, parseInt(rating, 10) + 1),
                postId: requiredPost[0]._id,
              }),
            });

            const updatedPosts = posts.map((post) => {
              if (post.postTitle === title) {
                return { ...post, disableHeart: true };
              }
              return post;
            });

            setPosts(updatedPosts);
          } catch (error) {
            console.error('Error:', error);
          }
        } else {
          try {
            const res = await fetch(`${API_URL}/api/post/removeLikedBy`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                userId: userId,
                postId: requiredPost[0]._id,
              }),
            });

            const data = await res.json();
            console.log(data);
          } catch (error) {
            console.error('Error:', error);
          }

          try {
            setRating(Math.max(0, parseInt(rating, 10) - 1))
            const res = await fetch(`${API_URL}/api/post/updatePostRating`, {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                rating: Math.max(0, parseInt(rating, 10) - 1),
                postId: requiredPost[0]._id,
              }),
            });

            const data = await res.json();
            console.log(data)

            const updatedPosts = posts.map((post) => {
              if (post.postTitle === title) {
                return { ...post, disableHeart: false };
              }
              return post;
            });

            setPosts(updatedPosts);
          } catch (error) {
            console.error('Error:', error);
          }
        }
      } catch (error) {
        console.error('Error:', error);
      }
    }
  };

  //Khaled: Handle save button click
  const handleSaveClick = async () => {
    if (!isSaved) {
      try {
        // Call the backend API to save the post
        const response = await fetch(`${API_URL}/api/user/savePost`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ userId: userId, postId: postId }), // Send the user and post ID in the request body
        });
        const result = await response.json();
        if (response.ok) {
          console.log('Post saved!');
          userDetailRefresh(userId);
        } else {
          console.error('Failed to save post:', response.status);
        }
        openSnackbar(result.message, result.success ? "success" : "error");
      } catch (error) {
        console.error('Error saving post:', error);
      }
    } else {
      try {
        // Call the backend API to unsave the post
        const response = await fetch(`${API_URL}/api/user/unsavePost`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ userId: userId, postId: postId }), // Send the user and post ID in the request body
        });

        const result = await response.json();
        if (response.ok) {
          console.log('Post unsaved!');
          userDetailRefresh(userId);
        } else {
          console.error('Failed to unsave post:', response.status);
        }
        openSnackbar(result.message, result.success ? "success" : "error");
      } catch (error) {
        console.error('Error unsaving post:', error);
      }
    }
  };

  const getLatest = async () => {
    try {
      const response = await fetch(`${API_URL}/api/post`);
      if (response.status === 200) {
        const result = await response.json();

        // Initialize the disableRating property for each post based on currentUser._id
        const updatedPosts = result.data.map((post) => ({
          ...post,
          disableHeart: post.likedBy.includes(userId),
        }));
        setPosts(updatedPosts);
      } else {
        console.error("Failed");
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getLatest();
  });

  return (
    <Grid container spacing={2} style={{ padding: "1em", marginTop: "15px" }}>
      <Grid item sm={12}
        style={{
          backgroundColor: theme.palette.mode === 'light' ? theme.palette.background.dark : theme.palette.grey[900],
          padding: "3em"
        }}
      >
        <Grid container spacing={2}>
          <Grid item sm={11} xs={11}>
            <Typography variant="h4" gutterBottom>
              {postTitle}
            </Typography>
            <Typography variant="subtitle2" gutterBottom>
              posted {formattedDate} by {postAuthor}
            </Typography>
            <Divider />
            <Typography variant="body1" gutterBottom style={{ margin: "1vh 0 1vh 0" }}>
              {postDescription}
            </Typography>
          </Grid>
          <Grid item sm={1} xs={1} style={{ textAlign: "center" }}>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                height: "100%",
              }}
            >
              <IconButton onClick={handleSaveClick} size="large" color="secondary">
                {isSaved ? <BookmarkIcon /> : <BookmarkBorderIcon />}
              </IconButton>
              <IconButton
                size="large"
                color="secondary"
                onClick={() => handleLike(postTitle)}
              >
                {disableHeart ? <FavoriteIcon /> : <FavoriteBorderIcon />}
              </IconButton>
              <Typography variant="h6" gutterBottom>
                {rating}
              </Typography>
              {children}
            </div >
          </Grid>
        </Grid >
      </Grid >
    </Grid >
  );
};

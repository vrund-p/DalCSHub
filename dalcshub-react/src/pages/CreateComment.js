// Author: Meet Kumar Patel
import {
    Button,
    Container,
    TextField,
    Typography,
} from '@mui/material';
import { API_URL } from "../utils";
import { useState, useEffect } from "react";
import { useParams } from 'react-router-dom';
import { Post, Comment } from "../components";
import { useUser } from "../providers";

export const CreateComment = () => {
    const { post_id } = useParams();

    const { user: currentUser} = useUser();
    const { firstName, lastName } = currentUser;

    const [posts, setPosts] = useState([]);
    const [previousComments, setpreviousComments] = useState([]);
    const [showPost, setshowPost] = useState(true);
   
    const getPosts = async () => {
        try {
            const response = await fetch(`${API_URL}/api/post`);
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

    const fetchComments = async () => {
        try {
            const response = await fetch(`${API_URL}/api/reply/fetch`);
            if (response.status === 200) {
                const result = await response.json();
                setpreviousComments(result.data);
            } else {
                console.error("Failed to fetch comments");
            }
        } catch (error) {
            console.error(error);
        }
    };


    useEffect(() => {
        getPosts();
        fetchComments();
    }, [showPost]);

    const filteredPost = posts.filter((post) => post._id === post_id);

    const filteredPreviousPost = previousComments.filter((previousComments) => previousComments.replied_post_id === post_id);

    const [content, setContent] = useState('');

    const handleContentChange = (event) => {
        setContent(event.target.value);
    };

    const handleshowPost = () => {
        setshowPost(true);
    };


    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            const res = await fetch(`${API_URL}/api/reply/addComment`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    replied_post_id: post_id,
                    commentDescription: content,
                    author_name: firstName + " " + lastName, 
                    date: new Date().toLocaleString(),
                }),
            });

            const data = await res.json();
            console.log("Successfully created post: ", data);

            setContent("");
            setshowPost(true);

        } catch (error) {
            console.error("Error creating post:", error);
        }
    };

    return (
        showPost ? (
            <>
                {filteredPost.map((post) => (
                    <Post
                        key={post._id}
                        postId={post._id}
                        postTitle={post.postTitle}
                        postDate={post.timeCreated}
                        postAuthor={post.postAuthor}
                        postDescription={post.postDescription}
                        postRating={post.postRating}
                    >
                        <Button variant="contained" onClick={() => setshowPost(false)}>
                            Reply
                        </Button>
                    </Post>
                ))}

                {filteredPreviousPost.map((filteredPreviousPost) => (
                    <Comment
                        key={filteredPreviousPost._id}
                        title={filteredPreviousPost.author_name + "  commented: "}
                        date={filteredPreviousPost.timeCreated}
                        author={filteredPreviousPost.author_name}
                        description={filteredPreviousPost.commentDescription}
                    >
                    </Comment>
                ))}
            </>
        ) : (
            <Container
                maxWidth="sm"
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    border: '1px solid #ccc',
                    borderRadius: '8px',
                    padding: '20px',
                    marginTop: '20px'
                }}
            >
                <Typography variant="h5" component="h1" gutterBottom>
                    Create a New Comment
                </Typography>
                <TextField
                    label="Replying to Post"
                    variant="outlined"
                    value={(filteredPost[0].postTitle)}
                    fullWidth
                    margin="normal"
                    disabled
                />
                <TextField
                    label="Content"
                    multiline
                    rows={4}
                    variant="outlined"
                    value={content}
                    onChange={handleContentChange}
                    fullWidth
                    margin="normal"
                />
                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        width: '100%',
                    }}
                >
                    <Button onClick={handleshowPost} variant="contained">
                        Cancel
                    </Button>
                    <Button onClick={handleSubmit} variant="contained">
                        Submit
                    </Button>
                </div>
            </Container>

        )
    );
};


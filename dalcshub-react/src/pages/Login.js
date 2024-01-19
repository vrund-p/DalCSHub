//Author: Vrund Patel

import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useUser, useSnackbar } from "../providers";
import { API_URL } from "../utils";
import { Grid, TextField, Button, Typography } from "@mui/material";

export const Login = () => {
  const { setUser } = useUser();
  const { openSnackbar } = useSnackbar();
  const navigate = useNavigate();

  const [loginInput, setLoginInput] = useState({
    loginEmail: "",
    loginPassword: "",
  });

  const handleChange = (e) => {
    let name = e.target.name;
    let value = e.target.value;

    setLoginInput({
      ...loginInput,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const loginError = validateInput();
    setLoginError(loginError);

    if (Object.values(loginError)[0].length === 0 && Object.values(loginError)[1].length === 0) {
      verifyLoginCredentials();

      setLoginInput({
        loginEmail: "",
        loginPassword: "",
      });
    }
  };

  const [loginErrors, setLoginError] = useState({});

  const validateInput = () => {
    const loginError = {};

    // email
    if (!loginInput.loginEmail) {
      loginError.loginEmail = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(loginInput.loginEmail)) {
      loginError.loginEmail = "Enter a valid email";
    } else {
      loginError.loginEmail = "";
    }

    // password
    if (!loginInput.loginPassword) {
      loginError.loginPassword = "Password is required";
    } else {
      loginError.loginPassword = "";
    }

    return loginError;
  };

  const verifyLoginCredentials = async () => {
    const { loginEmail, loginPassword } = loginInput;
    try{
      const response = await fetch(`${API_URL}/api/user/signin`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          "email": loginEmail,
          "password": loginPassword
        }),
      });
      const result = await response.json();

      if (response.ok) {
        setUser(result.data);

        // TODO: Store the "token" instead
        const currentUserString = JSON.stringify(result.data);
        await localStorage.setItem("currentUser", currentUserString);
        
        navigate("/main");
      } else {
        console.log("response.status: ", response.status);
      }
      openSnackbar(result.message, result.success? "success" : "error");
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <Grid container justifyContent="center" alignItems="center" height="100vh">
      <Grid item xs={10} sm={6} md={4}>
        <form onSubmit={handleSubmit}>
          <Typography variant="h5" align="center" gutterBottom>
            Login
          </Typography>

          <TextField
            label="Email"
            type="email"
            fullWidth
            margin="normal"
            name="loginEmail"
            value={loginInput.loginEmail}
            onChange={handleChange}
            error={Boolean(loginErrors.loginEmail)}
            helperText={loginErrors.loginEmail}
          />
          <TextField
            label="Password"
            type="password"
            fullWidth
            margin="normal"
            name="loginPassword"
            value={loginInput.loginPassword}
            onChange={handleChange}
            error={Boolean(loginErrors.loginPassword)}
            helperText={loginErrors.loginPassword}
          />
          <Button variant="contained" size="small" type="submit" fullWidth>
            Login
          </Button>
          <Typography variant="body2" align="center" marginTop="8px">
            Forgot Password? <Link to={"/register"}>Sign Up</Link>
          </Typography>
        </form>
      </Grid>
    </Grid>
  );
};

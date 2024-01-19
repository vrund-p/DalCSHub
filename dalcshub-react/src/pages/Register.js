//Author: Vrund Patel

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { API_URL } from "../utils";
import { Grid, TextField, Button, Typography, Select, MenuItem, FormHelperText, Stack, FormControl } from '@mui/material';
import { useSnackbar } from '../providers';

export const Register = () => {
  const navigate = useNavigate();
  const { openSnackbar } = useSnackbar();

  const [input, setInput] = useState({
    fName: '',
    lName: '',
    type: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [errors, setError] = useState({});

  const handleChange = (e) => {
    let name = e.target.name;
    let value = e.target.value;

    setInput({
      ...input,
      [name]: value
    });
  };

  const submitHandler = (e) => {
    e.preventDefault();

    const errors = validate();
    setError(errors);

    if (
      Object.values(errors)[0].length === 0 &&
      Object.values(errors)[1].length === 0 &&
      Object.values(errors)[2].length === 0 &&
      Object.values(errors)[3].length === 0 &&
      Object.values(errors)[4].length === 0 &&
      Object.values(errors)[5].length === 0 
    ) {

      registerUser();

      setInput({
        fName: '',
        lName: '',
        type: '',
        email: '',
        password: '',
        confirmPassword: ''
      });
    }
  };

  const validate = () => {
    const error = {};

    // firstName
    if (!input.fName) {
      error.fName = 'First Name is required';
    } else if (!/[A-Za-z]+/.test(input.fName)) {
      error.fName = 'Enter a valid first name';
    } else {
      error.fName = '';
    }

    // lastName
    if (!input.lName) {
      error.lName = 'Last Name is required';
    } else if (!/[A-Za-z]+/.test(input.lName)) {
      error.lName = 'Enter a valid last name';
    } else {
      error.lName = '';
    }

    // type
    if (!input.type) {
      error.type = 'Account Type is required';
    } else {
      error.type = '';
    }

    // email
    if (!input.email) {
      error.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(input.email)) {
      error.email = 'Enter a valid email';
    } else {
      error.email = '';
    }

    // password
    if (!input.password) {
      error.password = 'Password is required';
    } else if (input.password.length < 8) {
      error.password = 'Enter a valid password';
    } else {
      error.password = '';
    }

    // confirm password
    if (!input.confirmPassword) {
      error.confirmPassword = 'Re-enter the password to confirm';
    } else if (input.confirmPassword !== input.password) {
      error.confirmPassword = 'Password does not match';
    } else {
      error.confirmPassword = '';
    }

    return error;
  };

  const registerUser = async () => {
    const { fName, lName, type, email, password } = input;

    if (!fName || !lName || !type || !email || !password) {
      openSnackbar("Please fill in all required fields.", "warning");
      return;
    }

    try {
      const res = await fetch(`${API_URL}/api/user/x`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          firstName: fName,
          lastName: lName,
          type: type,
          email: email,
          password: password
        })
      });

      const result = await res.json();
      openSnackbar(result.message, result.success? "success" : "error");

      if (result.success) {
        navigate("/login");
        console.log("Invalid user's registration");
      } else {
        console.log('User registration unsuccessfully');
      }
    } catch (error) {
      console.error('Error:', error);
      openSnackbar("An error occurred. Please try again later.", "error");
    }
  };

  return (
    <Grid container justifyContent="center" alignItems="center" height="100vh">
      <Grid item xs={10} sm={6} md={4}>
        <div className="sign-up">
          <Typography variant="h5" align="center" gutterBottom>
            Register your Account for DalCSHub
          </Typography>
          <div className="container">
            <form onSubmit={submitHandler}>
              <TextField
                label="First Name"
                size='small'
                type="text"
                fullWidth
                margin="normal"
                name="fName"
                value={input.fName}
                onChange={handleChange}
                error={Boolean(errors.fName)}
                helperText={errors.fName}
              />
              <TextField
                label="Last Name"
                size="small"
                type="text"
                fullWidth
                margin="normal"
                name="lName"
                value={input.lName}
                onChange={handleChange}
                error={Boolean(errors.lName)}
                helperText={errors.lName}
              />
              <Stack direction="row" justifyContent="flex-start" alignItems="center" spacing={1}>
                <label>Account Type: </label>
                <FormControl error={Boolean(errors.type)}>
                  <Select
                    className="form-control"
                    name="type"
                    value={input.type === '' ? 'Select' : input.type}
                    onChange={handleChange}
                    defaultValue={'Select'}
                    size="small"
                  >
                    <MenuItem value={'Select'} disabled>
                      Select Type
                    </MenuItem>
                    <MenuItem value={'Student'}>Student</MenuItem>
                    <MenuItem value={'Instructor'}>Instructor</MenuItem>
                    <MenuItem value={'Alumni'}>Alumni</MenuItem>
                  </Select>
                  <FormHelperText>{errors.type}</FormHelperText>
                </FormControl>
              </Stack>
              <TextField
                label="Email"
                type="email"
                size="small"
                fullWidth
                margin="normal"
                name="email"
                value={input.email}
                onChange={handleChange}
                error={Boolean(errors.email)}
                helperText={errors.email}
                placeholder="example@dal.ca"
              />
              <TextField
                label="Password"
                type="password"
                size="small"
                fullWidth
                margin="normal"
                name="password"
                value={input.password}
                onChange={handleChange}
                error={Boolean(errors.password)}
                helperText={errors.password}
              />
              <TextField
                label="Confirm Password"
                type="password"
                size="small"
                variant="outlined"
                fullWidth
                margin="normal"
                name="confirmPassword"
                value={input.confirmPassword}
                onChange={handleChange}
                error={Boolean(errors.confirmPassword)}
                helperText={errors.confirmPassword}
              />
              <Button variant="contained" type="submit" fullWidth>
                Create Account
              </Button>
              <Typography variant="body2" align="center" marginTop="8px">
                Already Registered? <Link to={'/login'}>Login</Link>
              </Typography>
            </form>
          </div>
        </div>
      </Grid>
    </Grid>
  );
};


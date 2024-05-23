import { useState } from "react";
import {
  Button,
  Container,
  Paper, 
  TextField,
  Typography,
} from "@mui/material";
import { useFileHandler, useInputValidation, useStrongPassword } from "6pp";
import { bgGradient } from "../../components/constants/color";
import { Navigate } from "react-router-dom";

const isAdmin = true
const AdminLogin = () => {

  const secrateKey = useInputValidation("")
  const submitHandler = (e)=>{
    e.preventDefault();
    console.log("admin login handler");
  }

  if(isAdmin) return <Navigate to="/admin/dashboard" />

  return (
    <div style={{
      backgroundImage:bgGradient
    }}> 
      <Container
        component={"main"}
        maxWidth="xs"
        sx={{
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Paper
        
          elevation={3}
          sx={{
            padding: 4,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
            <>
              <Typography variant="h5">Admin Login </Typography>
              <form
                style={{
                  width: "100%",
                  marginTop: "1rem",
                }}
                onSubmit={submitHandler}
              >

                <TextField
                  required
                  fullWidth
                  label="secrateKey"
                  type="Password"
                  margin="normal"
                  variant="outlined"
                  value={secrateKey.value}
                  onChange={secrateKey.changeHandler}
                />

                <Button
                  sx={{
                    marginTop: "1rem",
                  }}
                  variant="contained"
                  color="primary"
                  fullWidth
                  type="submit"
                >
                  Login
                </Button>
              </form>
            </>
        </Paper>
      </Container>
    </div>
  );
};

export default AdminLogin;

import React, { useEffect } from "react";
import confetti from "canvas-confetti";
import { Box, Typography, Paper } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

const Home = () => {
  useEffect(() => {
    confetti({
      particleCount: 1000,
      startVelocity: 100,
      spread: 800,
      origin: { x: 0.5, y: 0.9 },
    });
  }, []);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "90vh",
        backgroundColor: "#f0f4f7",
        overflow: "hidden",
      }}
    >
      <Paper
        elevation={2}
        sx={{
          padding: "5rem",
          borderRadius: "12px",
          textAlign: "center",
          position: "relative",
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.15)",
          animation: "popUp 1s ease-out forwards",
          transform: "translateY(100px)", 
        }}
      >
        <CheckCircleIcon sx={{ fontSize: 60, color: "#4caf50" }} />

        <Typography
          variant="h4"
          sx={{ marginTop: "1rem", marginBottom: "1rem", fontWeight: "bold" }}
        >
          Thank you!
        </Typography>

        <Typography
          variant="h5"
          sx={{
            fontWeight: "bold",
            color: "#4caf50",
            marginBottom: "1rem",
          }}
        >
          Welcome to Infollion
        </Typography>
      </Paper>
    </Box>
  );
};

export default Home;

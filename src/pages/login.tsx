import { useState } from "react";
import { useLogin } from "@refinedev/core";
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Alert,
} from "@mui/material";

export const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { mutate: login, isLoading } = useLogin();
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    login(
      { username, password },
      {
        onError: (err) => setError(err?.message || "שגיאה"),
      }
    );
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #b39ddb, #9575cd)",
      }}
    >
      <Paper
        elevation={8}
        sx={{ p: 5, width: 380, borderRadius: 3, textAlign: "center" }}
      >
        <Typography variant="h4" sx={{ color: "#65499c", fontWeight: 700, mb: 0.5 }}>
          YK Hair
        </Typography>
        <Typography variant="body2" sx={{ color: "#999", mb: 3 }}>
          ניהול מוצרים
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="שם משתמש"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            sx={{ mb: 2 }}
            inputProps={{ dir: "ltr" }}
          />
          <TextField
            fullWidth
            label="סיסמה"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            sx={{ mb: 2 }}
            inputProps={{ dir: "ltr" }}
          />
          {error && (
            <Alert severity="error" sx={{ mb: 2, textAlign: "right" }}>
              {error}
            </Alert>
          )}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={isLoading}
            sx={{
              py: 1.5,
              fontWeight: 600,
              fontSize: 16,
            }}
          >
            כניסה
          </Button>
        </form>
      </Paper>
    </Box>
  );
};

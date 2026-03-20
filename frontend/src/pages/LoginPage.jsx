// AI GENERATED FILE

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import TextInput from "../components/TextInput";
import { useCheckFlow } from "../lib/checkFlowContext";
import supabaseClient from "../lib/supabaseClient";

const modes = {
  login: {
    helper: "Use your university email to continue."
  },
  signup: {
    helper: "Create a prototype account with your university email."
  }
};

const allowPrototypeFallback =
  typeof window !== "undefined" &&
  ["localhost", "127.0.0.1"].includes(window.location.hostname);

function LoginPage() {
  const navigate = useNavigate();
  const { resetFlowState } = useCheckFlow();
  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({
    email: "",
    password: ""
  });

  const currentMode = modes[mode];
  const toggleLabel =
    mode === "login" ? "Need an account? Sign Up" : "Already have an account? Log In";

  const validate = () => {
    const nextErrors = {
      email: "",
      password: ""
    };

    if (!email.trim()) {
      nextErrors.email = "University email is required.";
    } else if (!email.includes("@")) {
      nextErrors.email = "Enter a valid email address.";
    }

    if (!password) {
      nextErrors.password = "Password is required.";
    } else if (password.length < 8) {
      nextErrors.password = "Password must be at least 8 characters.";
    }

    setFieldErrors(nextErrors);

    return !nextErrors.email && !nextErrors.password;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!validate()) {
      return;
    }

    setLoading(true);

    try {
      if (supabaseClient && !allowPrototypeFallback) {
        const response =
          mode === "login"
            ? await supabaseClient.auth.signInWithPassword({
                email: email.trim(),
                password
              })
            : await supabaseClient.auth.signUp({
                email: email.trim(),
                password
              });

        if (response.error) {
          throw response.error;
        }
      }
    } catch (submitError) {
      if (!allowPrototypeFallback) {
        setError(submitError.message || "Unable to continue right now.");
        return;
      }
    } finally {
      setLoading(false);
    }

    resetFlowState();
    navigate("/");
  };

  const handleModeChange = (nextMode) => {
    setMode(nextMode);
    setError("");
    setFieldErrors({
      email: "",
      password: ""
    });
  };

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        padding: "48px",
        background: "#d8d8d8"
      }}
    >
      <section
        style={{
          width: "100%",
          maxWidth: "420px",
          border: "1px solid #cfcfcf",
          background: "#ffffff",
          padding: "36px"
        }}
      >
        <p
          style={{
            margin: 0,
            color: "#666666",
            fontSize: "0.76rem",
            fontWeight: 600,
            letterSpacing: "0.05em",
            textTransform: "uppercase"
          }}
        >
          ChatGuard
        </p>

        <h1
          style={{
            margin: "14px 0 8px",
            color: "#111111",
            fontSize: "2rem",
            lineHeight: 1.1
          }}
        >
          Welcome to ChatGuard
        </h1>

        <p
          style={{
            margin: 0,
            color: "#5f5f5f",
            fontSize: "0.9rem",
            lineHeight: 1.5
          }}
        >
          {currentMode.helper}
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
            gap: "8px",
            marginTop: "24px",
            marginBottom: "24px"
          }}
        >
          <button
            onClick={() => handleModeChange("login")}
            style={{
              minHeight: "38px",
              border: `1px solid ${mode === "login" ? "#232323" : "#cfcfcf"}`,
              background: mode === "login" ? "#232323" : "#f6f6f6",
              color: mode === "login" ? "#f4f4f4" : "#232323",
              fontSize: "0.88rem",
              fontWeight: 600,
              cursor: "pointer"
            }}
            type="button"
          >
            Log In
          </button>

          <button
            onClick={() => handleModeChange("signup")}
            style={{
              minHeight: "38px",
              border: `1px solid ${mode === "signup" ? "#232323" : "#cfcfcf"}`,
              background: mode === "signup" ? "#232323" : "#f6f6f6",
              color: mode === "signup" ? "#f4f4f4" : "#232323",
              fontSize: "0.88rem",
              fontWeight: 600,
              cursor: "pointer"
            }}
            type="button"
          >
            Sign Up
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "16px"
          }}
        >
          <TextInput
            autoComplete="email"
            error={fieldErrors.email}
            helperText={!fieldErrors.email ? "Use your school-issued email address." : ""}
            label="University Email"
            onChange={(event) => setEmail(event.target.value)}
            placeholder="name@university.edu"
            type="email"
            value={email}
          />

          <TextInput
            autoComplete={mode === "login" ? "current-password" : "new-password"}
            error={fieldErrors.password}
            helperText={!fieldErrors.password ? "Minimum 8 characters." : ""}
            label="Password"
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Enter your password"
            type="password"
            value={password}
          />

          {error ? (
            <p
              style={{
                margin: 0,
                color: "#4f4f4f",
                fontSize: "0.82rem",
                lineHeight: 1.45
              }}
            >
              {error}
            </p>
          ) : null}

          <button
            disabled={loading}
            style={{
              minHeight: "40px",
              border: "1px solid #1f1f1f",
              background: "#1f1f1f",
              color: "#f4f4f4",
              fontSize: "0.9rem",
              fontWeight: 600,
              cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.62 : 1
            }}
            type="submit"
          >
            {loading ? "Loading..." : "Continue"}
          </button>
        </form>

        <p
          style={{
            margin: "18px 0 0",
            color: "#6a6a6a",
            fontSize: "0.8rem",
            lineHeight: 1.45
          }}
        >
          {toggleLabel}
        </p>
      </section>
    </main>
  );
}

export default LoginPage;

import { BrowserRouter, Route, Routes } from "react-router-dom";

function HomePage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        padding: "48px",
        background: "#dcdcdc"
      }}
    >
      <section
        style={{
          width: "100%",
          maxWidth: "960px",
          padding: "48px",
          border: "1px solid #cfcfcf",
          background: "#ffffff",
          color: "#111111"
        }}
      >
        <p
          style={{
            margin: 0,
            color: "#5c5c5c",
            fontSize: "12px",
            letterSpacing: "0.08em",
            textTransform: "uppercase"
          }}
        >
          ChatGuard
        </p>
        <h1
          style={{
            margin: "16px 0 12px",
            fontSize: "40px",
            lineHeight: 1.1
          }}
        >
          Frontend bootstrap is ready.
        </h1>
        <p
          style={{
            margin: 0,
            maxWidth: "560px",
            color: "#4f4f4f",
            fontSize: "16px"
          }}
        >
          Minimal React + Vite shell with routing in place for the prototype.
        </p>
      </section>
    </main>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

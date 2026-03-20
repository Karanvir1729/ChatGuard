import { createBrowserRouter } from "react-router-dom";
import CourseContextPage from "./pages/CourseContextPage";
import DashboardPage from "./pages/DashboardPage";
import HistoryPage from "./pages/HistoryPage";
import LearnMorePage from "./pages/LearnMorePage";
import LoginPage from "./pages/LoginPage";
import NotFoundPage from "./pages/NotFoundPage";
import ResultPage from "./pages/ResultPage";
import ReviewPage from "./pages/ReviewPage";
import StartCheckPage from "./pages/StartCheckPage";

const router = createBrowserRouter([
  {
    path: "/login",
    element: <LoginPage />
  },
  {
    path: "/",
    element: <DashboardPage />
  },
  {
    path: "/check/start",
    element: <StartCheckPage />
  },
  {
    path: "/check/context",
    element: <CourseContextPage />
  },
  {
    path: "/check/review",
    element: <ReviewPage />
  },
  {
    path: "/check/result/:id",
    element: <ResultPage />
  },
  {
    path: "/history",
    element: <HistoryPage />
  },
  {
    path: "/learn-more",
    element: <LearnMorePage />
  },
  {
    path: "*",
    element: <NotFoundPage />
  }
]);

export default router;

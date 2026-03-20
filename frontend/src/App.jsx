import { RouterProvider } from "react-router-dom";
import { CheckFlowProvider } from "./lib/checkFlowContext";
import router from "./router";

function App() {
  return (
    <CheckFlowProvider>
      <RouterProvider router={router} />
    </CheckFlowProvider>
  );
}

export default App;

// AI GENERATED FILE

import { RouterProvider } from "react-router-dom";
import { CheckFlowProvider } from "./lib/checkFlowContext";
import router from "./router";

function App() {
  return (
    <CheckFlowProvider>
      <RouterProvider
        future={{
          v7_startTransition: true
        }}
        router={router}
      />
    </CheckFlowProvider>
  );
}

export default App;

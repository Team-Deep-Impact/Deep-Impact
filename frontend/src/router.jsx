// router.jsx
import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import Main from "./pages/main";
import Scenario from "./pages/scenario";
import About from "./pages/about";
import Effects from "./pages/effects";
const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true,
        element: <Main />,
      },
      {
        path: 'scenario/',
        element: <Scenario />
      },
      {
        path: 'about/',
        element: <About />
      },
      {
        path: 'effects/',
        element: <Effects />
      }
      
    ],
  },
]);

export default router;
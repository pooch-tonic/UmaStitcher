import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "jimp";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Layout from "./Layout";
import App from "./App";
import About from "./About";
import PrivacyPolicy from "./PrivacyPolicy";
import reportWebVitals from "./reportWebVitals";
import ReactGA from "react-ga4";

ReactGA.initialize("G-EJG37MLHZN");
// To be GDPR compliant
ReactGA.set({ anonymizeIp: true });

const theme = createTheme();

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <App />,
      },
      {
        path: "/about",
        element: <About />,
      },
      {
        path: "/privacy-policy",
        element: <PrivacyPolicy />,
      },
    ],
  },
]);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <RouterProvider router={router} />
    </ThemeProvider>
  </React.StrictMode>
);

const sendToAnalytics = ({ id, name, value, delta }) => {
  ReactGA.send({
    hitType: "event",
    eventCategory: "Web Vitals",
    eventAction: name,
    eventLabel: id,
    nonInteraction: true,
    // Built-in params:
    value: name === "CLS" ? delta * 1000 : delta, // Use `delta` so the value can be summed.
    // Custom params:
    metric_id: id, // Needed to aggregate events.
    metric_value: value, // Optional.
    metric_delta: delta, // Optional.

    // OPTIONAL: any additional params or debug info here.
    // See: https://web.dev/debug-web-vitals-in-the-field/
    // metric_rating: 'good' | 'ni' | 'poor',
    // debug_info: '...',
    // ...
  });
};
// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals(sendToAnalytics);

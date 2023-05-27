import * as React from "react";
import { Link as RouterLink } from "react-router-dom";
import Box from "@mui/material/Box";
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";

const Footer = () => (
  <Box sx={{ mb: 2 }}>
    <Typography variant="body2" color="text.secondary" align="center">
      {"UmaStitcher! - Developed by "}
      <Link
        color="inherit"
        href="https://github.com/pooch-tonic"
        target="_blank"
      >
        pooch-tonic
      </Link>{" "}
      -{" "}
      <Link
        color="inherit"
        href="https://github.com/pooch-tonic/umastitcher#umastitcher"
        target="_blank"
      >
        GitHub
      </Link>
    </Typography>
    <br />
    <Typography variant="body2" color="text.secondary" align="center">
      <RouterLink color="inherit" to="/about">
        About
      </RouterLink>{" "}
      -{" "}
      <RouterLink color="inherit" to="/privacy-policy">
        Privacy Policy
      </RouterLink>
    </Typography>
  </Box>
);

export default Footer;

import React from "react";
import { Outlet } from "react-router-dom";
import Container from "@mui/material/Container";
import Header from "./Header";
import Footer from "./Footer";

const Layout = () => (
  <React.Fragment>
    <Header />
    <Container
      component="main"
      maxWidth="sm"
      sx={{ py: 4, backgroundColor: "#ffffff" }}
    >
      <Outlet />
    </Container>
    <Footer />
  </React.Fragment>
);

export default Layout;

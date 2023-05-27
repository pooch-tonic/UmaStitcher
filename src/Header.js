import AppBar from "@mui/material/AppBar";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";

const Header = () => (
  <AppBar
    position="absolute"
    color="default"
    elevation={0}
    sx={{
      position: "relative",
      borderBottom: (t) => `1px solid ${t.palette.divider}`,
    }}
  >
    <Toolbar>
      <Box
        sx={{ display: "flex", alignItems: "center", cursor: "pointer" }}
        onClick={() => {
          window.location = "/";
        }}
      >
        <Avatar
          sx={{ mr: 1 }}
          alt="UmaStitcher! logo"
          src="/logo256.png"
          variant="square"
        />
        <Typography variant="h6" color="inherit" noWrap>
          UmaStitcher!
        </Typography>
      </Box>
    </Toolbar>
  </AppBar>
);

export default Header;

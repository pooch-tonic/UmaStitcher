import Paper from "@mui/material/Paper";

const Image = ({ alt, src }) => (
  <Paper
    component="img"
    sx={{
      width: "100%",
    }}
    alt={alt}
    src={src}
  />
);

export default Image;

import * as React from "react";
import "jimp";
import AppBar from "@mui/material/AppBar";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Container from "@mui/material/Container";
import CssBaseline from "@mui/material/CssBaseline";
import ImageList from "@mui/material/ImageList";
import ImageListItem from "@mui/material/ImageListItem";
import Link from "@mui/material/Link";
import Paper from "@mui/material/Paper";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import UploadIcon from "@mui/icons-material/Upload";
import ViewAgendaIcon from "@mui/icons-material/ViewAgenda";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { merge } from "./merger";

function Copyright() {
  return (
    <Typography variant="body2" color="text.secondary" align="center">
      {"UmaStitcher! - Developed by "}
      <Link color="inherit" href="https://github.com/pooch-tonic">
        pooch-tonic
      </Link>
    </Typography>
  );
}

const theme = createTheme();

function App() {
  const [result, setResult] = React.useState(null);
  const [rawFiles, setRawFiles] = React.useState([]);
  const [previewUrls, setPreviewUrls] = React.useState([]);
  const [uploading, setUploading] = React.useState(false);
  const [merging, setMerging] = React.useState(false);

  const computeResult = async (imageBuffers) => {
    const res = await merge(imageBuffers);
    setResult(res);
    setMerging(false);
  };

  const handleMerge = async () => {
    const len = rawFiles?.length;
    if (len > 1) {
      setMerging(true);
      setResult(null);
      // WebWorker is a pain in the a** to implement, so just used setTimeout of 100ms to let React DOM update UI state before freezing with image manipulation
      setTimeout(() => {
        const reader = new FileReader();
        const loadedBuffers = [];

        // Need to make sure images are loaded in input order in sync
        // FileReaderSync not available so made it by hand recursively with the onloadend event
        const loadFile = (index, maxIndex, loadedUrls) => {
          reader.onloadend = () => {
            loadedBuffers.push(reader.result);
            // if last image has been loaded
            if (index === maxIndex) {
              computeResult(loadedBuffers);
            } else {
              loadFile(index + 1, maxIndex, loadedUrls);
            }
          };
          reader.readAsArrayBuffer(rawFiles[index]);
        };
        loadFile(0, len - 1, []);
      }, 100);
    } else {
      console.log("no enough images to merge");
    }
  };

  const handleUpload = (event) => {
    const files = event?.target?.files;
    if (files) {
      setUploading(true);
      const len = files.length;
      if (len > 0) {
        setPreviewUrls([]);
        setResult(null);
        setRawFiles([...files]);
        const reader = new FileReader();

        // Need to make sure images are loaded in input order in sync
        // FileReaderSync not available so made it by hand recursively with the onloadend event
        const loadFile = (index, maxIndex, loadedUrls) => {
          reader.onloadend = () => {
            loadedUrls.push(reader.result);
            // if last image has been loaded
            if (index === maxIndex) {
              setPreviewUrls(loadedUrls);
              setUploading(false);
            } else {
              loadFile(index + 1, maxIndex, loadedUrls);
            }
          };
          reader.readAsDataURL(files[index]);
        };
        loadFile(0, len - 1, []);
      } else {
        console.log("0 files were uploaded.");
      }
    } else {
      console.log("no files");
    }
  };

  const renderBottomView = () => {
    if (!!result) {
      return (
        <Box sx={{ mt: 2 }}>
          <img src={result} alt="Merge result" loading="lazy" width="100%" />
        </Box>
      );
    } else if (previewUrls?.length > 0) {
      return (
        <ImageList sx={{ mt: 2 }} cols={3}>
          {" "}
          {previewUrls.map((previewUrl, index) => (
            <ImageListItem key={previewUrl}>
              <img
                src={previewUrl}
                alt={`preview of uploaded screenshot no. ${index + 1}`}
                loading="lazy"
              />
            </ImageListItem>
          ))}
        </ImageList>
      );
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
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
          <Avatar
            sx={{ mr: 1 }}
            alt="UmaInfoMerger logo"
            src="/logo256.png"
            variant="square"
          />
          <Typography variant="h6" color="inherit" noWrap>
            UmaStitcher!
          </Typography>
        </Toolbar>
      </AppBar>
      <Container component="main" maxWidth="sm" sx={{ mb: 4 }}>
        <Paper
          variant="outlined"
          sx={{ my: { xs: 3, md: 6 }, p: { xs: 2, md: 3 } }}
        >
          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <input
              accept="image/*"
              style={{ display: "none" }}
              id="raised-button-file"
              multiple
              type="file"
              onInput={handleUpload}
            />
            <label htmlFor="raised-button-file">
              <Button variant="outlined" component="span" disabled={uploading}>
                {uploading ? (
                  <CircularProgress size={24} sx={{ mr: 1 }} />
                ) : (
                  <UploadIcon sx={{ mr: 1 }} />
                )}
                {previewUrls?.length > 0 ? "Reupload" : "Upload"}
              </Button>
            </label>
            {!result && previewUrls?.length > 1 && (
              <Button
                variant="contained"
                sx={{ ml: 2 }}
                onClick={handleMerge}
                disabled={merging}
              >
                {merging ? (
                  <CircularProgress size={24} sx={{ mr: 1 }} />
                ) : (
                  <ViewAgendaIcon sx={{ mr: 1 }} />
                )}
                Merge
              </Button>
            )}
          </Box>
          {renderBottomView()}
        </Paper>
        <Copyright />
      </Container>
    </ThemeProvider>
  );
}

export default App;

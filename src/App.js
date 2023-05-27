import * as React from "react";
import { v4 as uuidv4 } from "uuid";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import ClearIcon from "@mui/icons-material/Clear";
import AddIcon from "@mui/icons-material/Add";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import ViewAgendaIcon from "@mui/icons-material/ViewAgenda";
import ImageGrid from "./ImageGrid";
import { merge } from "./merger";

function App() {
  const [result, setResult] = React.useState(null);
  const [files, setFiles] = React.useState([]);
  const [uploading, setUploading] = React.useState(false);
  const [merging, setMerging] = React.useState(false);
  const [keepStats, setKeepStats] = React.useState(true);
  const [useSSD, setUseSSD] = React.useState(true);

  const computeResult = async (imageBuffers) => {
    const res = await merge(imageBuffers, {
      keepStats,
    });
    setResult(res);
    setMerging(false);
  };

  const handleMerge = async () => {
    const len = files?.length;
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
          reader.readAsArrayBuffer(files[index].raw);
        };
        loadFile(0, len - 1, []);
      }, 100);
    } else {
      console.log("no enough images to stitch");
    }
  };

  const handleUpload = (event) => {
    const uploadedFiles = [...event?.target?.files];
    if (uploadedFiles) {
      setUploading(true);
      const len = uploadedFiles.length;
      if (len > 0) {
        setResult(null);
        const reader = new FileReader();

        // Need to make sure images are loaded in input order in sync
        // FileReaderSync not available so made it by hand recursively with the onloadend event
        const loadFile = (index, maxIndex, loadedUrls) => {
          reader.onloadend = () => {
            loadedUrls.push({
              id: uuidv4(),
              content: reader.result,
              raw: uploadedFiles[index],
            });
            // if last image has been loaded
            if (index === maxIndex) {
              setFiles([...files, ...loadedUrls]);
              setUploading(false);
            } else {
              loadFile(index + 1, maxIndex, loadedUrls);
            }
          };
          reader.readAsDataURL(uploadedFiles[index]);
        };
        loadFile(0, len - 1, []);
      } else {
        console.log("0 files were uploaded.");
      }
      event.target.files = null;
      event.target.value = null;
    } else {
      console.log("no files");
    }
  };

  const handleClear = () => {
    setFiles([]);
    setResult(null);
  };

  // helps correcting the upload order on devices that don't allow order selection
  const handleInvert = () => {
    setFiles([...files].reverse());
  };

  const renderBottomView = () => {
    if (!!result) {
      return (
        <Box sx={{ mt: 2 }}>
          <img src={result} alt="Stitch result" loading="lazy" width="100%" />
        </Box>
      );
    } else if (files?.length > 0) {
      return (
        <ImageGrid
          images={files}
          updateImages={(newImages) => setFiles(newImages)}
        />
      );
    }
  };

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          flexWrap: "wrap",
          rowGap: "10px",
          columnGap: "15px",
        }}
      >
        {result && (
          <Button variant="outlined" onClick={handleClear} disabled={merging}>
            <RestartAltIcon sx={{ mr: 1 }} />
            Reset
          </Button>
        )}
        {!result && (
          <React.Fragment>
            <input
              accept="image/*"
              style={{ display: "none" }}
              id="raised-button-file"
              multiple
              type="file"
              onInput={handleUpload}
            />
            <label htmlFor="raised-button-file">
              <Button
                variant="outlined"
                component="span"
                disabled={uploading || merging}
              >
                {uploading ? (
                  <CircularProgress size={24} sx={{ mr: 1 }} />
                ) : (
                  <AddIcon sx={{ mr: 1 }} />
                )}
                Add images
              </Button>
            </label>
          </React.Fragment>
        )}
        {!result && files?.length > 1 && (
          <React.Fragment>
            <Button variant="outlined" onClick={handleClear} disabled={merging}>
              <ClearIcon sx={{ mr: 1 }} />
              Clear
            </Button>
            <Button
              variant="outlined"
              onClick={handleInvert}
              disabled={merging}
            >
              <SwapHorizIcon sx={{ mr: 1 }} />
              Reverse
            </Button>
            <Button
              variant="contained"
              onClick={handleMerge}
              disabled={merging}
            >
              {merging ? (
                <CircularProgress size={24} sx={{ mr: 1 }} />
              ) : (
                <ViewAgendaIcon sx={{ mr: 1 }} />
              )}
              Stitch
            </Button>
          </React.Fragment>
        )}
      </Box>
      {!result && files?.length > 1 && (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            rowGap: "10px",
            columnGap: "15px",
            mb: 2,
          }}
        >
          <hr />
          <FormControlLabel
            control={
              <Switch
                checked={keepStats}
                onChange={(e) => setKeepStats(e.target.checked)}
                disabled={merging}
              />
            }
            label="Keep all screen contents"
          />
          <FormControlLabel
            control={
              <Switch
                checked={useSSD}
                onChange={(e) => setUseSSD(e.target.checked)}
                disabled={merging}
              />
            }
            label="Stricter stitching function"
          />
        </Box>
      )}
      {renderBottomView()}
    </Box>
  );
}

export default App;

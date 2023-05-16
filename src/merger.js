const { Jimp } = window;

const conf = {
  /**
   * hex color of bottom frame background (#F2F2F2 in hex, from iOS screenshot, without any filter)
   */
  bottomFrameBgColorRGBA: { r: 242, g: 242, b: 242, a: 255 },
  /**
   * height in percentage for the bottom frame lookup start point
   */
  firstLookUpHeight: 0.75,
  /**
   * limit in percentage indicating at what proportion of the image width we should stop looking up further.
   * (i.e. if the lookup from the left side hasn't found any frame color pixel at x % of the image width, stop)
   */
  firstLookUpLimitWidth: 0.3,
  /**
   * limit in percentage indicating at what proportion of the image height we should stop looking up further.
   * (i.e. if the lookup from inside the frame hasn't found any out-of frame color pixel at x % of the image height, stop)
   */
  firstLookUpLimitHeight: 0.9,
  /**
   * amount of repetitive pixels needed to be sure we hit the frame and not an accidental pixel
   */
  lookupChainSize: 3,
  /**
   * percentage of X offset to start pattern sampling based on the given image
   *
   * since the bottom frame is first detected before being sent to the sampling
   * function, please take in account the frame dimensions as a base reference
   */
  patternSampleXOffset: 0.04,
  /**
   * percentage width of sample, since specifying it with pixels might go wrong
   * with different resolutions
   *
   * please take in account the bottom frame dimensions as a base reference
   */
  patternSampleWidth: 0.9,
  /**
   * percentage height of sample, since specifying it with pixels might go wrong
   * with different resolutions
   *
   * please take in account the bottom frame dimensions as a base reference
   */
  patternSampleHeight: 0.11,
  /**
   * number of columns in the pattern = amount of pixel samples in one row
   */
  sampleCols: 32,
  /**
   * number of rows in the pattern = amount of pixel samples in one col
   */
  sampleRows: 12,
};

const init = () => {
  const { r, g, b, a } = conf.bottomFrameBgColorRGBA;
  conf["bottomFrameBgColorInt"] = Jimp.rgbaToInt(r, g, b, a);
};

init();

// lookup function direction values
const directions = {
  RIGHT: 1,
  LEFT: -1,
  UP: -1,
  DOWN: 1,
};

// lookup modes: inwards when trying to find frame from outside the frame, and outwards for the opposite
const lookupModes = {
  INWARDS: 0,
  OUTWARDS: 1,
};

// lookup chain of pixels in row direction
const lookupXChain = (
  image,
  intColor,
  direction,
  chainSize = 1,
  startX = 0,
  startY = 0,
  limitX = 10,
  lookupMode
) => {
  let matchRepeatCount = 0;
  let matchedX = startX;
  let colorCondFunc;

  if (lookupMode === lookupModes.INWARDS) {
    colorCondFunc = (col) => col !== intColor;
  } else {
    colorCondFunc = (col) => col === intColor;
  }

  for (let x = startX; x !== limitX; x += direction) {
    const pixelColor = image.getPixelColor(x, startY);
    if (colorCondFunc(pixelColor)) {
      if (matchRepeatCount > 0) {
        matchRepeatCount = 0;
      }
    } else {
      matchRepeatCount++;
      if (matchRepeatCount === chainSize) {
        matchedX = x + -direction * (matchRepeatCount - 1);
        break;
      }
    }
  }
  return matchedX;
};

// lookup chain of pixels in col direction
const lookupYChain = (
  image,
  intColor,
  direction,
  chainSize = 1,
  startX = 0,
  startY = 0,
  limitY = 10,
  lookupMode
) => {
  let matchRepeatCount = 0;
  let matchedY = startY;
  let colorCondFunc;

  if (lookupMode === lookupModes.INWARDS) {
    colorCondFunc = (col) => col !== intColor;
  } else {
    colorCondFunc = (col) => col === intColor;
  }

  for (let y = startY; y !== limitY; y += direction) {
    const pixelColor = image.getPixelColor(startX, y);
    if (colorCondFunc(pixelColor)) {
      if (matchRepeatCount > 0) {
        matchRepeatCount = 0;
      }
    } else {
      matchRepeatCount++;
      if (matchRepeatCount === chainSize) {
        matchedY = y + -direction * (matchRepeatCount - 1);
        break;
      }
    }
  }
  return matchedY;
};

// get the coordinates of the bottom frame and crop it out
const getBottomFrameCoords = (image) => {
  const { width, height } = image?.bitmap;

  // start from left side at the first lookup height coordinate to find the bottom frame.
  const firstLookUpY = Math.round(conf.firstLookUpHeight * height);
  // if bottom frame
  const limitXLeft = Math.round(conf.firstLookUpLimitWidth * width);
  const limitXRight = width - limitXLeft;
  const limitYBottom = Math.round(conf.firstLookUpLimitHeight * height);
  const limitYTop = height - limitYBottom;
  const leftX = lookupXChain(
    image,
    conf["bottomFrameBgColorInt"],
    directions.RIGHT,
    conf.chainSize,
    0,
    firstLookUpY,
    limitXLeft,
    lookupModes.INWARDS
  );
  const rightX = lookupXChain(
    image,
    conf["bottomFrameBgColorInt"],
    directions.LEFT,
    conf.chainSize,
    width - 1,
    firstLookUpY,
    limitXRight,
    lookupModes.INWARDS
  );
  const topY = lookupYChain(
    image,
    conf["bottomFrameBgColorInt"],
    directions.UP,
    conf.chainSize,
    leftX,
    firstLookUpY,
    limitYTop,
    lookupModes.OUTWARDS
  );
  const bottomY = lookupYChain(
    image,
    conf["bottomFrameBgColorInt"],
    directions.DOWN,
    conf.chainSize,
    leftX,
    firstLookUpY,
    limitYBottom,
    lookupModes.OUTWARDS
  );
  return {
    leftX,
    rightX,
    topY,
    bottomY,
    width: rightX - leftX,
    height: bottomY - topY,
  };
};

// sample a pattern based on config values
const samplePattern = (image, patternMap, offsetX = 0, offsetY = 0) => {
  const samples = [];
  patternMap.coords.forEach(([x, y]) => {
    samples.push(image.getPixelColor(offsetX + x, offsetY + y));
  });
  return samples;
};

// print pattern on image, only used for dev testing purposes
const showPattern = (image, patternMap, offsetX = 0, offsetY = 0) => {
  patternMap.coords.forEach(([x, y]) => {
    image.setPixelColor(65535, offsetX + x, offsetY + y);
  });
};

// implement a custom interpretation of SAD algorithm
const computeSAD = (targetPixelRGBA, currentPixelRGBA) =>
  Math.abs(targetPixelRGBA.r - currentPixelRGBA.r) +
  Math.abs(targetPixelRGBA.g - currentPixelRGBA.g) +
  Math.abs(targetPixelRGBA.b - currentPixelRGBA.b) +
  Math.abs(targetPixelRGBA.a - currentPixelRGBA.a);

// custom SSD algorithm hoping this would reduce any wrong detection occurences
const computeSSD = (targetPixelRGBA, currentPixelRGBA) =>
  Math.pow(targetPixelRGBA.r - currentPixelRGBA.r, 2) +
  Math.pow(targetPixelRGBA.g - currentPixelRGBA.g, 2) +
  Math.pow(targetPixelRGBA.b - currentPixelRGBA.b, 2) +
  Math.pow(targetPixelRGBA.a - currentPixelRGBA.a, 2);

// look for the pattern by keeping the same X coord and moving on the Y axis from top (0) to given Y limit
// return a value between 0 and image height - pattern height if a match is found, otherwise return -1
const findPattern = (
  image,
  patternMap,
  targetPattern,
  baseX = 0,
  baseY = 0,
  limitY,
  preferences
) => {
  let res = null;
  const diffFunction = preferences.useSSD ? computeSSD : computeSAD;

  for (let currY = baseY; currY < limitY; currY++) {
    let diff = 0;
    // dev perf test
    // let passes = 0;

    // eslint-disable-next-line no-loop-func
    patternMap.coords.every(([x, y], i) => {
      // dev test
      // passes++;
      const currentPixel = image.getPixelColor(x + baseX, y + currY);
      if (currentPixel !== targetPattern[i]) {
        const currentPixelRGBA = Jimp.intToRGBA(currentPixel);
        const targetPixelRGBA = Jimp.intToRGBA(targetPattern[i]);
        diff += diffFunction(targetPixelRGBA, currentPixelRGBA);

        if (res && diff > res.diff) {
          // stop the search if the error gets bigger than what's already on record
          return false;
        }
      }
      // image.setPixelColor(65535, x + baseX, y + currY);
      return true;
    });
    if (!res || diff < res.diff) {
      res = { y: currY, diff };
    }
    // for debug & perf check
    // console.log(currY, passes, res);
  }

  if (!res) {
    res = {
      y: 0,
    };
  }
  return res;
};

// create an array indicating the pixel sampling coordinates defining our pattern, assuming all images to sample on are of the same size
const createPatternMap = (baseImageWidth, baseImageHeight) => {
  const height = Math.floor(baseImageHeight * conf.patternSampleHeight);
  const width = Math.floor(baseImageWidth * conf.patternSampleWidth);
  const spacingX = Math.floor(width / conf.sampleCols);
  const spacingY = Math.floor(height / conf.sampleRows);
  const coords = [];
  for (let row = 0; row < conf.sampleRows; row++) {
    for (let col = 0; col < conf.sampleCols; col++) {
      coords.push([col * spacingX, row * spacingY]);
    }
  }
  return {
    coords,
    spacingX,
    spacingY,
    baseHeight: height,
    baseWidth: width,
    actualHeight: (conf.sampleRows - 1) * spacingY + 1,
    actualWidth: (conf.sampleCols - 1) * spacingX + 1,
  };
};

// use sampling to get overlapping parts between frames and crop accordingly
const cropBottomFrames = async (images, bottomFrameCoords, preferences) => {
  const { width, height, leftX, rightX, topY, bottomY } = bottomFrameCoords;
  const patternMap = createPatternMap(width, height);
  const patternXOffset = Math.round(width * conf.patternSampleXOffset + leftX);
  // used when getting most-bottom pattern
  const patternYOffset = bottomY - patternMap.actualHeight;
  const { width: imageWidth, height: imageHeight } = images[0].bitmap;

  // holds Y values to where to crop (= discard top part of frame) for each image, knowing the first image has to be full
  // Added a conditional value for users who want to keep top stats part as well
  const cropYValues = [preferences.keepStats ? 0 : topY];

  // use pattern matching to know wheere to crop for stitching
  for (let i = 1; i < images.length; i++) {
    const prev = images[i - 1];
    const curr = images[i];
    const prevBottomPattern = samplePattern(
      prev,
      patternMap,
      patternXOffset,
      patternYOffset
    );

    // send the first sample Y Offset as the max Y limit for sampling
    const patternMatch = findPattern(
      curr,
      patternMap,
      prevBottomPattern,
      patternXOffset,
      topY,
      patternYOffset,
      preferences
    );

    cropYValues.push(patternMatch.y);
  }

  // for testing in dev env
  /*showPattern(
    images[images.length - 1],
    patternMap,
    patternXOffset,
    patternYOffset
  );*/

  if (preferences.keepStats) {
    const lastIndex = cropYValues.length - 1;
    const last = cropYValues.pop();

    images[0].crop(0, 0, imageWidth, bottomY);
    cropYValues.forEach((y, i) => {
      images[i].crop(
        0,
        y + patternMap.actualHeight,
        imageWidth,
        bottomY - y - patternMap.actualHeight
      );
    });
    images[lastIndex].crop(
      0,
      last + patternMap.actualHeight,
      imageWidth,
      imageHeight - last - patternMap.actualHeight
    );
  } else {
    const first = cropYValues.shift();

    images[0].crop(leftX, first, width, bottomY - first);
    cropYValues.forEach((y, i) => {
      images[i + 1].crop(
        leftX,
        y + patternMap.actualHeight,
        width,
        bottomY - y - patternMap.actualHeight
      );
    });
  }
};

// read image buffers as JIMP images then extract bottom frames and finally stitch them together
const combineImages = async (images, preferences) => {
  const jimpImages = await Promise.all(
    images.map(async (currentImage) => {
      const currentJimpImage = await Jimp.read(currentImage);
      return currentJimpImage;
    })
  );
  const bottomFrameCoords = getBottomFrameCoords(jimpImages[0]);

  cropBottomFrames(jimpImages, bottomFrameCoords, preferences);

  const finalSize = {
    w: jimpImages[0].bitmap.width,
    h: jimpImages.reduce((acc, img) => acc + img.bitmap.height, 0),
  };

  const stitch = async (
    baseImage,
    overlayImages,
    currentIndex,
    baseImageStitchY
  ) => {
    const currentImage = overlayImages[currentIndex];
    const newImage = await baseImage.blit(currentImage, 0, baseImageStitchY);
    if (overlayImages[currentIndex + 1]) {
      return stitch(
        newImage,
        overlayImages,
        currentIndex + 1,
        baseImageStitchY + currentImage.bitmap.height
      );
    }
    return newImage;
  };

  let res = await new Jimp(finalSize.w, finalSize.h);
  res = await stitch(res, jimpImages, 0, 0);

  return res;
};

// exposed merge function to call the stitching function then convert the resulting JIMP image to base64
export const merge = async (images, preferences) => {
  const resultJimpImage = await combineImages(images, preferences);
  const resultImage = await resultJimpImage.getBase64Async(Jimp.AUTO);
  return resultImage;
};

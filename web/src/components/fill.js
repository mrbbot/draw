//Adapted from http://www.williammalone.com/articles/html5-canvas-javascript-paint-bucket-tool/
export default function floodFill(
  ctx,
  startX,
  startY,
  fillR,
  fillG,
  fillB,
  canvasWidth,
  canvasHeight,
  palette
) {
  // Function to check whether an RGB colour is in the palette
  function isPaletteColour(r, g, b) {
    for (let rgb of palette) {
      if (rgb.r === r && rgb.g === g && rgb.b === b) {
        return true;
      }
    }
    return false;
  }

  // Get raw image data from canvas
  const imageData = ctx.getImageData(0, 0, canvasWidth, canvasHeight);
  // Helper function for converting from (x, y) coordinates to imageData index
  const index = (x, y) => (y * canvasWidth + x) * 4;

  // Get the colour where the user clicked
  const startIndex = index(startX, startY);
  const startR = imageData.data[startIndex];
  const startG = imageData.data[startIndex + 1];
  const startB = imageData.data[startIndex + 2];

  // Check if filling with same colour as start and return if so to avoid infinite loop
  if (startR === fillR && startG === fillG && startB === fillB) {
    return;
  }

  // Function to check whether the colour at the specified index matches the start
  function matchesStartColour(pixelIndex) {
    const pixelR = imageData.data[pixelIndex];
    const pixelG = imageData.data[pixelIndex + 1];
    const pixelB = imageData.data[pixelIndex + 2];
    const pixelMatches =
      startR === pixelR && startG === pixelG && startB === pixelB;

    if (palette === null) {
      return pixelMatches;
    } else {
      // The !isPaletteColour makes sure that the flood fill matches colours that arise from the antialiasing of lines
      return pixelMatches || !isPaletteColour(pixelR, pixelG, pixelB);
    }
  }

  // Function to set the colour of a pixel to the fill colour
  function colourPixel(pixelIndex) {
    imageData.data[pixelIndex] = fillR;
    imageData.data[pixelIndex + 1] = fillG;
    imageData.data[pixelIndex + 2] = fillB;
    imageData.data[pixelIndex + 3] = 255;
  }

  // Main loop
  const pixelStack = [[startX, startY]];
  while (pixelStack.length) {
    let [x, y] = pixelStack.pop();

    let pixelIndex = index(x, y);
    while (y >= 0 && matchesStartColour(pixelIndex)) {
      y--;
      // Move up one row
      pixelIndex -= canvasWidth * 4;
    }
    // Backtrack one step
    pixelIndex += canvasWidth * 4;
    y++;

    let reachLeft = false;
    let reachRight = false;
    while (y <= canvasHeight - 1 && matchesStartColour(pixelIndex)) {
      y++;

      // Change the current pixels colour
      colourPixel(pixelIndex);

      // Build the stack to the left
      if (x > 0) {
        if (matchesStartColour(pixelIndex - 4)) {
          if (!reachLeft) {
            pixelStack.push([x - 1, y]);
            reachLeft = true;
          }
        } else if (reachLeft) {
          reachLeft = false;
        }
      }

      // Build the stack to the right
      if (x < canvasWidth - 1) {
        if (matchesStartColour(pixelIndex + 4)) {
          if (!reachRight) {
            pixelStack.push([x + 1, y]);
            reachRight = true;
          }
        } else if (reachRight) {
          reachRight = false;
        }
      }

      // Move down one row
      pixelIndex += canvasWidth * 4;
    }
  }

  // Set the canvas to display the new image data
  ctx.putImageData(imageData, 0, 0);
}

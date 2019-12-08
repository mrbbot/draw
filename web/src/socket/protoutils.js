import { draw } from "./proto";
const { DrawEvent, Colour } = draw;

export const drawEventTypes = [DrawEvent.Type.BRUSH, DrawEvent.Type.FILL];

export const drawEventTypeIcons = {
  [DrawEvent.Type.BRUSH]: "paint-brush",
  [DrawEvent.Type.FILL]: "fill-drip"
};

export const colours = [
  Colour.RED,
  Colour.ORANGE,
  Colour.YELLOW,
  Colour.GREEN,
  Colour.BLUE,
  Colour.PURPLE,
  Colour.PINK,
  Colour.PALE,
  Colour.BROWN,
  Colour.BLACK,
  Colour.GREY,
  Colour.WHITE
];

export const colourHexes = {
  [Colour.RED]: "#FF0000",
  [Colour.ORANGE]: "#FF6A00",
  [Colour.YELLOW]: "#FFD800",
  [Colour.GREEN]: "#00FF00",
  [Colour.BLUE]: "#0094FF",
  [Colour.PURPLE]: "#4800FF",
  [Colour.PINK]: "#FF00DC",
  [Colour.PALE]: "#FFD6FF",
  [Colour.BROWN]: "#873600",
  [Colour.BLACK]: "#000000",
  [Colour.GREY]: "#999999",
  [Colour.WHITE]: "#FFFFFF"
};

export const iconForDrawEventType = drawEventType =>
  drawEventTypeIcons[drawEventType];
export const hexForColour = colour => colourHexes[colour];

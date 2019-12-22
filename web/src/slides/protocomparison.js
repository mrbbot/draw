/* eslint-disable no-console */

//https://tech.chitgoks.com/2012/09/13/convert-string-to-bytes-in-javascript/
function stringToBytes(str) {
  let ch,
    st,
    re = [];
  for (let i = 0; i < str.length; i++) {
    ch = str.charCodeAt(i); // get char
    st = []; // set up "stack"
    do {
      st.push(ch & 0xff); // push byte to stack
      ch = ch >> 8; // shift value down by 1 byte
    } while (ch);
    // add stack contents to result
    // done because chars have "wrong" endianness
    re = re.concat(st.reverse());
  }
  // return an array of bytes
  return re;
}

import { draw } from "../socket/proto";
const { DrawEvent, Colour } = draw;

{
  const drawEvent = new DrawEvent();
  drawEvent.type = DrawEvent.Type.FILL;
  drawEvent.colour = Colour.BLUE;
  drawEvent.toX = 10;
  drawEvent.toY = 20;
  console.log(DrawEvent.encode(drawEvent).finish());
}

{
  const drawEvent = {
    type: "FILL",
    colour: "BLUE",
    toX: 10,
    toY: 20
  };
  const bytes = stringToBytes(JSON.stringify(drawEvent));
  console.log(new Uint8Array(bytes));
}

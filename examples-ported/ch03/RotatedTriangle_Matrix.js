// RotatedTriangle_Matrix.js (c) matsuda
// Vertex shader program
"use strict";
let loc_aPosition = 3;
let VSHADER_SOURCE =
`#version 300 es
layout(location=${loc_aPosition}) in vec4 aPosition;
uniform mat4 uXformMatrix;
void main() {
    gl_Position = uXformMatrix * aPosition;
}`;

// Fragment shader program
let FSHADER_SOURCE =
`#version 300 es
precision mediump float;
out vec4 fColor;
void main() {
    fColor = vec4(1.0, 0.0, 0.0, 1.0);
}`;

// The rotation angle
let ANGLE = 90.0;

function main() {
  // Retrieve <canvas> element
  let canvas = document.getElementById('webgl');

  // Get the rendering context for WebGL
  let gl = canvas.getContext('webgl2');
  if (!gl) {
    console.log('Failed to get the rendering context for WebGL');
    return;
  }

  // Initialize shaders
  if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
    console.log('Failed to intialize shaders.');
    return;
  }
 
  // Write the positions of vertices to a vertex shader
  let n = initVertexBuffers(gl);
  if (n < 0) {
    console.log('Failed to set the positions of the vertices');
    return;
  }

  // Create a rotation matrix
  let radian = Math.PI * ANGLE / 180.0; // Convert to radians
  let cosB = Math.cos(radian), sinB = Math.sin(radian);

  // Note: WebGL is column major order
  let xformMatrix = new Float32Array([
     cosB, sinB, 0.0, 0.0,
    -sinB, cosB, 0.0, 0.0,
      0.0,  0.0, 1.0, 0.0,
      0.0,  0.0, 0.0, 1.0
  ]);

  // Pass the rotation matrix to the vertex shader
  let loc_uXformMatrix = gl.getUniformLocation(gl.program, 'uXformMatrix');
  if (!loc_uXformMatrix) {
    console.log('Failed to get the storage location of uXformMatrix');
    return;
  }
  gl.uniformMatrix4fv(loc_uXformMatrix, false, xformMatrix);

  // Specify the color for clearing <canvas>
  gl.clearColor(0, 0, 0, 1);

  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT);

  // Draw the rectangle
  gl.drawArrays(gl.TRIANGLES, 0, n);
}

function initVertexBuffers(gl) {
  let vertices = new Float32Array([
    0, 0.5,   -0.5, -0.5,   0.5, -0.5
  ]);
  let n = 3; // The number of vertices

  // Create a buffer object
  let vertexBuffer = gl.createBuffer();
  if (!vertexBuffer) {
    console.log('Failed to create the buffer object');
    return false;
  }

  // Bind the buffer object to target
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  // Write date into the buffer object
  gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

  // Assign the buffer object to aPosition variable
  gl.vertexAttribPointer(loc_aPosition, 2, gl.FLOAT, false, 0, 0);

  // Enable the assignment to aPosition variable
  gl.enableVertexAttribArray(loc_aPosition);

  return n;
}


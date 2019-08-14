"use strict"
const SRC_VERT = `#version 300 es
layout(location=4) in vec4 aPosition;
layout(location=8) in vec2 aCoords;
out vec2 vCoords;
void main() {
	gl_Position = aPosition;
	vCoords = aCoords;
}
`;
const SRC_FRAG = `#version 300 es
precision mediump float;
in vec2 vCoords;
out vec4 fColor;
void main() {
	if(length(vCoords) < 0.5)    fColor = vec4(1,0,0,1);
	else fColor = vec4(0,0,0,1);
}
`;

function main()
{
	let canvas = document.getElementById('webgl');
	let gl = canvas.getContext('webgl2');
	initShaders(gl, SRC_VERT, SRC_FRAG);
	initVertexBuffers(gl);
	gl.clearColor(0.5, 0.5, 0.5, 1.0);
	gl.clear(gl.COLOR_BUFFER_BIT);
	gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
}

function initVertexBuffers(gl)
{
	let vertices = new Float32Array([
	-0.9,  0.9, -1,  1,
	-0.9, -0.9, -1, -1,
	 0.9,  0.9,  1,  1,
	 0.9, -0.9,  1, -1
	]);

	let vertexBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

	let a_Position = 4;
	gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 4*4, 0);
	gl.enableVertexAttribArray(a_Position);

	let a_coords = 8;
	gl.vertexAttribPointer(a_coords, 2, gl.FLOAT, false, 4*4, 4*2);

	gl.enableVertexAttribArray(a_coords);

	gl.bindBuffer(gl.ARRAY_BUFFER, null);
}

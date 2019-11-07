"use strict";
const loc_aPosition = 7;
const SRC_VERT = 
`#version 300 es
layout(location=${loc_aPosition}) in vec4 aPosition;
void main()
{
    gl_Position = aPosition;
}`;
const SRC_FRAG =
`#version 300 es
precision mediump float;
out vec4 fColor;
void main()
{
    fColor = vec4(1, 0, 0, 1);
}`;

function main()
{
    let canvas = document.getElementById('webgl');
    let gl = canvas.getContext("webgl2");

    let vertices = new Float32Array([
                        -0.90, -0.90, // Triangle 1
                         0.85, -0.90,
                        -0.90,  0.85,
                         0.90, -0.85, // Triangle 2
                         0.90,  0.90,
                        -0.85,  0.90]);

    let h_vert = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(h_vert, SRC_VERT);
    gl.compileShader(h_vert);

    let	h_frag = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(h_frag, SRC_FRAG);
    gl.compileShader(h_frag);

    let h_prog = gl.createProgram();
    gl.attachShader(h_prog, h_vert);
    gl.attachShader(h_prog, h_frag);
    gl.linkProgram(h_prog);

    let vao = gl.createVertexArray();
    gl.bindVertexArray(vao);

    let vbo = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    let loc_aPosition = 7;  // shoule be consistent with the vertex shaders
    gl.vertexAttribPointer(loc_aPosition, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(loc_aPosition);

    gl.bindVertexArray(null);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);

    gl.clearColor(0.0, 0.0, 0.0, 1.0);

    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.useProgram(h_prog);

    gl.bindVertexArray(vao);
    gl.drawArrays(gl.TRIANGLES, 0, 6);
    gl.bindVertexArray(null);

}
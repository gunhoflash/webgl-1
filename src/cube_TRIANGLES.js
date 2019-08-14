function main() {
    let canvas = document.getElementById('webgl');
    let gl = canvas.getContext("webgl2");
    initShaders(gl, document.getElementById("shader-vert").text, document.getElementById("shader-frag").text);
    

    let vao = initVertexBuffers(gl);
    
    gl.enable(gl.DEPTH_TEST);
    gl.clearColor(0,0,0,1);
    
    let loc_MVP = gl.getUniformLocation(gl.program, 'u_MVP');
    
    let MVP = new Matrix4();
    MVP.setPerspective(30, 1, 1, 100);
    MVP.lookAt(3, 3, 7, 0, 0, 0, 0, 1, 0);
    
    gl.uniformMatrix4fv(loc_MVP, false, MVP.elements);
    
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    
    gl.bindVertexArray(vao); 
    gl.drawArrays(gl.TRIANGLES, 0, 36);
    gl.bindVertexArray(null); 
}

function initVertexBuffers(gl) {
    let vao = gl.createVertexArray();
    gl.bindVertexArray(vao); 
    // Create a cube
    //    v6----- v5
    //   /|      /|
    //  v1------v0|
    //  | |     | |
    //  | |v7---|-|v4
    //  |/      |/
    //  v2------v3
    let verticesColors = new Float32Array([

         1.0,  1.0,  1.0,     1.0,  1.0,  1.0,  // v0 White
         1.0, -1.0,  1.0,     1.0,  1.0,  0.0,  // v3 Yellow
         1.0, -1.0, -1.0,     0.0,  1.0,  0.0,  // v4 Green

         1.0,  1.0,  1.0,     1.0,  1.0,  1.0,  // v0 White
         1.0, -1.0, -1.0,     0.0,  1.0,  0.0,  // v4 Green
         1.0,  1.0, -1.0,     0.0,  1.0,  1.0,  // v5 Cyan

         1.0,  1.0,  1.0,     1.0,  1.0,  1.0,  // v0 White
         1.0,  1.0, -1.0,     0.0,  1.0,  1.0,  // v5 Cyan
        -1.0,  1.0, -1.0,     0.0,  0.0,  1.0,  // v6 Blue

         1.0,  1.0,  1.0,     1.0,  1.0,  1.0,  // v0 White
        -1.0,  1.0, -1.0,     0.0,  0.0,  1.0,  // v6 Blue
        -1.0,  1.0,  1.0,     1.0,  0.0,  1.0,  // v1 Magenta

         1.0,  1.0,  1.0,     1.0,  1.0,  1.0,  // v0 White
        -1.0,  1.0,  1.0,     1.0,  0.0,  1.0,  // v1 Magenta
        -1.0, -1.0,  1.0,     1.0,  0.0,  0.0,  // v2 Red

         1.0,  1.0,  1.0,     1.0,  1.0,  1.0,  // v0 White
        -1.0, -1.0,  1.0,     1.0,  0.0,  0.0,  // v2 Red
         1.0, -1.0,  1.0,     1.0,  1.0,  0.0,  // v3 Yellow

        -1.0, -1.0, -1.0,     0.0,  0.0,  0.0,  // v7 Black
        -1.0, -1.0,  1.0,     1.0,  0.0,  0.0,  // v2 Red
        -1.0,  1.0,  1.0,     1.0,  0.0,  1.0,  // v1 Magenta

        -1.0, -1.0, -1.0,     0.0,  0.0,  0.0,  // v7 Black
        -1.0,  1.0,  1.0,     1.0,  0.0,  1.0,  // v1 Magenta
        -1.0,  1.0, -1.0,     0.0,  0.0,  1.0,  // v6 Blue

        -1.0, -1.0, -1.0,     0.0,  0.0,  0.0,  // v7 Black
        -1.0,  1.0, -1.0,     0.0,  0.0,  1.0,  // v6 Blue
         1.0,  1.0, -1.0,     0.0,  1.0,  1.0,  // v5 Cyan

        -1.0, -1.0, -1.0,     0.0,  0.0,  0.0,  // v7 Black
         1.0,  1.0, -1.0,     0.0,  1.0,  1.0,  // v5 Cyan
         1.0, -1.0, -1.0,     0.0,  1.0,  0.0,  // v4 Green

        -1.0, -1.0, -1.0,     0.0,  0.0,  0.0,  // v7 Black
         1.0, -1.0, -1.0,     0.0,  1.0,  0.0,  // v4 Green
         1.0, -1.0,  1.0,     1.0,  1.0,  0.0,  // v3 Yellow

        -1.0, -1.0, -1.0,     0.0,  0.0,  0.0,  // v7 Black
         1.0, -1.0,  1.0,     1.0,  1.0,  0.0,  // v3 Yellow
        -1.0, -1.0,  1.0,     1.0,  0.0,  0.0,  // v2 Red
    ]);
    
   
    // Create a buffer object
    let vbo = gl.createBuffer();
    
    // Write the vertex coordinates and color to the buffer object
    gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
    gl.bufferData(gl.ARRAY_BUFFER, verticesColors, gl.STATIC_DRAW);
    
    let FSIZE = verticesColors.BYTES_PER_ELEMENT;

    let a_Position = 2;
    gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, FSIZE * 6, 0);
    gl.enableVertexAttribArray(a_Position);

    let a_Color = 8;
    gl.vertexAttribPointer(a_Color, 3, gl.FLOAT, false, FSIZE * 6, FSIZE * 3);
    gl.enableVertexAttribArray(a_Color);

    gl.bindVertexArray(null); 
    gl.disableVertexAttribArray(a_Position);
    gl.disableVertexAttribArray(a_Color);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    
    return vao;
}

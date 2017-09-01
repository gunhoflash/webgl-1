function main()
{
    var gl = getWebGLContext(canvas);
    if (!gl)  
    {
        console.log('Failed to get the rendering context for WebGL'); 
        return;
    }

//https://developer.mozilla.org/en-US/docs/Web/API/OES_vertex_array_object
    var ext = null;
    ext = gl.getExtension("OES_vertex_array_object");

    if(!ext)
    {
        console.log('OES_vertex_array_object not supported.');
        return;
    }

	var positions_x = Array([
        Float32Array([
			-0.90, // Triangle 1
			0.85,
			-0.90,
            ]),
        Float32Array([
			0.90, // Triangle 2
			0.90,
			-0.85,
            ])
        ]);

	var positions_y = Array([
        Float32Array([
			-0.90, // Triangle 1
			-0.90,
			0.85,
            ]),
        Float32Array([
			-0.85, // Triangle 2
			0.90,
			0.90
            ])
        ]);

    if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
        console.log('Failed to intialize shaders.');
        return;
    }

    var h_prog = Array([null, null]);
    h_prog[0] = gl.program;

//-----------------------------------------------------
    var vao = ext.createVertexArrayOES();
    ext.bindVertexArrayOES(vao); 

    var vbo = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    var loc_aPosition = gl.getAttribLocation(h_prog, 'aPosition');
    gl.vertexAttribPointer(loc_aPosition, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(loc_aPosition);

    ext.bindVertexArrayOES(null); 
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
//-----------------------------------------------------

    gl.clearColor(0.0, 0.0, 0.0, 1.0);

    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.useProgram(h_prog);
    ext.bindVertexArrayOES(vao); 
    gl.drawArrays(gl.TRIANGLES, 0, 6);

}

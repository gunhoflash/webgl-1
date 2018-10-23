// Vertex shader program
var VSHADER_SOURCE =
  'attribute vec4 a_Position;\n' +
  'attribute vec2 a_TexCoord;\n' +
  'varying vec2 v_TexCoord;\n' +
  'void main() {\n' +
  '  gl_Position = a_Position;\n' +
  '  v_TexCoord = a_TexCoord;\n' +
  '}\n';

// Fragment shader program
var FSHADER_SOURCE =
  '#ifdef GL_ES\n' +
  'precision mediump float;\n' +
  '#endif\n' +
  'uniform sampler2D u_Sampler;\n' +
  'varying vec2 v_TexCoord;\n' +
  'void main() {\n' +
  '  gl_FragColor = texture2D(u_Sampler, v_TexCoord);\n' +
  '}\n';

function main() {
  // Retrieve <canvas> element
  var canvas = document.getElementById('webgl');

  // Get the rendering context for WebGL
  var gl = getWebGLContext(canvas);
  if (!gl) {
    console.log('Failed to get the rendering context for WebGL');
    return;
  }

  // Initialize shaders
  if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
    console.log('Failed to intialize shaders.');
    return;
  }

  // Set the vertex information
  initVertexBuffers(gl);

  // Specify the color for clearing <canvas>
  gl.clearColor(0.5, 0.5, 0.5, 1.0);


  // Set texture
  var   tex = initTextures(gl);
  init_UI(gl, tex);

    refresh(gl);
}

function refresh(gl, tex)
{
    var e;

	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);

    e = document.getElementById("mag_filter");
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, e.options[e.selectedIndex].value);

    e = document.getElementById("wrap_s");
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, e.options[e.selectedIndex].value);

    e = document.getElementById("wrap_t");
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, e.options[e.selectedIndex].value);


	
	gl.clear(gl.COLOR_BUFFER_BIT);   // Clear <canvas>
	
	gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4); // Draw the rectangle
	
}


function init_UI(gl, tex)
{
    var e;

    e = document.getElementById("mag_filter");
    e.options[0].value = gl.NEAREST;
    e.options[1].value = gl.LINEAR;
    e.onchange = function(ev) { refresh(gl,tex); };

    e = document.getElementById("wrap_s");
    e.options[0].value = gl.REPEAT;
    e.options[1].value = gl.CLAMP_TO_EDGE;
    e.options[2].value = gl.MIRRORED_REPEAT;
    e.onchange = function(ev) { refresh(gl,tex); };

    e = document.getElementById("wrap_t");
    e.options[0].value = gl.REPEAT;
    e.options[1].value = gl.CLAMP_TO_EDGE;
    e.options[2].value = gl.MIRRORED_REPEAT;
    e.onchange = function(ev) { refresh(gl,tex); };

}

function initVertexBuffers(gl) {
  var verticesTexCoords = new Float32Array([
    // Vertex coordinates, texture coordinate
    -0.5,  0.5,   -1.0,  2.0,
    -0.5, -0.5,   -1.0, -1.0,
     0.5,  0.5,    2.0,  2.0,
     0.5, -0.5,    2.0, -1.0,
  ]);

  // Create the buffer object
  var vertexTexCoordBuffer = gl.createBuffer();

  // Bind the buffer object to target
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexTexCoordBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, verticesTexCoords, gl.STATIC_DRAW);

  var FSIZE = verticesTexCoords.BYTES_PER_ELEMENT;
  //Get the storage location of a_Position, assign and enable buffer
  var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
  gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, FSIZE * 4, 0);
  gl.enableVertexAttribArray(a_Position);  // Enable the assignment of the buffer object

  // Get the storage location of a_TexCoord
  var a_TexCoord = gl.getAttribLocation(gl.program, 'a_TexCoord');
  // Assign the buffer object to a_TexCoord variable
  gl.vertexAttribPointer(a_TexCoord, 2, gl.FLOAT, false, FSIZE * 4, FSIZE * 2);
  gl.enableVertexAttribArray(a_TexCoord);  // Enable the assignment of the buffer object
}

function initTextures(gl) {

	var texture = gl.createTexture();
	var u_Sampler = gl.getUniformLocation(gl.program, 'u_Sampler');
	gl.bindTexture(gl.TEXTURE_2D, texture);
	
	gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true); 
	gl.pixelStorei(gl.UNPACK_ALIGNMENT, 1);

	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, 2, 2, 0, gl.RGB, gl.UNSIGNED_BYTE, 
        new Uint8Array([255,0,0,   0,255,0,    0,0,255,   255,0,255]));
	
	gl.uniform1i(u_Sampler, 0);
	
	return texture;
}


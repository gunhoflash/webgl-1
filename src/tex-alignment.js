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

  if(!gl.getExtension("OES_texture_float")) {
    alert("no OES_texture_float");
    return;
  }

  // Initialize shaders
  if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
    console.log('Failed to intialize shaders.');
    return;
  }

  initVertexBuffers(gl);

  gl.clearColor(0.5, 0.5, 0.5, 1.0);

  initTextures(gl);

  refresh(gl);
}

function refresh(gl)
{
	gl.clear(gl.COLOR_BUFFER_BIT);   // Clear <canvas>
	
	gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4); // Draw the rectangle
}

function initVertexBuffers(gl) {
  var verticesTexCoords = new Float32Array([
    -0.5,  0.5,   0.0, 1.0,
    -0.5, -0.5,   0.0, 0.0,
     0.5,  0.5,   1.0, 1.0,
     0.5, -0.5,   1.0, 0.0,
  ]);

  var vertexTexCoordBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexTexCoordBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, verticesTexCoords, gl.STATIC_DRAW);

  var FSIZE = verticesTexCoords.BYTES_PER_ELEMENT;

  var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
  gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, FSIZE * 4, 0);
  gl.enableVertexAttribArray(a_Position);  // Enable the assignment of the buffer object

  var a_TexCoord = gl.getAttribLocation(gl.program, 'a_TexCoord');

  gl.vertexAttribPointer(a_TexCoord, 2, gl.FLOAT, false, FSIZE * 4, FSIZE * 2);
  gl.enableVertexAttribArray(a_TexCoord);  // Enable the assignment of the buffer object

  return;
}

function initTextures(gl) {

	var tex0 = gl.createTexture();
	gl.bindTexture(gl.TEXTURE_2D, tex0);
	gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true); 
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
	gl.pixelStorei(gl.UNPACK_ALIGNMENT, 4);
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, 2, 2, 0, gl.RGB, gl.UNSIGNED_BYTE, new Uint8Array([255,0,0,   0,255,0,  99,99,    0,0,255,   255,0,255, 99,99]));
	


	var u_Sampler = gl.getUniformLocation(gl.program, 'u_Sampler');
	gl.uniform1i(u_Sampler, 0);
	
}



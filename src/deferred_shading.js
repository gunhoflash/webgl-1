function init_shader(gl, src_vert, src_frag, attrib_names)
{
	initShaders(gl, src_vert, src_frag);
	h_prog = gl.program;
	var	attribs = {};
	for(let attrib of attrib_names)
	{
		attribs[attrib] = gl.getAttribLocation(h_prog, attrib);
	}
	return {h_prog:h_prog, attribs:attribs};
}


function main() {
    var canvas = document.getElementById('webgl');
    var gl = getWebGLContext(canvas);
    var ext = gl.getExtension('WEBGL_draw_buffers');
    
    var fbo_width = canvas.width/2;
    var fbo_height = canvas.height/2;

    var quad = init_quad(gl);
    var fbo = init_fbo(gl, ext, fbo_width, fbo_height);

    gl.enable(gl.DEPTH_TEST);

    var VP = new Matrix4();
	VP.setPerspective(50, 1, 1, 100); 
	VP.lookAt(2,1,3,0,0,0,0,1,0);
	var	MVP;

    var shader_preproc = init_shader(gl,
        document.getElementById("shader-vert-preproc").text,
        document.getElementById("shader-frag-preproc").text,
        ["aPosition", "aNormal"]);

   var shader_shading = init_shader(gl,
        document.getElementById("vert-Blinn-Gouraud").text,
        document.getElementById("frag-Blinn-Gouraud").text,
        ["aPosition", "aTexcoord"]);

    shader_preproc.set_uniforms = function(gl) {
            gl.uniformMatrix4fv(gl.getUniformLocation(this.h_prog, "MVP"), false, MVP.elements);
        }

    var tex_unit_position = 3;
    var tex_unit_normal = 2;
    var tex_unit_material = 1;

    shader_shading.set_uniforms = function(gl) {
            gl.uniform1i(gl.getUniformLocation(this.h_prog, "tex_position"), tex_unit_position);
            gl.uniform1i(gl.getUniformLocation(this.h_prog, "tex_normal"), tex_unit_normal);
            gl.uniform1i(gl.getUniformLocation(this.h_prog, "tex_material"), tex_unit_material);
        }

	var	monkey;
	var	torus;
	var	monkey_loaded = false;
	var	torus_loaded = false;

	gl.bindFramebuffer(gl.FRAMEBUFFER, fbo.fbo);
	ext.drawBuffersWEBGL([
			ext.COLOR_ATTACHMENT0_WEBGL, 
			ext.COLOR_ATTACHMENT1_WEBGL, 
			ext.COLOR_ATTACHMENT2_WEBGL, 
			]);
	gl.viewport(0, 0, fbo_width, fbo_height);
	gl.clearColor(0, 0, 0, 1);
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	
	MVP = new Matrix4(VP);
	MVP.translate(-1,0,0);
	render_object(gl, shader_preproc, monkey);
	
	MVP = new Matrix4(VP);
	MVP.translate(1,0,0);
	render_object(gl, shader_preproc, torus);
	
	gl.bindFramebuffer(gl.FRAMEBUFFER, null);
	
	gl.viewport(0, 0, canvas.width, canvas.height);
	gl.clearColor(.5, .5, .5, 1);
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	
	gl.activeTexture(gl.TEXTURE0 + tex_unit);
	
	var MVP = new Matrix4(P);
	MVP.translate(-.5,.5,0);
	gl.bindTexture(gl.TEXTURE_2D, fbo.color[0]);
	render_object(gl, shader_tex, quad);
	
	var MVP = new Matrix4(P);
	MVP.translate(.5,-.5,0);
	gl.bindTexture(gl.TEXTURE_2D, fbo.color[1]);
	render_object(gl, shader_tex, quad);

}


function render_scene(gl)
{

}

function render_object(gl, shader, object)
{
    gl.useProgram(shader.h_prog);
	shader.set_uniforms(gl);

	for(var attrib_name in object.attribs)
	{
		var	attrib = object.attribs[attrib_name];
		gl.bindBuffer(gl.ARRAY_BUFFER, attrib.buffer);
		gl.vertexAttribPointer(shader.attribs[attrib_name], attrib.size, attrib.type, attrib.normalized, attrib.stride, attrib.offset);
		gl.bindBuffer(gl.ARRAY_BUFFER, null);
		gl.enableVertexAttribArray(shader.attribs[attrib_name]);
	}
	if(object.drawcall == "drawArrays")
	{
		gl.drawArrays(object.type, 0, object.n);
	}
	else if(object.drawcall == "drawElements")
	{
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, object.buf_index);
		gl.drawElements(object.type, object.n, object.type_index, 0);
	}

	for(var attrib_name in object.attribs)
	{
		gl.disableVertexAttribArray(shader.attribs[attrib_name]);
	}

    gl.useProgram(null);
}

function init_triangles(gl)
{
    var verts = new Float32Array([
		 -0.50, -0.50,  0.1, 1.0,		0, 0, 1, 1,		1, 1, 0, 1 ,
		  0.90, -0.50,  0.1, 1.0,		0, 0, 1, 1,		1, 1, 0, 1 ,
		  0.20,  0.90,  0.1, 1.0,		0, 0, 1, 1,		1, 1, 0, 1 ,

		 -0.70, -0.70,  0.0, 1.0,		0, 1, 0, 1,		1, 0, 1, 1 ,
		  0.70, -0.70,  0.0, 1.0,		0, 1, 0, 1,		1, 0, 1, 1 ,
		  0.00,  0.70,  0.0, 1.0,		0, 1, 0, 1,		1, 0, 1, 1 ,

   		 -0.90, -0.90, -0.1, 1.0,		1, 0, 0, 1,		0, 1, 1, 1 ,
		  0.50, -0.90, -0.1, 1.0,		1, 0, 0, 1,		0, 1, 1, 1 ,
		 -0.20,  0.50, -0.1, 1.0,		1, 0, 0, 1,		0, 1, 1, 1 ,
          ]);


    var buf = gl.createBuffer();
    
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, verts, gl.STATIC_DRAW);

	var FSIZE = verts.BYTES_PER_ELEMENT;
	var	attribs = [];
	attribs["aPosition"] = {buffer:buf, size:4, type:gl.FLOAT, normalized:false, stride:FSIZE*12, offset:0};
	attribs["aColor0"] = {buffer:buf, size:4, type:gl.FLOAT, normalized:false, stride:FSIZE*12, offset:FSIZE*4};
	attribs["aColor1"] = {buffer:buf, size:4, type:gl.FLOAT, normalized:false, stride:FSIZE*12, offset:FSIZE*8};

    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    
	return {n:9, drawcall:"drawArrays", type:gl.TRIANGLES, attribs:attribs};
}

function init_quad(gl)
{
    var verts = new Float32Array([
		 -1, -1, 0, 0 , 
		  1, -1, 1, 0 ,
		  1,  1, 1, 1 ,
		 -1,  1, 0, 1 ,
          ]);
    var buf = gl.createBuffer();
    
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, verts, gl.STATIC_DRAW);

	var FSIZE = verts.BYTES_PER_ELEMENT;
	var	attribs = [];
	attribs["aPosition"] = {buffer:buf, size:2, type:gl.FLOAT, normalized:false, stride:FSIZE*4, offset:0};
	attribs["aTexcoord"] = {buffer:buf, size:2, type:gl.FLOAT, normalized:false, stride:FSIZE*4, offset:FSIZE*2};

    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    
	return {n:4, drawcall:"drawArrays", type:gl.TRIANGLE_FAN, attribs:attribs};

}


function init_fbo(gl, ext, fbo_width, fbo_height)
{
	var fbo = gl.createFramebuffer();
	gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);

	var tex_color0 = gl.createTexture();
	gl.bindTexture(gl.TEXTURE_2D, tex_color0);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, fbo_width, fbo_height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
	gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex_color0, 0);

	var tex_color1 = gl.createTexture();
	gl.bindTexture(gl.TEXTURE_2D, tex_color1);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, fbo_width, fbo_height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
	gl.framebufferTexture2D(gl.FRAMEBUFFER, ext.COLOR_ATTACHMENT1_WEBGL, gl.TEXTURE_2D, tex_color1, 0);

	var rbo_depth = gl.createRenderbuffer();
	gl.bindRenderbuffer(gl.RENDERBUFFER, rbo_depth);
	gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, fbo_width, fbo_height);
	gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, rbo_depth);

    return {fbo:fbo, color:[tex_color0, tex_color1], depth:rbo_depth};
}

"use strict";

let g_last = Date.now();
let ANGLE_STEP_LIGHT = 30.0;
let ANGLE_STEP_MESH = 30.0;
function main()
{
	let canvas = document.getElementById('webgl');
	let gl = getWebGLContext(canvas);
	gl.getExtension('OES_standard_derivatives');

	gl.enable(gl.DEPTH_TEST);
	gl.clearColor(0.9, 0.9, 0.9, 1.0);

	let V = new Matrix4();
	V.setLookAt(6, 6, 6, 0, 0, 0, 0, 1, 0);

	let P = new Matrix4();
//	P.setPerspective(60, 1, 1, 100); 
	P.setOrtho(-1, 1, -1, 1, 1, 100); 

	let shader = new Shader(gl, 
			document.getElementById("vert-Phong-Phong").text,
			document.getElementById("frag-Phong-Phong").text,
			["aPosition", "aNormal", "aTexCoord"]);

	let lights = 
	[
		new Light
		(
			gl,
			[20, 20, 20, 1.0],		// position
			[0.1, 0.1, 0.1, 1.0],	// ambient
			[1.0, 1.0, 1.0, 1.0],	// diffusive
			[1.0, 1.0, 1.0, 1.0],	// specular
			false
		),
		new Light
		(
			gl,
			[-20, 20, 20, 0.0],		// position
			[0.1, 0.1, 0.1, 1.0],	// ambient
			[1.0, 1.0, 1.0, 1.0],	// diffusive
			[1.0, 1.0, 1.0, 1.0],	// specular
			true
		),
	];


	let mesh = new Mesh(gl);

	mesh.M.setTranslate(0, -8.8, 0);
	mesh.M.scale(0.05, 0.05, 0.05);

	let axes = new Axes(gl,4);

	let lastX;
	let lastY;
	let angle = [0,0];
	let dragging = false;

	canvas.onmousedown = function(ev) 
	{
		let x = ev.clientX, y = ev.clientY;
		let bb = ev.target.getBoundingClientRect();
		if (bb.left <= x && x < bb.right && bb.top <= y && y < bb.bottom)
		{
			lastX = x;
			lastY = y;
			dragging = true;
		}
	}
	canvas.onmouseup = function(ev) { dragging = false; };

	canvas.onmousemove = function(ev)
	{
		let x = ev.clientX;
		let y = ev.clientY;
		if(dragging)
		{
			let offset = [x - lastX, y - lastY];
			if(offset[0] != 0 || offset[1] != 0) // For some reason, the offset becomes zero sometimes...
			{
				let	VP = new Matrix4(P);
				VP.multiply(V);
				let	axis = unproject_vector([offset[1], offset[0], 0], VP, 
					gl.getParameter(gl.VIEWPORT));
				V.rotate(length2(offset), axis[0], axis[1], axis[2]);
			}
		}
		lastX = x;
		lastY = y;
	}

	let manager = new THREE.LoadingManager();
	manager.onProgress = function ( item, loaded, total ) {
		console.log( item, loaded, total );
	};

	let loaded = [];
	loaded["texnorm"] = false;
	loaded["texdisp"] = false;
	loaded["mesh"] = false;


	let tex_norm, tex_disp;

	let img_norm = new Image();
	img_norm.onload = function()
	{
		tex_norm = new Texture(gl, img_norm);
		loaded["texnorm"] = true;
	};

	let img_disp = new Image();
	img_disp.onload = function()
	{
		tex_disp = new Texture(gl, img_disp);
		loaded["texdisp"] = true;
	};


	img_norm.crossOrigin = '';	// https://webglfundamentals.org/webgl/lessons/webgl-cors-permission.html
	img_norm.src = 'https://threejs.org/examples/models/obj/ninja/normal.jpg';

	img_disp.crossOrigin = '';	// https://webglfundamentals.org/webgl/lessons/webgl-cors-permission.html
	img_disp.src = 'https://threejs.org/examples/models/obj/ninja/displacement.jpg';

	let url = 'https://threejs.org/examples/models/obj/ninja/ninjaHead_Low.obj';
//	let url = 'https://threejs.org/examples/models/obj/cerberus/Cerberus.obj';
//	let url = 'https://threejs.org/examples/models/gltf/Monster/glTF/Monster.gltf';
//	let url = 'https://xregy.github.io/webgl/resources/monkey_sub2_smooth.obj'; 

	let loader = new THREE.OBJLoader( manager );
//	let loader = new THREE.GLTFLoader( manager );
	loader.load(url,
		function ( object )
		{
			document.getElementById("output").innerHTML = 'Successfully loaded.';
//			for(let obj of object.scene.children)
			for(let obj of object.children)
			{
				if(obj.type == "Mesh")
				{
					mesh.init_from_THREE_geometry(gl, object.children[0].geometry);
				}
			}
			loaded["mesh"] = true;
		},
		// called when loading is in progresses
		function ( xhr )
		{
			document.getElementById("output").innerHTML = ( xhr.loaded / xhr.total * 100 ) + '% loaded.';
		},
		// called when loading has errors
		function ( error )
		{
			document.getElementById("output").innerHTML = 'An error happened: ' + error;
		}

	);

	var tick_init = function() {
		if(loaded["texnorm"] && loaded["mesh"] && loaded["texdisp"])
		{
			requestAnimationFrame(tick, canvas); // Request that the browser calls tick
		}
		else
		{
			requestAnimationFrame(tick_init, canvas); // Request that the browser calls tick
		}
	};

	let tick = function() {   // start drawing
		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
		axes.render(gl, V, P);
		gl.useProgram(shader.h_prog);
		gl.uniform1i(gl.getUniformLocation(shader.h_prog, "use_norm_map"), document.getElementById("normmap").checked);
		gl.uniform1i(gl.getUniformLocation(shader.h_prog, "use_disp_map"), document.getElementById("dispmap").checked);
		gl.uniform1f(gl.getUniformLocation(shader.h_prog, "disp_scale"), 2.436143);
		gl.uniform1f(gl.getUniformLocation(shader.h_prog, "disp_bias"), -0.428408);
		mesh.render(gl, shader, lights, __js_materials["gold"], V, P, {"tex_norm":tex_norm, "tex_disp":tex_disp});
		requestAnimationFrame(tick, canvas);
	};

	tick_init();

}

function length2(v)
{
	return Math.sqrt(v[0]*v[0] + v[1]*v[1]);
}

// https://github.com/g-truc/glm/blob/master/glm/ext/matrix_projection.inl
function project(p_obj, MVP, viewport)
{
	let	tmp = MVP.multiplyVector4(new Vector4([p_obj[0], p_obj[1], p_obj[2], 1]));

	for(let i in [0,1,2])	tmp.elements[i] /= tmp.elements[3];

//	for(let i in [0,1]) 	// --> not working!!!???
	for(let i=0 ; i<2 ; i++)
	{
		tmp.elements[i] = (0.5*tmp.elements[i] + 0.5) * viewport[i+2] + viewport[i];
	}

	return tmp.elements;
}

// https://github.com/g-truc/glm/blob/master/glm/ext/matrix_projection.inl
function unproject(p_win, MVP, viewport)
{
	let	MVP_inv = new Matrix4();
	MVP_inv.setInverseOf(MVP);

	let	tmp = new Vector4([p_win[0], p_win[1], p_win[2], 1.0]);

//	for(let i in [0,1]) --> not working!!!???
	for(let i=0 ; i<2 ; i++)
		tmp.elements[i] = 2.0*(tmp.elements[i] - viewport[i])/viewport[i+2] - 1.0;

	let p_obj = MVP_inv.multiplyVector4(tmp);

	for(let i in [0,1,2]) p_obj.elements[i] /= p_obj.elements[3];

	return p_obj.elements;
}

function unproject_vector(vec_win, MVP, viewport)
{
	let	org_win = project([0,0,0], MVP, viewport);
	let	vec = unproject([org_win[0]+vec_win[0], org_win[1]+vec_win[1], org_win[2]+vec_win[2]],
						MVP, viewport);
	return vec;
}



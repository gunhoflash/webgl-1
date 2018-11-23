"use strict";

let g_last = Date.now();
let ANGLE_STEP_LIGHT = 30.0;
let ANGLE_STEP_MESH = 30.0;
function main()
{
	let canvas = document.getElementById('webgl');
	let gl = getWebGLContext(canvas);

	gl.enable(gl.DEPTH_TEST);
	gl.clearColor(0.2,0.2,0.2,1);

	let V = new Matrix4();
	V.setLookAt(2, 1, 3, 0, 0, 0, 0, 1, 0);

	let P = new Matrix4();
	P.setPerspective(50, 1, 1, 100); 

	let axes = new Axes(gl);

	let shader = new Shader(gl, 
			document.getElementById("vert-Blinn-Gouraud").text,
			document.getElementById("frag-Blinn-Gouraud").text,
			["aPosition", "aNormal"]);

	let light = new Light
	(
		gl,
		[2.5, 2.5, 2.5, 1.0],
		[0.1, 0.1, 0.1, 1.0],
		[1.0, 1.0, 1.0, 1.0],
		[1.0, 1.0, 1.0, 1.0],
		false
	);
	light.turn_on(true);

	let monkey = new Mesh(gl);
	monkey.init_from_json_js(gl, __js_monkey_sub2_smooth);

	let tick = function()
	{
		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
		axes.render(gl, V, P);
		monkey.render(gl, shader, [light], __js_materials["gold"], V, P);
		requestAnimationFrame(tick, canvas); // Request that the browser calls tick
	};
	tick();
}



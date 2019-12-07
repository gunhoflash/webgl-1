const src_vert_Phong_Gouraud = `#version 300 es
layout(location=${loc_aPosition}) in vec4	aPosition;
layout(location=${loc_aNormal}) in vec3	aNormal;
uniform mat4	MVP;
uniform mat4	MV;
uniform mat4	matNormal;
struct TMaterial
{
	vec3	ambient;
	vec3	diffuse;
	vec3	specular;
	vec3	emission;
	float	shininess;
};
struct TLight
{
	vec4	position;
	vec3	ambient;
	vec3	diffuse;
	vec3	specular;
	bool	enabled;
};
uniform TMaterial	material;
uniform TLight		light[${numLights}];
out vec3		vColor;
void main()
{
	vec3	n = normalize(mat3(matNormal)*aNormal);
	vec4	vPosEye = MV*aPosition;
	vec3	l;
	vec3	v = normalize(-vPosEye.xyz);
	vColor = vec3(0.0);
	for(int i=0 ; i<${numLights} ; i++)
	{
		if(light[i].enabled)
		{
			if(light[i].position.w == 1.0)
				l = normalize((light[i].position - vPosEye).xyz);
			else
				l = normalize((light[i].position).xyz);
			vec3	h = normalize(l + v);
			float	l_dot_n = max(dot(l, n), 0.0);
			vec3	ambient = light[i].ambient * material.ambient;
			vec3	diffuse = light[i].diffuse * material.diffuse * l_dot_n;
			vec3	specular = vec3(0.0);
			if(l_dot_n > 0.0)
			{
				specular = light[i].specular * material.specular * pow(max(dot(h, n), 0.0), material.shininess);
			}
			vColor += ambient + diffuse + specular;
		}
	}
	gl_Position = MVP*aPosition;
}`;
const src_frag_Phong_Gouraud = `#version 300 es
precision mediump float;
in vec3	vColor;
out vec4 fColor;
void main()
{
	fColor = vec4(vColor, 1);
}`;

const src_vert_Blinn_Gouraud = `#version 300 es
layout(location=${loc_aPosition}) in vec4	aPosition;
layout(location=${loc_aNormal}) in vec3	aNormal;
uniform mat4	MVP;
uniform mat4	MV;
uniform mat4	matNormal;
struct TMaterial
{
	vec3	ambient;
	vec3	diffuse;
	vec3	specular;
	vec3	emission;
	float	shininess;
};
struct TLight
{
	vec4	position;
	vec3	ambient;
	vec3	diffuse;
	vec3	specular;
	bool	enabled;
};
uniform TMaterial	material;
uniform TLight		light[${numLights}];
out vec3		vColor;
void main()
{
	vec3	n = normalize(mat3(matNormal)*aNormal);
	vec4	vPosEye = MV*aPosition;
	vec3	l;
	vec3	v = normalize(-vPosEye.xyz);
	vColor = vec3(0.0);
	for(int i=0 ; i<${numLights} ; i++)
	{
		if(light[i].enabled)
		{
			if(light[i].position.w == 1.0)
				l = normalize((light[i].position - vPosEye).xyz);
			else
				l = normalize((light[i].position).xyz);
			vec3	h = normalize(l + v);
			float	l_dot_n = max(dot(l, n), 0.0);
			vec3	ambient = light[i].ambient * material.ambient;
			vec3	diffuse = light[i].diffuse * material.diffuse * l_dot_n;
			vec3	specular = vec3(0.0);
			if(l_dot_n > 0.0)
			{
				specular = light[i].specular * material.specular * pow(max(dot(h, n), 0.0), material.shininess);
			}
			vColor += ambient + diffuse + specular;
		}
	}
	gl_Position = MVP*aPosition;
}`;

const src_frag_Blinn_Gouraud = `#version 300 es
precision mediump float;
in vec3	vColor;
out vec4 fColor;
void main()
{
	fColor = vec4(vColor, 1);
}`;

const src_vert_Blinn_Phong = `#version 300 es
layout(location=${loc_aPosition}) in vec4 aPosition;
layout(location=${loc_aNormal}) in vec3 aNormal;
uniform mat4	MVP;
uniform mat4	MV;
uniform mat4	matNormal;
out vec3	vNormal;
out vec4	vPosEye;
void main()
{
	vPosEye = MV*aPosition;
	vNormal = normalize(mat3(matNormal)*aNormal);
	gl_Position = MVP*aPosition;
}`;

const src_frag_Blinn_Phong = `#version 300 es
precision mediump float;
in vec4	vPosEye;
in vec3	vNormal;
out vec4 fColor;
struct TMaterial
{
	vec3	ambient;
	vec3	diffuse;
	vec3	specular;
	vec3	emission;
	float	shininess;
};
struct TLight
{
	vec4	position;
	vec3	ambient;
	vec3	diffuse;
	vec3	specular;
	bool	enabled;
};
uniform TMaterial	material;
uniform TLight		light[${numLights}];
void main()
{
	vec3	n = normalize(vNormal);
	vec3	l;
	vec3	v = normalize(-vPosEye.xyz);
	fColor = vec4(0.0);
	for(int i=0 ; i<${numLights} ; i++)
	{
		if(light[i].enabled)
		{
			if(light[i].position.w == 1.0)
				l = normalize((light[i].position - vPosEye).xyz);		// positional light
			else
				l = normalize((light[i].position).xyz);	// directional light
			float	l_dot_n = max(dot(l, n), 0.0);
			vec3	ambient = light[i].ambient * material.ambient;
			vec3	diffuse = light[i].diffuse * material.diffuse * l_dot_n;
			vec3	specular = vec3(0.0);
			if(l_dot_n > 0.0)
			{
				vec3	h = normalize(l + v);
				specular = light[i].specular * material.specular * pow(max(dot(h, n), 0.0), material.shininess);
			}
			fColor += vec4(ambient + diffuse + specular, 1);
		}
	}
	fColor.w = 1.0;
}`;
const src_vert_Phong_Phong = `#version 300 es
layout(location=${loc_aPosition}) in vec4	aPosition;
layout(location=${loc_aNormal}) in vec3	aNormal;
uniform mat4	MVP;
uniform mat4	MV;
uniform mat4	matNormal;
out vec3	vNormal;
out vec4	vPosEye;
void main()
{
	vPosEye = MV*aPosition;
	vNormal = normalize((matNormal*vec4(aNormal,0)).xyz);
	gl_Position = MVP*aPosition;
}`;

const src_frag_Phong_Phong = `#version 300 es
precision mediump float;
in vec4 vPosEye;
in vec3	vNormal;
out vec4 fColor;
struct TMaterial
{
	vec3	ambient;
	vec3	diffuse;
	vec3	specular;
	vec3	emission;
	float	shininess;
};
struct TLight
{
	vec4	position;
	vec3	ambient;
	vec3	diffuse;
	vec3	specular;
	bool	enabled;
};
uniform TMaterial	material;
uniform TLight		light[${numLights}];
void main()
{
	vec3	n = normalize(vNormal);
	vec3	l;
	vec3	v = normalize(-vPosEye.xyz);
	fColor = vec4(0.0);
	for(int i=0 ; i<${numLights} ; i++)
	{
		if(light[i].enabled)
		{
			if(light[i].position.w == 1.0)
				l = normalize((light[i].position - vPosEye).xyz);
			else
				l = normalize((light[i].position).xyz);
			vec3	r = reflect(-l, n);
			float	l_dot_n = max(dot(l, n), 0.0);
			vec3	ambient = light[i].ambient * material.ambient;
			vec3	diffuse = light[i].diffuse * material.diffuse * l_dot_n;
			vec3	specular = vec3(0.0);
			if(l_dot_n > 0.0)
			{
				specular = light[i].specular * material.specular * pow(max(dot(r, v), 0.0), material.shininess);
			}
			fColor += vec4(ambient + diffuse + specular, 1);
		}
	}
	fColor.w = 1.0;
}`;

const src_vert_Blinn_Gouraud_spot = `#version 300 es
layout(location=${loc_aPosition}) in vec4	aPosition;
layout(location=${loc_aNormal}) in vec3	aNormal;
uniform mat4	MVP;
uniform mat4	MV;
uniform mat4	matNormal;
struct TMaterial
{
	vec3	ambient;
	vec3	diffuse;
	vec3	specular;
	vec3	emission;
	float	shininess;
};
struct TLight
{
	vec4	position;
	vec3	ambient;
	vec3	diffuse;
	vec3	specular;
	bool	enabled;
	vec4	direction;
	float	cutoff_angle;
};
uniform TMaterial	material;
uniform TLight		light[${numLights}];
out vec3		vColor;
void main()
{
	vec3	n = normalize(mat3(matNormal)*aNormal);
	vec4	vPosEye = MV*aPosition;
	vec3	l;
	vec3	v = normalize(-vPosEye.xyz);
	vColor = vec3(0.0);
	for(int i=0 ; i<${numLights} ; i++)
	{
		if(light[i].enabled)
		{
			if(light[i].position.w == 1.0)
				l = normalize((light[i].position - vPosEye).xyz);
			else
				l = normalize((light[i].position).xyz);
			vec3	h = normalize(l + v);
			float	l_dot_n = max(dot(l, n), 0.0);
			vec3	ambient = light[i].ambient * material.ambient;
			vec3	diffuse = light[i].diffuse * material.diffuse * l_dot_n;
			vec3	specular = vec3(0.0);
			if(l_dot_n > 0.0)
			{
				specular = light[i].specular * material.specular * pow(max(dot(h, n), 0.0), material.shininess);
			}
			if(dot(-l,normalize(light[i].direction).xyz) < light[i].cutoff_angle)
			{
				diffuse = vec3(0);
				specular = vec3(0);
			}


			vColor += ambient + diffuse + specular;
		}
	}
	gl_Position = MVP*aPosition;
}`;

const src_frag_Blinn_Gouraud_spot = `#version 300 es
precision mediump float;
in vec3	vColor;
out vec4 fColor;
void main()
{
	fColor = vec4(vColor, 1);
}`;
const src_vert_Phong_Gouraud_spot = `#version 300 es
layout(location=${loc_aPosition}) in vec4 aPosition;
layout(location=${loc_aNormal}) in vec3 aNormal;
uniform mat4	MVP;
uniform mat4	MV;
uniform mat4	matNormal;
struct TMaterial
{
	vec3	ambient;
	vec3	diffuse;
	vec3	specular;
	vec3	emission;
	float	shininess;
};
struct TLight
{
	vec4	position;
	vec3	ambient;
	vec3	diffuse;
	vec3	specular;
	bool	enabled;
	vec4	direction;
	float	cutoff_angle;
};
uniform TMaterial	material;
uniform TLight		light[${numLights}];
out vec3	vColor;
void main()
{
	vec3	n = normalize(mat3(matNormal)*aNormal);	// n is the normal vector in eye coordinate system
	vec4	vPosEye = MV*aPosition;	// vPosEye is the vertex position in eye coordinate system
	vec3	l;
	vec3	v = normalize(-vPosEye.xyz);
	vColor = vec3(0.0);
	for(int i=0 ; i<${numLights} ; i++)
	{
		if(light[i].enabled)
		{
			if(light[i].position.w == 1.0)
				l = normalize((light[i].position - vPosEye).xyz);
			else
				l = normalize((light[i].position).xyz);
			vec3	r = reflect(-l, n);
			float	l_dot_n = max(dot(l, n), 0.0);
			vec3	ambient = light[i].ambient * material.ambient;
			vec3	diffuse = light[i].diffuse * material.diffuse * l_dot_n;
			vec3	specular = vec3(0.0);
			if(l_dot_n > 0.0)
			{
				specular = light[i].specular * material.specular * pow(max(dot(r, v), 0.0), material.shininess);
			}
			if(dot(-l,normalize(light[i].direction).xyz) < light[i].cutoff_angle)
			{
				diffuse = vec3(0);
				specular = vec3(0);
			}


			vColor += ambient + diffuse + specular;
		}
	}
	gl_Position = MVP*aPosition;
}`;
const src_frag_Phong_Gouraud_spot = `#version 300 es
precision mediump float;
in vec3	vColor;
out vec4 fColor;
void main()
{
	fColor = vec4(vColor, 1);
}`;

const src_vert_Blinn_Phong_spot = `#version 300 es
layout(location=${loc_aPosition}) in vec4 aPosition;
layout(location=${loc_aNormal}) in vec3 aNormal;
uniform mat4	MVP;
uniform mat4	MV;
uniform mat4	matNormal;
out vec3	vNormal;
out vec4	vPosEye;
void main()
{
	vPosEye = MV*aPosition;
	vNormal = normalize(mat3(matNormal)*aNormal);
	gl_Position = MVP*aPosition;
}`;
const src_frag_Blinn_Phong_spot = `#version 300 es
precision mediump float;
in vec4	vPosEye;
in vec3	vNormal;
out vec4 fColor;
struct TMaterial
{
	vec3	ambient;
	vec3	diffuse;
	vec3	specular;
	vec3	emission;
	float	shininess;
};
struct TLight
{
	vec4	position;
	vec3	ambient;
	vec3	diffuse;
	vec3	specular;
	bool	enabled;
	vec4	direction;
	float	cutoff_angle;
};
uniform TMaterial	material;
uniform TLight		light[${numLights}];
void main()
{
	vec3	n = normalize(vNormal);
	vec3	l;
	vec3	v = normalize(-vPosEye.xyz);
	fColor = vec4(0.0);
	for(int i=0 ; i<${numLights} ; i++)
	{
		if(light[i].enabled)
		{
			if(light[i].position.w == 1.0)
				l = normalize((light[i].position - vPosEye).xyz);		// positional light
			else
				l = normalize((light[i].position).xyz);	// directional light
			float	l_dot_n = max(dot(l, n), 0.0);
			vec3	ambient = light[i].ambient * material.ambient;
			vec3	diffuse = light[i].diffuse * material.diffuse * l_dot_n;
			vec3	specular = vec3(0.0);
			if(l_dot_n > 0.0)
			{
				vec3	h = normalize(l + v);
				specular = light[i].specular * material.specular * pow(max(dot(h, n), 0.0), material.shininess);
			}
			if(dot(-l,normalize(light[i].direction).xyz) < light[i].cutoff_angle)
			{
				diffuse = vec3(0);
				specular = vec3(0);
			}

			fColor += vec4(ambient + diffuse + specular, 1);
		}
	}
	fColor.w = 1.0;
}`;
const src_vert_Phong_Phong_spot = `#version 300 es
layout(location=${loc_aPosition}) in vec4	aPosition;
layout(location=${loc_aNormal}) in vec3	aNormal;
uniform mat4	MVP;
uniform mat4	MV;
uniform mat4	matNormal;
out vec3	vNormal;
out vec4	vPosEye;
void main()
{
	vPosEye = MV*aPosition;
	vNormal = normalize((matNormal*vec4(aNormal,0)).xyz);
	gl_Position = MVP*aPosition;
}`;

const src_frag_Phong_Phong_spot = `#version 300 es
precision mediump float;
in vec4 vPosEye;
in vec3	vNormal;
out vec4 fColor;
struct TMaterial
{
	vec3	ambient;
	vec3	diffuse;
	vec3	specular;
	vec3	emission;
	float	shininess;
};
struct TLight
{
	vec4	position;
	vec3	ambient;
	vec3	diffuse;
	vec3	specular;
	bool	enabled;
	vec4	direction;
	float	cutoff_angle;
};
uniform TMaterial	material;
uniform TLight		light[${numLights}];
void main()
{
	vec3	n = normalize(vNormal);
	vec3	l;
	vec3	v = normalize(-vPosEye.xyz);
	fColor = vec4(0.0);
	for(int i=0 ; i<${numLights} ; i++)
	{
		if(light[i].enabled)
		{
			if(light[i].position.w == 1.0)
				l = normalize((light[i].position - vPosEye).xyz);
			else
				l = normalize((light[i].position).xyz);
			vec3	r = reflect(-l, n);
			float	l_dot_n = max(dot(l, n), 0.0);
			vec3	ambient = light[i].ambient * material.ambient;
			vec3	diffuse = light[i].diffuse * material.diffuse * l_dot_n;
			vec3	specular = vec3(0.0);
			if(l_dot_n > 0.0)
			{
				specular = light[i].specular * material.specular * pow(max(dot(r, v), 0.0), material.shininess);
			}
			if(dot(-l,normalize(light[i].direction).xyz) < light[i].cutoff_angle)
			{
				diffuse = vec3(0);
				specular = vec3(0);
			}
			fColor += vec4(ambient + diffuse + specular, 1);
		}
	}
	fColor.w = 1.0;
}`;



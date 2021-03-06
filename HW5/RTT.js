import * as THREE from "https://threejs.org/build/three.module.js";
import { OrbitControls } from "https://threejs.org/examples/jsm/controls/OrbitControls.js";
import { TeapotGeometry } from "https://threejs.org/examples/jsm/geometries/TeapotGeometry.js";

var scene, renderer, camera,camera2;
var angle = 0;
var mesh,teapots = [];
var cone = new THREE.Group(), light;
var sceneRTT,controls;
var radius,renderTarget;


function init() {
	
	var width = window.innerWidth;
    var height = window.innerHeight;

    renderer = new THREE.WebGLRenderer({
        antialias: true
    });
    renderer.setSize(width, height);
    document.body.appendChild(renderer.domElement);
    renderer.setClearColor(0x888888);
	
    scene = new THREE.Scene();
	sceneRTT = new THREE.Scene();
	
    camera = new THREE.PerspectiveCamera(45, window.innerWidth /window.innerHeight, 0.1, 1000);
	camera.position.y = 160;
    camera.position.z = 400;
	
	camera2 = new THREE.PerspectiveCamera();
	camera2.copy (camera);

    controls = new OrbitControls(camera, renderer.domElement);
	window.addEventListener('resize', onWindowResize, false);
	
    var gridXZ = new THREE.GridHelper(200, 20, 'red', 'white');
    scene.add(gridXZ);
	//////////////////////////////////////////////////////////////////////////////////
	
    light = new THREE.Mesh(new THREE.SphereGeometry( 10, 32, 16 ),new THREE.MeshBasicMaterial( { color: 0xffff00 } ));
	light.position.y = -13;
	cone = new THREE.Mesh(new THREE.CylinderGeometry( 5, 5, 10, 32 ), new THREE.MeshBasicMaterial( {color: 0x000000} ) );
	cone.add(light);
	scene.add(cone);

	var ambientLight = new THREE.AmbientLight(0x111111);
    scene.add(ambientLight);
	/////////////////////////////////////////////////////////////////////////////////
 
    let meshMaterial = new THREE.ShaderMaterial({
        uniforms: {
			lightpos: {type: 'v3', value: new THREE.Vector3()}
        },
        vertexShader: document.getElementById('myVertexShader').textContent,
        fragmentShader: document.getElementById('myFragmentShader').textContent
    });
	
	renderTarget = new THREE.WebGLRenderTarget(
		1024, 1024, {
		  minFilter: THREE.LinearFilter,
		  magFilter: THREE.NearestFilter,
		  format: THREE.RGBFormat
		}
	);
	
	let plane = new THREE.PlaneBufferGeometry(50, 30);
  
    let rttmaterial = new THREE.ShaderMaterial({
  	  uniforms:{
  		mytex:{type:"t",value: renderTarget.texture}
 	  },
  	  side: THREE.DoubleSide,
      vertexShader:["varying vec2 vUv;","void main() {",
		"gl_Position = projectionMatrix* modelViewMatrix * vec4( position, 1.0);",
		"vUv = uv;","}"
	  ].join("\n"),
      fragmentShader:[
	    "uniform sampler2D mytex;","varying vec2 vUv;",
		"void main() {",
		"vec4 myColor = texture2D(mytex,vUv);",
		"if(myColor.r == 1.0 && myColor.g == 1.0 && myColor.b == 0.0)",
			"discard;",
		"else",
			"gl_FragColor = myColor;","}" ].join("\n")});
	
    let geometry = new TeapotGeometry(6);
	geometry.computeBoundingSphere();
	radius = geometry.boundingSphere.radius;
	
	mesh = new THREE.Mesh(geometry, meshMaterial);
	sceneRTT.add(mesh);
	
	for (let i = 0; i < 10; i++ ){
		for (let  j = 0; j < 10; j++){
			let quad = new THREE.Mesh(plane,rttmaterial);
			quad.position.set(-90 + i * 20, 5, -90 + j * 20);
			teapots.push(quad);
			scene.add(quad);
			
		}
	}
}

function onWindowResize() {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
 
	angle += 0.01;
    
    cone.position.set(80 * Math.cos(angle), 50, 80 * Math.sin(angle));    
    mesh.material.uniforms.lightpos.value.copy(cone.position);
	mesh.rotation.y = 1.0*angle;
	
	let c = radius/Math.sin(camera2.fov/180*Math.PI/2);
	camera2.position.copy ( (camera.position.clone().sub(controls.target)).setLength(c) );
	camera2.lookAt (0,0,0);
	
	renderer.setRenderTarget (renderTarget);
    renderer.setClearColor(0xffff00);
    renderer.render(sceneRTT,camera2);

    // render texture to quad
    renderer.setRenderTarget(null);
    renderer.setClearColor(0x888888);
    renderer.render(scene, camera);
	
	teapots.forEach(function(t){
		t.rotation.y = 1.0 * angle;
		t.lookAt(camera.position);
	})
	
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}

export {init, animate, scene};


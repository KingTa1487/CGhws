import * as THREE from "https://threejs.org/build/three.module.js";
import { OrbitControls } from "https://threejs.org/examples/jsm/controls/OrbitControls.js";
import {TeapotGeometry} from "https://threejs.org/examples/jsm/geometries/TeapotGeometry.js";

var scene, renderer, camera;

var teapots=[], pointLight, cone = new THREE.Group(), light;
var turn = true;
var angle = 0;


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

    camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 10000);
    camera.position.y = 160;
    camera.position.z = 400;

    let controls = new OrbitControls(camera, renderer.domElement);

	
    var gridXZ = new THREE.GridHelper(200, 20, 'red', 'white');
    scene.add(gridXZ);

    pointLight = new THREE.PointLight(0xffffff);
    //scene.add (pointLight);
    //scene.add (new THREE.PointLightHelper(pointLight, 10));
	light = new THREE.Mesh(new THREE.SphereGeometry( 10, 32, 16 ),new THREE.MeshBasicMaterial( { color: 0xffff00 } ));
	light.position.y = -13;
	cone = new THREE.Mesh(new THREE.CylinderGeometry( 5, 5, 10, 32 ), new THREE.MeshBasicMaterial( {color: 0x000000} ) );
	cone.add(light);
	scene.add(cone);
	//pointLight.add(cone);

	var ambientLight = new THREE.AmbientLight(0x111111);
    scene.add(ambientLight);

 
    let meshMaterial = new THREE.ShaderMaterial({
        uniforms: {
			lightpos: {type: 'v3', value: new THREE.Vector3()}
        },
        vertexShader: document.getElementById('myVertexShader').textContent,
        fragmentShader: document.getElementById('myFragmentShader').textContent
    });

    
    //var geometry = new THREE.TorusKnotGeometry(20, 5, 100, 16);
    var geometry = new TeapotGeometry (6);
	
	for(let i=0; i<10; i++){
		for(let j=0; j<10; j++){
			let mesh = new THREE.Mesh(geometry, meshMaterial);
			mesh.position.set(-90+i*20, 10, -90+j*20);
			teapots.push(mesh);
			scene.add(mesh);
		}
	}
    
	
	window.addEventListener('resize', onWindowResize, false);
    
    //mesh.position.set (70, 0, 50);
    

}

function onWindowResize() {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
 
    if (turn) angle += 0.01;
    
    cone.position.set(80 * Math.cos(angle), 50,  80* Math.sin(angle));    
    

    teapots.forEach(function(run){
		run.material.uniforms.lightpos.value.copy (cone.position);
		run.rotation.y = 1.3 * angle;
	})
	
    requestAnimationFrame(animate);
    render();
}

function render(){
	renderer.render(scene, camera);
}

export {init, animate, scene};
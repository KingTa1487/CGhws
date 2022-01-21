import * as THREE from "https://threejs.org/build/three.module.js";
import { OrbitControls } from "https://threejs.org/examples/jsm/controls/OrbitControls.js";
import {TeapotGeometry} from "https://threejs.org/examples/jsm/geometries/TeapotGeometry.js";

var scene, renderer, camera;
var teapots=[], pointLight;
var turn = true;
var angle = 0;

init();
animate();

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
    window.addEventListener('resize', onWindowResize, false);
	
    var gridXZ = new THREE.GridHelper(200, 20, 'red', 'white');
    scene.add(gridXZ);

    pointLight = new THREE.PointLight(0xffffff);
    scene.add (pointLight);
    scene.add (new THREE.PointLightHelper(pointLight, 10));

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
    
    
    //mesh.position.set (70, 0, 50);
    //mesh.rotation.y = Math.PI/7;

}

function onWindowResize() {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
 
    angle += 0.01;
    
    pointLight.position.set(50 * Math.cos(angle), 80, 50 * Math.sin(angle));    
    teapots[0].material.uniforms.lightpos.value.copy (pointLight.position);

    teapots.forEach(function(run){
		run.rotation.y = 1.3 * angle;
	})
	
    requestAnimationFrame(animate);
    render();
}

function render(){
	renderer.render(scene, camera);
}

export {init, animate, scene};
import * as THREE from "https://threejs.org/build/three.module.js";
import { OrbitControls } from "https://threejs.org/examples/jsm/controls/OrbitControls.js";

import { Candle } from "./Candle.js";

var camera, scene, renderer;
var mouseLoc = new THREE.Vector2();
var raycaster = new THREE.Raycaster();
var pickables = [],candle = [];
var i, j;


function init() {
	renderer = new THREE.WebGLRenderer({
    antialias: true
	});
	renderer.setClearColor (0x888888);
	renderer.setSize(window.innerWidth, window.innerHeight);
	document.body.appendChild(renderer.domElement);

	scene = new THREE.Scene();
	camera = new THREE.PerspectiveCamera(50, 1, 1, 10000);
	camera.position.set(0, 100, 120);

	let controls = new OrbitControls (camera, renderer.domElement);
	document.body.appendChild(renderer.domElement);
	
	let floor = new THREE.Mesh (new THREE.PlaneGeometry (200,200,4,4), new THREE.MeshPhongMaterial());
	floor.rotation.x =  -Math.PI/2; 
	scene.add (floor);
  ////////////////////////////////////////////////////////////
  //makeFlame2();
	window.addEventListener('resize', onWindowResize, false);
  
	
	
	candle.push(new Candle(0, 0, -40, 1));     candle.push(new Candle(0, 0, 40, 2));
	candle.push(new Candle(-30, 0, -30, 3));   candle.push(new Candle(30, 0, 30, 4));
	candle.push(new Candle(-40, 0, 0, 5));     candle.push(new Candle(40, 0, 0, 6));
	candle.push(new Candle(-30, 0, 30, 7));    candle.push(new Candle(30, 0, -30, 8));
	candle.push(new Candle(0, 0, 0, 9));
 
	
  
	for(let i = 0;i<9;i++){
	  pickables.push(candle[i].candle);
	}
  
	document.addEventListener('pointerdown', doPointerDown, false);
 
}

function doPointerDown(event){
	event.preventDefault();
  
	mouseLoc.x = (event.clientX/window.innerWidth)*2-1;
	mouseLoc.y = -(event.clientY/window.innerHeight)*2+1;
  
	raycaster.setFromCamera(mouseLoc,camera);
  
	var intersects = raycaster.intersectObjects(pickables, true);
	if (intersects.length > 0) {
		for(i=1; i<10; i++){
			if(intersects[0].object.name === i){	
				
				candle[i-1].light.visible = false;
				candle[i-1].flameMesh.material.visible = false;
				
				setTimeout(lightOn, 3000);
				j=i;
			}
		}
	}
}

/*function lightOn(){
	candle[j-1].light.visible = true;
	candle[j-1].flameMesh.material.visible = true;
}

function onWindowResize() {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize(window.innerWidth, window.innerHeight);
}*/


/*function textureAnimate() {
  textureAnimate.count = (textureAnimate.count === undefined) ? 1 : textureAnimate.count;

//console.log (textureAnimate.count)
	if (this.flameMesh!== undefined) {
    this.texture = this.flameMesh.material.map;
  //console.log (`${textureAnimate.count}: [${texture.offset.x},${texture.offset.y}]`);
    this.texture.offset.x += 1/3;
 
 		if (textureAnimate.count % 3 === 0) {
    	this.texture.offset.y -= 1/3;
    }
    textureAnimate.count++;
  }
}*/

function animate() {
  
  requestAnimationFrame(animate);
  render();
  
  // billboard
  // candle.lookAt (camera.position)  // does not work
  //candle.lookAt(camera.position.x, 0, camera.position.z);
  
}

function render() {
  renderer.render(scene, camera);
}

export {init, animate, scene};
import * as THREE from "https://threejs.org/build/three.module.js";
import {scene} from './main.js';


class Candle{
	constructor(x, y, z, name){
		this.candle = new THREE.Object3D();
		this.body = new THREE.Mesh (new THREE.CylinderGeometry(5,5,40,60), new THREE.MeshPhongMaterial({color:'green'}));
		this.body.name = name;
		this.candle.add (this.body);
		this.body.position.y = 20;
    
		//flame
		var c = Math.floor(Math.random()*3);
		this.loader = new THREE.TextureLoader();
		this.texture = this.loader.load('https://i.imgur.com/M2tr5Tm.png?1');
		this.light = new THREE.PointLight(0XFFE77F, 2, 80);
    
		this.texture.wrapS = THREE.RepeatWrapping;
		this.texture.wrapT = THREE.RepeatWrapping;
		this.texture.repeat.set (1/3,1/3);
		this.texture.offset.set (0,c/3);
		let texMat = new THREE.MeshBasicMaterial({
			map: this.texture,
			alphaTest:0.5
		});
      //scene.add (flameMesh);
		this.flameMesh = new THREE.Mesh(new THREE.PlaneGeometry(30,30), texMat);
		this.candle.add (this.flameMesh);
		this.flameMesh.position.y = 48;
		this.candle.position.set(x, y, z);
		this.light.position.y = 48;
		this.light.castShadow = true;
		this.candle.add(this.light);
		scene.add (this.candle); 
      
		this.flameInterval = setInterval (this.textureAnimate.bind(this), 100);
		this.count = undefined;
	}
  
	textureAnimate() {
  		this.count = (this.count === undefined) ?Math.random()*10+1 : this.count;

		//console.log (textureAnimate.count)
		if (this.flameMesh!== undefined) {
			this.texture = this.flameMesh.material.map;
  		//console.log (`${textureAnimate.count}: [${texture.offset.x},${texture.offset.y}]`);
			this.texture.offset.x += 1/3;
 
 			if (this.count % 3 === 0) {
				this.texture.offset.y -= 1/3;
			}
    		this.count++;
		}
	}
   
	lightOn(){
		clearInterval(this.off);
		this.interval = setInterval(this.textureAnimate.bind(this), 100);
	    this.flameMesh.material.visible = true;
	    this.light.visible = true;
	}
	
	lightOff(){
		clearInterval(this.interval);
		this.off = setTimeout(this.lightOn.bind(this), 3000);
	    this.flameMesh.material.visible = false;
	    this.light.visible = false;
	}
}

export { Candle };


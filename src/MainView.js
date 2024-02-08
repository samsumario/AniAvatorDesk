import * as THREE from 'three';
import { CommentWindow } from './CommentWindow.js';
import { VrmModel } from './VrmModel.js';

const __dirname = await window.electronAPI.getDirname();

// scene
const scene = new THREE.Scene();

// renderer
const renderer = new THREE.WebGLRenderer({ alpha: true });
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.setPixelRatio( window.devicePixelRatio );
renderer.setClearColor(0x000000, 0);
document.body.appendChild( renderer.domElement );

// camera
const camera = new THREE.PerspectiveCamera( 30.0, window.innerWidth / window.innerHeight, 0.1, 20.0 );
camera.position.set( 0.0, 1.0, 5.0 ); // center of screen
//camera.position.set( -1.2, 1.5, 3.0 ); // bottom right of screen

// light for MMD
const light1 = new THREE.DirectionalLight( 0xffffff, 4 );
const light2 = new THREE.DirectionalLight( 0xffffff, 5 );
light1.position.set( 1.0, 1.0, 1.0 ).normalize();
light2.position.set( -0.5, 0.5, 1.0 ).normalize();
scene.add( light1 );
scene.add( light2 );

// set animate clock
const clock = new THREE.Clock();
clock.start();

// set fps limit
const fpsLimit = 1/24;
var frameWaitTime = 0;

/* load module */
// vrm
const vrm = new VrmModel(scene, __dirname + '/models/your.vrm');
await vrm.load();
// comment window
const cw = new CommentWindow(scene);
await cw.load();

/* main loop animation */
function animate() {
	let timeDelta = clock.getDelta();
	requestAnimationFrame( animate );

	// update vrm components
	frameWaitTime = frameWaitTime + timeDelta;
	if(frameWaitTime > fpsLimit) {
		
		vrm.update(frameWaitTime, clock.elapsedTime);
		cw.update();
		
		renderer.render( scene, camera );
		frameWaitTime = 0;
	}
}

// start animation
animate();
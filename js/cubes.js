import {OrbitControls} from '../node_modules/three/build/three';

let canvas = new CanvasHandler("body");
let controls = new THREE.OrbitControls(canvas.camera, canvas.renderer.domElement);

let bgColor = "#9cdff0"; 
let sandColor = "#f7b674";//"204,127,76"
let waterColor ="#31aaf5";

let light = new THREE.DirectionalLight(new THREE.Color("white"),0.8);
let sandMat = new THREE.MeshLambertMaterial({color:sandColor});
let waterMat = new THREE.MeshLambertMaterial({color:waterColor,transparent:true,opacity:0.3});
let geometry = new THREE.BoxGeometry(1,1,1);
let mesh = new THREE.Mesh(geometry,sandMat);
let mesh2 = new THREE.Mesh(geometry,waterMat);

mesh.add(mesh2);
mesh.castShadow = true;
mesh.receiveShadow = true;
mesh2.castShadow = true;
mesh2.receiveShadow = true;

canvas.renderer.shadowMap.enabled = true;
canvas.renderer.shadowMap.type = THREE.PCFShadowMap;

mesh2.position.z = -1.5;
mesh2.position.y = 0;

light.target = mesh;
light.castShadow = true;

light.position.z = 5;
light.position.y = 5;

canvas.scene.add(mesh);
//canvas.scene.add(mesh2); not add to scene or it become different object
canvas.scene.add(light);

light.shadow.mapSize.width = 512;  // default
light.shadow.mapSize.height = 512; // default
light.shadow.camera.near = 0.5;    // default
light.shadow.camera.far = 500;     // default

canvas.camera.position.z = 5;

canvas.renderer.setClearColor(bgColor,1);
let clock = new THREE.Clock(true);
canvas.update=()=>{
    mesh.position.y = Math.sin(clock.getElapsedTime());
    mesh2.position.y = -Math.sin(clock.getElapsedTime()+Math.PI/2);
}
canvas.renderLoop();
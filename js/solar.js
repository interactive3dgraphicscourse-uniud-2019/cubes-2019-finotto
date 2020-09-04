
import Planet from './planet.js';
let canvas = new CanvasHandler("body");
let controls = new THREE.OrbitControls(canvas.camera, canvas.renderer.domElement);

let bgColor = "#000000"; 
let sandColor = "#ffb674";//"204,127,76"
let waterColor ="#31aaf5";


let light = new THREE.DirectionalLight(new THREE.Color("white"),0.8);
let sandMat = new THREE.MeshBasicMaterial({color:sandColor});
let waterMat = new THREE.MeshLambertMaterial({color:waterColor,transparent:true,opacity:0.3});
let planet = new Planet(10,sandMat);
planet.generate();

canvas.renderer.shadowMap.enabled = true;
canvas.renderer.shadowMap.type = THREE.PCFShadowMap;


light.target = planet.planetObject;
light.castShadow = true;

light.position.z = 5;
light.position.y = 5;

canvas.scene.add(planet.planetObject);
//canvas.scene.add(mesh2); not add to scene or it become different object
canvas.scene.add(light);

light.shadow.mapSize.width = 512;  // default
light.shadow.mapSize.height = 512; // default
light.shadow.camera.near = 0.5;    // default
light.shadow.camera.far = 500;     // default

canvas.camera.position.z = 5;

canvas.renderer.setClearColor(bgColor,1);
//getHeightMap();

let clock = new THREE.Clock(true);

/**
 * Function of update of my scene
 */
canvas.update=()=>{
    // mesh.position.y = Math.sin(clock.getElapsedTime());
    // mesh2.position.y = -Math.sin(clock.getElapsedTime()+Math.PI/2);
}

canvas.renderLoop();

function getHeightMap(img,scale){
    if(!img || ! scale){
        throw new Error("missing image or scale in getHeightMap()");
    }
}
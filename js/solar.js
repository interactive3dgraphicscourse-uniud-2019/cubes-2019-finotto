
import Planet from './planet.js';
/**
 * Basic setup
 */
let canvas = new CanvasHandler("body");
let controls = new THREE.OrbitControls(canvas.camera, canvas.renderer.domElement);
/**
 * @type {THREE.Mesh} target
 */
let target;
/**
 * @type {boolean}
 */
let animate;
let gui = new dat.GUI();

// dat gui objects
let toogleAnimation = {set:()=>{animate=!animate}}
let sunSetter= {set:()=>{target = sun.planetObject}}
let mercurySetter= {set:()=>{target = mercury.planetObject}}
let venusSetter= {set:()=>{target = venus.planetObject}}
let marsSetter= {set:()=>{target = mars.planetObject}}
let earthSetter= {set:()=>{target = earth.planetObject}}
let moonSetter= {set:()=>{target = moon.planetObject}}

gui.add(toogleAnimation,"set").name("Toogle Animation");
gui.add(sunSetter,"set").name("Sun");
gui.add(mercurySetter,"set").name("Mercury");
gui.add(venusSetter,"set").name("Venus");
gui.add(marsSetter,"set").name("Mars");
gui.add(earthSetter,"set").name("Earth");
gui.add(moonSetter,"set").name("Moon");
/**
 * definitions of colors
 */
let bgColor = "#000000";
let earthColor = "#5599cc";//"#ffb674";//"204,127,76"
    let moonColor ="#cccccc";//"#31aaf5";
let marsColor="#c25119";
let venusColor="#a38e84";
let mercuryColor="#cccccc";
let sunColor="#c25119";
let sunColor2="#cc0303";

/**
 * Lights
 */
let light = new THREE.DirectionalLight(new THREE.Color("white"),0.8);

/**
 * Materials
 */
let earthMat = new THREE.MeshBasicMaterial({color:earthColor,opacity:1,transparent:false});
let moonMat = new THREE.MeshBasicMaterial({color:moonColor,transparent:true,opacity:1});
let mercuryMat = new THREE.MeshBasicMaterial({color:mercuryColor});
let venusMat = new THREE.MeshBasicMaterial({color:venusColor});
let marsMat = new THREE.MeshBasicMaterial({color:marsColor});
let sunMat = new THREE.MeshBasicMaterial({color:sunColor,transparent:false,opacity:1,wireframe:false});
let sunMat2 = new THREE.MeshBasicMaterial({color:sunColor2,transparent:false,opacity:1,wireframe:false});

/**
 * Planet creations
 */
let sun = new Planet(50,sunMat);
let mercury = new Planet(10,mercuryMat,2.5);
let venus = new Planet(13,venusMat,3);
let mars = new Planet(15,marsMat,3.5);
let earth = new Planet(16,earthMat,4);
let moon = new Planet(5,moonMat,1.5);

let heightMap = new Image();
heightMap.src="textures/world.jpg";
heightMap.onload=()=>{
    sun.generatePlanetSurface(heightMap,3,sunMat2);
    mercury.generatePlanetSurface(heightMap,2,venusMat);
    venus.generatePlanetSurface(heightMap,2,earthMat);
    mars.generatePlanetSurface(heightMap,2,venusMat);
    earth.generatePlanetSurface(heightMap,2,venusMat);
    moon.generatePlanetSurface(heightMap,2,venusMat);
}
// let heightMap2 = new Image();
// heightMap2.src="textures/height2.jpg";
// heightMap2.onload=()=>{
//     sun.generatePlanetSurface(heightMap,2,sunMat2);
//     // mercury.generatePlanetSurface(heightMap,4,venusMat);
//     // venus.generatePlanetSurface(heightMap,4,earthMat);
//     // mars.generatePlanetSurface(heightMap,4,venusMat);
//     // earth.generatePlanetSurface(heightMap,4,venusMat);
//     // moon.generatePlanetSurface(heightMap,4,venusMat);
// }



sun.generatePlanet();
mercury.generatePlanet();
venus.generatePlanet();
mars.generatePlanet();
earth.generatePlanet();
moon.generatePlanet();



sun.planetObject.position.set(0,0,0);
mercury.planetObject.position.set(0,0,1500);
venus.planetObject.position.set(0,0,2000);
mars.planetObject.position.set(0,0,3000);
earth.planetObject.position.set(0,0,4000);
moon.planetObject.position.set(0,0,500);

/**
 * planets controller for animations
 */
let mercuryController = new THREE.Object3D();
mercuryController.add(mercury.planetObject);

let venusController = new THREE.Object3D();
venusController.add(venus.planetObject);

let marsController = new THREE.Object3D();
marsController.add(mars.planetObject);

let earthController = new THREE.Object3D();
earthController.add(earth.planetObject);

/**
 * sceneGraph hierarchy
 */
earth.planetObject.add(moon.planetObject);
sun.planetObject.add(mercuryController);
sun.planetObject.add(venusController);
sun.planetObject.add(marsController);
sun.planetObject.add(earthController);


canvas.renderer.shadowMap.enabled = true;
canvas.renderer.shadowMap.type = THREE.PCFShadowMap;


// light.target = earth.planetObject;
light.castShadow = true;

light.position.z = 5;
light.position.y = 5;

canvas.scene.add(sun.planetObject);
//canvas.scene.add(mesh2); not add to scene or it become different object
canvas.scene.add(light);

light.shadow.mapSize.width = 512;  // default
light.shadow.mapSize.height = 512; // default
light.shadow.camera.near = 0.5;    // default
light.shadow.camera.far = 500;     // default

canvas.camera.position.z = 6000;

canvas.renderer.setClearColor(bgColor,1);

canvas.scene.background = new THREE.CubeTextureLoader().setPath("textures/cubemaps/")
                .load(['box.jpg','box.jpg','box.jpg','box.jpg','box.jpg','box.jpg']);

target = sun.planetObject;
let clock = new THREE.Clock(true);

/**
 * Function of update of my scene
 */
canvas.update=()=>{
    controls.target = target.getWorldPosition();

    if(animate){
        let sin = Math.sin(clock.getElapsedTime());   
        sun.planetObject.rotateY(0.005);
        mercuryController.rotateY(0.05);
        venusController.rotateY(0.01);
        marsController.rotateY(0.005);
        earthController.rotateY(0.001);
        earth.planetObject.rotateY(0.07)
    }
}

canvas.renderLoop();

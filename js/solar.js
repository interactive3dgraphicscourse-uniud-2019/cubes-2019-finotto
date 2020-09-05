
import Planet from './planet.js';
/**
 * Basic setup
 */
let canvas = new CanvasHandler("body");
let controls = new THREE.OrbitControls(canvas.camera, canvas.renderer.domElement);
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
let sun = new Planet(20,sunMat);
let mercury = new Planet(5,mercuryMat);
let venus = new Planet(6,venusMat);
let mars = new Planet(7,marsMat);
let earth = new Planet(10,earthMat);
let moon = new Planet(1,moonMat);

let heightMap = new Image();
heightMap.src="textures/world.jpg";
heightMap.onload=()=>{
    sun.generatePlanetSurface(heightMap,4,sunMat2);
    earth.generateSurface(heightMap,4,venusMat);
}

let heightMap2 = new Image();
heightMap2.src="textures/height2.jpg";
heightMap2.onload=()=>{
    sun.generateSurface(heightMap2,0.2,sunMat2);
    //earth.generateWithHeightMap(heightMap,2,moonMat);
}
sun.generatePlanet();
mercury.generatePlanet();
venus.generatePlanet();
mars.generatePlanet();
earth.generatePlanet();
moon.generatePlanet();

sun.planetObject.position.set(0,0,0);
mercury.planetObject.position.set(0,0,600);
venus.planetObject.position.set(0,0,750);
mars.planetObject.position.set(0,0,850);
earth.planetObject.position.set(0,0,1100);
moon.planetObject.position.set(0,0,100);

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

canvas.camera.position.z = 1000;

canvas.renderer.setClearColor(bgColor,1);
//getHeightMap();

let clock = new THREE.Clock(true);

/**
 * Function of update of my scene
 */
canvas.update=()=>{
    //controls.target = earth.planetObject.position;
    controls.target = sun.planetObject.position;
    let sin = Math.sin(clock.getElapsedTime());
    //sun.planetObject.scale.set(sin+1.5,sin+1.5,sin+1.5);
     //  sun.surfaceObject.scale.set(Math.sin(clock.getElapsedTime())*0.1,Math.sin(clock.getElapsedTime()),Math.sin(clock.getElapsedTime()));
     //  mercuryController.position.z = Math.sin(clock.getElapsedTime()*5)*100;
     // mesh2.position.y = -Math.sin(clock.getElapsedTime()+Math.PI/2);

     sun.planetObject.rotateY(0.005);
     sun.surfaceObject.rotateY(-0.002);
     mercuryController.rotateY(0.05);
     venusController.rotateY(0.01);
     marsController.rotateY(0.005);
     earthController.rotateY(0.001);
     earth.planetObject.rotateY(0.1)
}

canvas.renderLoop();

function getHeightMap(img,scale){
    if(!img || ! scale){
        throw new Error("missing image or scale in getHeightMap()");
    }
}
let canvas = new CanvasHandler("body");
let controls = new THREE.OrbitControls( canvas.camera, canvas.renderer.domElement );
let geo,mat,mesh;
let heightMap;


canvas.camera.position.z = 5;
loadTerrain();

canvas.update =()=>{

}
canvas.renderLoop();

function loadResources(){
    let text = new THREE.TextureLoader().load(Resources.TextureCube(),(text)=>{
        geo = new THREE.BoxGeometry(1,1,1);
        mat = new THREE.MeshBasicMaterial({map:text});
        mesh = new THREE.Mesh(geo,mat);
        canvas.scene.add(mesh);
    });
}

function loadTerrain() {
    let text = new THREE.TextureLoader().load(Resources.HeightMap(),(text)=>{
        this.heightMap = text;
        generateTerrain();
    });
}
function generateTerrain(){

}
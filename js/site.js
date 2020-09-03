let canvas = new CanvasHandler("body");
let controls = new THREE.OrbitControls(canvas.camera, canvas.renderer.domElement);
let geo, mat,matWater, mesh;
let heightMap;


canvas.camera.position.z = 5;
let light = new THREE.DirectionalLight( 0xffffff, 0.5 );
canvas.scene.add(light);
loadResources(loadTerrain);
canvas.update = () => {

}
canvas.renderLoop();

function loadResources(callBack) {
    // callback hell
    geo = new THREE.BoxGeometry(1, 1, 1);
    let albedo = new THREE.TextureLoader().load(Resources.TexturePaving(), (albedo) => {
        let normal = new THREE.TextureLoader().load(Resources.TextureNormalPaving(), (normal) => {
            let roughness = new THREE.TextureLoader().load(Resources.TextureRoughnessPaving(),(roughness)=>{
                mat = new THREE.MeshPhysicalMaterial({ map: albedo,normalMap:normal,roughnessMap:roughness,metalness:0,reflectivity:0 });
                let icealbedo = new THREE.TextureLoader().load(Resources.TextureIce(), (albedo) => {
                    let icenormal = new THREE.TextureLoader().load(Resources.TextureNormalIce(), (normal) => {
                        let iceroughness = new THREE.TextureLoader().load(Resources.TextureRoughnessIce(),(roughness)=>{
                            matWater = new THREE.MeshPhysicalMaterial({ map: albedo,normalMap:normal,roughnessMap:roughness,metalness:0,reflectivity:1 });
                            callBack();
                        });
                    });
                });
            });
        });
    });

}

function loadTerrain() {
    heightMap = new Image();
    heightMap.src = Resources.HeightMap();
    heightMap.onload = (text) => {
        this.heightMap = text;
        generateTerrain();
    };
}
function generateTerrain() {
    let img = heightMap;
    let canvas2 = document.createElement("canvas");
    canvas2.width = img.width;
    canvas2.height = img.height;
    let context = canvas2.getContext('2d');
    let imgSize = img.width * img.height;
    let data = new Float32Array(imgSize);
    context.drawImage(heightMap, 0, 0);
    console.log(context);
    let imgData = context.getImageData(0, 0, img.width, img.height);
    console.log(imgData);
    for (let i = 0, j = 0; i < imgData.data.length; i += 4) {
        let all = imgData.data[i] + imgData.data[i + 1] + imgData.data[i + 2];
        data[j++] = all;
        if( Math.floor((3 * all) % 5)>0){

            for (let y = 0; y < Math.floor((3 * all) % 5); y++) {
                let mesh = new THREE.Mesh(geo, mat);
                let x = j % img.width;
                console.log(all);
                let z = j / img.width;
                mesh.position.set(x, y, z);
                canvas.scene.add(mesh);
            }
        }else{
            for (let y = 0; y < 3; y++) {
                let mesh = new THREE.Mesh(geo, matWater);
                let x = j % img.width;
                console.log(all);
                let z = j / img.width;
                mesh.position.set(x, y, z);
                canvas.scene.add(mesh);
            }
        }
    }

}
export default class Planet {

    /**
     * 
     * @param {THREE.Material} material 
     * @param {number} size 
     */
    constructor(size,scale, material) {
        this.material = material;
        this.size = size;
        this.scale = scale;
        this.planetObject = new THREE.Object3D();
    }
    /**
     * 
     * @param {THREE.Scene} scene 
     */
    generate() {
        let mat = this.material;
        let geometry = new THREE.BoxGeometry(this.scale, this.scale, this.scale);

        for (let x = -this.size / 2; x < this.size / 2; x++) {
            for (let y = -this.size / 2; y < this.size / 2; y++) {
                for (let z = -this.size / 2; z < this.size / 2; z++) {
                    if (Math.floor(new THREE.Vector3(x, y, z).length() + (this.size * 0.8)) <= this.size && (Math.floor(new THREE.Vector3(x, y, z).length() + (this.size * 0.8)) + 1) >= this.size) {
                        let mesh = new THREE.Mesh(geometry, mat);
                        mesh.position.set(x*this.scale, y*this.scale, z*this.scale);
                        this.planetObject.add(mesh);

                    }
                    continue;
                }
            }
        }

    }
    /**
     * 
     * @param {THREE.Scene} scene 
     * @param {ImageBitmapSource} heightMap
     */
    generateWithHeightMap(heightMap,weight) {
        let mat = this.material;
        let geometry = new THREE.BoxGeometry(this.scale, this.scale, this.scale);
        let canvasContext = this.__getHeightMapData(heightMap)
        for (let x = -this.size / 2; x < this.size / 2; x++) {
            for (let y = -this.size / 2; y < this.size / 2; y++) {
                for (let z = -this.size / 2; z < this.size / 2; z++) {
                    if (Math.floor(new THREE.Vector3(x, y, z).length() + (this.size * 0.8)) <= this.size && (Math.floor(new THREE.Vector3(x, y, z).length() + (this.size * 0.8)) + 1) >= this.size) {
                        
                        // TODO fix this code
                        let u = (0.5- Math.atan2(-z/(this.size*0.5),-x/(this.size*0.5))/Math.PI/2)*heightMap.width;
                        let v = (0.5 - 2*Math.asin(-(y/(this.size*0.5)))/Math.PI/2)*heightMap.height;
                        console.log(u,v);
                        let colorChannels = canvasContext.getImageData(u,v,1,1).data;
                        let offset = ((colorChannels[0]/255)-0.5)*weight*this.scale;
                        console.log("OFFSET",offset);
                        let mesh = new THREE.Mesh(geometry, mat);
                        let direction = new THREE.Vector3((x), (y), (z)).multiplyScalar(this.scale);
                        mesh.position.set(direction.x,direction.y,direction.z);
                        this.planetObject.add(mesh);
                        for (let i = 1; i < offset; i++) {
                            mesh = new THREE.Mesh(geometry, mat);
                            direction = new THREE.Vector3((x), (y), (z)).multiplyScalar(this.scale).addScalar(i);
                            mesh.position.set(direction.x,direction.y,direction.z);
                            this.planetObject.add(mesh);
                        }
                        //mesh.position.add(new THREE.Vector3(-offset/2,-offset/2,-offset/2));
                    }
                    continue;
                }
            }
        }

    }
    /**
     * 
     * @param {ImageBitmapSource} heightMap 
     * @returns {CanvasRenderingContext2D}
     */
    __getHeightMapData(heightMap){
        let canvas = document.createElement('canvas');
        canvas.width = heightMap.width;
        canvas.height = heightMap.height;
        canvas.getContext('2d').drawImage(heightMap,0,0,heightMap.width,heightMap.height);
        return canvas.getContext('2d');
    }
}
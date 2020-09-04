export default class Planet {

    /**
     * 
     * @param {THREE.Material} material 
     * @param {number} size 
     */
    constructor(size, scale, material) {
        this.material = material;
        this.size = size;
        this.scale = scale;
        this.planetObject = new THREE.Object3D();
        this.surfaceObject = new THREE.Object3D();
        this.planetObject.add(this.surfaceObject);
    }
    /**
     * 
     * @param {THREE.Scene} scene 
     */
    generate() {
        let mat = this.material;
        let cubes = new THREE.BoxBufferGeometry();

        for (let x = -this.size / 2; x < this.size / 2; x++) {
            for (let y = -this.size / 2; y < this.size / 2; y++) {
                for (let z = -this.size / 2; z < this.size / 2; z++) {
                    if (Math.floor(new THREE.Vector3(x, y, z).length() + (this.size * 0.8)) <= this.size && (Math.floor(new THREE.Vector3(x, y, z).length() + (this.size * 0.8)) + 1) >= this.size) {
                        let geometry = new THREE.BoxBufferGeometry(this.scale, this.scale, this.scale);
                        let mesh = new THREE.Mesh(geometry, mat);
                        mesh.position.set(x * this.scale, y * this.scale, z * this.scale);
                        this.planetObject.add(mesh);
                        mesh.updateMatrix();
                        mesh.geometry.applyMatrix4(mesh.matrix);
                        cubes =THREE.BufferGeometryUtils.mergeBufferGeometries([cubes,mesh.geometry]);
                    }
                    continue;
                }
            }
        }
        this.planetObject = new THREE.Mesh(cubes,mat);

    }
    /** 
 * @param {ImageBitmapSource} heightMap;
 * @param {number} weight;
 * @param {THREE.Material} material2;
 */
    generateSurface(heightMap, weight, material2) {
       
        let canvasContext = this.__getHeightMapData(heightMap)
        /**
         * @type {THREE.Geometry}
         */
        let cubes = new THREE.BoxBufferGeometry();
        for (let x = -this.size / 2; x <= this.size / 2; x++) {
            for (let y = -this.size / 2; y <= this.size / 2; y++) {
                for (let z = -this.size / 2; z <= this.size / 2; z++) {
                    if (Math.floor(new THREE.Vector3(x, y, z).length() + (this.size * 0.8)) <= this.size && (Math.floor(new THREE.Vector3(x, y, z).length() + (this.size * 0.8)) + 1) >= this.size) {
                        let geometry = new THREE.BoxBufferGeometry(this.scale, this.scale, this.scale);
                        let u = (0.5 - Math.atan2((z * 2) / (this.size), (x * 2) / (this.size)) / Math.PI / 2) * heightMap.width;
                        let v = (0.5 - 2 * Math.asin((y * 2 / (this.size))) / Math.PI / 2) * heightMap.height;

                        let colorChannels = canvasContext.getImageData(u, v, 1, 1).data;
                        let offset = Math.floor(((colorChannels[0] / 255)) * this.scale * weight);

                        let mesh;
                        let direction;

                        for (let i = 1; i <= offset; i++) {
                            mesh = new THREE.Mesh(geometry, material2);
                            let dir = new THREE.Vector3(x, y, z).normalize();
                            dir = dir.multiplyScalar(i * this.scale);
                            direction = new THREE.Vector3((x), (y), (z)).add(dir);
                            mesh.position.set(Math.floor(direction.x), Math.floor(direction.y), Math.floor(direction.z));
                            //mesh.updateWorldMatrix();
                            mesh.updateMatrix();
                            mesh.geometry.applyMatrix4(mesh.matrix);
                            cubes =THREE.BufferGeometryUtils.mergeBufferGeometries([cubes,mesh.geometry]);
                            //cubes.mergeMesh(mesh);
                        }
                        //mesh.position.add(new THREE.Vector3(-offset/2,-offset/2,-offset/2));
                    }
                    continue;
                }
            }
        }
        this.surfaceObject = new THREE.Mesh(cubes, material2);
        this.planetObject.add(this.surfaceObject);
        // let merged = THREE.BufferGeometryUtils.mergeBufferGeometries(cubes.map(x=>x.geometry));
        // this.surfaceObject.add(merged);
    }
    /**
     * 
     * @param {ImageBitmapSource} heightMap 
     * @returns {CanvasRenderingContext2D}
     */
    __getHeightMapData(heightMap) {
        let canvas = document.createElement('canvas');
        canvas.width = heightMap.width;
        canvas.height = heightMap.height;
        canvas.getContext('2d').drawImage(heightMap, 0, 0, heightMap.width, heightMap.height);
        return canvas.getContext('2d');
    }


    //  obsolete 
    // /**  
    //  * @param {ImageBitmapSource} heightMap;
    //  * @param {number} weight;
    //  * @param {THREE.Material} material2;
    //  */
    // generateWithHeightMap(heightMap,weight,material2) {
    //     let mat = this.material;
    //     let geometry = new THREE.BoxGeometry(this.scale, this.scale, this.scale);
    //     let canvasContext = this.__getHeightMapData(heightMap)
    //     for (let x = -this.size / 2; x <= this.size / 2; x++) {
    //         for (let y = -this.size / 2; y <= this.size / 2; y++) {
    //             for (let z = -this.size / 2; z <= this.size / 2; z++) {
    //                 if (Math.floor(new THREE.Vector3(x, y, z).length() + (this.size * 0.8)) <= this.size && (Math.floor(new THREE.Vector3(x, y, z).length() + (this.size * 0.8)) + 1) >= this.size) {

    //                     // TODO fix this code
    //                     let u = (0.5- Math.atan2((z*2)/(this.size),(x*2)/(this.size))/Math.PI/2)*heightMap.width;
    //                     let v = (0.5 - 2*Math.asin((y*2/(this.size)))/Math.PI/2)*heightMap.height;

    //                     let colorChannels = canvasContext.getImageData(u,v,1,1).data;
    //                     let offset = Math.floor(((colorChannels[0]/255))*this.scale*weight);

    //                     let mesh = new THREE.Mesh(geometry, mat);
    //                     let direction = new THREE.Vector3((x), (y), (z)).multiplyScalar(this.scale);
    //                     mesh.position.set(direction.x,direction.y,direction.z);

    //                     this.planetObject.add(mesh);
    //                     for (let i = 1; i <= offset; i++) {
    //                         if(material2){
    //                             mesh = new THREE.Mesh(geometry, material2);
    //                         }else{
    //                             mesh = new THREE.Mesh(geometry, mat);
    //                         }
    //                         //let mat2 = new THREE.MeshBasicMaterial({color:"red"});
    //                         direction = new THREE.Vector3((x), (y), (z)).multiplyScalar(this.size+i);
    //                         mesh.position.set(direction.x,direction.y,direction.z);
    //                         this.planetObject.add(mesh);
    //                     }
    //                     //mesh.position.add(new THREE.Vector3(-offset/2,-offset/2,-offset/2));
    //                 }
    //                 continue;
    //             }
    //         }
    //     }

    // }
}
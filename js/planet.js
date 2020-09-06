export default class Planet {

    /**
     * 
     * @param {THREE.Material} material 
     * @param {number} diameter 
     */
    constructor(diameter, material) {
        this.material = material;
        this.diameter = diameter;
        this.boxSize = diameter / 10;
        this.planetObject = new THREE.Object3D();
        this.surfaceObject = new THREE.Object3D();
        this.planetObject.add(this.surfaceObject);
    }

    /** 
 * @param {ImageBitmapSource} heightMap;
 * @param {number} weight;
 * @param {THREE.Material} material2;
 */
    // generateSurface(heightMap, weight, material2) {

    //     let canvasContext = this.__getHeightMapDataContext(heightMap)
    //     /**
    //      * @type {THREE.Geometry}
    //      */
    //     let cubes = new THREE.BoxBufferGeometry();
    //     for (let x = -this.diameter / 2; x <= this.diameter / 2; x++) {
    //         for (let y = -this.diameter / 2; y <= this.diameter / 2; y++) {
    //             for (let z = -this.diameter / 2; z <= this.diameter / 2; z++) {
    //                 if (Math.floor(new THREE.Vector3(x, y, z).length() + (this.diameter * 0.8)) <= this.diameter && (Math.floor(new THREE.Vector3(x, y, z).length() + (this.diameter * 0.8)) + 1) >= this.diameter) {
    //                     let geometry = new THREE.BoxBufferGeometry(this.boxSize, this.boxSize, this.boxSize);
    //                     let u = (0.5 - Math.atan2((z * 2) / (this.diameter), (x * 2) / (this.diameter)) / Math.PI / 2) * heightMap.width;
    //                     let v = (0.5 - 2 * Math.asin((y * 2 / (this.diameter))) / Math.PI / 2) * heightMap.height;

    //                     let colorChannels = canvasContext.getImageData(u, v, 1, 1).data;
    //                     let offset = Math.floor(((colorChannels[0] / 255)) * this.boxSize * weight);

    //                     let mesh;
    //                     let direction;

    //                     for (let i = 1; i <= offset; i++) {
    //                         mesh = new THREE.Mesh(geometry, material2);
    //                         let dir = new THREE.Vector3(x, y, z).normalize();
    //                         dir = dir.multiplyScalar(i * this.boxSize);
    //                         direction = new THREE.Vector3((x), (y), (z)).add(dir);
    //                         mesh.position.set(Math.floor(direction.x), Math.floor(direction.y), Math.floor(direction.z));
    //                         //mesh.updateWorldMatrix();
    //                         mesh.updateMatrix();
    //                         mesh.geometry.applyMatrix4(mesh.matrix);
    //                         cubes = THREE.BufferGeometryUtils.mergeBufferGeometries([cubes, mesh.geometry]);
    //                         //cubes.mergeMesh(mesh);
    //                     }
    //                     //mesh.position.add(new THREE.Vector3(-offset/2,-offset/2,-offset/2));
    //                 }
    //                 continue;
    //             }
    //         }
    //     }
    //     this.surfaceObject = new THREE.Mesh(cubes, material2);
    //     this.planetObject.add(this.surfaceObject);
    //     // let merged = THREE.BufferGeometryUtils.mergeBufferGeometries(cubes.map(x=>x.geometry));
    //     // this.surfaceObject.add(merged);
    // }

    /**
     * new one
     */
    async generatePlanet() {
        let mat = this.material;
        let cubes;
        let tempCubes = [];
        for (let x = -this.diameter / 2; x <= this.diameter / 2; x += this.boxSize / 4) {
            for (let y = -this.diameter / 2; y <= this.diameter / 2; y += this.boxSize / 4) {
                for (let z = -this.diameter / 2; z <= this.diameter / 2; z += this.boxSize / 4) {
                    let pos = new THREE.Vector3(x, y, z);
                    if (pos.length() > (this.diameter / 2) - this.boxSize / 2 && pos.length() < (this.diameter / 2) + this.boxSize / 2) {
                        pos = this.__nearestSpawnPosition(pos, this.boxSize);
                        let newBox = this.__generateBoxAtPosition(pos, this.boxSize);
                        tempCubes.push(newBox);
                    }
                }
            }
        }
        cubes = THREE.BufferGeometryUtils.mergeBufferGeometries(tempCubes);
        this.planetObject.add(new THREE.Mesh(cubes, this.material));
    }
    /**
     * 
     * @param {ImageBitmapSource} heightMap 
     * @param {number} weight max block
     * @param {*} material material of surface block
     */
    async generatePlanetSurface(heightMap, weight, material) {
        //this.boxSize =8;
        let cubes;
        let tempCubes = [];
        let canvasContext = this.__getHeightMapDataContext(heightMap);
        for (let x = -this.diameter / 2; x <= this.diameter / 2; x += this.boxSize / 2) {
            for (let y = -this.diameter / 2; y <= this.diameter / 2; y += this.boxSize / 2) {
                for (let z = -this.diameter / 2; z <= this.diameter / 2; z += this.boxSize / 2) {
                    let pos = new THREE.Vector3(x, y, z);
                    if (pos.length() > (this.diameter / 2) - this.boxSize / 2 && pos.length() < (this.diameter / 2) + this.boxSize / 2) {

                        let uvCoord = this.__mapSphereCoordToMap(pos).multiply(new THREE.Vector2(heightMap.width, heightMap.height));
                        let colorChannels = canvasContext.getImageData(uvCoord.x, uvCoord.y, 1, 1).data;
                        let offset = Math.floor((colorChannels[0] / 255) * weight); // range 0-> weight
                        // for (let i = 1; i <= offset; i++) {
                        //     pos.setLength(((this.diameter / 2)*1) + (i*this.boxSize/4));
                        //     pos = this.__nearestSpawnPosition(pos, this.boxSize / 2);
                        //     let newBox = this.__generateBoxAtPosition(pos, this.boxSize*1.5);
                        //     //cubes = THREE.BufferGeometryUtils.mergeBufferGeometries([cubes, newBox]);
                        //     tempCubes.push(newBox);
                        // }
                        if(offset>0){
                            for (const point of this.__getFrustumCoords(pos, this.diameter / 2, (this.diameter / 2) + (offset*(this.boxSize)), 75, this.boxSize)) {
                                let newBox = this.__generateBoxAtPosition(point, this.boxSize);
                                tempCubes.push(newBox);
                                //cubes = THREE.BufferGeometryUtils.mergeBufferGeometries([cubes, newBox]);
                            }
                        }


                    }
                }
            }
        }
        cubes = THREE.BufferGeometryUtils.mergeBufferGeometries(tempCubes);
        this.surfaceObject.add(new THREE.Mesh(cubes, material));
        this.planetObject.add(this.surfaceObject);
    }

    /**
     * 
     * @param {THREE.Vector3} direction ray direction
     * @param {number} min ray min value
     * @param {number} max ray max value
     * @param {number} size blockSize
     * @param {number} fov blockSize
     * @returns {THREE.Vector3[]} 
     */
    __getFrustumCoords(direction, min, max, fov, boxSize) {
        let size = boxSize/4;
        let vDir = new THREE.Vector3(direction.x, direction.y, direction.z).normalize();
        let vMin = new THREE.Vector3(vDir.x, vDir.y, vDir.z).multiplyScalar(min);
        let vMax = vDir.multiplyScalar(max);
        let delta = (max - min) / boxSize;
        // // min splane
        // let vBTL = vMin.applyAxisAngle(new THREE.Vector3(-1, 1, 0), fov);
        // let vBTR = vMin.applyAxisAngle(new THREE.Vector3(1, 1, 0), fov);
        // let vBBR = vMin.applyAxisAngle(new THREE.Vector3(1, -1, 0), fov);
        // let vBBL = vMin.applyAxisAngle(new THREE.Vector3(-1, -1, 0), fov);
        // // max plane
        // let vFTL = vMax.applyAxisAngle(new THREE.Vector3(-1, 1, 0), fov);
        // let vFTR = vMax.applyAxisAngle(new THREE.Vector3(1, 1, 0), fov);
        // let vFBR = vMax.applyAxisAngle(new THREE.Vector3(1, -1, 0), fov);
        // let vFBL = vMax.applyAxisAngle(new THREE.Vector3(-1, -1, 0), fov);
        let row = [];
        for (let i = 1; i <= delta; i++) {
            let step = new THREE.Vector3(vMin.x, vMin.y, vMin.z).normalize();
            step = step.multiplyScalar((size) * i);
            step = vMin.add(step);
            step = this.__nearestSpawnPosition(step,boxSize);
            row.push(step);
        }
        return [...row];//,vBTL,vBTR,vBBR,vBBL,vFTL,vFTR,vFBR,vFBL
    }
    /**
     * 
     * @param {THREE.Vector3} surfacePoint direction to surface of the sphere
     * @returns {THREE.Vector2} (uv) coords on texture; 
     */
    __mapSphereCoordToMap(surfacePoint) {
        let direction = surfacePoint.normalize();
        let u = (0.5 - (Math.atan2((direction.z), (direction.x)) / (Math.PI * 2)));
        let v = (0.5 - 2 * Math.asin((direction.y)) / (Math.PI * 2));
        return new THREE.Vector2(u, v);
    }
    /**
     * 
     * @param {THREE.Vector3} position 
     * @param {number} size 
     * @returns {THREE.Vector3} nearest spawn position
     */
    __nearestSpawnPosition(position, boxSize) {
        let size = boxSize/4;
        let posX = (Math.floor(position.x / size)) * size + (0.5 * size);
        let posY = (Math.floor(position.y / size)) * size + (0.5 * size);
        let posZ = (Math.floor(position.z / size)) * size + (0.5 * size);
        return new THREE.Vector3(posX, posY, posZ);
    }


    /**
     * 
     * @param {THREE.Vector3} position 
     * @param {number} boxSize 
     * @returns {THREE.BufferGeometry}
     */
    __generateBoxAtPosition(position, boxSize) {
        let box = new THREE.BoxBufferGeometry(boxSize, boxSize, boxSize);
        let mesh = new THREE.Mesh(box);

        mesh.scale.set(boxSize, boxSize, boxSize);
        mesh.translateOnAxis(position, position.length());

        mesh.updateMatrix();
        mesh.geometry.applyMatrix4(mesh.matrix);

        return mesh.geometry;
    }
    /**
     * 
     * @param {ImageBitmapSource} heightMap 
     * @returns {CanvasRenderingContext2D}
     */
    __getHeightMapDataContext(heightMap) {
        let canvas = document.createElement('canvas');
        canvas.width = heightMap.width;
        canvas.height = heightMap.height;
        canvas.getContext('2d').drawImage(heightMap, 0, 0, heightMap.width, heightMap.height);
        return canvas.getContext('2d');
    }

    // /**
    //  * 
    //  * @param {THREE.Scene} scene 
    //  */
    // generate() {
    //     let mat = this.material;
    //     let cubes = new THREE.BoxBufferGeometry();

    //     for (let x = -this.diameter / 2; x < this.diameter / 2; x++) {
    //         for (let y = -this.diameter / 2; y < this.diameter / 2; y++) {
    //             for (let z = -this.diameter / 2; z < this.diameter / 2; z++) {
    //                 if (Math.floor(new THREE.Vector3(x, y, z).length() + (this.diameter * 0.8)) <= this.diameter && (Math.floor(new THREE.Vector3(x, y, z).length() + (this.diameter * 0.8)) + 1) >= this.diameter) {
    //                     let geometry = new THREE.BoxBufferGeometry(this.boxSize, this.boxSize, this.boxSize);
    //                     let mesh = new THREE.Mesh(geometry, mat);
    //                     mesh.position.set(x * this.boxSize, y * this.boxSize, z * this.boxSize);
    //                     this.planetObject.add(mesh);
    //                     mesh.updateMatrix();
    //                     mesh.geometry.applyMatrix4(mesh.matrix);
    //                     cubes =THREE.BufferGeometryUtils.mergeBufferGeometries([cubes,mesh.geometry]);
    //                 }
    //                 continue;
    //             }
    //         }
    //     }
    //     this.planetObject = new THREE.Mesh(cubes,mat);

    // }
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
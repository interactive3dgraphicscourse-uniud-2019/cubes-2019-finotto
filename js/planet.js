export default class Planet {

    /**
     * 
     * @param {THREE.Material} material 
     * @param {number} diameter 
     */
    constructor(diameter, material,boxSize,surfaceMaterial) {
        this.material = material;
        this.diameter = diameter;
        this.surfaceMaterial=surfaceMaterial;
        this.heightMap;
        if(boxSize){
            this.boxSize = boxSize;
        }else{
            this.boxSize = diameter / 10;
        }
        this.planetObject = new THREE.Object3D();
        this.surfaceObject = new THREE.Object3D();
        this.planetObject.add(this.surfaceObject);
    }

    async generatePlanet() {
        let mat = this.material;
        let cubes;
        let tempCubes = [];
        for (let x = -this.diameter / 2; x <= this.diameter / 2; x += this.boxSize/2 ) {
            for (let y = -this.diameter / 2; y <= this.diameter / 2; y += this.boxSize/2 ) {
                for (let z = -this.diameter / 2; z <= this.diameter / 2; z += this.boxSize/2 ) {
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
                        if(offset>3){
                            console.log("BRAKKEPOINT");
                        }
                        
                        if(offset>0){
                            for (const point of this.__getRangeCoords(pos, this.diameter / 2, (this.diameter / 2) + (offset*(this.boxSize/2)), 75, this.boxSize)) {
                                let newBox = this.__generateBoxAtPosition(point, this.boxSize);
                                tempCubes.push(newBox);

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
    __getRangeCoords(direction, min, max, fov, boxSize) {
        let size = boxSize/2;
        let vDir = new THREE.Vector3(direction.x, direction.y, direction.z).normalize();
        let vMin = new THREE.Vector3(vDir.x, vDir.y, vDir.z).multiplyScalar(min);
        let vMax = vDir.multiplyScalar(max);

        let delta = (max - min) / size;

        let row = [];
        for (let i = 0; i <= delta; i++) {
            let step = new THREE.Vector3(vMin.x, vMin.y, vMin.z).normalize();
            step = step.multiplyScalar((size));
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
        let box = new THREE.BoxBufferGeometry(boxSize,boxSize,boxSize);
        let mesh = new THREE.Mesh(box);

        mesh.scale.set(boxSize, boxSize, boxSize);
        mesh.translateOnAxis(position, position.length());
        mesh.geometry.scale(boxSize,boxSize,boxSize)
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

}
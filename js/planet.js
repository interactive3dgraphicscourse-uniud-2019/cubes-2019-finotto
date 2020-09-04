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
    generate(scene) {
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
}

export default class Planet{

    /**
     * 
     * @param {THREE.Material} material 
     * @param {number} size 
     */
    constructor(size,material){
        this.material = material;
        this.size = size;
        this.planetObject = new THREE.Object3D();
    }
    /**
     * 
     * @param {THREE.Scene} scene 
     */
    generate(scene){
        let mat = this.material;
        let geometry = new THREE.BoxGeometry(1,1,1);

        for(let x=-this.size/2;x<this.size/2;x++){
            for (let y=-this.size/2;y<this.size/2; y++) {
                for (let z=-this.size/2;z<this.size/2; z++) {
                    if(new THREE.Vector3(x,y,z).length()+(this.size/2)>this.size)
                        continue;
                    let mesh = new THREE.Mesh(geometry,mat);
                    mesh.position.x=x-(this.size/2);
                    mesh.position.y=y-(this.size/2);
                    mesh.position.z=z-(this.size/2);
                    this.planetObject.add(mesh);
                }                
            }
        }

    }
}
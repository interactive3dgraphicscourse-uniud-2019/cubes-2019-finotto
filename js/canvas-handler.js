
class CanvasHandler{
    /**
     * @type {Scene}
     */
    scene;
    /**
     * @type {Camera}
     */
    camera;
    /**
     * @type {WebGLRenderer}
     */
    renderer;
    /**
     * @type {HTMLElement}
     */
    canvasElement;
    /**
     * @type {()=>void} update function
     */
    update;
    /**
     * 
     * @param {string} selector id of element to use as canvas 
     */
    constructor(selector){
        this.setup(selector);
        window.addEventListener('resize',this.resize,false);
    }
    /**
     * 
     * @param {string} elementId 
     */
    setup(elementId){
        if(this.bindCanvasElement(elementId)){
            this.createScene();
            this.createCamera();
            this.createRenderer();
            this.canvasElement.appendChild(this.renderer.domElement);
        }else{
            console.log("error");
        }
    }
    bindCanvasElement(elementId){
        if(elementId){
            this.canvasElement = document.querySelector(elementId);
            if(!this.canvasElement){
                return false;
            }
            return true;
        }
        return false;
    }
    createScene(){
        this.scene = new THREE.Scene();
    }
    createCamera(){
        let aspect = (this.canvasElement.clientWidth/this.canvasElement.clientHeight);
        this.camera = new THREE.PerspectiveCamera(75,aspect,0.1,10000);
    }
    createRenderer(){
        this.renderer = new THREE.WebGLRenderer({antialias:true});

        (this.renderer).setSize((this.canvasElement).clientWidth,(this.canvasElement).clientHeight)
    }
    renderLoop(){
        requestAnimationFrame(this.renderLoop.bind(this));
        if(this.update){ this.update();}
        this.renderer.render(this.scene,this.camera);
    }
    resize(){
        // TODO Resize function
    }
}
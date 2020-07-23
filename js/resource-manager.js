class ResourceManager{
    /**
     * Load Resource File Async and return the respose 
     * @param {string} url 
     * Called if the resource is load succesfully
     * @param {(XMLHttpRequest)=>void} onResult 
     */
    static loadResource(url,onResult){
        let http = new XMLHttpRequest();
        http.onreadystatechange = ()=>{
            if(http.readyState ==4 && http.status == "200"){
                onResult(http);
            }
        }
        http.open("GET",url,true,true);
        http.send();
    }
}

class router {
    constructor() {
        this.routes = {};
    }

    /**
     * path -> foo 
     *              -> bar 
     *              -> testbaz
     *              -> 
     * @param {*} method 
     * @param {*} path 
     * @param {*} fn 
     */
    add(method, path, fn) {
        if (!this.routes[method]) {
            this.routes[method] = {};
        } 
    
        if (this.routes[method][path]) {
            this.routes[method][path]["handler"] = fn;
        } else {
            this.routes[method][path] = {
                "handler": fn
            };
        }
    }

    resolve(method, path) {
        let handler;

        if (this.routes[method]){
            if (this.routes[method][path]) {// exact match
                handler = this.routes[method][path]["handler"];
            }
        }

        return handler;
    }
}

module.exports = router;
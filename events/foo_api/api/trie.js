const node = require("./node.js");

class Trie {

    constructor() {
        this.root = new node();
    }

    insert(nodes) {
        if (nodes) {
            
        }
    }

    error(error) {
        if (this.cb) {
            if (error) {
                return this.cb(error);
            }
        }
    }
}

module.exports = Trie;
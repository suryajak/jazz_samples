class Node {
    constructor(val) {
        this.val = val;
        this.complete = false;
        this.nodes = {};
    }

    add(node) {
        if (node) {
            if (this.nodes)
            this.nodes.push(node);
        }
    }

    getValue() {
        return this.val;
    }

    getNodes() {
        return this.nodes;
    }
}

module.exports = Node;
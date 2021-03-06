function Node(data, priority) {
    this.data = data;
    this.priority = priority;
}

Node.prototype.toString = function() {
    return this.priority;
};

// takes an array of objects with {data, priority}
function PriorityQueue(arr) {
    this.heap = [];
    if (arr) {
        for (var i = 0; i < arr.length; i++) {
            this.push(arr[i].data, arr[i].priority);
        }
    }
}

PriorityQueue.prototype = {

    size: function() {
        return this.heap.length;
    },

    push: function(data, priority) {
        var node = new Node(data, priority);
        for (var i = 0; i < this.heap.length; i++) {
            if (node.priority > this.heap[i].priority) {
                this.heap.splice(i, 0, node);
                return;
            }
        }
        this.heap.push(node);
    },

    // removes and returns the data of highest priority
    pop: function() {
        var topVal = this.heap.shift().data;
        return topVal;
    },
    
    // bubbles node i up the binary tree based on
    // priority until heap conditions are restored
    bubble: function(i) {
        while (i > 1) { 
            var parentIndex = i >> 1; // <=> floor(i/2)
            
            // if equal, no bubble (maintains insertion order)
            if (!this.isHigherPriority(i, parentIndex)) break;
            
            this.swap(i, parentIndex);
            i = parentIndex;
    }   },
        
    // does the opposite of the bubble() function
    sink: function(i) {
        while (i*2 < this.heap.length) {
            // if equal, left bubbles (maintains insertion order)
            var leftHigher = !this.isHigherPriority(i*2 +1, i*2);
            var childIndex = leftHigher? i*2 : i*2 +1;
            
            // if equal, sink happens (maintains insertion order)
            if (this.isHigherPriority(i,childIndex)) break;
            
            this.swap(i, childIndex);
            i = childIndex;
    }   },
        
    // swaps the addresses of 2 nodes
    swap: function(i,j) {
        var temp = this.heap[i];
        this.heap[i] = this.heap[j];
        this.heap[j] = temp;
    },
        
    // returns true if node i is higher priority than j
    isHigherPriority: function(i,j) {
        if(!this.heap[i] || !this.heap[j]) return false;
        return this.heap[i].priority < this.heap[j].priority;
    }
}
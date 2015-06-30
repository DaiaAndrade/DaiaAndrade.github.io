/*
 * models.js
 * Rich Simpson
 * August 19, 2014
 *
 * This code implements a simulation of search algorithms
 * for integration with Smart Sparrow.  
 *
 * This is our data model - The M in MVC
 */

/*
 * This is the main search model, which the controller will 
 * interact with.
 */
function SearchModel() {
		// set initial values for model variables
		this.initValues();
        // graph data structure
        this.graph = new GraphModel();
		// Initialize the state space graph
		this.initializeGraph();
} // SearchModel


/*
 * This function is used to provide initial values
 * for search model variables
 */
SearchModel.prototype.initValues = function() {
	// ID of node in graph where search starts
	this.startNode = 'A';
	// ID of node in graph where search ends
	this.endNode = 'I';
	// depth limit for iterative deepening search
	this.depthLimit = 50;
}

/*
 * This function is used to "reset" the search model
 */
SearchModel.prototype.reset = function() {
		// set initial values for model variables
		this.initValues();
        // graph data structure
        this.graph.reset();
        // Initialize the state space graph
		this.initializeGraph();
}


/*
 * This function is used to start a search over without
 * changing the graph in the search model. This is important
 * for depth-first search with iterative deepening
 */
SearchModel.prototype.restart = function() {
		// set initial values for model variables
		this.initValues();
        // reset the tree data structure
}


SearchModel.prototype.initializeGraph = function() {
	// This as a quick, cheap way to store initial values
	// for the nodes in the graph. I'm using an object as
	//  a dictionary with nodeID:heuristic pairs.
	var nodeList = {A:7, B:6, C:5, D:4, 
					E:6, F:5, G:4, H:3,
					I:5};

	// Add some nodes to the state space graph
	// loop over all of the nodes in the node list
	for (var nodeID in nodeList) {
		// add the node and its heuristic value to the graph
		this.addNodeToGraph(nodeID, nodeList[nodeID]);
	}	
	// This as a quick, cheap way to store initial values
	// for the edges in the graph. I'm using an object as a dictionary
	// of dictionaries with startNodeID:{edge} pairs, where each
	// {edge} consists of endNodeID:cost pairs
	var edgeList = {
		A:{B:-1, E:-1, F:-1},
		B:{A:-1, C:-1, E:-1, F:-1, G:-1},
		C:{B:-1, D:-1, F:-1, G:-1, H:-1},
		D:{C:-1, G:-1, H:-1},
		E:{A:-1, B:-1, F:-1, I:-1},
		F:{A:-1, B:-1, C:-1, E:-1, G:-1, I:-1},
		G:{B:-1, C:-1, D:-1, F:-1, H:-1},
		H:{C:-1, D:-1, G:-1},
		I:{E:-1, F:-1},
	};
	// loop over all of the start nodes
	for (var startNodeID in edgeList) {
		// loop over all of the nodes the start node connects to
		for (var endNodeID in edgeList[startNodeID]) {
			// we only want to add some of the possible edges
			// pick a random number
			var randNum = Math.floor(Math.random() * 100) + 1;
			// we want about 33% of edges
			if (randNum <= 33) {
				// pick a random cost for the edge
				var randCost = Math.floor(Math.random() * 10) + 1;
				// add the edge and its cost to the graph model
				this.addEdgeToGraph(startNodeID, endNodeID, randCost);
				// if this is an undirected graph, then add an edge in the other direction
				/*if (! this.directedGraph) {
					// add the "opposite" edge and its cost to the graph model
					this.addEdgeToGraph(endNodeID, startNodeID, edgeList[startNodeID][endNodeID]);
				}*/
			}
		}
	}	
}


/*
 * GraphNode represents the nodes within the state space graph.
 * A graph node has a unique ID. Depending on the search
 * algorithm being used, it may or may not have a heuristic
 * value indicating the node's distance from the goal node,
 * where a larger value indicates greater distance from the 
 * goal. The node also has an array for keeping track of all
 * the times it appears in the search tree.
 */
function GraphNode() {
	// Node ID - unique for each node in graph
	this.nodeID = '';
	// Heuristic (h) value - Distance from node to goal
	this.heuristic = 0;
	// Array of corresponding nodes in tree
	this.treeNodeIDs = [];
} // GraphNode


/*
 * GraphEdge represents the edges/arcs between nodes in the
 * graph. A graph edge has a start node, an end node and a
 * cost, which may or may not be considered by the search
 * algorithm. For an undirected edge, you can either treat
 * a single edge as undirected or create two separate edges.
 */
function GraphEdge() {
	// start node
	this.fromNodeID = '';
	// end node
	this.toNodeID = '';
	// cost of edge (g value)
	this.cost = 0;
} // GraphEdge


/*
 * The GraphModel consists of an array of nodes and an array
 * of edges.
 */
function GraphModel() {
	// array of nodes - starts off empty
	this.nodes = [];
	// array of edges - starts off empty
	this.edges = [];
	// the graph is undirected
	this.directedGraph = false;
} // GraphModel



GraphModel.prototype.reset = function() {
	// array of nodes - starts off empty
	emptyOutArray(this.nodes);
	// array of edges - starts off empty
	emptyOutArray(this.edges);
}


/*
 * This function returns the index of a tree node based on its ID
 */
GraphModel.prototype.findNode = function(nodeID) {
	// loop through nodes in tree
	for	(var index = 0; index < this.nodes.length; index++) {
		// check whether the current nodeID is the target nodeID
	    if (this.nodes[index].nodeID == nodeID)
	    	// return the index of the target nodeID within the 
	    	// node array
	    	return index;
	}
	// return -1 to indicate that the nodeID wasn't found
	return -1;
}


/*
 * This function returns the index of an edge based on its 
 * fromNodeID and toNodeID
 */
GraphModel.prototype.findEdge = function(fromNodeID, toNodeID) {
	// loop through edges in tree
	for	(var index = 0; index < this.edges.length; index++) {
		// check whether the current nodeID is the target nodeID
	    if (this.edges[index].fromNodeID == fromNodeID && 
	    	this.edges[index].toNodeID == toNodeID)
	    	// return the index of the target nodeID within the 
	    	// node array
	    	return index;
	}
	// return -1 to indicate that the nodeID wasn't found
	return -1;
}


/*
 * This function returns the cost of an edge based on its 
 * fromNodeID and toNodeID
 */
GraphModel.prototype.findEdgeCost = function(fromNodeID, toNodeID) {
	// loop through edges in tree
	for	(var index = 0; index < this.edges.length; index++) {
		// check whether the current nodeID is the target nodeID
	    if (this.edges[index].fromNodeID == fromNodeID && 
	    	this.edges[index].toNodeID == toNodeID)
	    	// return the index of the target nodeID within the 
	    	// node array
	    	return this.edges[index].cost;
	}
	// return -1 to indicate that the nodeID wasn't found
	return -1;
}


/*
 * This function is used to add a node to the nodes array
 */
SearchModel.prototype.addNodeToGraph = function(nodeID, heuristic) {
	// is the heuristic less than zero?
	if (heuristic < 0) return;
	// does the node already exist?
	if (this.graph.findNode(nodeID) >= 0) return;
	// Create a GraphNode object
	var newGraphNode = new GraphNode();
	// Initialize object values
	newGraphNode.nodeID = nodeID;
	newGraphNode.heuristic = heuristic;	
	// Add GraphNode object to array of nodes
	this.graph.nodes[this.graph.nodes.length] = newGraphNode;
}


/*
 * This function is used to add an edge to the edges array
 */
SearchModel.prototype.addEdgeToGraph = function(fromNodeID, toNodeID, cost) {
	// are the from and to nodes the same?
	if (fromNodeID == toNodeID) return;
	// Is cost > 0?
	if (cost < 0) return;
	// does the from node already exist?
	if (this.graph.findNode(fromNodeID) < 0) return;
	// does the to node already exist?
	if (this.graph.findNode(toNodeID) < 0) return;
	// does the edge already exist?
	if (this.graph.findEdge(fromNodeID, toNodeID) >= 0) return;

	// Create a GraphEdge object
	var newGraphEdge = new GraphEdge();
	// initialize values
	newGraphEdge.fromNodeID = fromNodeID;
	newGraphEdge.toNodeID = toNodeID;
	newGraphEdge.cost = cost;
	// Add GraphEdge object to array of edges
	this.graph.edges[this.graph.edges.length] = newGraphEdge;
}


/*
 * This function dumps the contents of the node array in no particular
 * order.
 */
GraphModel.prototype.dumpGraph = function() {
	// loop through the nodes array
	for	(var index = 0; index < this.nodes.length; index++) {
		// print out ID of each node
		console.log("Index: " + index + " ID: " + this.nodes[index].nodeID);
	}
	// loop through the edges array
	for	(var index = 0; index < this.edges.length; index++) {
		// print out details about each edge
		console.log("Index: " + index + " fromID: " + this.edges[index].fromNodeID 
						+ " toID: " + this.edges[index].toNodeID);

	}
}


/*
 * This function returns a list of all the nodes in the graph.
 */
GraphModel.prototype.nodeList = function() {
// 	console.log("-----Node List-----");
	// create empty array to store list
	var nodeList = [];
	// loop through the nodes array
	for	(var index = 0; index < this.nodes.length; index++) {
		// add nodeID to path
		nodeList[nodeList.length] = this.nodes[index].nodeID;
	}
	// return list of nodes
	return nodeList;
}

function ContextRetriever(context){
	this.context = context;
}

ContextRetriever.prototype.retrieveData = function(){
	this.nodeAmount = this.context.searchModel.graph.nodes.length;
	this.edgeAmount = this.context.searchModel.graph.edges.length;
	//console.log(this.nodeAmount,this.edgeAmount);
}
ContextRetriever.prototype.putData = function(){
	document.getElementById('nodes').innerHTML = this.nodeAmount;
	document.getElementById('edges').innerHTML = this.edgeAmount;
}

ContextRetriever.prototype.setContext = function(){
	this.retrieveData();
	//this.putData();
}

ContextRetriever.prototype.getNodes = function(){
	return this.nodeAmount;
}

ContextRetriever.prototype.getEdges = function(){
	return this.edgeAmount;
}
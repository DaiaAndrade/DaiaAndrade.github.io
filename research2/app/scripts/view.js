/*
 * main.js
 * Rich Simpson
 * August 19, 2014
 *
 * This code implements a simulation of search algorithms
 * for integration with Smart Sparrow.  
 *
 * This is our view - The V in MVC
 */

function SearchView() {
	this.setupGraphView();
}

/*
 * Create the graph view. The graph is drawn on a canvas.
 * Each node is represented as a circle. The graph is 
 * precomputed, so I create an array
 * of objects to keep track of which nodes have been
 * "discovered" by the search algorithm.
 */
SearchView.prototype.setupGraphView = function() { 
	// handle for graph canvas
	this.graphCanvas = document.getElementById('graphCanvas');	
	// handle for graph canvas context
	this.graphContext = this.graphCanvas.getContext('2d');
	// erase the canvas
	this.graphContext.clearRect(0, 0, this.graphCanvas.width, this.graphCanvas.height);
	// set canvas to 1/3 width of window
	this.graphContext.canvas.width  = (window.innerWidth / 3) - 10;
	// set radius for each node
	this.graphNodeRadius = 20;
	// create an object filled with node objects. each 
	// object stores:
	// - the x and y position of the node within the canvas, 
	// - the id of the node
	this.graphNodes = {
		A:{x:100, y:50, id:'A'},
		B:{x:175, y:50, id:'B'},
		C:{x:250, y:50, id:'C'},
		D:{x:325, y:50, id:'D'},
		E:{x:100, y:125, id:'E'},
		F:{x:175, y:125, id:'F'},
		G:{x:250, y:125, id:'G'},
		H:{x:325, y:125, id:'H'},
		I:{x:100, y:200, id:'I'},
	};
}


SearchView.prototype.drawGraph = function(nodeList) { 
	// erase the canvas
	this.graphContext.clearRect(0, 0, this.graphCanvas.width, this.graphCanvas.height);
	this.graphContext.canvas.width  = (window.innerWidth / 3) - 10;
	// draw all the nodes that have been "discovered"
	this.drawNodes(nodeList);
	// draw the edges between the discovered nodes
	this.drawEdges(nodeList);
}

SearchView.prototype.drawEdges = function(nodeList) { 
	// make sure we have a canvas and a context
	if (this.graphCanvas.getContext) {
		// loop through the node list and find all the edges that
		// should be visible
		for (var startIndex = 0; startIndex < nodeList.length; startIndex++) {
			var startNodeID = nodeList[startIndex];
			for (var endIndex = 0; endIndex < nodeList.length; endIndex++) {
				var endNodeID = nodeList[endIndex];
				// is the node supposed to be drawn?
				if (searchController.searchModel.graph.findEdge(startNodeID, endNodeID) >= 0) {
					this.drawEdge(startNodeID, endNodeID);
				} // if we're supposed to draw this edge
			} // all nodes are the endNode
		} // all nodes are the startNode
	} // if we have a context
}


SearchView.prototype.drawEdge = function(startNode, endNode) { 
	// get the cost of the edge
	var edgeCost = searchController.searchModel.graph.findEdgeCost(startNode, endNode);
	// if the cost is -1 then we don't need to draw it, so we're done
	if (edgeCost == -1) return;
	// make sure we have a canvas to draw in
	if (this.graphCanvas.getContext) {
		// start the drawing path
		this.graphContext.beginPath();
		// all the edges are drawn in black
 		this.graphContext.strokeStyle = "black";
		// get starting x,y coordinates
		var startX = this.graphNodes[startNode].x;
		var startY = this.graphNodes[startNode].y;
		// get ending x,y coordinates
		var endX = this.graphNodes[endNode].x;
		var endY = this.graphNodes[endNode].y;
// 		console.log('-----');
// 		console.log('sN: ' + startNode + ' eN: ' + endNode);
// 		console.log('sX: ' + startX + ' sY: ' + startY +
// 					'eX: ' + endX + ' eY: ' + endY);
		// adjust x coordinate of start and end points to 
		// begin drawing at edge of nodes
		// if the start node is to the left of the end node
		if (startX < endX) {
			startX += this.graphNodeRadius;
			endX -= this.graphNodeRadius;
		// if the start node is to the right of the end node
		} else if (startX > endX) {
			startX -= this.graphNodeRadius;
			endX += this.graphNodeRadius;			
		}
		// adjust y coordinate of start and end points to 
		// begin drawing at edge of nodes
		// if the start node is above the end node
		if (startY < endY) {
			startY += this.graphNodeRadius;
			endY -= this.graphNodeRadius;
		// if the start node is below the end node
		} else if (startY > endY) {
			startY -= this.graphNodeRadius;
			endY += this.graphNodeRadius;			
		}
// 		console.log('sX: ' + startX + ' sY: ' + startY +
// 					'eX: ' + endX + ' eY: ' + endY);
// 		console.log('-----');
		// move to the start of the line
		this.graphContext.moveTo(startX, startY);
		// draw the line
		this.graphContext.lineTo(endX, endY);
		// close the drawing path
		this.graphContext.closePath();
		// fill in the line on the canvas
		this.graphContext.stroke();
		// if we are using an algorithm that doesn't consider cost, add costs to the graph
		if (searchController.searchAlg == "UCS" || 
				searchController.searchAlg == "ASTAR" ||
				searchController.searchAlg == "ASTARGRAPH") {
			// set the font for the cost
			this.graphContext.textAlign = "center";
			this.graphContext.textBaseline = "bottom";
			this.graphContext.fillStyle = "red";
			this.graphContext.font = "12pt Helvetica";
			// get mid-point x,y coordinates
			var midX = Math.floor((startX + endX) / 2);
			var midY = Math.floor((startY + endY) / 2);
			// create a string for the cost value
			var costString = "g=" + edgeCost;
			// draw the cost string
			this.graphContext.fillText(costString, midX, midY);
		}
	} // if we have a context
}


SearchView.prototype.drawNodes = function(nodeList) { 
	// make sure we have a canvas and a context
	if (this.graphCanvas.getContext) {
		// loop through the array and draw all the nodes that
		// should be visible
		for (nodeID in this.graphNodes) {
			// is the node supposed to be drawn?
			if (nodeInList(nodeID, nodeList)) {
				this.drawNode(nodeID);
			} // if we're supposed to draw this node
		} // loop over all nodes in object
	} // if we have a context
}


SearchView.prototype.drawNode = function(nodeID) { 
	// start the drawing path
	this.graphContext.beginPath();
	// if this is the start node or end node, draw it in red
	if (nodeID == searchController.searchModel.startNode ||
		nodeID == searchController.searchModel.endNode) {
 		this.graphContext.strokeStyle = "red";
 	// otherwise, draw it in black
	} else {
 		this.graphContext.strokeStyle = "black";
 	}
	// move the pen to the starting point of the node
	// if I don't do this I get lines between each circle I draw
	// I have to offset the x value because x is in the center of the circle
	this.graphContext.moveTo(this.graphNodes[nodeID].x + this.graphNodeRadius, 
							this.graphNodes[nodeID].y);
	// draw the node
	this.graphContext.arc(	this.graphNodes[nodeID].x,	// x
							this.graphNodes[nodeID].y, 	// y
							this.graphNodeRadius, 		// radius
							0, 							// start angle
							Math.PI * 2, 				// end angle
							true);						// clockwise
 	// draw the node on the canvas
	this.graphContext.stroke();
	// set the font for the node ID
	this.graphContext.textAlign = "center";
	this.graphContext.textBaseline = "bottom";
	this.graphContext.fillStyle = "black";
	this.graphContext.font = "12pt Helvetica";
	// draw the node ID
	this.graphContext.fillText(nodeID, this.graphNodes[nodeID].x, this.graphNodes[nodeID].y);
	// set the font for the node's heuristic value
	this.graphContext.textAlign = "center";
	this.graphContext.textBaseline = "top";
	this.graphContext.fillStyle = "black";
	this.graphContext.font = "10pt Helvetica";
	// get the index to the node list in the model
	graphNodeIndex = searchController.searchModel.graph.findNode(nodeID);
	// create a string for the heuristic value
	var hString = "h=" + searchController.searchModel.graph.nodes[graphNodeIndex].heuristic;
	// draw the heuristic string
	this.graphContext.fillText(hString, this.graphNodes[nodeID].x, this.graphNodes[nodeID].y);
}
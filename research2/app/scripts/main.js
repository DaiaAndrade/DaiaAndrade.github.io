/*
 * main.js
 * Rich Simpson
 * August 19, 2014
 *
 * This code implements a simulation of search algorithms
 * for integration with Smart Sparrow.  
 *
 * This is our controller - The C in MVC
 */


/*
 * Check whether the given NodeID is in the nodeList
 * I use this to determine whether or not I should draw 
 * a given node.
 */
function nodeInList(node, nodeList) { 
	// loop through the node list
	for (index = 0; index < nodeList.length; index++) {
		// do we have a match?
		if (node == nodeList[index]) return true;
	}
	// we didn't find it, so return false
	return false;
}


/*
 * I use this function to empty out all of the arrays that
 * I use in this program.
 */
function emptyOutArray(myArray) {
	myArray.length = 0;
}


/*
 * This function returns true if it is passed an array and false
 * otherwise. I found it here:
 * http://www.w3schools.com/js/js_arrays.asp
 */
function isArray(myArray) {
    return myArray.constructor.toString().indexOf("Array") > -1;
}
 

function arrayToString(myArray) {
	var arrayStr = " ";
	// loop through all items in the array
	for	(index = 0; index < myArray.length; index++) {
		// add each nodeID in the fringe to our string
		arrayStr += myArray[index] + " ";
	}
	// return the string when we're done
// 	console.log(arrayStr);
	return arrayStr;
}


/*
 * This is the controller for the search simulations.
 */
function SearchController() {
	// Create the data model
	this.searchModel = new SearchModel();
	// Create the view
	this.searchView = new SearchView();
	// This counter is used to create unique IDs for each node\
	// in the search tree
}


SearchController.prototype.drawGraph = function() {
	// get the list of nodes from the model
	nodeList = this.searchModel.graph.nodeList(); //error corrected from Rich's code
	// tell the view to draw the nodes
	this.searchView.drawGraph(nodeList);
}
var simModel = new pipit.CapiAdapter.CapiModel({
	answer: false
});


pipit.CapiAdapter.expose('answer', simModel);
pipit.Controller.notifyOnReady();

var searchController = new SearchController();
var context = new ContextRetriever(searchController);
searchController.drawGraph();
context.setContext();


questions = function() {
	var nodes = context.getNodes();
	var edges = context.getEdges();
	var answer1 = document.getElementById("question1").value;  
	var answer2 = document.getElementById("question2").value;
	var correct = 0;
	if (nodes == answer1) {
		correct += 1;
		document.getElementById('correct1').innerHTML = "Question 1 is right";
	}
	else{
		document.getElementById('correct1').innerHTML = "Question 1 is wrong";
	}

	if (edges == answer2) {
		correct += 1;
		document.getElementById('correct2').innerHTML = "Question 2 is right";
	}
	else{
		document.getElementById('correct2').innerHTML = "Question 2 is wrong";
	}
	if (correct == 2) {
		simModel.set('answer', true);
		pipit.CapiAdapter.expose('answer', simModel);
		pipit.Controller.notifyOnReady();	
	};
	return true;
	/*var answered = answered + 1;
	if (answered == questionsAmount){
		simModel.set('answer', true);
		pipit.CapiAdapter.expose('answer', simModel);

	}
	pipit.Controller.notifyOnReady();	
	return true;*/
}
/*simModel.set('answer', true),
pipit.CapiAdapter.expose('answer', simModel)*/

$(document).ready(context.setContext());

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

function Queue(){
	this.queue = [null,null,null,null];
}

Queue.prototype.queueCheck = function(){
	var trueCounter = 0;
	for (var count in this.queue){
		if (this.queue[count] == true) {
			trueCounter += 1;
		}
	}
	if (trueCounter >= 4) {
		return true;
	}
	else{
		return false;
	}
}
 Queue.prototype.queueAdd = function(value){
 	this.queue.splice(0,1);
 	this.queue.push(value);
 }


pipit.CapiAdapter.expose('answer', simModel);
pipit.Controller.notifyOnReady();

var searchController = new SearchController();
var context = new ContextRetriever(searchController);
var queue = new Queue();

main = function(){
	searchController.drawGraph();
	context.setContext();
};


questions = function() {
	var nodes = context.getNodes();
	var edges = context.getEdges();
	var answer1 = document.getElementById("question1").value;  
	var answer2 = document.getElementById("question2").value;

	if (nodes == answer1) {
		queue.queueAdd(true);
		document.getElementById('correct1').innerHTML = "Question 1 is right";
	}
	else{
		queue.queueAdd(false);
		document.getElementById('correct1').innerHTML = "Question 1 is wrong";
	}

	if (edges == answer2) {
		queue.queueAdd(true);
		document.getElementById('correct2').innerHTML = "Question 2 is right";
	}
	else{
		queue.queueAdd(false);
		document.getElementById('correct2').innerHTML = "Question 2 is wrong";
	}
	console.log(queue.queue);
	if (queue.queueCheck() == true) {
		$('#form1').css({"display": "none"});
		$('#correct2').css({"display": "none"});
		$('#correct3').css({"display": "none"});
		$('#correct4').css({"display": "none"});
		document.getElementById('correct1').innerHTML = "You got it right!";
		simModel.set('answer', true);
		pipit.CapiAdapter.expose('answer', simModel);
		pipit.Controller.notifyOnReady();
	}
	else{
		searchController.searchModel.reset();
		context = new ContextRetriever(searchController);
		main();
	}

	return true;
	
}

questions2 = function() {
	var edgeDegreeF = context.getEdgeDegreeF();
	var edgeDegreeC = context.getEdgeDegreeC();
	var answer3 = document.getElementById("question3").value;  
	var answer4 = document.getElementById("question4").value;  
	
	if (edgeDegreeF == answer3) {
		queue.queueAdd(true);
		document.getElementById('correct3').innerHTML = "Question 3 is right";
	}
	else{
		queue.queueAdd(false);
		document.getElementById('correct3').innerHTML = "Question 3 is wrong";
	}

	if (edgeDegreeC == answer4) {
		queue.queueAdd(true);
		document.getElementById('correct4').innerHTML = "Question 4 is right";
	}
	else{
		queue.queueAdd(false);
		document.getElementById('correct4').innerHTML = "Question 4 is wrong";
	}
	console.log(queue.queue);
	if (queue.queueCheck() == true) {
		$('#form2').css({"display": "none"});
		$('#correct2').css({"display": "none"});
		$('#correct3').css({"display": "none"});
		$('#correct4').css({"display": "none"});
		document.getElementById('correct1').innerHTML = "You got it right!";
		simModel.set('answer', true);
		pipit.CapiAdapter.expose('answer', simModel);
		pipit.Controller.notifyOnReady();
	}
	else{
		$('#form2').css({"display": "none"});
		$("#form1").css({"display": "block"});
		searchController.searchModel.reset();
		context = new ContextRetriever(searchController);
		main();
	}
	return true;
}

$('#send1').click(function(){
		$("#form1").css({"display": "none"});
		$('#form2').css({"display": "block"});
})

var hide = function(){
	$("#form1").css({"display": "block"});
}

$(document).ready(main,hide());


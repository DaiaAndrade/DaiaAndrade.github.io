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

/*	Daiane Andrade
	july 2015

	Code do implement fuctions for the SmartSparrow	*/

/*	Queue data structure.
	A queue is a vector with no information inside of it, with 4 index
	It is used to control the Answers	*/

function Queue(){
	this.queue = [null,null,null,null];
}

/*	function to check if the queue has the correct
	amount of true inside of it. Used to 
	finish the questions	*/

Queue.prototype.queueCheck = function(){
	var trueCounter = this.trueCounter();
	if (trueCounter >= 4) {
		return true;
	}
	else{
		return false;
	}
}
/*	function to add the value at the end of the queue
	and remove the first element of the queue	*/
Queue.prototype.queueAdd = function(value){
	this.queue.splice(0,1);
	this.queue.push(value);
}

/*	function that counts the amount of true values
	inside the queue	*/
Queue.prototype.trueCounter = function(){
	var trueCounter = 0;
	for (var count in this.queue){
		if (this.queue[count] == true) {
			trueCounter += 1;
		}
	}
	return trueCounter;
}

/*	serie of code to create and expose variables
	to SmartSparrow	*/	
var simModel = new pipit.CapiAdapter.CapiModel({
	done: false
});

pipit.CapiAdapter.expose('done', simModel);
pipit.Controller.notifyOnReady();

/*	Global variables to be used during the execution	*/
var searchController = new SearchController();
var queue = new Queue();

/*	main function where the graph should be drawn	*/
main = function(){
	searchController.drawGraph();
};

/*	function for the first 2 questions	*/
questions = function() {
	//	take the elements from the HTML 
	var answer1 = document.getElementById("question1").value;  
	var answer2 = document.getElementById("question2").value;

	//	compare the answer with the amount of nodes
	if (answer1 == searchController.searchModel.graph.nodes.length) {
		//	add true in the queue
		queue.queueAdd(true);
	}
	else{
		//	add false in the queue
		queue.queueAdd(false);
	}

	//	compare the answer with the amount of egdes
	if (answer2 == (searchController.searchModel.graph.edges.length/2)) {
		//	add true in the queue
		queue.queueAdd(true);
	}
	else{
		//	add false in the queue
		queue.queueAdd(false);
	}

	//	viewers tracking of answers
	document.getElementById('correct1').innerHTML = "Number of right Answers: " + queue.trueCounter();

	//	do we have the right queue ansers?
	if (queue.queueCheck() == true) {
		document.getElementById('correct1').innerHTML = "You got it right!";
		/*	change the status of the SmartSparrow variable for true to show that
			the student is able to continue the lesson	*/
		simModel.set('done', true);
		//	expose the answer for the SmartSparrow
		pipit.CapiAdapter.expose('done', simModel);
		pipit.Controller.notifyOnReady();
	}

	// the amount is not right, so continue to answer and change the graph 	
	else{
		searchController.searchModel.reset();
		main();
	}

	return true;
	
}

/*	function for the last 2 questions	*/
questions2 = function() {
	//	take the elements from the HTML 
	var answer3 = document.getElementById("question3").value;  
	var answer4 = document.getElementById("question4").value;  
	
	//	compare the answer with the degree of the node
	if (answer3 == searchController.searchModel.degreeCounter('F')) {
		//	add true in the queue
		queue.queueAdd(true);
	}
	else{
		//	add false in the queue
		queue.queueAdd(false);
	}

	//	compare the answer with the degree of the node
	if (answer4 == searchController.searchModel.degreeCounter('C')) {
		//	add true in the queue
		queue.queueAdd(true);
	}
	else{
		//	add false in the queue
		queue.queueAdd(false);
	}

	//	viewers tracking of answers
	document.getElementById('correct1').innerHTML = "Number of right Answers: " + queue.trueCounter();

	//	do we have the right queue ansers?
	if (queue.queueCheck() == true) {
		document.getElementById('correct1').innerHTML = "You got it right!";
		/*	change the status of the SmartSparrow variable for true to show that
			the student is able to continue the lesson	*/
		simModel.set('answer', true);
		pipit.CapiAdapter.expose('answer', simModel);
		pipit.Controller.notifyOnReady();
	}

	// the amount is not right, so continue to answer and change the graph 	
	else{
		searchController.searchModel.reset();
		main();
	}
	return true;
}

//	send button for the first 2 questions
$('#send1').click(function(){
	//	do we have the right queue ansers?
	if (queue.queueCheck() == true) {
		//	hide the questions 1 and 2
		$("#form1").css({"display": "none"});
	}
	//	we do not
	else{
		//	hide questiosn 1 and 2
		$("#form1").css({"display": "none"});
		//	show questions 3 and 4
		$('#form2').css({"display": "block"});
	}
})

//	send button for the last 2 questions
$('#send2').click(function(){
	//	do we have the right queue ansers?
	if (queue.queueCheck() == true) {
		//	hide the questions 3 and 4
		$('#form2').css({"display": "none"});
	}
	//	we do not
	else{
		//	hide questions 3 and 4
		$("#form2").css({"display": "none"});
		//	show questions 1 and 2
		$('#form1').css({"display": "block"});
	}
})

/*	when you load the page, in the CSS,
	all the questions are hidden, andyou just wnat to show
	the questions 1 and 2 when the page is fully loaded,
	so we made this function	*/
var show = function(){
	$("#form1").css({"display": "block"});
}

$(document).ready(main,show());


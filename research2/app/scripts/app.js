var simModel = new pipit.CapiAdapter.CapiModel({
	answer: false
});


pipit.CapiAdapter.expose('answer', simModel);
pipit.Controller.notifyOnReady();

var answered = 0;
var questionsAmount = 1;

function ContextRetriever(context){
	this.context = context;
}

ContextRetriever.prototype.retrieveData = function(){
	this.nodeAmount = this.context.searchModel.graph.nodeList.length;
	this.edgeAmount = this.context.searchModel.graph.edgeList.length;
	console.log(this.nodeAmount,this.edgeAmount);
}
ContextRetriever.prototype.putData = function(){
	document.getElementById('nodes').innerHTML = this.nodeAmount;
	document.getElementById('edges').innerHTML = this.edgeAmount;
}

ContextRetriever.prototype.setContext = function(){
	this.retrieveData();
	this.putData();
}

/*function questions() {  
	var answer1 = document.questionsForm.question1;  
	var answered = answered + 1;
	if (answered == questionsAmount){
		simModel.set('answer', true);
		pipit.CapiAdapter.expose('answer', simModel);

	}
	pipit.Controller.notifyOnReady();	
	return true;
}*/


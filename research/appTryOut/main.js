var answered == 1;
var questionNumber == 1;

var simModel = new pipit.CapiAdapter.CapiModel({
	done: false
});
pipit.CapiAdapter.expose('done', simModel);
pipit.Controller.notifyOnReady();	


function questions() {  
	var answer1 = document.question.question1;  
	if(option == 1)  {  
		checkAnswer1(answer1);
	}  
	if (anwsered == questionNumber){
		simModel.set('done', true);
		pipit.CapiAdapter.expose('done', simModel);

	}
	pipit.Controller.notifyOnReady();	
}
$(document).ready(function() {
	// I don't know why I can't do this in CSS, but I can't and I'm
	// tired of fighting with it.
// 	$("#depthLimitSpnr").width(50);
	// This should really be in my code for initializing the view, but
	// it doesn't work there
	pipit.Controller.notifyOnReady();
});
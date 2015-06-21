var simModel = new pipit.CapiAdapter.CapiModel({
	answer: false
});


pipit.CapiAdapter.expose('answer', simModel);
pipit.Controller.notifyOnReady();

var answered = 0;
var questionsAmount = 1;

function questions() {  
	var answer1 = document.questionsForm.question1;  
	var answered = answered + 1;
	if (answered == questionsAmount){
		simModel.set('answer', true);
		pipit.CapiAdapter.expose('answer', simModel);

	}
	pipit.Controller.notifyOnReady();	
	return true;
}
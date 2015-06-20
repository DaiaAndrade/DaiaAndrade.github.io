var answered == 1;
var questionNumber == 1;

var simModel = new pipit.CapiAdapter.CapiModel({
	done: false
});
pipit.CapiAdapter.expose('demoMode', simModel);

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
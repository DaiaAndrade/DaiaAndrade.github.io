var simModel = new pipit.CapiAdapter.CapiModel({
	done: false
});

pipit.CapiAdapter.expose('done', simModel);
pipit.Controller.notifyOnReady();	

var answered == 1;
var questionNumber == 1;

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
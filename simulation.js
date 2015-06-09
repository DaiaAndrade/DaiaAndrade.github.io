var simModel = new pipit.CapiAdapter.CapiModel({
	actualResult: result
});

pipit.CapiAdapter.expose('actualResult', simModel);

var main = function(userChoice) {
	
	var computerChoice = Math.random();
	if (computerChoice < 0.34) {
		computerChoice = "rock";
	}
	else if(computerChoice >= 0.34 && computerChoice <= 0.67) {
		computerChoice = "paper";
	}
	else {
		computerChoice = "scisors";
	}
	if (userChoice == 1) {
		userChoice = "rock";
	}
	else if(userChoice == 2) {
		userChoice = "paper";
	}
	else {
		userChoice = "scisors";
	}
	document.getElementById("computer").innerHTML = "Computer Choice: " + computerChoice;
	var result = compare(userChoice,computerChoice);
	document.getElementById("result").innerHTML = result;

	//tieCheck(result);

}


var compare = function(choice1,choice2){
	if (choice1 == choice2){
		return "It is a tie!";
	}
	else if(choice1 == "rock"){
		if(choice2 == "scisors"){
			return "Rock wins";
		}
		else{
			return "Paper wins";
		}
	}
	else if(choice1 == "paper"){
		if (choice2 == "rock") {
			return "Paper wins";
		}
		else{
			return "Scisors wins";
		}
	}
	else{
		if(choice2 == "rock"){
			return "Rock wins";
		}
		else{
			return "Scisors wins";
		}
	}
}


/*var tieCheck = function(result){

	pipit.CapiAdapter.expose("actualResult", simModel, {allowedValues: ['It is a tie!', 'Rock wins', 'Paper wins', 'Scisors wins']});
	if(actualResult == "It is a tie!") {
		$('#results').append("Done");
	}
	else{
		$('#results').append("Meh");
	}
	pipit.Controller.notifyOnReady();
}*/
$(document).ready(function(){
	pipit.Controller.notifyOnReady();
});
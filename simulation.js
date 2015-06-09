var userChoice = prompt("Rock, Scisors ou Paper?");
var computerChoice = Math.random();
if (computerChoice < 0.34) {
	computerChoice = "rock";
} else if(computerChoice <= 0.67) {
	computerChoice = "paper";
} else {
	computerChoice = "scisors";
} console.log("Computer: " + computerChoice);

compare(userChoice,computerChoice);
var compare = function(choice1,choice2){
	if (choice1 === choice2){
		return "It's a tie!";}
	else if(choice1 == "rock"){
		if(choice2=="scisors"){
			return "Rock wins";}
		else{
			return "Paper wins";}
	}
	else if(choice == "paper"){
		if (coice2 == "rock") {
			return "Paper wins";
		};
		else{
			return "Scisors wins";
		}
	}
	else{
		if(choice2 == "rock"){
			return "Rock wins";}
		}
		else{
			return "Scisors wins";
		}
	}
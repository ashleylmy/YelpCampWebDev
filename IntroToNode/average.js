function average(scores){
	var total = 0;
	scores.forEach(function(score){
				   total += score
				   })
	var average = total / scores.length
	return average;
}

var scores = [ 40, 65, 77, 82, 80, 54, 73, 63, 95, 49]
console.log(average(scores))

"use strict";

var userArray = [];
var noBirthdays = true;


$(document).ready(function()
{
	
  displayBirthday();

});




function displayBirthday()
{
	
	$.ajax({
		method: "GET",
		url: '/users'
	}).done(function(result){
		
		 userArray = result;
		
		noBirthdays = true;
		for(var i=0; i < userArray.length; i++)
		{
			var mbr = userArray[i];
			var birthday = mbr.birthday;
			showBirthdays(birthday, mbr.name);
			
			
		}
		
		if(noBirthdays)
		{
			$("#birthday").html("No Birthdays Today!");
			
		}
		
		
		
	});
}
	
	
	function showBirthdays(birthday,name)
	{
	
		var $birthdaySpace = $("#birthday");
		
		var birthDate = new Date(birthday); //access users birthdays from JSON file
		var today = new Date(); //get todays date
		var diff = today-birthDate; // This is the difference in milliseconds
		var currentDay = today.getDate();
		var currentYear = today.getFullYear();
		var currentMonth = today.getMonth();
		var userDay = birthDate.getDate();
		var userYear = birthDate.getFullYear();
		var userMonth = birthDate.getMonth();
		
		
		
		//console.log(birthDate);
		//console.log(today);
		
		if(currentMonth == userMonth && currentDay == userDay)
		{
			
			$birthdaySpace.append("<p class= bday>" + name + " <br></p>");
			noBirthdays = false;
		
		}
	
	}
	

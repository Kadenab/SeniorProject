"use strict";

var userArray = [];
var people = [];
var noBirthdays = true;


$(document).ready(function()
{
	
  showMembersCatalog();
  
  $("#button").click(displaySelectMember);
  
 
  img.click(showProfile);
 
   
  
});

function showMembersCatalog()
{
	//get the place where the Members will go
	
	var $memberSpace = $("#memberArea");
	//console.log("help");
	$.ajax({
		method: "GET",
		url: '/users'
	}).done(function(result){
		//console.log("help");
		
		
		//console.log(result.[0]);
		//$memberSpace.html(JSON.stringify(result));
		 userArray = result;
		for(var i=0; i < userArray.length; i++)
			
			{
				var mbr = userArray[i];
				var mainDiv = $("<div></div>");
				var infoDiv = $("<div></div>");
				var mbrData =  mbr.image;
				var img = $("<img></img>");
				img.attr("data-toggle", "modal");
				img.attr("data-target", "#myModal");
				
				img.attr("id", mbr.name);
				
				
				infoDiv.attr('id','infoDiv');
				img.attr("src", mbrData);
				 img.addClass("img-square");
				 img.click(showProfile);
				mbrData =  mbr.name + "<br>";
				mbrData = mbr.occupation;
				mbrData +=  mbr.gender + ", " + "from " ;
				mbrData +=  mbr.state ;
				mainDiv.append(img);
				
				mainDiv.append(" " + mbr.name);
				
				
				
				//mainDiv.html('<img src=  "' + mbr.image + '" class = img-square height = 65px width = 65px  > ' + "<b>" +  mbr.userName+ "</b>" );
				infoDiv.html(mbr.occupation + " | "  +  mbr.gender + " | " +  "From" + " " +  mbr.state);
				
				
				$memberSpace.append(mainDiv);
				mainDiv.append(infoDiv);
				mainDiv.css({"margin-top": "20px","margin-bottom": "0px","font-size": "20.5px", "color": "yellow", "margin": "40.35px"});
				infoDiv.css({"margin-left": "55px", "color": "#626466"});
				
			
				
				
				
				
			}
			
			//$("img").click(showProfile);
				
		
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
	
	function displaySelectMember()
	{
		
	
		var $findMemberSpace = $("#searchMenu");  //Place to display results of search
		var search = $('#search').val(); //get search engine results
		console.log(search);
		if (search== "" )
		{	
			return;
		}
		
		$('#searchMenu').val("");
		$('#search').val(""); //clear search input once submitted
		
		
		
		for(var i=0; i < userArray.length; i++)
		{
			if(userArray[i].name.indexOf(search) >= 0)
			{
				
				///// To make the memeber thats searched bring up the profile
				var mbr = userArray[i];
				var user = mbr.name;
				secondModal(user, mbr.name);
				
				
				
					var links = $("<a></a>");
				
					links.click(secondModal);//make a tags clickable
					links.attr("data-toggle", "modal");
					links.attr("data-target", "#myModal");
					links.attr("id", mbr.name);
										
					links.html(userArray[i].name +"<br>");
					$findMemberSpace.append(links);
					links.css({"width": "400px","font-size": "17.5px","color": "blue", "margin-left": "8px"});
			}
			
			
		}
		
			
		

	
	}

	
	function showProfile(){
		var $modalSpace = $("#memberArea");
		
		var id = $(this).attr("id");
		console.log(id);
		

		$.ajax({
		method: "GET",
		url: '/profile', 
		data:{name:id}
	}).done(function(result){
		
		console.log(result);// result of data in console
		
	
		var userImage = $(".user-image");
		var userHeader = $(".user-heading");
		var modalAccount = $("#account");
		
		var modalEducation = $("#education");
		var modalSkills =$("#skills");
		
		//Data for modal account tab
		
		var img = '<img src=  "' + result.image + '" class = img-circle  text-align: center border-image:  5px solid black> ' ;
		
		var info =  "<h4><b>" + result.name +  "</b></h4>"  + " " +  result.occupation ;
		
		var output =   "<br>"+  " "+ "<br>" +  result.bio +"</br>";
		
		var infoDiv = $("<div></div>");
		infoDiv.attr('id','userHeader');
		infoDiv.attr('text-align','center');
		
		
		
		// Data for modal education tab
	 
		var college = "<h4><b>" + result.college + "</b></h4>" ;
		
		var collegeInfo = result.collegeInfo;
		console.log(college);
		
		//loop for collegeInfo array (modal education tab)
		
		var collegeInfoDiv = $("<div></div>");
		var ul = $("<ul></ul>");
		
		for(var i=0; i < collegeInfo.length; i++ )
		{
			var li = $("<li></li>");
			li.text(collegeInfo[i]);
			ul.append(li);
			
		}
		
		
		// Data for modal skills tab
		
		var skills =  result.skills ;
		var skillInfoDiv = $("<div></div>");
		var secondUl= $("<ul></ul>");
		
		for(var i=0; i < skills.length; i++ )
		{
			var li2 = $("<li></li>");
			li2.text(skills[i]);
			secondUl.append(li2);
			
		}
		
		
		
		var para = $("<p></p>");
		para.attr('id','modalPara');
		
		userHeader.html("");
		modalAccount.html("");
		modalEducation.html("");
		modalSkills.html("");
		
		
		infoDiv.html(info);
		para.html(output);
		
		
		userHeader.append(img);
		userHeader.append(infoDiv);
		
	
		modalEducation.append(college);
		collegeInfoDiv.append(ul);
		skillInfoDiv.append(secondUl);
		
		modalSkills.append(skillInfoDiv);
		modalEducation.append(collegeInfoDiv);
		modalAccount.append(para);
		
		
	
	 
	});
	
		
	}
	
	
	
	
	
	function secondModal(user, name){
		
		var $modalSpace = $("#memberArea");
		
		var id = $(this).attr("id");
		console.log(id);

		$.ajax({
		method: "GET",
		url: '/profile2', 
		data:{name:id}
	}).done(function(result){
		
		console.log(result);// result of data in console
		
	
			var userImage = $(".user-image");
		var userHeader = $(".user-heading");
		var modalAccount = $("#account");
		
		var modalEducation = $("#education");
		var modalSkills =$("#skills");
		
		//modalBody.addClass("modal-body");
		
		var img = '<img src=  "' + result.image + '" class = img-circle  text-align: center border-image:  5px solid black> ' ;
		
		
		
		var info =  "<h4><b>" + result.name +  "</b></h4>"  + " " +  result.occupation ;
		
	 
		
	
		
		var infoDiv = $("<div></div>");
		infoDiv.attr('id','userHeader');
		infoDiv.attr('text-align','center');
		
		var output =   "<br>"+  " "+ "<br>" +  result.bio +"</br>";
		
		var para = $("<p></p>");
		para.attr('id','modalPara');
		
		userHeader.html("");
		modalBody.html("");
		
		infoDiv.html(info);
		para.html(output);
		
		userHeader.append(img);
		userHeader.append(infoDiv);
		
		
		modalBody.append(para);
		
	
	 
	});
	
		
	}
		
		

	
	
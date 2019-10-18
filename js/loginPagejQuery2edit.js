"use strict";

$(document).ready(function()
{
	$("#Login").click(loginPopUp);
	
	$("#Register").click(registerPopUp);
	
	$("#loginForm").submit(searchByLogin);
	$("#signupForm").submit(searchBySignup);

});

function loginPopUp()
{
	var $loginContainer = $(".container");
	$loginContainer.each(function()
	{
		$(this).css('display','block');
	});
}

function registerPopUp()
{
	var $registerContainer = $(".container2");
	$registerContainer.each(function()
	{
		$(this).css('display','block');
	});		
}


function searchByLogin(e)
{
	
	e.preventDefault();
	//alert('Login');
	//You need to check here to see if the correct type of data was entered.
	
	//***********************************************
	var email,password,name;

		email: $('#loginEmail').val();
		password:$('#loginPassword').val();
		name: "";
	
	
	//clear the input areas
	$('#loginEmail').val("");
	$('#loginPassword').val("");
	// show the email and password assigned to data
	console.log(email, password, name);
	// post "/signin" route in server using the data captured fromm the input
	$.post( '/signin', data, function(result){
		if(result.msg == "yes")
		{

			alert(result.name);

			window.location.href = "/homepage";
		}
		
	});
}

function searchBySignup(e)
{
	e.preventDefault();
	//alert('Signup');
	//You need to check here to see if the correct type of data was entered.
	
	//***********************************************
	var data =
	{
		'name': $('#signupUsername').val().trim(),
		'email':$('#signupEmail').val().trim(),
		'password':$('#signupPassword').val().trim()
		
	};
	//clear the input areas
	$('#signupUsername').val("");
	$('#signupEmail').val("");
	$('#signupPassword').val("");
	
	$.post( '/signup', data, function(result){
		if(result.msg == "yes")
		{
			window.location.href = "/homepage";
		}
		else
		{
			alert(result.msg);
		}
	});
}

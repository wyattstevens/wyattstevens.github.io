var BASE_URL = "mysterious-bastion.herokuapp.com";
var TEST_URL = "localhost:8080";
var getFoods = function () {

	removeElementsByClass("food_item");

	fetch ("https://" + BASE_URL + "/foods", { credentials: "include"}).then(function(response) {
		if (response.status == 200 || response.status == 201) {
	  	response.json().then(function(data) {
	    	console.log("data received from server", data);

				var loginWrapper = document.querySelector("#login-wrapper")
				loginWrapper.style.display="none";

				var buttonsDiv = document.querySelector(".buttons");
				buttonsDiv.style.display="block";

				var wrapper = document.querySelector(".wrapper");
				wrapper.style.display="flex";

		    var foodsList = document.querySelector("#foodsList");
				data.forEach(function (food) {


					var newListItem = document.createElement("li");
					newListItem.setAttribute("class", "food_item");

					var titleHeading = document.createElement("h3");
					titleHeading.setAttribute("class", "food_name");
					titleHeading.innerHTML = food.name;
					newListItem.appendChild(titleHeading);

					var caloriesElement = document.createElement("div");
					caloriesElement.setAttribute("class", "macros");
					caloriesElement.innerHTML = "Calories: " + food.calories;
					newListItem.appendChild(caloriesElement);

					var proteinElement = document.createElement("div");
					proteinElement.setAttribute("class", "macros");
					proteinElement.innerHTML = "Protein: " + food.protein;
					newListItem.appendChild(proteinElement);

					var carbohydratesElement = document.createElement("div");
					carbohydratesElement.setAttribute("class", "macros");
					carbohydratesElement.innerHTML = "Carbohydrates: " + food.carbohydrates;
					newListItem.appendChild(carbohydratesElement);

					var fatElement = document.createElement("div");
					fatElement.setAttribute("class", "macros");
					fatElement.innerHTML = "Fat: " + food.fat;
					newListItem.appendChild(fatElement);

					var deleteButton = document.createElement("button");
					deleteButton.innerHTML = "Delete";
					deleteButton.onclick = function() {
						deleteFood(food.id);
					};

					var updateButton = document.createElement("button");
					updateButton.innerHTML = "Update";
					updateButton.onclick = function() {
						updateFood(food);
					};

					newListItem.appendChild(deleteButton);

					newListItem.appendChild(updateButton);

					foodsList.appendChild(newListItem);
				});
			});
	  } else {

			console.log("Inside the else function");

			var buttonsDiv = document.querySelector(".buttons");
			buttonsDiv.style.display="none";

			var wrapper = document.querySelector(".wrapper");
			wrapper.style.display="none";

			var loginWrapper = document.querySelector("#login-wrapper");
			loginWrapper.style.display="flex";

		}
	});
};
getFoods();

var addButton = document.querySelector("#add");
addButton.onclick = function () {
	var newItemName = document.querySelector("#newItemName").value;
	var newItemCalories = document.querySelector("#newItemCalories").value;
	var newItemProtein = document.querySelector("#newItemProtein").value;
	var newItemCarbohydrates = document.querySelector("#newItemCarbohydrates").value;
	var newItemFat = document.querySelector("#newItemFat").value;
  var bodyStr = "name=" + encodeURIComponent(newItemName);
	bodyStr += "&calories=" + encodeURIComponent(newItemCalories);
	bodyStr += "&protein=" + encodeURIComponent(newItemProtein);
	bodyStr += "&carbohydrates=" + encodeURIComponent(newItemCarbohydrates);
	bodyStr += "&fat=" + encodeURIComponent(newItemFat);
	document.getElementById("newItemName").value = '';
	document.getElementById("newItemCalories").value = '';
	document.getElementById("newItemProtein").value = '';
	document.getElementById("newItemCarbohydrates").value = '';
	document.getElementById("newItemFat").value = '';
  fetch("https://" + BASE_URL + "/foods", {
    method: "POST",
		credentials: "include",
    body: bodyStr,
    headers: {"content-type":"application/x-www-form-urlencoded"}
  }).then(function (response) {

    // handle the response:
		getFoods();

		});
    console.log("Server responded!");
};

var registerButton = document.querySelector("#register");
registerButton.onclick = function () {
	var userFirstName = document.querySelector("#registerFirstName").value;
	var userLastName = document.querySelector("#registerLastName").value;
	var userEmail = document.querySelector("#registerEmail").value;
	var userPassword = document.querySelector("#registerPassword").value;
  var bodyStr = "firstname=" + encodeURIComponent(userFirstName);
	bodyStr += "&lastname=" + encodeURIComponent(userLastName);
	bodyStr += "&email=" + encodeURIComponent(userEmail);
	bodyStr += "&password=" + encodeURIComponent(userPassword);
	document.getElementById("registerFirstName").value = '';
	document.getElementById("registerLastName").value = '';
	document.getElementById("registerEmail").value = '';
	document.getElementById("registerPassword").value = '';
  fetch("https://" + BASE_URL + "/users", {
    method: "POST",
		credentials: "include",
    body: bodyStr,
    headers: {"content-type":"application/x-www-form-urlencoded"}
  }).then(function (response) {

	    if (response.status == 201) {
					alert("You have been succesfully registered!");
			} else if (response.status == 422){
					alert("That email has already been registered.")
			}

		});
	  console.log("Server responded!");
};

var loginButton = document.querySelector("#login");
loginButton.onclick = function () {
	var userEmail = document.querySelector("#loginFieldEmail").value;
	var userPassword = document.querySelector("#loginFieldPassword").value;
	userEmail.value = "";
	userPassword.value = "";
  var bodyStr = "email=" + encodeURIComponent(userEmail);
	bodyStr += "&password=" + encodeURIComponent(userPassword);
  fetch("https://" + BASE_URL + "/sessions", {
    method: "POST",
		credentials: "include",
    body: bodyStr,
    headers: {"content-type":"application/x-www-form-urlencoded"}
  	}).then(function (response) {

			if (response.status == 401) {
				alert("Invalid email or password.")
			} else {
				// handle the response:
				getFoods();
				console.log("Logging in...");
			}
	});
};

var deleteFood = function(foodID) {
	if(confirm("Are you sure you want to delete this item?")) {
		fetch("https:" + BASE_URL + "/foods/" + foodID, {
			method: "DELETE",
			credentials: "include"
		}).then(function(response) {
			getFoods();
		})
	}
}

var updateFood = function(food) {

	//creates the update form and populates fields
	var updateField = document.querySelector("#updateItemForm");
	updateField.style.display="flex";

	var nameField = document.querySelector("#updateItemName");
	nameField.value = food.name;

	var caloriesField = document.querySelector("#updateItemCalories");
	caloriesField.value = food.calories;

	var proteinField = document.querySelector("#updateItemProtein");
	proteinField.value = food.protein;

	var carbohydratesField = document.querySelector("#updateItemCarbohydrates");
	carbohydratesField.value = food.carbohydrates;

	var fatField = document.querySelector("#updateItemFat");
	fatField.value = food.fat;

	var confirmButton = document.querySelector("#confirmButton");
	confirmButton.onclick = function() {

		//building the body string
		var bodyStr = "name=" + encodeURIComponent(nameField.value);
		bodyStr += "&calories=" + encodeURIComponent(caloriesField.value);
		bodyStr += "&protein=" + encodeURIComponent(proteinField.value);
		bodyStr += "&carbohydrates=" + encodeURIComponent(carbohydratesField.value);
		bodyStr += "&fat=" + encodeURIComponent(fatField.value);
		bodyStr += "&id=" + encodeURIComponent(food.id);

		fetch("https://" + BASE_URL + "/foods/" + food.id, {
			method: "PUT",
			credentials: "include",
			body: bodyStr,
			headers: {"content-type":"application/x-www-form-urlencoded"}
		}).then(function (response) {

			// handle the response:
			getFoods();
			updateField.style.display="none";

			});

	}
};

function removeElementsByClass(className){
    var elements = document.getElementsByClassName(className);
    while(elements.length > 0){
        elements[0].parentNode.removeChild(elements[0]);
    }
}


function getRndInteger(min, max) {
  return Math.floor(Math.random() * (max - min) ) + min;
}

let hideEmployeeSavedAlertTimer = undefined;

document.addEventListener("DOMContentLoaded", () => {
	// TODO: Things that need doing when the view is loaded
	const employeeSaveElement = document.getElementById('saveButton');
	if(employeeSaveElement) {
		employeeSaveElement.addEventListener("click", saveActionClick);
	}

	document.getElementById("signOutImage").addEventListener("click", logout)
});

// Save
function saveActionClick(event) {
	// TODO: Actually save the employee via an AJAX call
	const saveActionElement = event.target;
	
	const registerId = getRegisterId();
	const managerId = getManagerId();
	const employeeId = getEmployeeId();
	const saveActionUrl = ("/api/employeeDetail/" + (registerId));
	const saveEmployeeRequest = {
		id: registerId,
		lastName: getEmployeeLastName(),
		firstName: getEmployeeFirstName(),
		password: getEmployeePassword(),
		classification: getEmployeeType()
	};

	//console.log(JSON.stringify(saveEmployeeRequest));

	if(formValidation()) {
		console.log("NO ERRORS");
		ajaxPost(saveActionUrl, saveEmployeeRequest, (callbackResponse) => {
			if (isSuccessResponse(callbackResponse)) {
				displayEmployeeSavedAlertModal();
			}
		});
	}
}

function formValidation() {
	if(getEmployeeFirstName() === "") {
		document.getElementById("errorText").innerHTML = "First name field is empty!";
		document.getElementById("firstName").focus();
		document.getElementById("firstName").select();
		return false;
	} else if(getEmployeeLastName() === "") {
		document.getElementById("errorText").innerHTML = "Last name field is empty!";
		document.getElementById("lastName").focus();
		document.getElementById("lastName").select();
		return false;
	} else if(getEmployeePassword() === "") {
		document.getElementById("errorText").innerHTML = "Password field is empty!";
		document.getElementById("password").focus();
		document.getElementById("password").select();
		return false;
	} else if(getEmployeeVerifyPassword() === "") {
		document.getElementById("errorText").innerHTML = "Verify password field is empty!";
		document.getElementById("verifyPassword").focus();
		document.getElementById("verifyPassword").select();
		return false;
	} else if (getEmployeePassword() != getEmployeeVerifyPassword()) {
		document.getElementById("errorText").innerHTML = "Passwords do not match!";
		document.getElementById("password").focus();
		document.getElementById("password").select();
		return false; 
	} else {
		document.getElementById("errorText").innerHTML = "";
		return true;
	}
}

function displayEmployeeSavedAlertModal() {
	if (hideEmployeeSavedAlertTimer) {
		clearTimeout(hideEmployeeSavedAlertTimer);
	}

	const savedAlertModalElement = getSavedAlertModalElement();
	savedAlertModalElement.style.display = "none";
	savedAlertModalElement.style.display = "block";

	hideEmployeeSavedAlertTimer = setTimeout(hideEmployeeSavedAlertModal, 1200);
}

function hideEmployeeSavedAlertModal() {
	if (hideEmployeeSavedAlertTimer) {
		clearTimeout(hideEmployeeSavedAlertTimer);
	}

	getSavedAlertModalElement().style.display = "none";
}
// End save

// Getters and setters
function getEmployeeSaveElement() {
	return document.getElementById("save");
}

function getEmployeeFirstName() {
	return getEmployeeFirstNameElement().value;
}
function getEmployeeFirstNameElement() {
	return document.getElementById("firstName");
}

function getEmployeeLastName() {
	return getEmployeeLastNameElement().value;
}
function getEmployeeLastNameElement() {
	return document.getElementById("lastName");
}

function getEmployeePassword() {
	return getEmployeePasswordElement().value;
}
function getEmployeePasswordElement() {
	return document.getElementById("password");
}

function getEmployeeVerifyPassword() {
	return getEmployeeVerifyPasswordElement().value;
}
function getEmployeeVerifyPasswordElement() {
	return document.getElementById("verifyPassword");
}

function getEmployeeType() {
	return Number(getEmployeeTypeElement().value);
}
function getEmployeeTypeElement() {
	return document.getElementById("type");
}

function getRegisterId() {
	return getRegisterIdElement().value;
}
function getRegisterIdElement() {
	return document.getElementById("employeeId");
}

function getManagerId() {
	return getManagerIdElement().value;
}
function getManagerIdElement() {
	return document.getElementById("employeeManagerId");
}

function getEmployeeId() {
	return getEmployeeIdElement().value;
}
function getEmployeeIdElement() {
	return document.getElementById("employeeEmployeeId");
}

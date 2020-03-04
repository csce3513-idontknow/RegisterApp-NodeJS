document.addEventListener("DOMContentLoaded", () => {
	
	document.getElementById("logout").addEventListener("click", logout);
	document.getElementById("startTransaction").addEventListener("click", startTransaction);
	document.getElementById("viewProducts").addEventListener("click", viewProducts);
	document.getElementById("createEmployee").addEventListener("click", createEmployee);
	document.getElementById("salesReport").addEventListener("click", salesReport);
	document.getElementById("cashierReport").addEventListener("click", cashierReport);

});

function startTransaction(){
	displayError("Functionality has not yet been implemented.”");
}

function viewProducts () {
	location.assign("/productListing");
}

function createEmployee () {
	location.assign("/employeeDetail");
}

function salesReport () {
	displayError("Functionality has not yet been implemented.”");
}

function cashierReport () {
	displayError("Functionality has not yet been implemented.”");
}
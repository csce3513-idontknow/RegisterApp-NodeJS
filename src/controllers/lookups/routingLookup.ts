export enum ParameterLookup {
	ProductId = "productId",
	EmployeeId = "employeeId"
}

export enum QueryParameterLookup {
	ErrorCode = "errorCode",
	EmployeeId = "employeeId"
}

export enum ViewNameLookup {
	SignIn = "signIn",
	MainMenu = "mainMenu",
	ProductDetail = "productDetail",
	EmployeeDetail = "employeeDetail",
	ProductListing = "productListing",
	Transaction = "transaction"
}

export enum RouteLookup {
	// Page routing
	SignIn = "/",
	SignOut = "/signOut",
	MainMenu = "/mainMenu",
	ProductDetail = "/productDetail",
	EmployeeDetail = "/employeeDetail",
	ProductListing = "/productListing",
	ProductSearch = "/productSearch",
	Transaction = "/transaction",
	// Page routing - parameters
	ProductIdParameter = "/:productId",
	EmployeeIdParameter = "/:employeeId",
	TransactionIdParameter = "/:transactionId",
	// End page routing - parameters
	// End page routing
	// API routing
	API = "/api",
}

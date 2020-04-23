export enum ParameterLookup {
	ProductId = "productId",
	EmployeeId = "employeeId",
	ProductSearchString = "productSearchString"
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
	Transaction = "transaction1"
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
	ProductSales = "/productSales",
	// Page routing - parameters
	ProductSearchString = "/:productSearchString",
	ProductIdParameter = "/:productId",
	EmployeeIdParameter = "/:employeeId",
	TransactionIdParameter = "/:transactionId",
	// End page routing - parameters
	// End page routing
	// API routing
	API = "/api",
}

export enum ParameterLookup {
	ProductId = "productId"
}

export enum QueryParameterLookup {
	ErrorCode = "errorCode"
}

export enum ViewNameLookup {
	ProductDetail = "productDetail",
	MainMenu = "mainMenu",
	ProductListing = "productListing",
	SignIn = "signIn"
}

export enum RouteLookup {
	// Page routing
	SignIn = "/",
	SignOut = "/signOut",
	ProductListing = "/",
	ProductDetail = "/productDetail",
	MainMenu = "/mainMenu",

	// Page routing - parameters
	ProductIdParameter = "/:productId",
	// End page routing - parameters
	// End page routing

	// API routing
	API = "/api",
	// End API routing
}

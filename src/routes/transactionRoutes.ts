// routing for transaction to be done here
// use same format from previous controllers and follow guidelines set for sprint 4

// Following code is copied into the sollution to make it run for other development.
// This code should be changed to the correct code, right now it serves the main menu route!
import express from "express";
import { RouteLookup } from "../controllers/lookups/routingLookup";
import * as transactionRouteController from "../controllers/transactionRouteController";
import * as ProductListingRouteController from "../controllers/productListingRouteController";


function transactionRoutes(server: express.Express) {
	server.get(RouteLookup.Transaction, transactionRouteController.start);

	server.post((RouteLookup.API + RouteLookup.Transaction), transactionRouteController.saveTransaction);

	server.get(RouteLookup.API + RouteLookup.ProductSearch + RouteLookup.ProductSearchString, ProductListingRouteController.productSearch);

	server.delete(RouteLookup.API + RouteLookup.Transaction + RouteLookup.TransactionIdParameter + transactionRouteController.cancel);


}

module.exports.routes = transactionRoutes;
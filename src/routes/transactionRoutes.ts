// routing for transaction to be done here
// use same format from previous controllers and follow guidelines set for sprint 4

// Following code is copied into the sollution to make it run for other development.
// This code should be changed to the correct code, right now it serves the main menu route!
import express from "express";
import { RouteLookup } from "../controllers/lookups/routingLookup";
import * as TransactionRouteController from "../controllers/transactionRouteController";

function transactionRoutes(server: express.Express) {
	server.get(RouteLookup.Transaction, TransactionRouteController.start);
}

module.exports.routes = transactionRoutes;
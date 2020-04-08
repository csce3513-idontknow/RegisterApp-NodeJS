// routing for transaction to be done here
// use same format from previous controllers and follow guidelines set for sprint 4

// Following code is copied into the sollution to make it run for other development.
// This code should be changed to the correct code, right now it serves the main menu route!
import express from "express";
import { RouteLookup } from "../controllers/lookups/routingLookup";
import * as MainMenuRouteController from "../controllers/mainMenuRouteController";

function mainMenuRoutes(server: express.Express) {
	server.get(RouteLookup.MainMenu, MainMenuRouteController.start);
}

module.exports.routes = mainMenuRoutes;
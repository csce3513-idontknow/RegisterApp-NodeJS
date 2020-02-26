import express from "express";
import { RouteLookup } from "../controllers/lookups/routingLookup";
import * as signInRouteController from "../controllers/signInRouteController";

function signInRoutes(server: express.Express) {
	server.get(RouteLookup.signIn, signInRouteController.start);
}

module.exports.routes = signInRoutes;
import express from "express";
import { RouteLookup } from "../controllers/lookups/routingLookup";
import * as EmployeeDetailRouteController from "../controllers/employeeDetailRouteController";

function employeeDetailRoutes(server: express.Express) {
    server.get(
        "/employeeDetail",
        EmployeeDetailRouteController.start);
    server.get(
        "/employeeDetail/:employeeId",
        EmployeeDetailRouteController.startWithEmployee);

    server.post(
        "/api/employeeDetail",
        EmployeeDetailRouteController.createEmployee);

    server.patch(
        "/api/employee/:employeeID",
        EmployeeDetailRouteController.updateEmployee);

    // server.delete(
    //     (RouteLookup.API + RouteLookup.EmployeeDetail
    //         + RouteLookup.EmployeeIdParameter),
    //     EmployeeDetailRouteController.deleteEmployee);
}

module.exports.routes = employeeDetailRoutes;
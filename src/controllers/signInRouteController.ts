import { Request, Response } from "express";
import { Resources } from "../resourceLookup";
import * as Helper from "./helpers/routeControllerHelper";
import { ViewNameLookup } from "./lookups/routingLookup";
import * as EmployeeSignIn from "../controllers/commands/employees/employeeSignInCommand";
import { PageResponse, CommandResponse, Employee } from "./typeDefinitions";
import * as EmployeeExists from "../controllers/commands/employees/activeEmployeeExistsQuery";

export const start = async (req: Request, res: Response): Promise<void> => {
	// TODO: Use the credentials provided in the request body (req.body)
	//  and the "id" property of the (Express.Session)req.session variable
	//  to sign in the user
	if (Helper.handleInvalidSession(req, res)) {
		return;
	}

	return res.render(
		ViewNameLookup.SignIn,
	)
};

export const signIn = async (req: Request, res: Response): Promise<void> => {
	//verify employee credentials
	console.log("HERE");

};

export const clearActiveUser = async (req: Request, res: Response): Promise<void> => {
	// TODO: Sign out the user associated with req.session.id
};


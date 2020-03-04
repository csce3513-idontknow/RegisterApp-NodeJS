import { Request, Response } from "express";
import { Resources } from "../resourceLookup";
import * as Helper from "./helpers/routeControllerHelper";
import { ViewNameLookup, RouteLookup } from "./lookups/routingLookup";
import * as EmployeeSignIn from "../controllers/commands/employees/employeeSignInCommand";
import { PageResponse, CommandResponse, Employee } from "./typeDefinitions";
import * as ActiveEmployeeExists from "../controllers/commands/employees/activeEmployeeExistsQuery";
import * as ClearActiveUser from "./commands/activeUsers/clearActiveUserCommand";
import { SignInRequest, ApiResponse } from "./typeDefinitions";

export const start = async (req: Request, res: Response): Promise<void> => {
	// TODO: Use the credentials provided in the request body (req.body)
	//  and the "id" property of the (Express.Session)req.session variable
	//  to sign in the user
	try {
		if ((await ActiveEmployeeExists.execute()).data === false) {
			return res.redirect(RouteLookup.EmployeeDetail);
		}
		return res.render(
			ViewNameLookup.SignIn,
		);
	} catch (e) {
		console.error(e);
		res.sendStatus(500);
	}
};

export const signIn = async (req: Request, res: Response): Promise<void> => {

	try {
		if (!req.session) {
			throw new Error("Session not found");
		}
		await EmployeeSignIn.signInQuery(<SignInRequest>{
			employeeId: req.body.employee_Id,
			password: req.body.password
		}, req.session);
		return res.redirect(RouteLookup.MainMenu);
	} catch (e) {
		res.status(e.status).render(ViewNameLookup.SignIn, <ApiResponse>{
			errorMessage: e.message
		});
	}

};

export const clearActiveUser = async (req: Request, res: Response): Promise<void> => {
	// TODO: Sign out the user associated with req.session.id
	try {
		if (req.session) {
			await ClearActiveUser.execute(req.session.id);
		}
		res.status(204).send(<ApiResponse>{
			redirectUrl: RouteLookup.SignIn
		});
	} catch (e) {
		res.status(e.status).send(<ApiResponse>{
			redirectUrl: RouteLookup.SignIn,
			errorMessage: e.message
		});
	}
};


// beginning sign in route controller
import { Request, Response } from "express";
import { ViewNameLookup } from "./lookups/routingLookup";

export const start = async (req: Request, res: Response): Promise<void> => {
	// TODO: Use the credentials provided in the request body (req.body)
	//  and the "id" property of the (Express.Session)req.session variable
	//  to sign in the user
	return res.render(
		ViewNameLookup.SignIn,
	)
};

export const signIn = async (req: Request, res: Response): Promise<void> => {
	//verify employee credentials
};

export const clearActiveUser = async (req: Request, res: Response): Promise<void> => {
	// TODO: Sign out the user associated with req.session.id
};

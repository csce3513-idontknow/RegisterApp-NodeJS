import { Request, Response } from "express";
import { Resources, ResourceKey } from "../resourceLookup";
import * as Helper from "./helpers/routeControllerHelper";
import { ViewNameLookup, QueryParameterLookup, RouteLookup } from "./lookups/routingLookup";
import * as ValidateActiveUser from "./commands/activeUsers/validateActiveUserCommand";
import { PageResponse, CommandResponse, ActiveUser, MainMenuPageResponse } from "./typeDefinitions";
import { lookup } from "dns";
import { EmployeeClassification } from "./commands/models/constants/entityTypes";

export const start = async (req: Request, res: Response): Promise<void> => {
	if (Helper.handleInvalidSession(req, res)) {
		return;
	}

	res.setHeader(
		"Cache-Control",
		"no-cache, max-age=0, must-revalidate, no-store");

		// For testing mainmenu view
		/* return res.render(
			ViewNameLookup.MainMenu,
			<MainMenuPageResponse>{
				isElevatedUser: true,
				errorMessage: Resources.getString(req.query[QueryParameterLookup.ErrorCode])
			}); */

	return ValidateActiveUser.execute((<Express.Session>req.session).id)
		.then((activeUserCommandResponse: CommandResponse<ActiveUser>): void => {
			// TODO: Examine the ActiveUser classification if you want this information
			let isElevatedUser: boolean = false;
			if ( activeUserCommandResponse.data?.classification == EmployeeClassification.GeneralManager ) {
				isElevatedUser = true;
			}
			else if ( activeUserCommandResponse.data?.classification == EmployeeClassification.ShiftManager ) {
				isElevatedUser = true;
			}
			else if ( activeUserCommandResponse.message == ResourceKey.USER_NOT_FOUND ) {
				res.redirect( RouteLookup.SignIn, 401 );
			}

			// This recommends to Firefox that it refresh the page every time
			//  it is accessed
			res.setHeader(
				"Cache-Control",
				"no-cache, max-age=0, must-revalidate, no-store");

			return res.render(
				ViewNameLookup.MainMenu,
				<MainMenuPageResponse>{
					isElevatedUser: isElevatedUser,
					errorMessage: Resources.getString(req.query[QueryParameterLookup.ErrorCode])
				});
		}).catch((error: any): void => {
			if (!Helper.processStartError(error, res)) {
				res.setHeader(
					"Cache-Control",
					"no-cache, max-age=0, must-revalidate, no-store");

				return res.render(
					ViewNameLookup.MainMenu,
					<PageResponse>{ errorMessage: error.message });
			}
		});
};
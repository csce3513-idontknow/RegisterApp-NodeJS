import { Request, Response } from "express";
import { Resources } from "../resourceLookup";
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

		return res.render(
			ViewNameLookup.MainMenu,
			<MainMenuPageResponse>{
				isElevatedUser: false,
				errorMessage: Resources.getString(req.query[QueryParameterLookup.ErrorCode])
			});

	return ValidateActiveUser.execute((<Express.Session>req.session).id)
		.then((activeUserCommandResponse: CommandResponse<ActiveUser>): void => {
			// TODO: Examine the ActiveUser classification if you want this information
			let isElevatedUser: boolean;
			if ( activeUserCommandResponse.data?.classification == EmployeeClassification.GeneralManager ) {
				isElevatedUser = true;
			}
			else if ( activeUserCommandResponse.data?.classification == EmployeeClassification.ShiftManager ) {
				isElevatedUser = true;
			}
			else {
				isElevatedUser = false;
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
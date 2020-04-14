// route controller for transaction
// Will be helping Ryan here
import * as Helper from "./helpers/routeControllerHelper";
import * as EmployeeHelper from "./commands/employees/helpers/employeeHelper";
import * as ValidateActiveUser from "./commands/activeUsers/validateActiveUserCommand";
import { PageResponse, CommandResponse, ActiveUser, TransactionPageResponse } from "./typeDefinitions";
import { Request, Response } from "express";
import { Resources, ResourceKey } from "../resourceLookup";
import * as transactionCreateCommmand from "./commands/transactions/transactionCreateCommands";
import { ViewNameLookup, RouteLookup, QueryParameterLookup, ParameterLookup } from "./lookups/routingLookup";
import { TransactionModel, queryById as queryTransactionById } from "../controllers/commands/models/transactionModel";
import { TransactionEntryModel, queryById as queryTransactionEntryById, queryByTransactionIdAndProductId } 
		from "../controllers/commands/models/transactionEntryModel";
import { execute as validateActiveUserCommand } from "./commands/activeUsers/validateActiveUserCommand";
import { execute as cancelTransactionCommand } from "./commands/transactions/cancelTransactionCommand";



export const saveTransaction = async (req: Request, res: Response): Promise<void> => {
	// should have argument employeeId of current employee, and maybe more arguments like the products
	// This code is not finished!
	transactionCreateCommmand.execute("00253");
};

export const cancel = async (req: Request, res: Response) => {
	if (Helper.handleInvalidApiSession(req, res))
		return;
	try {
		const user = (await validateActiveUserCommand((<Express.Session>req.session).id)).data!;
		const response = await cancelTransactionCommand(req.params.transactionId, user.employeeId);
		
		res.status(response.status).send(response.message ? { errorMessage: response.message } : response.data);
	} catch (error) {
		return Helper.processApiError(error, res);
	}
};

export const start = async (req: Request, res: Response): Promise<void> => {
	if (Helper.handleInvalidSession(req, res)) {
		return;
	}

	return ValidateActiveUser.execute((<Express.Session>req.session).id)
		.then((activeUserCommandResponse: CommandResponse<ActiveUser>): void => {

			res.setHeader(
				"Cache-Control",
				"no-cache, max-age=0, must-revalidate, no-store");

			return res.render(
				ViewNameLookup.Transaction,
				<TransactionPageResponse>{
					errorMessage: Resources.getString(req.query[QueryParameterLookup.ErrorCode])
				});
		}).catch((error: any): void => {
			if (!Helper.processStartError(error, res)) {
				res.setHeader(
					"Cache-Control",
					"no-cache, max-age=0, must-revalidate, no-store");

				return res.render(
					ViewNameLookup.Transaction,
					<PageResponse>{ errorMessage: error.message });
			}
		});
};
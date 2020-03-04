import { Resources, ResourceKey } from "../../../resourceLookup";
import * as Helper from "../helpers/helper";
import * as EmployeeModel from "../models/employeeModel";
import * as DatabaseConnection from "../models/databaseConnection";
import { SignInRequest } from "../../typeDefinitions";
import { CommandResponse, Employee } from "../../typeDefinitions";
import Sequelize from "sequelize";
import * as ActiveUserModel from "../models/activeUserModel";


export const signInQuery = async (signInRequest: SignInRequest, session: Express.Session): Promise<CommandResponse<void>> => {

    let authorizationTransaction: Sequelize.Transaction | null = null;

    try {
        authorizationTransaction = await DatabaseConnection.createTransaction();
        const employeeObj = await EmployeeModel.queryByEmployeeId(parseInt(signInRequest.employeeId, 10), authorizationTransaction);
        if (employeeObj == null || employeeObj.password.toString() != signInRequest.password) {
            throw <CommandResponse<void>>{
                status: 403,
                message: Resources.getString(ResourceKey.USER_SIGN_IN_CREDENTIALS_INVALID)
            };
        }
        const activeUserObj = await ActiveUserModel.queryByEmployeeId(employeeObj.id, authorizationTransaction);
        if (activeUserObj !== null) {
            activeUserObj.set("sessionKey", session.id);
            await activeUserObj.save();
        } else {
            await ActiveUserModel.ActiveUserModel.create({
                name: "${employeeObj.firstName} ${employeeObj.lastName}",
                createdOn: new Date(),
                employeeId: employeeObj.id,
                sessionKey: session.id,
                classification: employeeObj.classification
            });
        }
        await authorizationTransaction.commit();
        return <CommandResponse<void>>{ status: 204 };
    } catch (e) {
        if (authorizationTransaction != null) {
            authorizationTransaction.rollback();
        }
        throw <CommandResponse<void>>{
            status: e.status || 500,
            message: e.message || Resources.getString(ResourceKey.USER_UNABLE_TO_SIGN_IN)
        };
    }
};

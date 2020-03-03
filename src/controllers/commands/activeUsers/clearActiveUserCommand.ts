import Sequelize from "sequelize";
import * as Helper from "../helpers/helper";
import { ActiveUserModel } from "../models/activeUserModel";
import { Resources, ResourceKey } from "../../../resourceLookup";
import * as ActiveUserRepository from "../models/activeUserModel";
import { CommandResponse, ActiveUser } from "../../typeDefinitions";
import * as DatabaseConnection from "../models/databaseConnection";

export const execute = async (activeUserSessionKey?: string): Promise<CommandResponse<void>> => {
	if (Helper.isBlankString(activeUserSessionKey)) {
		return <CommandResponse<void>>{ status: 204 };
	}

	let deleteTransaction: Sequelize.Transaction;

	return DatabaseConnection.createTransaction()
		.then((createdTransaction: Sequelize.Transaction): Promise<ActiveUserModel | null> => {
			deleteTransaction = createdTransaction;

			return ActiveUserRepository.queryBySessionKey(
				<string>activeUserSessionKey,
				deleteTransaction);
		}).then((queriedActiveUser: (ActiveUserModel | null)): Promise<void> => {
			if (queriedActiveUser == null) {
				return Promise.resolve();
			}

			return queriedActiveUser.destroy(
				<Sequelize.InstanceDestroyOptions>{
					transaction: deleteTransaction
				});
		}).then((): CommandResponse<void> => {
			deleteTransaction.commit();

			return <CommandResponse<void>>{ status: 204 };
		}).catch((error: any): Promise<CommandResponse<void>> => {
			if (deleteTransaction != null) {
				deleteTransaction.rollback();
			}

			return Promise.reject(<CommandResponse<void>>{
				status: (error.status || 500),
				message: (error.message
					|| Resources.getString(ResourceKey.USER_NOT_FOUND))
			});
		});
};

import Sequelize from "sequelize";
import * as Helper from "../helpers/helper";
import { ActiveUserModel } from "../models/activeUserModel";
import { Resources, ResourceKey } from "../../../resourceLookup";
import * as ActiveUserRepository from "../models/activeUserModel";
import { CommandResponse } from "../../typeDefinitions";
import * as DatabaseConnection from "../models/databaseConnection";

export const execute = async (sessionKey: string): Promise<CommandResponse<void>> => {
	const activeUserQueried = await ActiveUserRepository.queryBySessionKey(sessionKey);

	if (!activeUserQueried) {
		Promise.reject(<CommandResponse<void>>{
			status: 404,
			message: Resources.getString(ResourceKey.USER_NOT_FOUND)
		});
	}

	await activeUserQueried?.destroy();

	return <CommandResponse<void>>{status: 204};

};

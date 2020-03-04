import { EmployeeModel } from "../models/employeeModel";
import { Resources, ResourceKey } from "../../../resourceLookup";
import * as EmployeeRepository from "../models/employeeModel";
import { CommandResponse, Employee } from "../../typeDefinitions";

export const execute = async(): Promise<CommandResponse<boolean>> => {
	return EmployeeRepository.queryActiveExists()
		.then((queriedEmployee: (EmployeeModel | null)): Promise<CommandResponse<boolean>> => {
				return Promise.resolve(<CommandResponse<boolean>>{
					status: 200,
					data: queriedEmployee !== null
				});
	});
};
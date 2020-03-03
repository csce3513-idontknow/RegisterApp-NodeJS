import { EmployeeModel } from "../models/employeeModel";
import { Resources, ResourceKey } from "../../../resourceLookup";
import * as EmployeeRepository from "../models/employeeModel";
import { CommandResponse, Employee } from "../../typeDefinitions";

export const execute = async(): Promise<CommandResponse<Employee>> => {
    return EmployeeRepository.queryActiveExists()
		.then((queriedEmployee: (EmployeeModel | null)): Promise<CommandResponse<Employee>> => {
			if (!queriedEmployee) {
				return Promise.reject(<CommandResponse<Employee>>{
					status: 200,
					message: Resources.getString(ResourceKey.EMPLOYEE_NOT_FOUND)
				});
			}

			return Promise.resolve(<CommandResponse<Employee>><unknown>{
                    status: 200,
                });
	});
};
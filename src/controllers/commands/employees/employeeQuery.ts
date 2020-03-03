import { EmployeeModel } from "../models/employeeModel";
import { Resources, ResourceKey } from "../../../resourceLookup";
import * as EmployeeRepository from "../models/employeeModel";
import { CommandResponse, Employee } from "../../typeDefinitions";

export const employeeExists = async (id: string): Promise<CommandResponse<Employee>> => {
    return EmployeeRepository.queryById(id)
        .then((queriedEmployee: (EmployeeModel | null)): Promise<CommandResponse<Employee>> => {
            if(!queriedEmployee) {
                return Promise.reject(<CommandResponse<Employee>>{
                    status: 404,
                    message: Resources.getString(ResourceKey.EMPLOYEES_UNABLE_TO_QUERY)
                });
            }

            return Promise.resolve(<CommandResponse<Employee>>{
                status: 200,
                employee: queriedEmployee
            });
        });
}
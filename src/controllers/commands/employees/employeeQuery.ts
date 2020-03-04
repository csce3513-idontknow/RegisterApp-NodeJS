import { EmployeeModel } from "../models/employeeModel";
import { Resources, ResourceKey } from "../../../resourceLookup";
import { CommandResponse, Employee } from "../../typeDefinitions";
import * as EmployeeRepository from "../models/employeeModel";
import * as Helper from "../helpers/helper";

export const employeeLookup = async (employeeId?: string): Promise<CommandResponse<Employee>> => {

    if (Helper.isBlankString(employeeId)) {
        return Promise.reject(<CommandResponse<Employee>>{
            status: 422,
            message: Resources.getString(ResourceKey.EMPLOYEE_EMPLOYEE_ID_INVALID)
        });
    }

    return EmployeeRepository.queryById(<string>employeeId)
        .then((queriedEmployee: (EmployeeModel | null)): Promise<CommandResponse<Employee>> => {
            if (!queriedEmployee) {
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
};
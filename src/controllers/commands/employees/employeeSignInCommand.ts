import { EmployeeModel } from "../models/employeeModel";
import { Resources, ResourceKey } from "../../../resourceLookup";
import * as EmployeeRepository from "../models/employeeModel";
import { CommandResponse, Employee } from "../../typeDefinitions";

export const signInQuery = async (id: string, employeePassword: string): Promise<CommandResponse<Employee>> => {
    return EmployeeRepository.queryById(id)
        .then((queriedEmployee: (EmployeeModel | null)): Promise<CommandResponse<Employee>> => {

            if (!queriedEmployee) {
                return Promise.reject(<CommandResponse<Employee>>{
                    status: 404,
                    message: Resources.getString(ResourceKey.EMPLOYEE_EMPLOYEE_ID_INVALID)
                });
            } else if (queriedEmployee.password.toString() != employeePassword) {
                return Promise.reject(<CommandResponse<Employee>>{
                    status: 404,
                    message: Resources.getString(ResourceKey.EMPLOYEE_PASSWORD_INVALID)
                });
            }

            return Promise.resolve(<CommandResponse<Employee>>{
                status: 200,
                employee: queriedEmployee
            });
        });
}

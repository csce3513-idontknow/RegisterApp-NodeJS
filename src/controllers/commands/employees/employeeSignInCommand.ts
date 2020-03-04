import { Resources, ResourceKey } from "../../../resourceLookup";
import * as Helper from "../helpers/helper";
import * as EmployeeModel from "../models/employeeModel";
import * as DatabaseConnection from "../models/databaseConnection";
import { SignInRequest } from "../../typeDefinitions";
import { CommandResponse, Employee } from "../../typeDefinitions";
import Sequelize from "sequelize";
import * as ActiveUserModel from "../models/activeUserModel";

export const signInQuery = async (id: string, employeePassword: string): CommandResponse<void> => {
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

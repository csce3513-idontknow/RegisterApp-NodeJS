import { EmployeeModel } from "../models/employeeModel";
import { Resources, ResourceKey } from "../../../resourceLookup";
import { CommandResponse, Employee, EmployeeSaveRequest } from "../../typeDefinitions";
import * as EmployeeRepository from "../models/employeeModel";
import * as Helper from "../helpers/helper";
import * as EmployeeHelper from "./helpers/employeeHelper";
import * as DatabaseConnection from "../models/databaseConnection";
import { EmployeeClassification } from "../models/constants/entityTypes";
import Sequelize from "sequelize";
import sequelize from "sequelize";
import { promises } from "dns";

const saveValidation = (saveEmployeeRequest: EmployeeSaveRequest): CommandResponse<Employee> => {
    let errorMsg = '';

    //Validation
    if (Helper.isBlankString(saveEmployeeRequest.firstName)) {
        errorMsg = Resources.getString(ResourceKey.EMPLOYEE_FIRST_NAME_INVALID);
    }
    else if (Helper.isBlankString(saveEmployeeRequest.lastName)) {
        errorMsg = Resources.getString(ResourceKey.EMPLOYEE_LAST_NAME_INVALID);
    }
    else if (Helper.isBlankString(saveEmployeeRequest.password)) {
        errorMsg = Resources.getString(ResourceKey.EMPLOYEE_PASSWORD_INVALID)
    }
    //Sets first as manager
    if (saveEmployeeRequest.isInitialEmployee) {
        saveEmployeeRequest.classification = EmployeeClassification.GeneralManager;
    }

    return errorMsg === '' ? <CommandResponse<Employee>>{ status: 200 }
        : <CommandResponse<Employee>>{
            status: 422,
            message: errorMsg
        };
};

export const execute = async (saveEmployeeRequest: EmployeeSaveRequest): Promise<CommandResponse<Employee>> => {
    const response: CommandResponse<Employee> = saveValidation(saveEmployeeRequest);
    if (response.status !== 200) {
        return Promise.reject(response);
    }

   let transactionUpdate: Sequelize.Transaction;


    return DatabaseConnection.createTransaction()
        .then((madeTransation: Sequelize.Transaction): Promise<EmployeeModel | null> => {
            transactionUpdate = madeTransation;
            return EmployeeRepository.queryByEmployeeId(+saveEmployeeRequest.id!, transactionUpdate);

        }).then((searchedEmployee: (EmployeeModel | null)): Promise<EmployeeModel> => {
            if (searchedEmployee == null) {
                return Promise.reject(<CommandResponse<Employee>>{
                    status: 404,
                    message: Resources.getString(ResourceKey.EMPLOYEE_NOT_FOUND)
                });
            }
           return searchedEmployee.update(
               <Record<string, any>>{
                   active: saveEmployeeRequest.active,
                   lastName: saveEmployeeRequest.lastName,
                   password: Buffer.from(saveEmployeeRequest.password),
                   firstName: saveEmployeeRequest.firstName,
                   managerId: saveEmployeeRequest.managerId,
                   classification: saveEmployeeRequest.isInitialEmployee ? EmployeeClassification.GeneralManager : saveEmployeeRequest.classification,   
               },
               <Sequelize.InstanceUpdateOptions>{
                   transaction: transactionUpdate
               });

        }).then((updatedEmployee: EmployeeModel): CommandResponse<Employee> => {
            transactionUpdate.commit();
            return <CommandResponse<Employee>>{
                status: 200,
                data: EmployeeHelper.mapEmployeeData(updatedEmployee)
            };
        }).catch((error: any): Promise<CommandResponse<Employee>> => {
            if(transactionUpdate != null) {
                transactionUpdate.rollback();
            }

            return Promise.reject(<CommandResponse<Employee>>{
                status: error.status || 500,
                message: error.message || Resources.getString(ResourceKey.EMPLOYEE_UNABLE_TO_SAVE)
            });
        });
};

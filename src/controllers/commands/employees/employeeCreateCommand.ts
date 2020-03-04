import { EmployeeModel } from "../models/employeeModel";
import { Resources, ResourceKey } from "../../../resourceLookup";
import { CommandResponse, Employee, EmployeeSaveRequest } from "../../typeDefinitions";
import * as EmployeeRepository from "../models/employeeModel";
import * as Helper from "../helpers/helper";
import * as DatabaseConnection from "../models/databaseConnection";
import { EmployeeClassification } from "../models/constants/entityTypes";
import Sequelize from "sequelize";

const validateSaveRequest = (saveEmployeeRequest: EmployeeSaveRequest): CommandResponse<Employee> => {
    let errorMsg: string = "";

    // Validation
    if (Helper.isBlankString(saveEmployeeRequest.firstName)) {
        errorMsg = Resources.getString(ResourceKey.EMPLOYEE_FIRST_NAME_INVALID);
    }
    else if (Helper.isBlankString(saveEmployeeRequest.lastName)) {
        errorMsg = Resources.getString(ResourceKey.EMPLOYEE_LAST_NAME_INVALID);
    }
    else if (Helper.isBlankString(saveEmployeeRequest.password)) {
        errorMsg = Resources.getString(ResourceKey.EMPLOYEE_PASSWORD_INVALID);
    }
    // Sets first as manager
    if (saveEmployeeRequest.isInitialEmployee) {
        saveEmployeeRequest.classification = EmployeeClassification.GeneralManager;
    }

    return errorMsg === "" ? <CommandResponse<Employee>>{ status: 200 }
        : <CommandResponse<Employee>>{
            status: 422,
            message: errorMsg
        };
};

export const execute = async (saveEmployeeRequest: EmployeeSaveRequest): Promise<CommandResponse<Employee>> => {
    const validationResponse: CommandResponse<Employee> = validateSaveRequest(saveEmployeeRequest);
    if (validationResponse.status !== 200) {
        return Promise.reject(validationResponse);
    }

    const employeeToCreate: EmployeeModel = <EmployeeModel>{
        active: saveEmployeeRequest.active,
        lastName: saveEmployeeRequest.lastName,
        password: Buffer.from(saveEmployeeRequest.password),
        firstName: saveEmployeeRequest.firstName,
        managerId: saveEmployeeRequest.managerId,
        classification: saveEmployeeRequest.isInitialEmployee ? EmployeeClassification.GeneralManager : saveEmployeeRequest.classification,
    };

    let createTransaction: Sequelize.Transaction;

    return DatabaseConnection.createTransaction()
        .then((createdTransaction: Sequelize.Transaction): Promise<EmployeeModel | null> => {
            createTransaction = createdTransaction;
            return EmployeeRepository.queryByEmployeeId(+saveEmployeeRequest.id!, createTransaction);

        }).then((queriedEmployee: (EmployeeModel | null)): Promise<EmployeeModel> => {
            if (queriedEmployee != null) {
                return Promise.reject(<CommandResponse<Employee>>{
                    status: 409,
                    message: Resources.getString(ResourceKey.EMPLOYEES_UNABLE_TO_QUERY)
                });
            }
            return EmployeeModel.create(
                employeeToCreate,
                <Sequelize.CreateOptions>{
                    transaction: createTransaction
                });
        }).then((createdEmployee: EmployeeModel): CommandResponse<Employee> => {
            createTransaction.commit();
            return <CommandResponse<Employee>>{
                status: 201,
                data: <Employee>{
                    active: createdEmployee.active,
                    lastName: createdEmployee.lastName,
                    password: createdEmployee.password,
                    firstName: createdEmployee.firstName,
                    managerId: createdEmployee.managerId,
                    classification: createdEmployee.classification,
                    id: createdEmployee.id,
                    createdOn: createdEmployee.createdOn,
                    employeeId: createdEmployee.id
                }
            };
        }).catch((error: any): Promise<CommandResponse<Employee>> => {
            if (createTransaction != null) {
                createTransaction.rollback();
            }

            return Promise.reject(<CommandResponse<Employee>>{
                status: error.status || 500,
                message: error.message || Resources.getString(ResourceKey.EMPLOYEE_UNABLE_TO_SAVE)
            });
        });
};

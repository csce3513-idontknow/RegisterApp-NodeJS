import { EmployeeModel } from "../models/employeeModel";
import { Resources, ResourceKey } from "../../../resourceLookup";
import { CommandResponse, Employee, EmployeeSaveRequest } from "../../typeDefinitions";
import * as EmployeeRepository from "../models/employeeModel";
import * as Helper from "../helpers/helper";
import * as DatabaseConnection from "../models/databaseConnection";
import { EmployeeClassification } from "../models/constants/entityTypes";
import Sequelize from "sequelize";

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

    const employeeCreation: EmployeeModel = <EmployeeModel>{
        active: saveEmployeeRequest.active,
        lastName: saveEmployeeRequest.lastName,
        password: Buffer.from(saveEmployeeRequest.password),
        firstName: saveEmployeeRequest.firstName,
        managerId: saveEmployeeRequest.managerId,
        classification: saveEmployeeRequest.isInitialEmployee ? EmployeeClassification.GeneralManager : saveEmployeeRequest.classification,
    };

    let createTransaction: Sequelize.Transaction;

    return DatabaseConnection.createTransaction()
        .then((madeTransation: Sequelize.Transaction): Promise<EmployeeModel | null> => {
            createTransaction = madeTransation;
            return EmployeeRepository.queryByEmployeeId(+saveEmployeeRequest.id!, createTransaction);

        }).then((searchedEmployee: (EmployeeModel | null)): Promise<EmployeeModel> => {
            if (searchedEmployee != null) {
                return Promise.reject(<CommandResponse<Employee>>{
                    status: 409,
                    message: Resources.getString(ResourceKey.EMPLOYEES_UNABLE_TO_QUERY)
                });
            }
            return EmployeeModel.create(
                employeeCreation,
                <Sequelize.CreateOptions>{
                    transaction: createTransaction
                });
        }).then((madeEmployee: EmployeeModel): CommandResponse<Employee> => {
            createTransaction.commit();
            return <CommandResponse<Employee>>{
                status: 201,
                data: <Employee>{
                    active: madeEmployee.active,
                    lastName: madeEmployee.lastName,
                    password: madeEmployee.password,
                    firstName: madeEmployee.firstName,
                    managerId: madeEmployee.managerId,
                    classification: madeEmployee.classification,
                    id: madeEmployee.id,
                    createdOn: madeEmployee.createdOn,
                    employeeId: madeEmployee.id
                }
            };
        }).catch((error: any): Promise<CommandResponse<Employee>> => {
            if(createTransaction != null) {
                createTransaction.rollback();
            }

            return Promise.reject(<CommandResponse<Employee>>{
                status: error.status || 500,
                message: error.message || Resources.getString(ResourceKey.EMPLOYEE_UNABLE_TO_SAVE)
            });
        });
};

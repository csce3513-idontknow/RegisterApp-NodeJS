import { EmployeeClassification } from "../../models/constants/entityTypes";
import { Employee } from "../../../typeDefinitions";
import { EmployeeModel } from "../../models/employeeModel";

export const hashString = (toHash: string): string => {
	return ""; // TODO: Look at https://nodejs.org/docs/latest-v12.x/api/crypto.html#crypto_crypto_createhash_algorithm_options as one option
};

export const isElevatedUser = (employeeClassification: EmployeeClassification): boolean => {
	return false; // TODO: Determine if an employee is an elevated user by their classification
};

export const mapEmployeeData = (searchedEmployee: EmployeeModel): Employee => {
	return <Employee><unknown>{
		id: searchedEmployee.id,
		active: searchedEmployee.active,
		lastName: searchedEmployee.lastName,
		password: searchedEmployee.password,
		createdOn: searchedEmployee.createdOn,
		firstName: searchedEmployee.firstName,
		managerId: searchedEmployee.managerId,
		employeeId: searchedEmployee.employeeId,
		classification: searchedEmployee.classification
	};
};
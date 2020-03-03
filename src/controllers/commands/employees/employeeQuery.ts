import { queryByEmployeeId } from "../models/employeeModel";

export const employeeExists = (employeeRecordID: number) => {
    queryByEmployeeId(employeeRecordID);
    const employeeDetails = {};

    return employeeDetails;
}
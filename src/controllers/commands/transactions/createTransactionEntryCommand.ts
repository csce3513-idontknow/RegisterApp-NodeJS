import { TransactionEntryModel } from "../models/transactionEntryModel";
import { queryByLookupCode } from "../models/productModel";
import { queryById as queryTransactionById } from "../models/transactionModel";
import { CommandResponse, TransactionEntry } from "../../typeDefinitions";
import { ResourceKey, Resources } from "../../../resourceLookup";

export const execute = async (transactionId: string, productCode: string) => {
    try{
        const check = await queryTransactionById(transactionId);
        if (!check)
            return <CommandResponse<TransactionEntry>>{
                status: 404,
                message: Resources.getString(ResourceKey.TRANSACTION_UNABLE_TO_ADD)
            };
        const product = await queryByLookupCode(productCode);
        
    }
}
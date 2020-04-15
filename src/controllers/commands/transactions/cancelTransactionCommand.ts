import { TransactionEntryModel } from "../models/transactionEntryModel";
import { queryById as queryTransactionById } from "../models/transactionModel";
import { CommandResponse, TransactionEntry } from "../../typeDefinitions";
import { ResourceKey, Resources } from "../../../resourceLookup";

export const execute = async (transactionId: string, cashierId: string) => {
    try {
        const transaction = await queryTransactionById(transactionId);
        if (!transaction)
            return <CommandResponse<TransactionEntry>>{
                status: 404,
                message: Resources.getString(ResourceKey.TRANSACTION_UNABLE_TO_CLOSE)
            };
        if (cashierId !== transaction.cashierId)
            return <CommandResponse<TransactionEntry>>{
                status: 403,
                message: Resources.getString(ResourceKey.USER_NO_PERMISSIONS)
            };

        await TransactionEntryModel.destroy({
            where: {
                transactionId
            }
        });

        await TransactionEntryModel.destroy({
            where: {
                id: transactionId
            }
        });
        return <CommandResponse<TransactionEntry>>{
            status: 204
        };
    } catch (error) {
        throw <CommandResponse<TransactionEntry>>{
            status: error.status ?? 500,
            message: error.message ?? Resources.getString(ResourceKey.TRANSACTION_UNABLE_TO_CLOSE)
        };
    }
};

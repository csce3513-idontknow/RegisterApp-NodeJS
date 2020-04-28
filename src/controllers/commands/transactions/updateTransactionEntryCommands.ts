import { TransactionEntryModel } from "../models/transactionEntryModel";
import { CommandResponse, TransactionEntry } from "../../typeDefinitions";
import { ResourceKey, Resources } from "../../../resourceLookup";

export const execute = async (transactionId: string, productId: string, quantity: number, price: number): Promise<CommandResponse<TransactionEntry>> => {
	return TransactionEntryModel.create(<TransactionEntryModel>{
	transactionId, productId, quantity, price
	}).then((createdTransaction: TransactionEntryModel): CommandResponse<TransactionEntry> => {
		return <CommandResponse<TransactionEntry>>{
			data: <TransactionEntry>{
				
				transactionId: transactionId,
				quantity: quantity,
				productId: productId,
				price: price,
				id: createdTransaction.id,
				createdOn: createdTransaction.createdOn
			},
			status: 201
		};
	}).catch((error: any): Promise<CommandResponse<TransactionEntry>> => {
		return Promise.reject(<CommandResponse<TransactionEntry>>{
			status: error.status ?? 500,
			message: error.message ?? Resources.getString(ResourceKey.TRANSACTION_UNABLE_TO_CREATE)
		});
	});
};
import { Text } from "react-native";
import { Category, Transaction } from "../types"
import Card from "./ui/Card";

interface TransactionListItemProps {
    transaction: Transaction;
    categoryInfo: Category | undefined;
}

export default function TransactionListitem({
    transaction,
    categoryInfo }:
    TransactionListItemProps) {
    return (
        <Card>
            <Text>
                {categoryInfo?.name} amount:{transaction.amount}
            </Text>
        </Card>
    );
}

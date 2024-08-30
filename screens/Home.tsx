import { useEffect, useState } from 'react';
import { ScrollView, Text, View } from 'react-native'
import { Category, Transaction, TransactionsByMonth } from '../types';
import { useSQLiteContext } from 'expo-sqlite/next';
import TransactionList from '../components/TransactionsList';
import Card from '../components/ui/Card';

export default function Home() {

    const [categories, setCategories] = useState<Category[]>([]);
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [transactionsByMonth, setTransactionsByMonth] = useState<TransactionsByMonth>({
        totalExpenses: 0,
        totalIncome: 0,
    });

    const db = useSQLiteContext();

    useEffect(() => {
        db.withTransactionAsync(async () => {
            await getData();
        });
    }, [db]);

    async function getData() {
        try {
            const result = await db.getAllAsync<Transaction>
                (`SELECT * FROM Transactions ORDER BY date DESC;`);
            setTransactions(result);

            const categoriesResult = await db.getAllAsync<Category>
                (`SELECT * FROM Categories;`);
            setCategories(categoriesResult)

            const now = new Date();
            const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
            const endOfMonth = new Date(now.getFullYear(), now.getMonth()+1, 1);
            endOfMonth.setMilliseconds(endOfMonth.getMilliseconds()-1);

        }
        catch (error) {
            console.error("error fetching transaction", error)
        }
    }
    async function deleteTransaction(id: number) {
        db.withTransactionAsync(async () => {
            await db.runAsync(`DELETE FROM Transactions WHERE id = ?;`, [id])
            await getData();
        })
    }
    return (
        <ScrollView contentContainerStyle={{
            padding: 15, paddingVertical: 170
        }}>
            <TransactionSummary
                totalExpenses={transactionsByMonth.totalExpenses}
                totalIncome={transactionsByMonth.totalIncome} />
            <TransactionList
                categories={categories}
                transactions={transactions}
                deleteTransaction={deleteTransaction} />
        </ScrollView>
    );
}

function TransactionSummary({ totalIncome, totalExpenses }: TransactionsByMonth) {

    const savings = totalIncome - totalExpenses;
    const readablePeriod = new Date().toLocaleDateString("default",
        {
            month: "long",
            year: "numeric"
        });
    return (
        <Card>
            <Text>Summary for {readablePeriod}</Text>
        </Card>
    );
}
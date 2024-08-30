import { useEffect, useState } from 'react';
import { ScrollView, Text, View}  from 'react-native'
import { Category, Transaction } from '../types';
import { useSQLiteContext } from 'expo-sqlite/next';
import TransactionList from '../components/TransactionsList';

export default function Home(){

    const [categories,setCategories] = useState<Category[]>([]);
    const [transactions, setTransactions] = useState<Transaction[]>([]);

    const db= useSQLiteContext();

    useEffect(() => {
        db.withTransactionAsync(async () => {
            await getData();
        });
    },[db]);

    async function getData() {
        try{
        const result = await db.getAllAsync<Transaction>
        (`SELECT * FROM Transactions ORDER BY date DESC;`);
        setTransactions(result);
        }
        catch (error){
            console.error("error fetching transaction",error)
        }
    }
    async function deleteTransaction(id:number){
        db.withTransactionAsync(async () =>{
            await db.runAsync(`DELETE FROM Transactions WHERE id = ?;`,[id])
            await getData();
        })
    }
    return (
        <ScrollView contentContainerStyle={{
            padding:15, paddingVertical: 170
        }}>
            <TransactionList 
            categories={categories}
            transactions={transactions}
            deleteTransaction={deleteTransaction}/>
        </ScrollView>
    );
}
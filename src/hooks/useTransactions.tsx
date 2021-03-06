import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { api } from "../services/api";




interface Transaction {
    id: number;
    title: string;
    amount: number;
    type: string;
    category: string;
    createdAt: string;
}

interface TransactionsProviderProps{
    children: ReactNode;
}

interface TransactionsContextData{
    transactions: Transaction[];
    createTransaction: (Transaction:TransactionInput) => Promise<void>;
}

type TransactionInput = Omit<Transaction, "id" | "createdAt">

const TransactionsContext = createContext<TransactionsContextData>({} as TransactionsContextData);

export function TransactionsProvider({children}:TransactionsProviderProps){
    
    const [transactions, setTrasactions] = useState<Transaction[]>([]);

    //realizando requisição
    useEffect(() => {
        api("/transactions")
            .then(response => setTrasactions(response.data.transactions))
    }, []);


    async function createTransaction(transactionInput: TransactionInput){
      const response =  await api.post("/transactions",transactionInput)
      const  {transaction } = response.data;

      setTrasactions([...transactions,transaction])
    }

   return(
    <TransactionsContext.Provider value={{transactions, createTransaction}}>
        {children}
    </TransactionsContext.Provider>
   );
    
}

export function useTransactions(){
    const context = useContext(TransactionsContext)

    return context;
}
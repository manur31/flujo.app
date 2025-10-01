import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from '../supabaseClient'
import { useAuth } from "./AuthContext";

export const ExpensesContext = createContext()

export const useExpense = () => {
    const context = useContext(ExpensesContext)
    if (!context) {
        throw new Error('useExpense most be used within an ExpenseProvider')
    }

    return context
}

export const ExpenseProvider = ({children}) => {

    const { user } = useAuth()
    const [expenses, setExpenses] = useState()

    const getExpenses = async () => {
        const { data, error } = await supabase
        .from('expenses')
        .select()
        .eq('user_id', user?.user_id)

        if (error) {
            throw error
        }

        setExpenses(data)
    }

    const createExpense = async (name, unit_price, amount) => {
        
        try {
            const { data, error } = await supabase.from('expenses').insert({
                name,
                unit_price,
                amount,
                type: 'expense',
                user_id: user?.user_id
            }).select()

            if (error) {
                throw error
            }

            setExpenses(expenses, ...data)
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <ExpensesContext.Provider value={{
                expenses, 
                getExpenses,
                createExpense
            }}>
            {children}
        </ExpensesContext.Provider>
    )
}

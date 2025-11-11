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

        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);

        const endOfDay = new Date();
        endOfDay.setHours(23, 59, 59, 999);

        const { data, error } = await supabase
        .from('expenses')
        .select()
        .eq('user_id', user?.user_id)
        .gte("created_at", startOfDay.toISOString())
        .lte("created_at", endOfDay.toISOString())

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
                return error
            }

            setExpenses(expenses, ...data)
        } catch (error) {
            console.log(error)
        }
    }

    const deleteExpense = async (id) => {
        const { error } = await supabase.from('expenses')
        .delete()
        .eq('user_id', user?.user_id)
        .eq('id', id)
        .select()

        if (error) {
            return error
        }

        setExpenses(expenses.filter(expense => expense.id !== id))
    }

    return (
        <ExpensesContext.Provider value={{
                expenses, 
                getExpenses,
                createExpense,
                deleteExpense
            }}>
            {children}
        </ExpensesContext.Provider>
    )
}

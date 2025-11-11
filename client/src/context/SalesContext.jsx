import { createContext, useContext, useState } from 'react'
import { supabase } from '../supabaseClient'
import { useAuth } from './AuthContext'

const SaleContext = createContext()

export const useSale = () => {
    const context = useContext(SaleContext)
    if (!context) {
        throw new Error("useSale most be used within an SaleProvider")
    }
    return context
}
export const SaleProvider = ({children}) => {

    const { user } = useAuth()
    const [sales, setSales] = useState(null)

    const getSales = async () => {

        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);

        const endOfDay = new Date();
        endOfDay.setHours(23, 59, 59, 999);

        const { data, error } = await supabase
        .from('sales')
        .select()
        .eq('user_id', user?.user_id)
        .gte("created_at", startOfDay.toISOString())
        .lte("created_at", endOfDay.toISOString())

        if (error) {
            throw error
        }

        setSales(data)
    } 

    const createSale = async (sales, total) => {
        try {
            const { data, error } = await supabase.from('sales').insert({
                products: sales,
                total, 
                user_id: user?.user_id
            }).select().single()

            if (error) {
                throw error
            }

            setSales([...sales, data])
            console.log(data)
        } catch (error) {
            console.log(error)
        }
    }

    const updateSale = async (id, updateFields, total) => {
        console.log(id, updateFields, total)
        const { data, error } = await supabase.from('sales')
        .update({products: updateFields, total: total})
        .eq('user_id', user?.user_id)
        .eq('id', id)
        .select()

        if (error) {
            throw error
        }

        // setSales(sales.filter(sale => sale.id !== id))
        return (data)
    }

    const deleteSale = async (id) => {
        console.log(id)
        const { error } = await supabase.from('sales')
        .delete()
        .eq('user_id', user?.user_id)
        .eq('id', id)
        .select()

        if (error) {
            return error
        }

        setSales(sales.filter(sale => sale.id !== id))
    }

    return (
        <SaleContext.Provider value={{
                sales, 
                getSales, 
                createSale,
                deleteSale,
                updateSale
            }}>
            {children}
        </SaleContext.Provider>
    )
}
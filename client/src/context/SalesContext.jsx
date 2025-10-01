import { createContext, useCallback, useContext, useEffect, useState } from 'react'
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
        const { data, error } = await supabase
        .from('sales')
        .select()
        .eq('user_id', user?.user_id)

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
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        getSales()
    },[])

    return (
        <SaleContext.Provider value={{
                sales, 
                getSales, 
                createSale
            }}>
            {children}
        </SaleContext.Provider>
    )
}
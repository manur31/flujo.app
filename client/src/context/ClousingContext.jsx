import { createContext, useContext, useState } from 'react'
import { supabase } from '../supabaseClient'
import { useAuth } from './AuthContext'

const ClousingContext = createContext()

export const useClousing = () => {
    const context = useContext(ClousingContext)
    if (!context) {
        throw new Error("useClousing most be used within an ClousingProvider")
    }
    return context
}
export const ClousingProvider = ({children}) => {

    const { user } = useAuth()
    const [clousings, setClousings] = useState([])

    const getClousings = async () => {
        const { data, error } = await supabase
        .from('clousing')
        .select()
        .eq('user_id', user?.user_id)

        if (error) {

            throw error
        }

        setClousings(data)
    } 

    const createClousing = async (transations, day) => {
        try {
            const { data, error } = await supabase.from('clousing').insert({
                transations,
                day, 
                user_id: user?.user_id
            }).select().single()

            if (error) {
                console.log(error)
                throw error
            }

            setClousings([...clousings, data])
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <ClousingContext.Provider value={{
                clousings, 
                getClousings, 
                createClousing
            }}>
            {children}
        </ClousingContext.Provider>
    )
}
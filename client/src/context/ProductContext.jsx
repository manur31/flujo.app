import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../supabaseClient'
import { useAuth } from './AuthContext'

export const ProductContext = createContext()

export const useProduct = () => {
    const context = useContext(ProductContext)
    if(!context) {
        throw new Error("useProduct most be used within an ProductProvider")
    }
    return context
}

export const ProductProvider = ({children}) => {

    const { user } = useAuth()
    const [loading, setLoading] = useState(false)
    const [products, setProducts] = useState([])


    const getProducts = async () => {
        setLoading(true)
        try {
            const { data, error } = await supabase.from('products')
            .select()
            .eq('user_id', user?.user_id)

            if (error) {
                throw error;
            }

            setProducts(data)
            setLoading(false)
        } catch (error) {
            console.log(error)
        }

    }


    const createProduct = async (name, price) => {
        setLoading(true)
        try {
            const { data, error } = await supabase.from('products')
            .insert({
                product_name: name,
                price,
                type: 'sale',
                user_id: user?.user_id
            }).select()

            if (error) {
                throw error
            }

            setProducts([...products, ...data])
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    const deleteProduct = async (id) => {
        const { error } = await supabase.from('products')
        .delete()
        .eq('user_id', user?.user_id)
        .eq('id', id)
        .select()

        if (error) {
            throw error
        }

        setProducts(products.filter(product => product.id !== id))
    }

    const updateProduct = async (id, updateFields) => {
        const { data, error } = await supabase.from('products')
        .update(updateFields)
        .eq('user_id', user?.user_id)
        .eq('id', id)
        .select()

        if (error) {
            throw error
        }

        setProducts(products.filter(product => product.id !== id))
    }

    return (
        <ProductContext.Provider value={{
                products, 
                getProducts, 
                createProduct, 
                deleteProduct, 
                updateProduct
            }}>
            {children}
        </ProductContext.Provider>
    )
}
import { useEffect, useState } from 'react'
import Button from '../components/Button'
import { useNavigate } from 'react-router'
import { useExpense } from '../context/ExpensesContext'

function FlujoGasto() {
    const { expenses, createExpense } = useExpense()
    const navigate = useNavigate()

    const [name, setName] = useState('')
    const [amount, setAmount] = useState(0)
    const [unit_price, setUnit_price] = useState(0)

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            await createExpense(name, unit_price, amount)
            navigate('/dashboard')
        } catch (error) {
            console.log(error)
        }

    }

  return (
    <main className='flex flex-col items-center justify-items-center gap-10 bg-white dark:bg-[#1E293B] h-dvh text-[#3B82F6] dark:text-white py-10 px-4'>
        <h2 className="text-4xl text-center font-bold">FlujoGasto</h2>
        <form onSubmit={handleSubmit} className='grid grid-cols-2 gap-x-4 gap-y-8'>
            <article className='flex flex-col gap-2 col-span-2 w-full'>
                <label htmlFor="name" className='text-2xl px-2'>Nombre</label>
                <input onChange={(e)=> setName(e.target.value)} type="text" name="name" placeholder='Paquete de Jamon...' className='border-2 rounded-xl px-4 py-2'/>
            </article>
            <article className='flex flex-col gap-2 w-full'>
                <label htmlFor="price" className='text-2xl px-2'>Precio</label>
                <input onChange={(e)=> setUnit_price(e.target.value)} type="number" name="price" placeholder='250..' className='border-2 rounded-xl px-4 py-2'/>
            </article>
            <article className='flex flex-col gap-2 w-full'>
                <label htmlFor="amount" className='text-2xl px-2'>Cantidad</label>
                <input onChange={(e)=> setAmount(e.target.value)} type="number" name="amount" placeholder='2...' className='border-2 rounded-xl px-4 py-2'/>
            </article>
            <section className="flex items-start pt-4 col-span-2 gap-4 w-full">
                <Button page="/dashboard">Cancelar</Button>
                <button type='submit' className='bg-[#06B6D4] hover:bg-[#19616d] text-white px-4 py-2 rounded-xl w-full'>
                    Registar
                </button>
            </section>
        </form>
        <div className='flex items-center justify-center h-full w-full bg-[#121e3b] rounded-2xl'>Anuncio</div>
    </main>
  )
}

export default FlujoGasto
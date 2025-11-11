import { useState } from 'react'
import Button from '../components/Button'
import { useExpense } from '../context/ExpensesContext'
import { toast } from 'sonner'
import { Toaster } from '../components/ui/sonner'
import { useNavigate } from 'react-router'


function FlujoGasto() {
    const { createExpense, updateExpense } = useExpense()

    const [name, setName] = useState('')
    const [amount, setAmount] = useState(1)
    const [unit_price, setUnit_price] = useState(0)

    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const result = await createExpense(name, unit_price, amount)
            if (!result) {
                toast.success(`${name} se agrego correctamente`, {
                    action: {
                    label: "Ir al panel", 
                    onClick: () => navigate('/dashboard')
                    }, 
                    className: {
                        actionButton: 'action-button',
                    }
                })
            } else {
                toast.error('Error al registrar el gasto', {
                    description: 'Debe llenar los campos obligatorios *',
                    className: {
                        title: 'title',
                        description: 'description',
                    }
                })
            }
            
        } catch (error) {
            console.log(error)
        } finally {
            setName('')
            setAmount(1)
            setUnit_price(0)
        }
    }

  return (
    <main className='flex flex-col items-center justify-items-center gap-10  bg-[#1E293B] h-dvh  text-white py-10 px-4'>
        <Toaster 
            toastOptions={{
                classNames: {
                    description: '!text-red-900 !text-sm',
                    actionButton: '!py-4'
                },
        }}/>
        <h2 className="text-4xl text-center font-bold">FlujoGasto</h2>
        <form onSubmit={handleSubmit} className='grid grid-cols-1 gap-6 w-full px-4'>
            <article className='flex flex-col gap-2 w-full'>
                <label htmlFor="name" className='text-2xl px-2'>Nombre <span className='text-red-400'>*</span></label>
                <input onChange={(e)=> setName(e.target.value)} type="text" name="name" value={name} placeholder='Paquete de Jamon...' className='border-2 rounded-xl px-4 py-2'/>
            </article>
            <article className='flex flex-col gap-2 w-full'>
                <label htmlFor="price" className='text-2xl px-2'>Precio <span className='text-red-400'>*</span></label>
                <input onChange={(e)=> setUnit_price(e.target.value)} type="number" name="price" value={unit_price} placeholder='250..' className='border-2 rounded-xl px-4 py-2'/>
            </article>
            <article className='flex flex-col gap-2 w-full'>
                <label htmlFor="amount" className='text-2xl px-2'>Cantidad</label>
                <input onChange={(e)=> setAmount(e.target.value)} type="number" name="amount" value={amount} placeholder='2...' className='border-2 rounded-xl px-4 py-2'/>
            </article>
            <section className="flex items-start pt-4 gap-4 w-full">
                <Button page="/dashboard">Cancelar</Button>
                <button type='submit' className='bg-[#06B6D4] hover:bg-[#19616d] text-white px-4 py-2 rounded-xl w-full'>
                    Registar
                </button>
            </section>
        </form>
    </main>
  )
}

export default FlujoGasto
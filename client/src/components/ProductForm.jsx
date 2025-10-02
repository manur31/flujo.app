import { useState } from "react"

function ProductForm({closeModal, createProduct}) {
    const [name, setName] = useState('')
    const [price, setPrice] = useState(0)

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const result = await createProduct(name, price)
            closeModal()
        } catch (error) {
            console.log(error)
        }
    }

  return (
    <main className='flex flex-col items-center justify-items-center gap-10 bg-white dark:bg-[#1E293B] w-full h-fit text-[#3B82F6] dark:text-white py-10 px-4'>
        <form onSubmit={handleSubmit} className='flex flex-col gap-4 gap-y-8'>
            <article className='flex flex-col items-center gap-2 w-full'>
                <label htmlFor="name" className='text-2xl px-2'>Nombre</label>
                <input onChange={(e)=> setName(e.target.value)} type="text" name="name" placeholder='Paquete de Jamon...' className='border-2 rounded-xl px-4 py-2'/>
            </article>
            <article className='flex flex-col gap-2 w-full'>
                <label htmlFor="price" className='text-2xl px-2'>Precio</label>
                <input onChange={(e)=> setPrice(e.target.value)} type="number" name="price" placeholder='250..' className='border-2 rounded-xl px-4 py-2'/>
            </article>
            <section className="flex items-start pt-4 col-span-2 gap-4 w-full">
                <button onClick={closeModal} type="button" className='bg-[#3B82F6] hover:bg-[#121e3b] text-white px-4 py-2 rounded-xl w-full'>
                    Cancelar
                </button>
                <button type='submit' className='bg-[#06B6D4] hover:bg-[#19616d] text-white px-4 py-2 rounded-xl w-full'>
                    Registar
                </button>
            </section>
        </form>
    </main>
  )
}

export default ProductForm
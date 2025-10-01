
function SaleCard({sales, closeModal}) {

  return (
    <section className="">
        <article className="dark:text-white text-2xl flex w-full justify-between mb-2">
            <p>#</p>
            <p>Nombre</p>
            <p>Total</p>
        </article>
        {sales.length === 0 ? (
            <h3 className="dark:text-white text-xl mt-6">Aun no agregas prodcutos</h3>
        ) : (
         sales.map(sale => (
            <article key={sale.id} className="flex items-center justify-between w-full dark:text-white text-xl">
                <p>{sale.amount}</p>
                <h3 className="truncate ">{sale.name}</h3>
                <p>RD${sale.unit_price * sale.amount}</p>
            </article>
        ))
        )}
        <article className="mt-6">
            <button onClick={closeModal} className='bg-[#3B82F6] hover:bg-[#121e3b] text-white px-4 py-2 rounded-xl w-full'>
                        Cerrar
            </button>
        </article>
    </section>
  )
}

export default SaleCard
import { FiPlusCircle, FiShoppingCart } from "react-icons/fi"
import Button from "../components/Button"
import { useProduct } from "../context/ProductContext"
import { useEffect, useState } from "react"
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react'
import ProductForm from "../components/ProductForm"
import SaleCard from "../components/SaleCard"
import { useSale } from "../context/SalesContext"
import { useNavigate } from "react-router"

function FlujoVenta() {

    const { products, getProducts, createProduct } = useProduct()
    const { createSale } = useSale()
    const navigate = useNavigate()

    const [sales, setSales] = useState([])
    const [total, setTotal] = useState(null)
    const [open, setOpen] = useState(false)
    const [isOpen, setIsOpen] = useState(false)
    // const [ filterProducts, setFilterProducts] = useState([])
    const [search, setSearch] = useState('')

    useEffect(() => {
        getProducts()
    },[products])

    const filterProducts = products.filter(product => {
      if (search) {
        return product.product_name.toLowerCase().includes(search.toLowerCase())
      } else {
        return products
      }
    })

    const addSale = (product) => {
        setSales(prevSales => {
            const existingProduct = prevSales.find(sale => sale.name === product.product_name);

            if (existingProduct) {
            return prevSales.map(sale =>
                sale.name === product?.product_name
                ? { ...sale, amount: sale.amount + 1 } // ✅ siempre +1
                : sale
            );
            } else {
            return [
                ...prevSales,
                {
                    name: product?.product_name,
                    unit_price: product?.price,
                    amount: 1,
                    created_at: new Date().toISOString()
                }
            ];
            }
        });
    };

    const handleClick = async () => {
      try {
            await createSale(sales, total)
            setSales([])
            setTotal(null)
            navigate('/dashboard')
        } catch (error) {
            console.log(error)
        }
    }
    
    useEffect(() => {
        const newTotal = sales.reduce((acc, sale) => acc + sale.unit_price * sale.amount, 0);
        setTotal(newTotal);
    }, [sales]);


  return (
    <main className="grid grid-rows-[60px_90px_1fr_50px] justify-center pt-8 pb-6 h-dvh w-full dark:bg-[#1E293B] dark:text-white">
        <header className="relative w-full">
            <h2 className="text-4xl text-[#3B82F6] text-center font-bold">FlujoVenta</h2>
            <span className={`absolute top-0 right-0 ${sales.length === 0 ? 'hidden' : 'flex'} size-6 bg-white text-black items-center justify-center rounded-full`}>{sales.length}</span>
            <span onClick={() => setIsOpen(!isOpen)} className="absolute top-2 right-4 text-3xl">
                <FiShoppingCart/>
            </span>
            <Dialog open={isOpen} onClose={setIsOpen} className="relative z-10">
        <DialogBackdrop
          transition
          className="fixed inset-0 bg-gray-900/50 transition-opacity data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in"
        />

        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <DialogPanel
              transition
              className="relative transform overflow-hidden rounded-lg bg-gray-800 text-left shadow-xl outline -outline-offset-1 outline-white/10 transition-all data-closed:translate-y-4 data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in sm:my-8 sm:w-full w-full sm:max-w-lg data-closed:sm:translate-y-0 data-closed:sm:scale-95 px-2"
            >
              <div className="bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <DialogTitle as="h3" className="font-semibold text-white text-3xl">
                      Carrito
                    </DialogTitle>
                    <div className="mt-2">
                      <SaleCard sales={sales} closeModal={() => setIsOpen(!isOpen)}/>
                    </div>
                  </div>
                </div>
              </div>
            </DialogPanel>
          </div>
        </div>
      </Dialog>
        </header>
        <section className="flex flex-col gap-2 w-full">
            <input type="text" onChange={e => setSearch(e.target.value)} placeholder="Buscar producto..." className="text-xl px-6 py-2 w-full border-2 border-[#3B82F6] rounded-2xl"/>
            <p onClick={() => setOpen(true)} className={`pl-4 ${products.length === 0 ? 'hidden' : 'flex'}`}>Agregar nuevo producto...</p>
            <Dialog open={open} onClose={setOpen} className="relative z-10">
        <DialogBackdrop
          transition
          className="fixed inset-0 bg-gray-900/50 transition-opacity data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in"
        />

        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <DialogPanel
              transition
              className="relative transform overflow-hidden rounded-lg bg-gray-800 text-left shadow-xl outline -outline-offset-1 outline-white/10 transition-all data-closed:translate-y-4 data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in sm:my-8 sm:w-full sm:max-w-lg data-closed:sm:translate-y-0 data-closed:sm:scale-95 px-8"
            >
              <div className="bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <DialogTitle as="h3" className="font-semibold text-white text-3xl">
                      Apregar producto
                    </DialogTitle>
                    <div className="mt-2">
                      <ProductForm closeModal={() => setOpen(!open)} createProduct={createProduct}/>
                    </div>
                  </div>
                </div>
              </div>
            </DialogPanel>
          </div>
        </div>
      </Dialog>
        </section>
        <section className="grid grid-cols-1 gap-4 overflow-scroll h-96 mt-4">
            {products.length === 0 ? (
                <article 
                        className="flex items-center w-full h-fit gap-3 border-4 border-[#3B82F6] rounded-xl px-6 py-4"
                    >
                        <h3 className="truncate text-xl text-nowrap font-medium">Agregar producto</h3>
    
                            <span 
                                onClick={() => setOpen(!open)} 
                                className="text-3xl cursor-pointer hover:scale-110 transition-transform"
                            >
                                <FiPlusCircle />
                            </span>
                    </article>
                ) : (
                  Array.isArray(filterProducts) && filterProducts.map(product => {
                    const saleItem = sales.find(sale => sale.name === product.product_name);

                    return (
                        <article 
                            key={product.id} 
                            className="grid grid-cols-[1fr_80px_50px] w-full gap-3 border-4 border-[#3B82F6] rounded-xl px-6 py-4 items-center h-fit"
                        >
                            <h3 className="truncate text-xl text-nowrap font-medium">{product.product_name}</h3>
                            <p className="text-lg font-medium">RD$ {product.price}</p>
        
                            <div className="flex items-center gap-2">
                                {saleItem?.amount > 0 && (
                                    <span className="text-lg font-semibold text-[#3B82F6]">
                                    x{saleItem.amount}
                                    </span>
                                )}
                                <span 
                                    onClick={() => addSale(product)} 
                                    className="text-3xl cursor-pointer hover:scale-110 transition-transform"
                                >
                                    <FiPlusCircle />
                                </span>
                            </div>
                        </article>
                    );   
                    }))}
            
        </section>
        <section className="flex gap-4 w-full relative mt-2">
            <Button page="/dashboard">Cancelar</Button>
            <button onClick={handleClick} className='bg-[#06B6D4] hover:bg-[#19616d] text-white px-4 py-2 rounded-xl w-full'>
                    Vender
            </button>
        </section>
    </main>
  )
}

export default FlujoVenta
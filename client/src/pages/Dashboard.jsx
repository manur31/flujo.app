import Header from '../components/Header'
import Button from '../components/Button'
import { FiShare } from 'react-icons/fi'
import {
    Tooltip,
    PieChart,
    Pie
} from 'recharts'
import { useProduct } from '../context/ProductContext'
import { useAuth } from '../context/AuthContext'
import { useEffect, useState } from 'react'
import { useExpense } from '../context/ExpensesContext'
import { useSale } from '../context/SalesContext'
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react'
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline'

function Dashboard() {

    const { getProducts } = useProduct()
    const { expenses, getExpenses } = useExpense()
    const { session } = useAuth()
    const { sales, getSales } = useSale()
    const [ sold, setSold ] = useState([])
    const [transations, setTransations] = useState()
    const [ dailyTotal, setDailyTotal] = useState()
    const [ salesItems, setSalesItems] = useState()
    const [ expensesItems, setExpensesItems ] = useState()
    const [open, setOpen] = useState(true)

    useEffect(() => {
        if (!session?.user.user_metadata.email_verified) {
            setOpen(true)
        } else {
            setOpen(false)
        }
    },[])

     useEffect(() => {
        getProducts()  
        getExpenses()  
        getSales()
    },[])

    useEffect(() => {
        const merged = [
            ...(sold || []),
            ...(expenses || [])
        ]
        const sorted = merged.sort(
            (a, b) => new Date(b.created_at) - new Date(a.created_at)
        )
        setTransations(sorted)
    }, [sold, expenses])


    useEffect(() => {
        if (sales) {
            const soldProducts = sales.map(sale => sale.products).flat()
            setSold(soldProducts)
        }
    }, [sales])


    const totalIncome = (income = []) => {
        let incomeFinal = 0
        for (let i = 0; income?.length > i; i++) {
            let incomePrevio = income[i]?.unit_price * income[i]?.amount
            incomeFinal += incomePrevio
        }

        return incomeFinal
    }

    useEffect(() => {
        if (sold?.length > 0) {
            setSalesItems(totalIncome(sold))
        }
        if (expenses?.length > 0) {
            setExpensesItems(totalIncome(expenses))
        }


        setDailyTotal(salesItems + expensesItems)
    },[sold, expenses])


    const chartData = [
        {
            name: 'Ingresos',
            value: salesItems,
            fill: '#06B6D4'
        },
        {
            name: 'Gastos',
            value: expensesItems,
            fill: '#3B82F6'
        }
    ]

  return (
    <main className='bg-white dark:bg-[#1E293B] dark:text-white h-dvh'>
        <Header/>
        <article className='flex flex-col gap-4'>
            <h4 className='text-xl uppercase text-center font-bold pt-2'>Resumen del dia</h4>
            <section className='flex flex-col items-center relative p-14'>
                <p className='text-xl font-bold'> {dailyTotal !== 0 ? `RD$ ${dailyTotal}` : 'Aun no vendes'}</p>
                <p className='text-sm'>Total del dia</p>
                <div className=' absolute top-0 left-0 w-full h-full flex items-center justify-center'>
                    <PieChart width={300} height={300}>
                        <Pie data={chartData} dataKey='value' nameKey='name' cx='50%' cy='50%' outerRadius={85} innerRadius={70} fill='#06B6D4'/>
                        <Tooltip/>
                    </PieChart>
                </div>
            </section>
            <section className='flex items-center gap-10 mb-4 justify-center'>
                <article className='flex flex-col items-center'>
                    <article className='flex items-center gap-1'>
                        <div className='size-3 bg-[#3B82F6] rounded-full'></div>
                        <p className='text-sm'>Gastos</p>
                    </article>
                    <h4 className='text-xl font-bold'>RD$ {expensesItems ? expensesItems : 0}</h4>
                </article>
                <article className='flex flex-col items-center'>
                    <article className='flex items-center gap-1'>
                        <div className='size-3 bg-[#06B6D4] rounded-full'></div>
                        <p className='text-sm'>Ingresos</p>
                    </article>
                    <h4 className='text-xl font-bold'>RD$ {salesItems ? salesItems : 0}</h4>
                </article>
            </section>
        </article>
        <article className='rounded-xl mx-4 overflow-hidden mb-2 border-b-4 border-[#3B82F6]'>
            <header className='flex justify-between items-center px-4 py-2 bg-[#3B82F6] text-white'>
                <p>Movimientos</p>
                <FiShare/>
            </header>
            <section className={'overflow-scroll h-42'}>
                {Array.isArray(transations) && transations.map(transation => (
                    <article className='grid grid-cols-[30px_1fr_50px_50px] gap-1 mx-2 px-4 py-2 border-b-2 border-[#3B82F6]' key={transation?.created_at}>
                        <p>{transation?.amount}</p>
                        <h3 className='truncate text-nowrap pr-2'>{transation?.name}</h3>
                        <p>{transation?.amount * transation?.unit_price}</p>
                        <p className='justify-self-end'>{transation?.type === 'expense' ? 'Gasto' : 'Ingreso'}</p>
                    </article>
                ))}
            </section>
        </article>
        <article className='flex gap-2 mx-10 py-4'>
            <Button page='/gasto'>Gasto</Button>
            <Button page='/venta' action={true}>Ingreso</Button>
        </article>

        <Dialog open={open} onClose={setOpen} className="relative z-10">
        <DialogBackdrop
          transition
          className="fixed inset-0 bg-gray-900/50 transition-opacity data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in"
        />

        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <DialogPanel
              transition
              className="relative transform overflow-hidden rounded-lg bg-gray-800 text-left shadow-xl outline -outline-offset-1 outline-white/10 transition-all data-closed:translate-y-4 data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in sm:my-8 sm:w-full sm:max-w-lg data-closed:sm:translate-y-0 data-closed:sm:scale-95"
            >
              <div className="bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex size-12 shrink-0 items-center justify-center rounded-full bg-red-500/10 sm:mx-0 sm:size-10">
                    <ExclamationTriangleIcon aria-hidden="true" className="size-6 text-yellow-400" />
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <DialogTitle as="h3" className="text-2xl font-semibold text-white">
                      Confirmar correo
                    </DialogTitle>
                  </div>
                </div>
                <div className="bg-gray-700/25 mt-6 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                    <p className="text-lg text-gray-400">
                        Revisa tu bandeja de correo y haz clic en el botón Confirmar mi correo para continuar.
                    </p>
                </div>
              </div>
            </DialogPanel>
          </div>
        </div>
      </Dialog>
    </main>
  )
}

export default Dashboard
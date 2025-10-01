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

function Dashboard() {

    const { getProducts } = useProduct()
    const { expenses, getExpenses } = useExpense()
    const { sales, getSales } = useSale()
    const [ sold, setSold ] = useState([])
    const [transations, setTransations] = useState()
    const [ dailyTotal, setDailyTotal] = useState()
    const [ salesItems, setSalesItems] = useState()
    const [ expensesItems, setExpensesItems ] = useState()

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
                <p className='text-xl font-bold'>RD$ {dailyTotal}</p>
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
                    <h4 className='text-xl font-bold'>RD$ {expensesItems}</h4>
                </article>
                <article className='flex flex-col items-center'>
                    <article className='flex items-center gap-1'>
                        <div className='size-3 bg-[#06B6D4] rounded-full'></div>
                        <p className='text-sm'>Ingresos</p>
                    </article>
                    <h4 className='text-xl font-bold'>RD$ {salesItems}</h4>
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
                    <article className='grid grid-cols-[20px_1fr_50px_50px] gap-1 mx-2 px-4 py-2 border-b-2 border-[#3B82F6]' key={transation?.created_at}>
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
    </main>
  )
}

export default Dashboard
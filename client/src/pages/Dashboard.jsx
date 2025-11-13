import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import { useProduct } from '../context/ProductContext'
import { useExpense } from '../context/ExpensesContext'
import { useSale } from '../context/SalesContext'
import { useClousing } from '../context/ClousingContext'
import Header from '../components/Header'
import Button from '../components/Button'
import {
    Tooltip,
    PieChart,
    Pie
} from 'recharts'
import Transations from '../components/Transations'
import { Spinner } from '../components/ui/spinner'

function Dashboard() {
    const { getProducts } = useProduct()
    const { expenses, getExpenses } = useExpense()
    const { sales, getSales } = useSale()
    const { getClousings, clousings, createClousing } = useClousing()

    const [sold, setSold] = useState([])
    const [transations, setTransations] = useState()
    const [dailyTotal, setDailyTotal] = useState()
    const [salesItems, setSalesItems] = useState(0)
    const [expensesItems, setExpensesItems ] = useState(0)
    const [loading, setLoading] = useState(false)
    const [haveClouse, setHaveClouse] = useState(null)
    const [day, setDay] = useState('')

     useEffect(() => {
        getProducts()  
        getExpenses()  
        getSales()
        getClousings()
    },[])

    useEffect(() => {
        setLoading(true)
        if (sales) {
            const updatedSale = sales?.map(sale => ({
                ...sale, 
                products: sale?.products?.map(product => ({
                    ...product,
                    saleId: sale?.id
                }))
            }))

            const soldProducts = updatedSale.map(sale => sale.products).flat()
            setSold(soldProducts)
        }
        setLoading(false)
    }, [sales])

    const date = new Date()

    useEffect(() => {
        setDay(date.toLocaleDateString("es-MX",{ day:'numeric', month:'long', year:'numeric' }))
        if (day) {
            const filteredClouse = clousings.filter(clouse => clouse.day === day)
            if (filteredClouse.length > 0) {
                setHaveClouse(true)
            }
        }
        if (haveClouse === null) {
            getClousings()
        }
    }, [clousings])

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

    const totalIncome = (income = []) => {
        let incomeFinal = 0
        if (income.length !== 0) {
            for (let i = 0; income?.length > i; i++) {
                let incomePrevio = income[i]?.unit_price * income[i]?.amount
                incomeFinal += incomePrevio
            }
        }
        return incomeFinal
    }

    useEffect(() => {
        setLoading(true)
        if (sold?.length > 0) {
            setSalesItems(totalIncome(sold))
        }
        if (expenses?.length > 0) {
            setExpensesItems(totalIncome(expenses))
        }

        setDailyTotal(salesItems - expensesItems)
        setLoading(false)
    },[sold, expenses, transations])

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
    <main className='bg-[#1E293B] text-white h-dvh'>
        <Header/>
        <article className='flex flex-col gap-4'>
            <h4 className='text-xl uppercase text-center font-bold '>Resumen del dia</h4>
            <section className='flex flex-col items-center relative p-14'>
                <p className='text-lg font-medium'> {
                    loading ? (<Spinner className='size-8'/>) : (
                        dailyTotal === 0 || Number.isNaN(dailyTotal) ? 'Aun no vendes' : `RD$ ${dailyTotal}`
                    )
                }</p>
                <p className='text-sm'>Total del dia</p>
                <Link to={'/clousers'}>
                    <div className=' absolute top-0 left-0 w-full h-full flex items-center justify-center'>
                        <PieChart width={300} height={300}>
                            <Pie data={chartData} dataKey='value' nameKey='name' cx='50%' cy='50%' outerRadius={85} innerRadius={70} fill='#06B6D4'/>
                            <Tooltip/>
                        </PieChart>
                    </div>
                </Link>
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
        <Transations data={transations} haveClouse={haveClouse} createClousing={createClousing}/>
        <article className='flex gap-4 mx-8 mb-10 py-4'>
            <Button page='/gasto' disabled={haveClouse}>Gasto</Button>
            <Button page='/venta' action={true} disabled={haveClouse}>Ingreso</Button>
        </article>

    </main>
  )
}

export default Dashboard
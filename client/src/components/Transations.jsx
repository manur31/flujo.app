import { useEffect, useState } from 'react'
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { FiLock, FiShare } from 'react-icons/fi';
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react'
import { useAuth } from '../context/AuthContext';

function Transations({data, createClousing}) {
    const [normalized, setNormalized] = useState([])
    const [day, setDay] = useState('')
    const [open, setOpen] = useState(false)
    const [isOpen, setIsOpen] = useState(false)
    const { user } = useAuth()

    const date = new Date()

    useEffect(()=> {
        setNormalized(data?.map(item => ({
            name: item?.name || "",
            amount: item?.amount ?? 0,
            unit_price: item?.unit_price ?? 0,
            type: item?.type || "sale",
            created_at: item?.created_at || ""
        })));

        setDay(date.toLocaleDateString("es-MX",{ day:'numeric', month:'long', year:'numeric' }))
    },[data])

    const generatePDF = () => {
        const doc = new jsPDF();

        let totalSales = 0;
        let totalExpenses = 0;

        normalized.forEach(item => {
            const totalItem = item.amount * item.unit_price;
            if (item.type === "sale") totalSales += totalItem;
            else if (item.type === "expense") totalExpenses += totalItem;
        });

        doc.setFontSize(16);
        doc.text(`Reporte de Ventas y Gastos de ${user?.bussines_name}`, 14, 15);

        autoTable(doc, {
            startY: 25,
            head: [["Nombre", "Cantidad", "Precio Unitario", "Tipo", "Fecha"]],
            body: normalized.map(item => [
                item.name,
                item.amount,
                `$${item.unit_price}`,
                item.type,
                new Date(item.created_at).toLocaleString()
            ]),
            theme: "striped",
            styles: { fontSize: 10 }
        });


        const finalY = doc.lastAutoTable.finalY + 10;
        doc.setFontSize(14);
        doc.text("Totales:", 14, finalY);
        doc.setFontSize(12);
        doc.text(`- Total Ventas: $${totalSales}`, 14, finalY + 10);
        doc.text(`- Total Gastos: $${totalExpenses}`, 14, finalY + 20);
        doc.text(`- Balance: $${totalSales - totalExpenses}`, 14, finalY + 30);

        doc.save(`${user?.bussines_name}-${day}-reporte.pdf`);
        setIsOpen(!isOpen)
    };

    const handleClick = () => {
        createClousing(normalized, day)
        setOpen(!open)
    }
    
  return (
    <article className='rounded-xl mx-4 overflow-hidden mb-2 border-b-4 border-[#3B82F6]'>
        <header className='flex justify-between items-center px-4 py-2 bg-[#3B82F6] text-white'>
            <p>Movimientos</p>
            <section className='flex gap-4 text-lg'>
                <FiShare onClick={() => setIsOpen(!isOpen)}/>
                <FiLock onClick={() => setOpen(!open)}/>
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
                                            Confirmar cierre
                                            </DialogTitle>
                                            <h3 className="mt-4 text-white text-xl">
                                            ¿Deseas cerrar el día?
                                            </h3>
                                            <p className="mt-4 text-white">
                                            Al confirmar el cierre no podrás registrar más ventas o gastos hasta mañana. Asegúrate de que todas tus transacciones de hoy estén completas antes de continuar.
                                            </p>
                                            <div className='flex gap-4 mt-6'>
                                                <button onClick={() => setOpen(!open)} type="button" className='bg-[#3B82F6] hover:bg-[#121e3b] text-white px-4 py-2 rounded-xl w-full'>
                                                    Cancelar
                                                </button>
                                                <button onClick={handleClick} className='bg-[#06B6D4] hover:bg-[#19616d] text-white px-4 py-2 rounded-xl w-full'>
                                                    Confirmar
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </DialogPanel>
                        </div>
                    </div>
                </Dialog>
                <Dialog open={isOpen} onClose={setIsOpen} className="relative z-10">
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
                                            Confirmar PDF
                                            </DialogTitle>
                                            <h3 className="mt-4 text-white text-xl">
                                                Generar reporte del día
                                            </h3>
                                            <p className="mt-4 text-white">
                                                Presiona <strong>"Guardar"</strong> para descargar un PDF con todas las transacciones registradas hoy.
                                            </p>
                                            <div className='flex gap-4 mt-6'>
                                                <button onClick={() => setIsOpen(!isOpen)} type="button" className='bg-[#3B82F6] hover:bg-[#121e3b] text-white px-4 py-2 rounded-xl w-full'>
                                                    Cancelar
                                                </button>
                                                <button onClick={generatePDF} className='bg-[#06B6D4] hover:bg-[#19616d] text-white px-4 py-2 rounded-xl w-full'>
                                                    Guardar
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </DialogPanel>
                        </div>
                    </div>
                </Dialog>
            </section>
        </header>
        <section className={'overflow-scroll h-42'}>
            {Array.isArray(normalized) && normalized.map(transation => (
                <article className='grid grid-cols-[30px_1fr_50px_50px] gap-1 mx-2 px-4 py-2 border-b-2 border-[#3B82F6]' key={transation?.created_at}>
                    <p>{transation?.amount}</p>
                    <h3 className='truncate text-nowrap pr-2'>{transation?.name}</h3>
                    <p>{transation?.amount * transation?.unit_price}</p>
                    <p className='justify-self-end'>{transation?.type === 'expense' ? 'Gasto' : 'Ingreso'}</p>
                </article>
            ))}
        </section>
    </article>
  )
}

export default Transations
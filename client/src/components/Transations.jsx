import { useEffect, useState } from 'react'
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { FiLock, FiShare, FiMoreVertical, FiTrash2 } from 'react-icons/fi';
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react'
import { useAuth } from '../context/AuthContext';
import { toast } from 'sonner'
import { Toaster } from '../components/ui/sonner'
import { Spinner } from '../components/ui/spinner'
import { useExpense } from '../context/ExpensesContext';
import { useSale } from '../context/SalesContext';

function Transations({data, haveClouse,createClousing}) {

    const { deleteExpense } = useExpense()
    const { deleteSaleProduct } = useSale()


    const [normalized, setNormalized] = useState([])
    const [day, setDay] = useState('')
    const [open, setOpen] = useState(false)
    const [isOpen, setIsOpen] = useState(false)
    const [openItem, setOpenItem] = useState(false)
    const [currentItem, setCurrentItem] = useState(null)
    const [loading, setLoading] = useState(false)
    const { user } = useAuth()

    const date = new Date()

    useEffect(()=> {
        setNormalized(data?.map(item => ({
            name: item?.name || "",
            amount: item?.amount ?? 0,
            unit_price: item?.unit_price ?? 0,
            type: item?.type || "sale",
            created_at: item?.created_at || "",
            id: item?.id,
            saleId: item?.saleId || item?.id
        })));

        setDay(date.toLocaleDateString("es-MX",{ day:'numeric', month:'long', year:'numeric' }))
    },[data])

    const generatePDF = () => {
        const doc = new jsPDF();

        let totalSales = 0;
        let totalExpenses = 0;

        normalized?.forEach(item => {
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
        toast.success('PDF generado con exito');
    };

    const handleClick = () => {
        createClousing(normalized, day)
        toast.success(`El cierre de ${day} se realizo correctamente`)
        setOpen(!open)
    }

    const handleDelete = async (name, id, saleId) => {
        setLoading(true)
        if (id === saleId) {
            const result = await deleteExpense(id)
            if (!result) {
                toast.success(`${name} se elimino correctamente`, { 
                    className: {
                        actionButton: 'action-button',
                    }
                })
            } else if (result) {
                toast.error(`Hubo un error al eliminar ${name}`)
            } 
        } else {
            try {
                await deleteSaleProduct(saleId, id);
                toast.success(`${name} eliminado correctamente`);
            } catch (error) {
                console.error('Error:', error);
                toast.error(`Error al eliminar ${name}`);
            }
        }

        setLoading(false)
        setOpenItem(!openItem)
    }
    
  return (
    <article className='rounded-xl mx-4 overflow-hidden mb-2 border-b-4 border-[#3B82F6]'>
        <header className='flex justify-between items-center px-4 py-2 bg-[#3B82F6] text-white'>
            <p>Movimientos</p>
            <section className='flex gap-4 text-lg'>
                <FiShare onClick={() => setIsOpen(!isOpen)} className='cursor-pointer hover:text-[#06B6D4]'/>
                <FiLock onClick={() => setOpen(!open)} className='cursor-pointer hover:text-[#06B6D4]'/>
                <Dialog open={open} onClose={setOpen} className="relative z-10">
                    <DialogBackdrop
                    transition
                    className="fixed inset-0 bg-gray-900/50 transition-opacity data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in"
                    />
y
                    <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                            <DialogPanel
                            transition
                            className="relative transform overflow-hidden rounded-lg bg-gray-800 text-left shadow-xl outline -outline-offset-1 outline-white/10 transition-all data-closed:translate-y-4 data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in sm:my-8 sm:w-full sm:max-w-lg data-closed:sm:translate-y-0 data-closed:sm:scale-95 px-8"
                            >
                                <div className="bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                    <div className="sm:flex sm:items-start">
                                        {
                                            !haveClouse ? (
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
                                                <button onClick={handleClick} className='bg-[#06B6D4] hover:bg-[#19616d] text-white px-4 py-2 rounded-xl w-full disabled:opacity-30'>
                                                    Confirmar
                                                </button>
                                            </div>
                                        </div>
                                            ) : (
                                                <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                                            <DialogTitle as="h3" className="font-semibold text-white text-3xl">
                                                Cierre ya realizado
                                            </DialogTitle>
                                            <h3 className="mt-4 text-white text-lg">
                                            {`Ya has cerrado el ${day}`}
                                            </h3>
                                            <p className="mt-4 text-white text-lg">
                                                No es posible realizar otro cierre hasta mañana. Vuelve a intentarlo una vez inicie el nuevo día.
                                            </p>
                                            <div className='flex gap-4 mt-6'>
                                                <button onClick={() => setOpen(!open)} type="button" className='bg-[#3B82F6] hover:bg-[#121e3b] text-white px-4 py-2 rounded-xl w-full'>
                                                    Cancelar
                                                </button>
                                            </div>
                                        </div>
                                            )
                                        }
                                        
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
                                                <button onClick={() => {setIsOpen(!isOpen), setLoading(false)}} type="button" className='bg-[#3B82F6] hover:bg-[#121e3b] text-white px-4 py-2 rounded-xl w-full'>
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
            
            {Array.isArray(normalized) && normalized.map((transation, index) => (
                <article className='grid grid-cols-[30px_1fr_50px_50px_10px] gap-1 mx-2 pl-4 pr-2 py-2 items-center border-b-2 border-[#3B82F6]' key={index}>
                    <p>{transation?.amount}</p>
                    <h3 className='truncate text-nowrap pr-2'>{transation?.name}</h3>
                    <p>{transation?.amount * transation?.unit_price}</p>
                    <p className='justify-self-end'>{transation?.type === 'expense' ? 'Gasto' : 'Ingreso'}</p>
                    <FiMoreVertical className='justify-self-start' onClick={() => {
                        setOpenItem(!openItem); 
                        setCurrentItem(transation)
                    }}/>
                        
                </article>
            ))}

            <Dialog open={openItem} onClose={setOpenItem} className="relative z-10">
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
                                            <DialogTitle as="h3" className="font-semibold text-white text-2xl">
                                            {currentItem?.name}
                                            </DialogTitle>
                                            <div className='flex items-center justify-center mt-4 px-2 text-white'>
                                                <div className='flex flex-col items-center gap-2'>
                                                    {
                                                        loading ? <Spinner className='size-8'/> : <FiTrash2 size={32} className='text-red-400' onClick={() => handleDelete(currentItem?.name, currentItem.id, currentItem.saleId)}/>
                                                    }
                                                    <p>{loading ? 'Eliminando...' : "Eliminar"}</p>
                                                </div>
                                            </div>
                                            <div className='flex gap-4 mt-6'>
                                                <button onClick={() => setOpenItem(!openItem)} type="button" className='bg-[#3B82F6] hover:bg-[#121e3b] text-white px-4 py-2 rounded-xl w-full'>
                                                    Cancelar
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
        <Toaster
            toastOptions={{
                classNames: {
                    title: '!text-lg',
                },
                duration: 3000
        }}/>
    </article>
  )
}

export default Transations
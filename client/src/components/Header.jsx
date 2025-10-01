import { useEffect, useState } from "react"
import Button from "./Button.jsx"
import { FiMenu, FiX } from "react-icons/fi"
import { useAuth } from "../context/AuthContext.jsx"
import { Link } from "react-router"

function Header() {

    const { session, user } = useAuth()
    const [isOpen, setIsOpen] = useState(false)

  return (
    <header className="flex justify-between sticky top-0 left-0 bg-white dark:bg-[#1E293B] dark:text-white items-center px-8 py-6 z-10">
        <Link to={'/dashboard'}>
            <h1 className="text-3xl font-bold uppercase">Flujo</h1>
        </Link>
        <section>
            <article className="text-3xl font-bold" onClick={() => setIsOpen(!isOpen)}>
                <FiMenu/>
            </article>
        </section>
        <article className={`bg-[#000000b9] ${isOpen ? 'flex' : 'hidden'} absolute left-0 top-0 w-full h-dvh`}>
            <section className="flex flex-col gap-4 items-center pt-16 pb-8 px-10 bg-white dark:bg-[#1E293B] w-full h-fit">
                {session ? (
                        <Link to={'/profile'}>
                            <h3>{user?.user_name}</h3>
                        </Link>
                    ) : (
                        <article className="flex gap-4 mt-4">
                            <Button page="/register">
                                Registarme
                            </Button>
                            <Button page="/login" action={true}>
                                Iniciar Sesion
                            </Button>
                        </article>
                    )
                }
                
                <div className='flex items-center justify-center h-48 w-full mt-4 bg-[#121e3b] rounded-2xl'>Anuncio</div>
            </section>
            <p className="absolute right-6 top-6 text-3xl uppercase font-bold" onClick={() => setIsOpen(!isOpen)}>
                <FiX/>
            </p>
        </article>
    </header>
  )
}

export default Header
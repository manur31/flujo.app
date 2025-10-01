import React from 'react'
import { useAuth } from '../context/AuthContext'
import Header from '../components/Header'

function Profile() {

    const { signOut } = useAuth()

    const handleClick = async () => {
        await signOut()
    }

  return (
    <>
        <Header/>
        <div className='flex flex-col items-center'>
            <h2 className='text-center pt-4 text-3xl font-bold'>Profile</h2>
            <button onClick={handleClick} className='bg-[#3B82F6] text-white py-2 rounded-2xl w-40 my-6'>
                Cerrar sesion
            </button>
        </div>
    </>
  )
}

export default Profile
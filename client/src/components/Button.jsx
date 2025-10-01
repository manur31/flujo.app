import { useNavigate } from 'react-router'

function Button({children, page, action=false}, onclick) {
    const navigate = useNavigate()

    const handleclick = () => {
      if (page) {
        navigate(page)
      } else {
        onclick()
      }
    }

  return (
    <button onClick={handleclick} type='button' className={`w-full sm:w-fit justify-center flex items-center text-nowrap px-4 py-2 ${action ? 'bg-[#06B6D4] hover:bg-[#19616d]' : 'bg-[#3B82F6] hover:bg-[#121e3b]'}  text-white rounded-xl  cursor-pointer`}>
        {children}
    </button>
  )
}

export default Button
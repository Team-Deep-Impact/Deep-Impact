import { Link } from "react-router-dom"

function NavBar() {
  
    return (
      <>
        <div className='flex items-center w-full h-20 justify-center bg-gray-800 border-b border-2 border-black'>
            <ul className='flex gap-16 items-center justify-center'>
                <li><Link to='/'><p className='text-2xl text-white hover:text-red-900'>Main</p></Link></li>
                <li><Link to='scenario/'><p className='text-2xl text-white hover:text-red-900'>Scenario</p></Link></li>
                <li><Link to='about/'><p className='text-2xl text-white hover:text-red-900'>About</p></Link></li>
                <li><Link to='effects/'><p className='text-2xl text-white hover:text-red-900'>Effects</p></Link></li>
            </ul>
        </div>
      </>
    )
  }
  
  export default NavBar
import { Outlet } from 'react-router-dom'
import './App.css'
import NavBar from './components/navbar'

function App() {

  return (
    <>
      <div className='flex flex-col items-center bg-gray-600 min-h-screen'>
        <NavBar />
        <Outlet />
      </div>
    </>
  )
}

export default App

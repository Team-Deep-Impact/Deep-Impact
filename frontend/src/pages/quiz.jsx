import { useState } from "react"
import axios from 'axios';
import { Button } from "@mui/material";

const Quiz = () => {
  const [clicked, setClicked] = useState(false)
  const [quiz,setQuiz] = useState(null)

  const handleQuiz = async() => {
    setClicked(true)
    try{
      const newQuiz = await axios(`${import.meta.env.VITE_REACT_APP_SERVER}/api/openai/`)
      console.log("newQuiz.data :",newQuiz.data)
      setQuiz(newQuiz.data)
  }
    catch {
      alert("Could not make quiz. Try again")
    } finally {
    setClicked(false)  
    }
  }

  return (
    <>
      <div className='text-white text-center flex flex-col w-1/2'>
          <div className='m-4'>
          <p className='text-2xl underline mb-2'>Test Your Knowledge?</p>
          <p>Deep impact is a web-app designed to give users insight into potential danger of asteroid impact. Using the NASA NeoWs API we have created a simulation tool to visualize incoming asteroids and various methods of asteroid deflection.</p>
          </div>
          <div className='m-4'>
            <Button variant="danger" onClick={handleQuiz}>Start Quiz</Button>
          <p className='text-2xl underline mb-2'>Our Team</p>
          {/* <ul>
            <li>Daniel Smith-dePaz</li>
            <li>Jordan Yamada</li>
            <li>Pierre Bell</li>
            <li>Michael Roy</li>
            <li>Mickey Shoenberger</li>
            <li>Jordan Edgington</li>
          </ul> */}
          </div>
          <p className='italic m-4'>The Sky Is Falling!</p>
          <p className='m-4'>To see learn more about Deep Impact, checkout our <a href='https://github.com/Team-Deep-Impact/Deep-Impact' className='underline hover:text-red-900'>GitHub</a>.</p>
      </div>
    </>
  )
}

export default Quiz

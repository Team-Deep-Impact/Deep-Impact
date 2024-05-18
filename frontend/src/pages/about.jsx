function About() {
  
    return (
      <>
        <div className='text-white text-center flex flex-col w-1/2'>
            <div className='m-4'>
            <p className='text-2xl underline mb-2'>What is Deep Impact?</p>
            <p>Deep impact is a web-app designed to give users insight into potential danger of asteroid impact. Using the NASA NeoWs API we have created a simulation tool to visualize incoming asteroids and various methods of asteroid deflection.</p>
            </div>
            <div className='m-4'>
            <p className='text-2xl underline mb-2'>Our Team</p>
            <ul>
              <li>Daniel Smith-dePaz</li>
              <li>Jordan Yamada</li>
              <li>Pierre Bell</li>
              <li>Michael Roy</li>
              <li>Mickey Shoenberger</li>
              <li>Jordan Edgington</li>
            </ul>
            </div>
            <p className='italic m-4'>The Sky Is Falling!</p>
            <p className='m-4'>To see learn more about Deep Impact, checkout our <a href='https://github.com/Team-Deep-Impact/Deep-Impact/blob/threats-page/frontend/src/pages/about.jsx' className='underline hover:text-red-900'>GitHub</a>.</p>
        </div>
      </>
    )
  }
  
  export default About
  
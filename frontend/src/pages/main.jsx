import distanceImage from '../assets/Objects_between_earth_and_moon_crop.jpg';

function Main() {
  
    return (
      <>
        <div className='w-7/12'>
            <h1 class="text-center text-2xl text-white my-5">Welcome to Deep Impact!</h1>
            <h2 class="text-center underline text-xl text-white my-5">Close Approaches</h2>
            <h3 class="text-xl text-white my-3">How close?</h3>
            <p class="text-l text-white">A body in space is considered a near-earth object if passing within 1.3 times the distance from the Earth to the Sun (defined as 1 astronomical unit, AU).  For reference, the Earth is 93 million miles from the Sun (150 million km), and the moon is 238,900 miles (384,000 km) from Earth.</p>
            <h3 class="text-xl text-white my-3">What's the issue? </h3>
            <p class="text-l text-white">Collision with the earth can have significant effects on the environment, ranging from local effects to global impact.</p>
            <p class="text-l text-white">A potential hazardous asteroid (PHA) would approach closer than 0.05 AU and a diameter of greater than 500 ft (140m).</p>
            <h3 class="text-xl text-white my-3">How often?</h3>
            <p class="text-l text-white">Since 1900, NASA has logged 2,586 PHAs and anticipate 3,317 more out to 2200 AD.</p>
            <img src={distanceImage} class="mt-5"/>
            <p class="text-base text-white text-center">Comparison of the distances of satellite range and the closest approaches to the Earth</p>
            <h2 class="text-center underline text-xl text-white my-5">Examples</h2>
            <p class="text-l text-white">In 1957, 2019 CD2 asteroid passed 46,349 mi from Earth, with a diameter of 850-1940 ft.  This is relatively large, and with this asteroid's orbit around the sun it will have at least 5 more close approaches in the future (although not as close). </p>
            <p class="text-l text-white">In 2029, 99942 Apophis, an asteroid of around 1,115 ft in diameter, will pass 23,619 mi from the Earth.</p>
            <p class="text-l text-white mb-10">The near-earth object everyone recognizes is Halley's Comet. With observations going back 2,000 years, the comet approaches the earth every 76 years.  The comet is large, being about 48,000 ft by 26,000 ft.  Thankfully the closest approach has been 0.033 AU (3 million miles), in 837 AD.</p>

        </div>
      </>
    )
  }
  
  export default Main
  
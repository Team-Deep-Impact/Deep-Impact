import React, { useState, useEffect, useRef } from 'react';
import { Stage, Layer, Circle, Text, Line } from 'react-konva';
import { Slider } from '@mui/material';
import axios from 'axios';

const API_KEY = 'LF7i77oqghRiq54HEFJh991WgjHcKsETP9D5ofsg';
const EARTH_RADIUS_KM = 6371; // Earth's radius in kilometers
const EARTH_DISPLAY_SCALE = 0.01; // Display scale for Earth
const ASTEROID_DISPLAY_SCALE = 0.3; // Display scale for asteroids
const G = 1e-8; // Gravitational constant for simulation
const EARTH_MASS = 5.972e6; // Scaled down mass of Earth for simulation
const ASTEROID_DENSITY = 2000; // Density in kg/m^3

const CANVAS_WIDTH = window.innerWidth;
const CANVAS_HEIGHT = window.innerHeight;
const EARTH_X = CANVAS_WIDTH - 100;
const EARTH_Y = CANVAS_HEIGHT / 2;
const SIMULATION_AREA_MULTIPLIER = 2; // Extend the simulation area

function Scenario() {
  const [asteroid, setAsteroid] = useState({
    name: '',
    size: 1,
    speed: 0.05,
    mass: 1,
    angle: Math.PI / 4,
    x: 100,
    y: CANVAS_HEIGHT / 2 - 100,
  });
  const [trajectoryPoints, setTrajectoryPoints] = useState([]);
  const animationRef = useRef();
  const asteroidsData = useRef([]);
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationResult, setSimulationResult] = useState('');
  const [strategy, setStrategy] = useState(''); // State for selected strategy
  const [timeStep, setTimeStep] = useState(100); // State for time step

  useEffect(() => {
    const fetchAsteroids = async () => {
      try {
        const response = await axios.get(`https://api.nasa.gov/neo/rest/v1/neo/browse?api_key=${API_KEY}`);
        asteroidsData.current = response.data.near_earth_objects;
        setAsteroidData(0); // Set initial asteroid
      } catch (error) {
        console.error('Error fetching asteroid data:', error);
      }
    };
    fetchAsteroids();
  }, []);

  const estimateMass = (diameter) => {
    const radius = diameter / 2;
    const volume = (4 / 3) * Math.PI * Math.pow(radius, 3);
    return volume * ASTEROID_DENSITY;
  };

  const setAsteroidData = (index) => {
    const asteroidData = asteroidsData.current[index];
    console.log('Asteroid Data:', asteroidData);
    const size = asteroidData.estimated_diameter.kilometers.estimated_diameter_max;
    const mass = estimateMass(size);
    setAsteroid({
      name: asteroidData.name,
      size: size,
      speed: asteroidData.close_approach_data[0].relative_velocity.kilometers_per_second / 1000,
      mass: mass,
      angle: Math.PI / 8,
      x: 100,
      y: CANVAS_HEIGHT / 2 - 100,
    });
    setTrajectoryPoints([]);
  };

  const handleAsteroidSelect = (event) => {
    setAsteroidData(event.target.value);
  };

  const applyDeflectionStrategy = (vx, vy) => {
    if (strategy === 'Nuclear Detonation') {
      vx += 0.5; // Example effect
    } else if (strategy === 'Kinetic Impact') {
      vx += 0.25; // Example effect
    } else if (strategy === 'Gravity Tractor') {
      vy -= 0.1; // Example effect
    }
    return { vx, vy };
  };

  const simulate = () => {
    let { x, y, speed, angle, mass } = asteroid;

    let vx = speed * Math.cos(angle);
    let vy = speed * Math.sin(angle);

    const updateFrame = () => {
      console.log(`Asteroid position: (${x}, ${y}), velocity: (${vx}, ${vy})`);

      const dx = EARTH_X - x;
      const dy = EARTH_Y - y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance <= EARTH_RADIUS_KM * EARTH_DISPLAY_SCALE + asteroid.size * ASTEROID_DISPLAY_SCALE) {
        setSimulationResult('Asteroid collided with Earth!');
        setIsSimulating(false);
        return;
      }

      // Apply gravitational force
      const force = (G * EARTH_MASS * mass) / (distance * distance);
      const ax = force * (dx / distance) / mass;
      const ay = force * (dy / distance) / mass;

      vx += ax * timeStep;
      vy += ay * timeStep;

      ({ vx, vy } = applyDeflectionStrategy(vx, vy));

      x += vx * timeStep;
      y += vy * timeStep;

      if (y > CANVAS_HEIGHT * SIMULATION_AREA_MULTIPLIER || x > CANVAS_WIDTH * SIMULATION_AREA_MULTIPLIER || y < -CANVAS_HEIGHT * SIMULATION_AREA_MULTIPLIER || x < -CANVAS_WIDTH * SIMULATION_AREA_MULTIPLIER) {
        setSimulationResult('Asteroid missed Earth!');
        setIsSimulating(false);
        return;
      }

      setAsteroid(prev => ({ ...prev, x, y }));
      setTrajectoryPoints(prev => [...prev, x, y]);
      animationRef.current = window.requestAnimationFrame(updateFrame);
    };

    setIsSimulating(true);
    setSimulationResult('');
    animationRef.current = window.requestAnimationFrame(updateFrame);
  };

  const handleSimulate = () => {
    if (isSimulating) return;
    simulate();
  };

  const handleTimeStepChange = (event, newValue) => {
    setTimeStep(newValue);
  };

  return (
    <>
      <div>
        <h1>Asteroid Collision Scenario</h1>
        <select onChange={handleAsteroidSelect}>
          {asteroidsData.current.map((ast, index) => (
            <option key={index} value={index}>{ast.name}</option>
          ))}
        </select>
        <select onChange={(e) => setStrategy(e.target.value)}>
          <option value="">Select Deflection Strategy</option>
          <option value="Nuclear Detonation">Nuclear Detonation</option>
          <option value="Kinetic Impact">Kinetic Impact</option>
          <option value="Gravity Tractor">Gravity Tractor</option>
        </select>
        <button onClick={handleSimulate} disabled={isSimulating}>Simulate</button>
        {simulationResult && (
          <div>
            <h2>Simulation Result</h2>
            <p>{simulationResult}</p>
          </div>
        )}
        {asteroid.name && (
          <div>
            <h3>Asteroid Information</h3>
            <p><strong>Name:</strong> {asteroid.name}</p>
            <p><strong>Size:</strong> {asteroid.size.toFixed(3)} kilometers</p>
            <p><strong>Speed:</strong> {(asteroid.speed * 1000).toFixed(3)} km/s</p>
            <p><strong>Mass:</strong> {asteroid.mass.toExponential(3)} kg</p>
          </div>
        )}
        <div>
          <h3>Time Step: {timeStep}</h3>
          <Slider
            value={timeStep}
            min={10}
            max={500}
            step={10}
            onChange={handleTimeStepChange}
            aria-labelledby="time-step-slider"
          />
        </div>
      </div>
      <Stage width={CANVAS_WIDTH} height={CANVAS_HEIGHT}>
        <Layer>
          <Text text="Earth" fontSize={20} x={EARTH_X - EARTH_RADIUS_KM * EARTH_DISPLAY_SCALE} y={EARTH_Y - 10} />
          <Circle x={EARTH_X} y={EARTH_Y} radius={EARTH_RADIUS_KM * EARTH_DISPLAY_SCALE} fill="blue" />
          <Circle x={asteroid.x} y={asteroid.y} radius={asteroid.size * ASTEROID_DISPLAY_SCALE} fill="gray" stroke="black" strokeWidth={1} />
          {trajectoryPoints.length > 0 && (
            <Line points={trajectoryPoints.flat()} stroke="red" strokeWidth={2} />
          )}
        </Layer>
      </Stage>
    </>
  );
}

export default Scenario;

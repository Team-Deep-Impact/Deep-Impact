import React, { useState, useEffect, useRef } from 'react';
import { Stage, Layer, Circle, Text, Line } from 'react-konva';
import { Slider, Button } from '@mui/material';
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
const ROCKET_SPEED = 0.1; // Speed of the rocket

function Scenario() {
  const [asteroid, setAsteroid] = useState({
    name: '',
    size: 1,
    speed: 0.05,
    mass: 1,
    angle: Math.PI / 9,
    x: 100,
    y: CANVAS_HEIGHT / 2 - 100,
  });
  const [trajectoryPoints, setTrajectoryPoints] = useState([]);
  const [forecastPoints, setForecastPoints] = useState([]);
  const animationRef = useRef();
  const asteroidsData = useRef([]);
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationResult, setSimulationResult] = useState('');
  const [strategy, setStrategy] = useState(''); // State for selected strategy
  const [timeStep, setTimeStep] = useState(100); // State for time step
  const [rocket, setRocket] = useState({ active: false, x: EARTH_X, y: EARTH_Y, trajectory: [], targetX: 0, targetY: 0 });

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
    const speed = asteroidData.close_approach_data[0].relative_velocity.kilometers_per_second / 1000;
    setAsteroid({
      name: asteroidData.name,
      size: size,
      speed: speed,
      mass: mass,
      angle: Math.PI / 9,
      x: 100,
      y: CANVAS_HEIGHT / 2 - 100,
    });
    setTrajectoryPoints([]);
    calculateForecastPath(size, speed, Math.PI / 9, mass); // Calculate the forecast path once
    setRocket({ active: false, x: EARTH_X, y: EARTH_Y, trajectory: [], targetX: 0, targetY: 0 });
  };

  const handleAsteroidSelect = (event) => {
    setAsteroidData(event.target.value);
  };

  const calculateForecastPath = (size, speed, angle, mass) => {
    let x = 100;
    let y = CANVAS_HEIGHT / 2 - 100;
    let vx = speed * Math.cos(angle);
    let vy = speed * Math.sin(angle);
    const points = [];
    let iterationCount = 0;
    const maxIterations = 2000; // Extended limit to allow for longer forecast

    while (true) {
      const dx = EARTH_X - x;
      const dy = EARTH_Y - y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      // Check if the asteroid hits Earth
      if (distance <= EARTH_RADIUS_KM * EARTH_DISPLAY_SCALE + size * ASTEROID_DISPLAY_SCALE) {
        break;
      }

      // Apply gravitational force
      const force = (G * EARTH_MASS * mass) / (distance * distance);
      const ax = force * (dx / distance) / mass;
      const ay = force * (dy / distance) / mass;

      vx += ax * timeStep;
      vy += ay * timeStep;

      x += vx * timeStep;
      y += vy * timeStep;

      points.push(x, y);

      iterationCount++;
      if (iterationCount >= maxIterations) {
        break;
      }

      // Stop the loop if the asteroid goes off screen
      if (y > CANVAS_HEIGHT * SIMULATION_AREA_MULTIPLIER || x > CANVAS_WIDTH * SIMULATION_AREA_MULTIPLIER || y < -CANVAS_HEIGHT * SIMULATION_AREA_MULTIPLIER || x < -CANVAS_WIDTH * SIMULATION_AREA_MULTIPLIER) {
        break;
      }
    }

    setForecastPoints(points);
  };

  const calculateInterceptionPoint = (rocketSpeed, asteroidX, asteroidY, asteroidVX, asteroidVY) => {
    let interceptX = asteroidX;
    let interceptY = asteroidY;
    let closestApproach = Infinity;

    for (let t = 0; t < 5000; t += timeStep) {
      const futureAsteroidX = asteroidX + asteroidVX * t;
      const futureAsteroidY = asteroidY + asteroidVY * t;

      const dx = futureAsteroidX - EARTH_X;
      const dy = futureAsteroidY - EARTH_Y;
      const distanceToAsteroid = Math.sqrt(dx * dx + dy * dy);

      const timeToIntercept = distanceToAsteroid / rocketSpeed;
      if (Math.abs(timeToIntercept - t) < closestApproach) {
        closestApproach = Math.abs(timeToIntercept - t);
        interceptX = futureAsteroidX;
        interceptY = futureAsteroidY;
      }
    }

    console.log(`Calculated interception point: (${interceptX}, ${interceptY})`);
    return { x: interceptX, y: interceptY };
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

      x += vx * timeStep;
      y += vy * timeStep;

      // Calculate the interception point for the rocket in real-time
      const { x: interceptX, y: interceptY } = calculateInterceptionPoint(ROCKET_SPEED, x, y, vx, vy);
      setRocket((prev) => ({ ...prev, targetX: interceptX, targetY: interceptY }));

      console.log(`Rocket target updated to: (${interceptX}, ${interceptY})`);

      // Update rocket position
      const rocketDx = rocket.targetX - rocket.x;
      const rocketDy = rocket.targetY - rocket.y;
      const rocketDistance = Math.sqrt(rocketDx * rocketDx + rocketDy * rocketDy);

      if (rocketDistance > 1) {
        const rocketAngle = Math.atan2(rocketDy, rocketDx);
        const rocketVX = ROCKET_SPEED * Math.cos(rocketAngle);
        const rocketVY = ROCKET_SPEED * Math.sin(rocketAngle);

        setRocket((prev) => ({
          ...prev,
          x: prev.x + rocketVX * timeStep,
          y: prev.y + rocketVY * timeStep,
          trajectory: [...prev.trajectory, prev.x + rocketVX * timeStep, prev.y + rocketVY * timeStep],
        }));
      } else {
        setSimulationResult('Rocket intercepted the asteroid!');
        setIsSimulating(false);
        return;
      }

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
    if (isSimulating) {
      setIsSimulating(false);
      window.cancelAnimationFrame(animationRef.current);
      setSimulationResult('Simulation stopped.');
    } else {
      simulate();
    }
  };

  const handleTimeStepChange = (event, newValue) => {
    setTimeStep(newValue);
  };

  const handleAngleChange = (event, newValue) => {
    setAsteroid(prev => ({ ...prev, angle: newValue }));
    calculateForecastPath(asteroid.size, asteroid.speed, newValue, asteroid.mass);
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
        <Button
          variant="contained"
          color="primary"
          onClick={handleSimulate}
          style={{ marginTop: '10px' }}
        >
          {isSimulating ? 'Stop Simulation' : 'Simulate'}
        </Button>
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
        <div>
          <h3>Initial Angle: {(asteroid.angle * 180 / Math.PI).toFixed(2)}°</h3>
          <Slider
            value={asteroid.angle}
            min={0}
            max={Math.PI / 2}
            step={Math.PI / 180}
            onChange={handleAngleChange}
            aria-labelledby="angle-slider"
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
          {forecastPoints.length > 0 && (
            <Line points={forecastPoints} stroke="gray" strokeWidth={2} dash={[10, 10]} />
          )}
          {rocket.active && (
            <Circle x={rocket.x} y={rocket.y} radius={5} fill="red" />
          )}
          {rocket.trajectory.length > 0 && (
            <Line points={rocket.trajectory} stroke="red" strokeWidth={2} />
          )}
        </Layer>
      </Stage>
    </>
  );
}

export default Scenario;

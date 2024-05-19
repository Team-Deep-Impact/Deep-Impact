import React, { useState, useEffect, useRef } from 'react';
import { Stage, Layer, Circle, Text, Line } from 'react-konva';
import { Slider, Button, MenuItem, Select, Typography, Box } from '@mui/material';
import axios from 'axios';

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
const ROCKET_SPEED = 0.025; // Reduced speed of the rocket

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
  const [rocket, setRocket] = useState({
    active: false,
    x: EARTH_X,
    y: EARTH_Y,
    trajectory: [],
    vx: 0,
    vy: 0,
  });
  const [rocketDistance, setRocketDistance] = useState(10000);
  const [collisionOccurred, setCollisionOccurred] = useState(false);

  useEffect(() => {
    const fetchAsteroids = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_REACT_APP_SERVER}/api/sentry/`);
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
    setRocket({ active: false, x: EARTH_X, y: EARTH_Y, trajectory: [], vx: 0, vy: 0 });
    setRocketDistance(10000);
    setCollisionOccurred(false);
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

  const applyVelocityImpulse = (asteroid, strategy, rocketDx, rocketDy) => {
    let impulseX = 0;
    let impulseY = 0;
    const angle = Math.atan2(rocketDy, rocketDx);
    if (strategy === 'Nuclear Detonation') {
      impulseX = 0.01 * Math.cos(angle);
      impulseY = 0.01 * Math.sin(angle);
    } else if (strategy === 'Kinetic Impact') {
      impulseX = 0.005 * Math.cos(angle);
      impulseY = 0.005 * Math.sin(angle);
    }
    return { vx: asteroid.vx + impulseX, vy: asteroid.vy + impulseY };
  };

  const simulate = () => {
    let { x, y, speed, angle, mass } = asteroid;

    let vx = speed * Math.cos(angle);
    let vy = speed * Math.sin(angle);

    const updateFrame = () => {
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

      // Update rocket position
      setRocket((prev) => {
        const rocketDx = x - prev.x;
        const rocketDy = y - prev.y;
        const rocketDistance = Math.sqrt(rocketDx * rocketDx + rocketDy * rocketDy);
        const rocketAngle = Math.atan2(rocketDy, rocketDx);

        const rocketVX = ROCKET_SPEED * Math.cos(rocketAngle);
        const rocketVY = ROCKET_SPEED * Math.sin(rocketAngle);

        const newX = prev.x + rocketVX * timeStep;
        const newY = prev.y + rocketVY * timeStep;

        if (rocketDistance <= asteroid.size * ASTEROID_DISPLAY_SCALE && !collisionOccurred) {
          const newVelocity = applyVelocityImpulse({ vx, vy }, strategy, rocketDx, rocketDy);
          vx = newVelocity.vx;
          vy = newVelocity.vy;
          setSimulationResult('Rocket intercepted the asteroid!');
          setCollisionOccurred(true); // Mark collision occurred
          return { ...prev, active: false, x: newX, y: newY, vx: 0, vy: 0 }; // Stop the rocket
        }

        return {
          ...prev,
          x: newX,
          y: newY,
          vx: prev.active ? rocketVX : 0, // Stop velocity if inactive
          vy: prev.active ? rocketVY : 0, // Stop velocity if inactive
          trajectory: [...prev.trajectory, newX, newY],
        };
      });

      setRocketDistance(rocketDistance);

      if (rocketDistance <= asteroid.size * ASTEROID_DISPLAY_SCALE && !collisionOccurred) {
        setSimulationResult('Rocket intercepted the asteroid!');
        setIsSimulating(false);
        return;
      }

      if (y > CANVAS_HEIGHT * SIMULATION_AREA_MULTIPLIER || x > CANVAS_WIDTH * SIMULATION_AREA_MULTIPLIER || y < -CANVAS_HEIGHT * SIMULATION_AREA_MULTIPLIER || x < -CANVAS_WIDTH * SIMULATION_AREA_MULTIPLIER) {
        setSimulationResult('Asteroid missed Earth!');
        setIsSimulating(false);
        return;
      }

      setAsteroid((prev) => ({ ...prev, x, y }));
      setTrajectoryPoints((prev) => [...prev, x, y]);
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
    setAsteroid((prev) => ({ ...prev, angle: newValue }));
    calculateForecastPath(asteroid.size, asteroid.speed, newValue, asteroid.mass);
  };

  return (
    <>
      <Box sx={{ padding: '20px', maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
        <Typography variant="h4" gutterBottom>
          Asteroid Collision Scenario
        </Typography>
        <Box sx={{ marginBottom: '20px' }}>
          <Select
            value={asteroid.name}
            onChange={handleAsteroidSelect}
            displayEmpty
            fullWidth
          >
            {asteroidsData.current.map((ast, index) => (
              <MenuItem key={index} value={index}>
                {ast.name}
              </MenuItem>
            ))}
          </Select>
        </Box>
        <Box sx={{ marginBottom: '20px' }}>
          <Select
            value={strategy}
            onChange={(e) => setStrategy(e.target.value)}
            displayEmpty
            fullWidth
          >
            <MenuItem value="">Select Deflection Strategy</MenuItem>
            <MenuItem value="Nuclear Detonation">Nuclear Detonation</MenuItem>
            <MenuItem value="Kinetic Impact">Kinetic Impact</MenuItem>
          </Select>
        </Box>
        <Button
          variant="contained"
          color="primary"
          onClick={handleSimulate}
          style={{ marginBottom: '20px' }}
        >
          {isSimulating ? 'Stop Simulation' : 'Simulate'}
        </Button>
        {simulationResult && (
          <Box sx={{ marginBottom: '20px' }}>
            <Typography variant="h6">Simulation Result</Typography>
            <Typography>{simulationResult}</Typography>
          </Box>
        )}
        {asteroid.name && (
          <Box sx={{ marginBottom: '20px' }}>
            <Typography variant="h6">Asteroid Information</Typography>
            <Typography><strong>Name:</strong> {asteroid.name}</Typography>
            <Typography><strong>Size:</strong> {asteroid.size.toFixed(3)} kilometers</Typography>
            <Typography><strong>Speed:</strong> {(asteroid.speed * 1000).toFixed(3)} km/s</Typography>
            <Typography><strong>Mass:</strong> {asteroid.mass.toExponential(3)} kg</Typography>
          </Box>
        )}
        <Box sx={{ marginBottom: '20px' }}>
          <Typography>Time Step: {timeStep}</Typography>
          <Slider
            value={timeStep}
            min={10}
            max={500}
            step={10}
            onChange={handleTimeStepChange}
            aria-labelledby="time-step-slider"
          />
        </Box>
        <Box sx={{ marginBottom: '20px' }}>
          <Typography>Initial Angle: {(asteroid.angle * 180 / Math.PI).toFixed(2)}°</Typography>
          <Slider
            value={asteroid.angle}
            min={0}
            max={Math.PI / 2}
            step={Math.PI / 180}
            onChange={handleAngleChange}
            aria-labelledby="angle-slider"
          />
        </Box>
      </Box>
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
            <Line points={rocket.trajectory} stroke="green" strokeWidth={2} />
          )}
        </Layer>
      </Stage>
    </>
  );
}

export default Scenario;

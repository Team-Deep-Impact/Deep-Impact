# Scenario Component Documentation

## Overview

The `Scenario` component simulates an asteroid collision scenario with Earth and the effect of a deflection strategy using a rocket. The simulation involves gravitational forces and velocity impulses to alter the asteroid's trajectory.

## Dependencies

- `react-konva`: For rendering and managing canvas elements.
- `@mui/material`: For UI components like buttons, sliders, and selects.
- `axios`: For fetching data from an API.

## Constants

- `EARTH_RADIUS_KM`: Earth's radius in kilometers.
- `EARTH_DISPLAY_SCALE`: Display scale for Earth.
- `ASTEROID_DISPLAY_SCALE`: Display scale for asteroids.
- `G`: Gravitational constant for the simulation.
- `EARTH_MASS`: Scaled-down mass of Earth for the simulation.
- `ASTEROID_DENSITY`: Density of the asteroid in kg/m³.
- `CANVAS_WIDTH` and `CANVAS_HEIGHT`: Dimensions of the canvas.
- `EARTH_X` and `EARTH_Y`: Position of Earth on the canvas.
- `SIMULATION_AREA_MULTIPLIER`: Factor to extend the simulation area.
- `ROCKET_SPEED`: Speed of the rocket.
- `ROCKET_RADIUS`: Radius of the rocket.

## State Variables

- `asteroid`: Object containing details about the asteroid (name, size, speed, mass, angle, position).
- `trajectoryPoints`: Array of points representing the asteroid's trajectory.
- `forecastPoints`: Array of points representing the forecasted path of the asteroid.
- `animationRef`: Ref to manage the animation frame.
- `asteroidsData`: Ref to store the fetched asteroid data.
- `isSimulating`: Boolean indicating if the simulation is running.
- `simulationResult`: String to store the result of the simulation.
- `strategy`: Selected deflection strategy.
- `timeStep`: Time step for the simulation.
- `rocket`: Object containing details about the rocket (position, velocity, trajectory).
- `rocketDistance`: Distance between the rocket and the asteroid.
- `collisionOccurred`: Boolean indicating if a collision has occurred.

## Functions

- `useEffect`: Fetches asteroid data when the component mounts.
- `estimateMass(diameter)`: Estimates the mass of the asteroid based on its diameter.
- `setAsteroidData(index)`: Sets the data for the selected asteroid and initializes simulation parameters.
- `handleAsteroidSelect(event)`: Handles the selection of an asteroid from the dropdown.
- `calculateForecastPath(size, speed, angle, mass)`: Calculates the forecasted path of the asteroid.
- `applyVelocityImpulse(asteroid, strategy, rocketDx, rocketDy)`: Applies a velocity impulse to the asteroid based on the selected strategy and the direction of the rocket.
- `simulate()`: Runs the simulation, updating the positions and velocities of the asteroid and the rocket.
- `handleSimulate()`: Starts or stops the simulation.
- `handleTimeStepChange(event, newValue)`: Updates the time step for the simulation.
- `handleAngleChange(event, newValue)`: Updates the initial angle of the asteroid and recalculates the forecast path.

## JSX Structure

- **Box**: Container for the UI elements.
  - **Typography**: Displays the title and headers.
  - **Select**: Dropdown for selecting an asteroid and a deflection strategy.
  - **Button**: Starts or stops the simulation.
  - **Slider**: Adjusts the time step and initial angle of the asteroid.
  - **Asteroid Information**: Displays the selected asteroid's details.

- **Stage**: Konva canvas stage.
  - **Layer**: Layer for rendering elements on the canvas.
    - **Text**: Labels the Earth.
    - **Circle**: Represents the Earth and the asteroid.
    - **Line**: Represents the asteroid's trajectory and forecasted path.
    - **Circle**: Represents the rocket.
    - **Line**: Represents the rocket's trajectory.

## Example Usage

```javascript
import React from 'react';
import ReactDOM from 'react-dom';
import Scenario from './Scenario';

ReactDOM.render(<Scenario />, document.getElementById('root'));
```

# Physics and Math in the Asteroid Collision Simulation

## Overview

This simulation models the interaction between an asteroid, Earth, and a deflection rocket. It uses fundamental principles of physics and mathematics to simulate gravitational forces, velocity and position updates, and the application of velocity impulses for deflection. Here, we explain the key equations and their relevance.

## Gravitational Force

### Newton's Law of Universal Gravitation

The gravitational force \( F \) between Earth and the asteroid is given by:

$$
F = \frac{G \cdot m_1 \cdot m_2}{d^2}
$$

Where:
- \( G \) is the gravitational constant (\(1 \times 10^{-8}\) for this simulation).
- \( m_1 \) is the mass of Earth.
- \( m_2 \) is the mass of the asteroid.
- \( d \) is the distance between the centers of Earth and the asteroid.

This force determines the gravitational pull exerted by Earth on the asteroid, influencing its trajectory as it approaches Earth.

### Acceleration

Using Newton's second law of motion, the acceleration \( a \) of the asteroid due to Earth's gravitational force is calculated as:

$$
a = \frac{F}{m_2}
$$

Where:
- \( F \) is the gravitational force.
- \( m_2 \) is the mass of the asteroid.

The acceleration components in the x and y directions are:

$$
a_x = a \cdot \frac{dx}{d}
$$

$$
a_y = a \cdot \frac{dy}{d}
$$

Where:
- \( dx \) and \( dy \) are the differences in the x and y coordinates between Earth and the asteroid.
- \( d \) is the distance between Earth and the asteroid.

## Velocity and Position Updates

The asteroid's velocity is updated using the calculated acceleration:

$$
v_x = v_x + a_x \cdot \Delta t
$$

$$
v_y = v_y + a_y \cdot \Delta t
$$

Where:
- \( v_x \) and \( v_y \) are the velocity components of the asteroid.
- \( a_x \) and \( a_y \) are the acceleration components.
- \( \Delta t \) is the time step of the simulation.

The new position of the asteroid is calculated as:

$$
x = x + v_x \cdot \Delta t
$$

$$
y = y + v_y \cdot \Delta t
$$

Where:
- \( x \) and \( y \) are the position coordinates of the asteroid.

## Deflection Strategy and Velocity Impulse

When the deflection rocket collides with the asteroid, a velocity impulse is applied to alter its trajectory. The impulse depends on the selected deflection strategy and the angle of impact.

### Impulse Calculation

The impulse components are calculated as:

$$
\text{impulse}_x = I \cdot \cos(\theta)
$$

$$
\text{impulse}_y = I \cdot \sin(\theta)
$$

Where:
- \( I \) is the magnitude of the impulse, determined by the deflection strategy.
- \( \theta \) is the angle of impact between the rocket and the asteroid.

The new velocity of the asteroid after the impulse is:

$$
v_x = v_x + \text{impulse}_x
$$

$$
v_y = v_y + \text{impulse}_y
$$

By updating the velocity and position of the asteroid at each time step, the simulation provides a realistic representation of its motion and interaction with Earth and the deflection rocket.



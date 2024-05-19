# Deep Impact

![Deep Impact](https://dalle-image-storage.s3.amazonaws.com/1715997915066.jpeg)

## Live App

[Deep Impact](https://deep-impact.onrender.com/)

## Overview

Deep Impact is a web application designed to provide users with insights into the potential dangers of asteroid impacts. Utilizing the NASA NeoWs API, we've developed a simulation tool that visualizes incoming asteroids and explores various methods of asteroid deflection.

### Our Team

- [Pierre Bell](https://github.com/Landy-87)
- [Jordan Edgington](https://github.com/Jordan-Edgington)
- [Michael Roy](https://github.com/its-michaelroy)
- [Mickey Shoenberger](https://github.com/michelle-shoenberger)
- [Daniel Smith-dePaz](https://github.com/adeadzeplin)
- [Jordan Yamada](https://github.com/JordanYamada)


To learn more about Deep Impact, check out our [Deep Impact GitHub](https://github.com/Team-Deep-Impact/Deep-Impact).

## Features

1. **Asteroid Visualization**: Visualize incoming asteroids using real-time data from the NASA NeoWs API.
2. **Scenario & Deflection Strategies**: Explore various methods of asteroid deflection, such as Nuclear Detonation, Kinetic Impact, and Gravity Tractor.
3. **Simulation Tool**: Simulate asteroid trajectories and deflection outcomes.
4. **Dashboard**: View the dashboard, and other pages with relevant information and insights.

## Technical Documentations

[Frontend Documentaions](./frontend/README.md)

## Getting Started

### Django Backend Setup

1. **Set Up Python Environment**:
    - Vanilla Python:
        ```sh
        python -m venv .venv
        ```
    - Virtual Environment Wrapper:
        ```sh
        mkvirtualenv .venv
        ```
    - Activate the environment:
        ```sh
        source .venv/bin/activate
        ```

2. **Install Required Packages**:
    - Navigate to the backend directory and install dependencies:
        ```sh
        cd Deep-Impact/backend
        pip install -r requirements.txt
        ```

3. **Initial Migration(s)**:
    - Ensure you're located in the path: Deep-Impact/backend
        ```sh
        python manage.py makemigrations
        python manage.py migrate
        ```

4. **Making Environmental Variables**:
    - Ensure you're located in the path: Deep-Impact/backend
        ```sh
        touch .env
        ```
    - Follow the .env.sample as a template to fill in your environmental variables

5. **Start Django Server**:
    - Ensure you're located in the path: Deep-Impact/backend
        ```sh
        python manage.py runserver
        ```

### Vite Frontend Setup

1. **Install Node Modules**:
    - Navigate to the frontend directory and install dependencies:
        ```sh
        npm install
        ```

2. **Making Environmental Variables**:
    - Ensure you're located in the path: Deep-Impact/frontend
        ```sh
        touch .env
        ```
    - Follow the .env.sample as a template to fill in your environmental variables

3. **Run Development Server**:
    - Start the development server:
        ```sh
        npm run dev
        ```

## License

Deep Impact is open-source software released under the [MIT License](LICENSE). Feel free to use, modify, and distribute the codebase in accordance with the terms of the license.

Thank you for choosing Deep Impact. We hope you enjoy exploring our project and learning more about asteroid impacts!

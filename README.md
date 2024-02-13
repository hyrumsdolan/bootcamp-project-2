
# Fitness Tracker

## Table of Contents
- [Description](#description)
- [Deployed Site](#deployed-site)
- [Installation](#installation)
- [Collaborators](#collaborators)
- [Technology Used](#Language-and-Technology-used)
- [License](#license)

## Description
Allows users to sign in, choose a workout type (Push/Pull/Legs). It randomly generates workouts for the user targeting the respective muscles and then stores all their sets and reps performed.

## Deployed site 
https://workout-fitness-tracker-ff2f5d2f6a1e.herokuapp.com/login

![Workout Page](/public/images/workout.png)
![Sets Page](/public/images/sets.png)


## Installation
To use on you own machine instead of the deployed app

`npm install` 

Create and .env with:
```
DB_NAME='fitness_db'
DB_USER='root'
DB_PASSWORD=''
API_KEY: '' //fill with API key from Exercise API from API Ninja
SESSION_SECRET=''
```

`node db/seed`

`npm start`


## Collaborators

[Jesse Nay](https://github.com/jessenay)

[Hyrum Dolan](https://github.com/hyrumsdolan)

[Kyler Jansson](https://github.com/KylerJansson)

[Maxwell Kaufman](https://github.com/MaxwellKaufman)

[Travis Nielson](https://github.com/TNielson78)

## Language and Technology used:
HTML, CSS, JAVASCRIPT. Node.js, express, sequilize, prettier, Nodemon and web API.

## License
![License](https://img.shields.io/badge/license-MIT-blue.svg)
This project is licensed under the MIT license. For more information, see the [license link](https://opensource.org/licenses/MIT).


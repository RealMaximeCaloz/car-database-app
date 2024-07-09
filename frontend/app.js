const leftButton = document.getElementsByClassName("arrow-left")[0].addEventListener('click', handleLeftButtonClick);
const rightButton = document.getElementsByClassName("arrow-right")[0].addEventListener('click', handleRightButtonClick);
const titleBanner = document.getElementsByClassName("title-banner")[0].addEventListener('click', handleTitleBannerClick);
let currentCarName = 'Lamborghini Revuelto'; // Track the current car's name

// TO DO LIST:
// Fix nav buttons
// Implement list on title banner
// dynamically draw progress bars

// Initial load
fetch(`/api/car/${currentCarName}`)
    .then(response => response.json())
    .then(data => {
        if (data) {
            displayCarDetails(data);
        } else {
            console.error('Initial car not found');
        }
    })
    .catch(error => console.error('Error fetching initial car details:', error));

function handleLeftButtonClick(){
    navigateCar('previous');
};

function handleRightButtonClick(){
    navigateCar('next');
};

function handleTitleBannerClick(){
    alert("Title Banner was clicked!")
    fetchAllCars();
};


function navigateCar(direction) {
    fetch(`/api/cars?direction=${direction}&currentName=${currentCarName}`)
        .then(response => response.json())
        .then(data => {
            if (data.message) {
                console.log(data.message); // Handle no cars found
            } else {
                console.log("DATAAAAA: ", data);
                currentCarName = data.name; // Update the current car's name
                console.log("currentCarName: ", currentCarName);
                displayCarDetails(data); // Display the car details
            }
        })
        .catch(error => console.error('Error fetching car:', error));
}

function fetchAllCars() {
    fetch('/api/cars')
        .then(response => response.json())
        .then(data => {
            displayCarList(data);
        })
        .catch(error => console.error('Error fetching cars:', error));
}

function displayCarDetails(car) {
    const carNameDiv = document.getElementsByClassName('title-banner')[0];
    carNameDiv.innerHTML = `
        <p>${car.name}</p>
    `

    const carDetailsDiv = document.getElementsByClassName('content')[0];
    carDetailsDiv.innerHTML = `
        <div class="image-container">
            <img src="${car.logo_path}" alt="${car.name}" class="logo">
            <img src="${car.image_path}" alt="${car.name}" class="car-image">
        </div>
        <div class="specs">
            <div class="spec">
                <div class="label">Horsepower:</div>
                <div class="bar-container">
                    <div class="bar red" style="width: 68%;"></div>
                </div>
                <div class="value">${car.horsepower}hp</div>
            </div>
            <div class="spec">
                <div class="label">Torque:</div>
                <div class="bar-container">
                    <div class="bar red" style="width: 60%;"></div>
                </div>
                <div class="value">${car.torque}Nm</div>
            </div>
            <div class="spec">
                <div class="label">Fuel Consumption:</div>
                <div class="bar-container">
                    <div class="bar red" style="width: 10%;"></div>
                </div>
                <div class="value">${car.fuel_consumption}L/100km</div>
            </div>
            <div class="spec">
                <div class="label">Engine Type:</div>
                <div class="bar-container" id="engine-type-bar-container">
                    <div class="icon fuel"></div>
                </div>
                <div class="value">${car.engine_type}</div>
            </div>
            <div class="spec">
                <div class="label">Seating Capacity:</div>
                <div class="bar-container">
                    <div class="bar red" style="width: 20%;"></div>
                </div>
                <div class="value">${car.seating_capacity}</div>
            </div>
            <div class="spec">
                <div class="label">Price:</div>
                <div class="bar-container">
                    <div class="bar red" style="width: 60%;"></div>
                </div>
                <div class="value">$${car.price} USD</div>
            </div>
        </div>
    `;
}


function displayCarList(cars) {
    const carListDiv = document.getElementById('car-list');
    carListDiv.innerHTML = ''; // Clear previous list
    cars.forEach(car => {
        const carItem = document.createElement('div');
        carItem.className = 'car-item';
        carItem.innerText = car.name;
        carItem.onclick = () => {
            currentCarName = car.name;
            fetch(`/api/car/${car.name}`)
                .then(response => response.json())
                .then(data => displayCarDetails(data))
                .catch(error => console.error('Error fetching car details:', error));
        };
        carListDiv.appendChild(carItem);
    });
}


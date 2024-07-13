const leftButton = document.getElementsByClassName("arrow-left")[0].addEventListener('click', handleLeftButtonClick);
const rightButton = document.getElementsByClassName("arrow-right")[0].addEventListener('click', handleRightButtonClick);
const titleBanner = document.getElementsByClassName("title-banner")[0].addEventListener('click', handleTitleBannerClick);
let currentCarName = 'Lamborghini Centenario'; // Track the current car's name
const carListDiv = document.getElementById('car-list');

// TO DO LIST:
// Center gasoline logo
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
            if (Array.isArray(data)) {
                displayCarList(data);
            } else if (typeof data === 'object' && data !== null) {
                // If a single object is returned, wrap it in an array
                displayCarList([data]);
            } else {
                console.error('Unexpected data format received:', data);
            }
        })
        .catch(error => console.error('Error fetching cars:', error));
}

function displayCarList(cars) {
    carListDiv.innerHTML = ''; // Clear previous list

    cars.forEach(car => {
        const carItem = createCarItem(car);
        carListDiv.appendChild(carItem);
    });
}


function displayCarDetails(car) {
    const carNameDiv = document.getElementsByClassName('title-banner')[0];
    // Update only the text content within the car name div
    const carNameText = carNameDiv.querySelector('.car-name-text');
    if (!carNameText) {
        const newCarNameText = document.createElement('p');
        newCarNameText.classList.add('car-name-text');
        newCarNameText.textContent = car.name;
        carNameDiv.appendChild(newCarNameText);
    } else {
        carNameText.textContent = car.name;
    }

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
                    <div class="bar red" style="width: ${calculateWidth(car.horsepower, 1000)};"></div>
                </div>
                <div class="value">${car.horsepower}hp</div>
            </div>
            <div class="spec">
                <div class="label">Torque:</div>
                <div class="bar-container">
                    <div class="bar red" style="width: ${calculateWidth(car.torque, 1000)};"></div>
                </div>
                <div class="value">${car.torque}Nm</div>
            </div>
            <div class="spec">
                <div class="label">Fuel Consumption:</div>
                <div class="bar-container">
                    <div class="bar red" style="width: ${calculateFuelBarWidth(car.fuel_consumption)};"></div>
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
                    <div class="bar red" style="width: ${calculateWidth(car.seating_capacity, 9)};"></div>
                </div>
                <div class="value">${car.seating_capacity}</div>
            </div>
            <div class="spec">
                <div class="label">Price:</div>
                <div class="bar-container">
                    <div class="bar red" style="width: ${calculatePriceBarWidth(car.price)};"></div>
                </div>
                <div class="value">$${car.price} USD</div>
            </div>
        </div>
    `;
}


function createCarItem(car) {
    const carItem = document.createElement('div');
    carItem.className = 'car-item';
    carItem.innerText = car.name;
    carItem.onclick = () => {
        currentCarName = car.name;
        fetch(`/api/car/${car.name}`)
            .then(response => response.json())
            .then(data => {
                carListDiv.style.display = 'none'; // Hide dropdown after selection
                displayCarDetails(data);
            })
            .catch(error => console.error('Error fetching car details:', error));
    };
    return carItem;
}


function calculateWidth(value, maxValue) {
    let width = (value / maxValue) * 100; 
    if (width > 100){
        width = 100;
    }
    return (width) + '%';
}

function calculateFuelBarWidth(value) {
    let width = (1/value)*100
    if (width > 100){
        width = 100;
    }
    return width + '%';
}

function calculatePriceBarWidth(price) {
    let width;
    if (price < 10000){
        width = 100;
    } else if (price >= 10000 && price < 25000){
        width = 90;
    }else if (price >= 25000 && price < 50000){
        width = 80;
    }else if (price >= 50000 && price < 80000){
        width = 70;
    }else if (price >= 80000 && price < 100000){
        width = 60;
    }else if (price >= 100000 && price < 150000){
        width = 50;
    }else if (price >= 150000 && price < 250000){
        width = 40;
    }else if (price >= 250000 && price < 500000){
        width = 30;
    }else if (price >= 500000 && price < 1000000){
        width = 20;
    }else if (price >= 1000000){
        width = 10;
    }
    return width + '%';
}

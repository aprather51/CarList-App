//Book Classes: Represent Cars
class Car {
	constructor(year, make, model) {
		this.year = year;
		this.make = make;
		this.model = model;
	}
}

// UI Classes: Handle UI Tasks
class UI {
	static displayCars() {
		// /************* Temp Data ****************/
		//const StoredCars = [
		// 	{
		// 		year: '2019',
		// 		make: 'Nissan',
		// 		model: 'Altima'
		// 	},
		// 	{
		// 		year: '2014',
		// 		make: 'Chevrolet',
		// 		model: 'Corvette'
		// 	}
		// ];

		//const cars = StoredCars;
		/**************************************** */

		const cars = Store.getCars();

		cars.forEach(car => UI.addCarToList(car));
	}

	/* --> Function - add car into UI */
	static addCarToList(car) {
		const list = document.querySelector('#car-list');
		const row = document.createElement('tr');

		row.innerHTML = `
      <td>${car.year}</td>
      <td>${car.make}</td>
      <td>${car.model}</td>
      <td><span class="delete" >✖</span></td>
    `;

		list.appendChild(row);
	}

	/* --> Function - clear from input list after submit */
	static clearFields() {
		document.querySelector('#year').value = '';
		document.querySelector('#make').value = '';
		document.querySelector('#model').value = '';
	}

	/* --> Function - Delete one of car from row */
	static deleteCar(el) {
		if (el.classList.contains('delete')) {
			el.parentElement.parentElement.remove();
		}
	}

	/* --> Function set up alert fields* */
	static showAlert(message, className) {
		//setting up alert element with class name
		const div = document.createElement('div');
		div.className = `alert alert-${className}`;
		div.appendChild(document.createTextNode(message));

		//setting up nesting element to place alert at top of form.
		const container = document.querySelector('.container');
		const form = document.querySelector('#car-form');
		container.insertBefore(div, form);

		//Vanish alert after 3s
		setTimeout(() => document.querySelector('.alert').remove(), 3000);
	}
}

//Store Class: Handle local storage (Data doesn't dissapear when page is refreshed/closed)
class Store {
	static getCars() {
		//if there is list of cars -- Display a list in string. Otherwise display null.
		let cars;
		if (localStorage.getItem('cars') === null) {
			cars = [];
		} else {
			cars = JSON.parse(localStorage.getItem('cars'));
		}

		return cars;
	}

	static addCar(car) {
		//push Car into local storage in JSON (string) format.
		const cars = Store.getCars();
		cars.push(car);
		localStorage.setItem('cars', JSON.stringify(cars));
	}

	static removeCar(model) {
		//Remove Car from local storage based on 'model name'
		const cars = Store.getCars();

		cars.forEach((car, index) => {
			//if model is matched...
			if (car.model === model) {
				//joining only 1
				cars.splice(index, 1);
			}
		});

		localStorage.setItem('cars', JSON.stringify(cars));
	}
}

//Event: Display Cars ---------------------------------------------------------------------
document.addEventListener('DOMContentLoaded', UI.displayCars);

//Event: Add a car ----------------------------------------------------------------------
document.querySelector('#car-form').addEventListener('submit', e => {
	/* -> Prevent from actual submit */
	e.preventDefault();

	/* -> Collect form value */
	const year = document.querySelector('#year').value;
	const make = document.querySelector('#make').value;
	const model = document.querySelector('#model').value;

	/* -> Validation - To be sure input is filled in as required. */
	if (year === '' || make === '' || model === '') {
		UI.showAlert('All fields are required', 'danger');
	} else {
		//otherwise proceed on...

		/* -> Instantiate a car  (collect input values and submit) */
		const car = new Car(year, model, make);

		/* -> Add the car info into UI (Table) */
		UI.addCarToList(car);

		/* -> Add car into local storage */
		Store.addCar(car);

		/* -> Show success message after submit */
		UI.showAlert('Success, Car added into list.', 'success');

		/* -> Clear fields after submit/add into UI */
		UI.clearFields();
	}
});

//Event: Remove a car
document.querySelector('#car-list').addEventListener('click', e => {
	/* -> Remove car from UI */
	UI.deleteCar(e.target);

	/* -> Remove car from local storage based on 'model' */
	Store.removeCar(e.target.parentElement.previousElementSibling.textContent);

	/* -> Show success message after submit */
	UI.showAlert('Car is removed from list.', 'warning');
});

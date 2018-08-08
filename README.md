# Chicago Employees

### Coding exercise for DataTheorem by Pierre Ortega, August 2018

#### [Live demo](https://chicago-employee-pierre-wzkrxzuxfx.now.sh)

A responsive web app that list a directory of chicago employees given by an API.

1.  The first screen is the list of all employees with only their first name, last name and title.
    - It is possible to filter the list based on the employees' departments (Police, General Services, etc.).
    - The keyboard can be used: _Down_ to focus on the next row, _Up_ to focus on the previous row, and _Enter_ to navigate to the next screen with the currently focused employee's details.
2.  Clicking on an employee's name or hitting _Enter_ while focused on an employee will trigger the second screen, which displays all the information about this employee: id, first name, last name, title, salary, department.
    - The keyboard can be used here too. _Down_ changes the employee information displayed to that of the "next" employee. The _Up_ key is the previous employee. And the _Enter_ key takes you back to the table view with the current employee focused.
3.  Lastly, the third screen provides a form to add a new employee to the database.

## How to use

### Production

#### Build it with docker

```
docker build -t chicago-employees .
```

or, use multi-stage builds to build a smaller docker image

```
docker build -t chicago-employees -f ./Dockerfile.multistage .
```

#### Deploy to the cloud on zeit.co

![Deploy to now](https://deploy.now.sh/static/button.svg)

Download [now](https://zeit.co/download) ([About it](https://zeit.co/now))

```bash
now
```

### Development

Requirements:

- NodeJS 8 and above
- Yarn or NPM

Clone repository and run:

```bash
npm install
npm run dev
# or
yarn
yarn dev
```

Go to http://localhost:3000

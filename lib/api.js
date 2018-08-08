import fetch from "isomorphic-unfetch";

const DEBUG_API = false;

const BASE_URL = process.env.BACKEND_URL;

const sendRequest = (endpoint, options = {}) => {
  if (!endpoint.startsWith("/")) {
    // Fail fast, developer will see on dev time.

    console.warn(
      "Please, when using sendRequest, start your request call with /. You tried:",
      endpoint
    );
    // Idea here is to avoid dev mistake in creating calls without slash
    return Promise.reject();
  }

  // Console warn so it prints trace
  if (DEBUG_API) console.warn(`${BASE_URL}${endpoint}`);

  return fetch(`${BASE_URL}${endpoint}`, options)
    .then(result => checkStatus(result, options))
    .catch(err => {
      // There was an error,
      // pitch stop for logging, before sending to the caller
      console.warn(
        "Error while fetching the API for endpoint",
        endpoint,
        err
      );

      // Enforce that it is up to the caller to handle error
      throw err;
    });
};

function checkStatus(response, options) {
  // Skip reading response if mode is no-cors
  if (options && options.mode === "no-cors") {
    return response;
  }
  // response.ok will be true on any 2xx status
  if (response.ok) {
    return response.json();
  } else {
    const error = { message: response.statusText, response };
    // error.response = response;
    return Promise.reject(error);
  }
}

// Pretty simple validation
function validate(obj, schema) {
  for (let [field, type] of Object.entries(schema)) {
    if (!obj[field]) throw new Error(`Missing field ${field}.`);
    if (typeof obj[field] !== type)
      throw new Error(`Field ${field} is not type ${type}.`);
  }

  return true;
}

const API = {};

// List employees
// https://dt-interviews.appspot.com/docs#operation/listEmployees
API.list = function(page = 1, per_page = 30) {
  if (per_page < 1) throw new Error("Invalid page size");
  return sendRequest(`/?page=${page}&per_page=${per_page}`);
};

// Fetch information about employee
// https://dt-interviews.appspot.com/docs#operation/getEmployeeById
API.get = function(employeeId) {
  if (typeof employeeId !== "number") {
    throw new Error(
      "API.get: Type of employeeId provided %s invalid. It needs to be a number",
      typeof employeeId
    );
  }

  return sendRequest(`/${employeeId}`);
};

// Create new employee
// https://dt-interviews.appspot.com/docs#operation/createEmployee
API.createNew = function(obj) {
  // Will throw if not valid obj
  validate(obj, {
    name: "string",
    department: "string",
    employee_annual_salary: "number",
    job_titles: "string"
  });

  return sendRequest("/", {
    method: "POST",
    body: JSON.stringify(obj),
    mode: "no-cors",
    headers: {
      "Content-Type": "application/json; charset=utf-8"
    }
  });
};
export default API;

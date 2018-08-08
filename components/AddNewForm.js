import React from "react";
import { withFormik } from "formik";
import Form from "./common/Form";
import API from "../lib/api";
import Notification from "./common/Notification";

// https://stackoverflow.com/a/4149393/3171397
const fromCamelCaseToRegular = text => {
  if (typeof text !== "string") return "";
  return (
    text
      // insert a space before all caps
      .replace(/([A-Z])/g, " $1")
      // uppercase the first character
      .replace(/^./, function(str) {
        return str.toUpperCase();
      })
  );
};

// Make sure after adding the field here, you also map it inside the handleSubmit
const FIELDS = ["firstName", "lastName", "title", "salary", "department"];

// Our inner form component which receives our form's state and updater methods as props
const InnerForm = ({
  status,
  values,
  errors,
  touched,
  handleChange,
  handleBlur,
  handleSubmit,
  isSubmitting
}) => (
  <Form onSubmit={handleSubmit}>
    {status && (
      <Notification type={status === true ? "success" : "danger"}>
        {status === true ? "Employee added with success!" : status}
      </Notification>
    )}

    {FIELDS.map(field => {
      return (
        <Form.Control
          key={field}
          label={fromCamelCaseToRegular(field)}
          errorText={touched[field] && errors[field]}
        >
          <Form.Input
            type="text"
            required
            name={field}
            onChange={handleChange}
            isError={touched[field] && errors[field]}
            onBlur={handleBlur}
            value={values[field]}
            // For Salary field, we want it to have sufix
            suffix={field === "salary" && "$"}
          />
        </Form.Control>
      );
    })}
    <Form.Button type="submit" isSubmitting={isSubmitting}>
      Submit
    </Form.Button>
  </Form>
);

// Wrap our form with the using withFormik HoC
export default withFormik({
  // Transform outer props into form values
  mapPropsToValues: props =>
    FIELDS.reduce((state, field) => {
      state[field] = field === "salary" ? 0 : "";
      return state;
    }, {}),
  // Add a custom validation function (this can be async too!)
  validate: values => {
    const errors = {};

    // Check if all fields are filled
    FIELDS.forEach(field => {
      if (!values[field] || values[field] === "") {
        errors[field] = "This field is required";
      }
    });

    // Salary has its own validation
    if (Number(values.salary) < 0) {
      errors.salary = "Salary can't be less than 0";
    }

    if (isNaN(Number(values.salary))) {
      errors.salary = "Salary needs to be a valid number";
    }

    return errors;
  },
  // Submission handler
  handleSubmit: async (values, { props, setStatus, setSubmitting }) => {
    const { firstName, lastName, salary, department, title } = values;

    const name = `${lastName.toUpperCase()}, ${firstName.toUpperCase()}`;

    const payload = {
      name,
      department,
      employee_annual_salary: Number(salary),
      job_titles: title
    };

    setSubmitting(true);

    try {
      let res = await API.createNew(payload);
      if (typeof props.onSubmit === "function") props.onSubmit(res);
      setStatus(true);
    } catch (e) {
      console.warn("An error occured!", e);
      setStatus("An error occurred! Please try again later.");
    }

    setSubmitting(false);
  }
})(InnerForm);

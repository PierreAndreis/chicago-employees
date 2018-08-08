import React from "react";
import NextHead from "next/head";
import { Router, Link } from "./../routes";
import { connect } from "react-redux";

import {
  loadPage,
  setFocusIndex,
  prevFocusIndex,
  nextFocusIndex
} from "../store/actions";
import API from "../lib/api";
import { getFilteredEmployees } from "../store/computed";
import Loading from "../components/common/Loading";
import Message from "../components/common/Notification";

function formatMoney(number) {
  if (typeof number !== "number") {
    number = Number(number);
  }

  return `$${number.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, "$&,")}`;
}

class Employee extends React.Component {
  state = {
    noResult: false
  };

  static async getInitialProps(props) {
    const { store, isServer, query } = props.ctx;

    const employeeId = Number(query.id);

    // In case someone tries to be smart
    // and enter a invalid number on query Id
    if (isNaN(employeeId)) {
      return { error: { message: "Not valid Employee Id" } };
    }

    const state = store.getState();

    // Find which page this employeeId is based on the pageSize
    // Assuming the API will ALWAYS return sorted by ID
    const initialPage = Math.ceil(employeeId / state.pageSize);

    // Check if we have to load page
    if (state.page !== initialPage || state.employees.length < 1) {
      store.dispatch(loadPage(initialPage));
    }

    let payload;
    let error;
    try {
      payload = await API.get(employeeId);
    } catch (e) {
      error = e;
    }

    return { employeeId, payload, error };
  }

  componentDidMount() {
    window.addEventListener("keydown", this.arrowNavigator);

    // Fix focusIndex coming from ssr
    // We can't know what focusIndex this employeeId is until page is done loading
    const employees = this.props.employees;
    if (employees.length > 0) {
      const correctFocus = employees.findIndex(
        e => e.id === this.props.employeeId
      );
      this.props.setFocusIndex(correctFocus);
    }
  }

  componentWillUnmount() {
    window.removeEventListener("keydown", this.arrowNavigator);
  }

  arrowNavigator = e => {
    if (this.props.loading) return;

    const KEYS = ["Enter", "Tab", "ArrowDown", "ArrowUp"];

    // Get the key before the event bubbles
    let key = e.key;

    if (!KEYS.includes(key)) {
      return;
    }

    if (key === "Enter") {
      Router.pushRoute("list");

      return;
    }

    // Maps Tab to ArrowDown and Shift+Tab to ArrowUp
    // Tabs is what is used by browser to switch focus
    if (key === "Tab" && !e.shiftKey) key = "ArrowDown";
    if (key === "Tab" && e.shiftKey) key = "ArrowUp";

    // Remove native key on browser for arrows, which scrolls down the page
    // browser will scroll down to show focus by spec
    e.preventDefault();

    // this.props.setFocusIndex
    if (key === "ArrowDown") {
      this.props.nextFocusIndex();
    }

    if (key === "ArrowUp") {
      this.props.prevFocusIndex();
    }
  };

  componentDidUpdate(prevProps) {
    // Reset no result for every page change
    if (this.state.noResult && prevProps.page !== this.props.page) {
      this.setState({
        noResult: false
      });
    }

    // Wait until it finishes loads to calculate the below
    if (this.props.loading) return;

    let changeRouter = false;
    if (this.props.loading !== prevProps.loading) {
      changeRouter = true;
    }
    if (prevProps.focusIndex !== this.props.focusIndex) {
      changeRouter = true;
    }

    if (changeRouter) {
      let newEmployee = this.props.employees[this.props.focusIndex];

      // If there is no nextEmployee on this page, alert the user
      if (!newEmployee) {
        this.setState({
          noResult: true
        });
        return;
      }
      // Otheriwse pushes to next employee
      Router.pushRoute("employee", {
        id: newEmployee.id
      });
    }
  }

  render() {
    let content;

    if (this.props.loading) {
      content = <Loading />;
    } else if (this.props.error) {
      content = (
        <Message type="danger">
          <p>
            <strong>Employee #{this.props.employeeId}</strong> <br />
            {this.props.error.message}
          </p>
        </Message>
      );
    } else if (this.state.noResult) {
      content = (
        <Message type="warning">
          <p>
            No employee found on page {this.props.page}
            {this.props.filters.length > 0 && (
              <>
                {" "}
                on current filter criteria: <br />
                <strong>Departments:</strong>{" "}
                {this.props.filters.join(",")}
              </>
            )}
          </p>
          <p style={{ marginTop: "5px" }}>
            <strong> Please, either: </strong> <br />
            Go back<br />
            Go to next page <br />
            Go back to previous page
          </p>
        </Message>
      );
    } else {
      const payload = this.props.payload;

      // Sometimes, payload.name is null >:(
      // Server should take care of these..
      const [last, first] = !payload.name ? [] : payload.name.split(", ");

      const employee = {
        id: payload.id,
        "first-name": first,
        "last-name": last,
        "annual-salary": formatMoney(payload.employee_annual_salary),
        department: payload.department,
        title: payload.job_titles
      };

      content = (
        <div className="content">
          {Object.keys(employee).map(property => (
            <div key={property}>
              <b style={{ textTransform: "capitalize" }}>
                {property.replace("-", " ")}
              </b>{" "}
              <div>{employee[property] || "Unknown"} </div>
            </div>
          ))}
        </div>
      );
    }

    return (
      <>
        <NextHead>
          <title key="title">
            {this.props.payload.name} - Chicago Employees
          </title>
        </NextHead>
        <div className="modal is-active">
          <div className="modal-background" />
          <div className="modal-card">
            <section className="modal-card-body">{content}</section>
            <footer className="modal-card-foot">
              <button
                className="button is-dark is-rounded"
                disabled={this.props.loading}
                onClick={() => this.props.prevFocusIndex()}
              >
                Previous
              </button>

              <Link to="/">
                <button className="button is-primary is-rounded">
                  Go back
                </button>
              </Link>
              <button
                className="button is-dark is-rounded"
                disabled={this.props.loading}
                onClick={() => this.props.nextFocusIndex()}
              >
                Next
              </button>
            </footer>
          </div>
        </div>
      </>
    );
  }
}

const mapStateToProps = state => ({
  page: state.page,
  focusIndex: state.focusIndex,
  filters: state.filters,
  loading: state.loading,
  employees: getFilteredEmployees(state)
});

const mapActionToProps = dispatch => ({
  nextFocusIndex: () => dispatch(nextFocusIndex()),
  prevFocusIndex: () => dispatch(prevFocusIndex()),
  setFocusIndex: focusIndex => dispatch(setFocusIndex(focusIndex))
});

export default connect(
  mapStateToProps,
  mapActionToProps
)(Employee);

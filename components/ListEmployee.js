import React from "react";
import { connect } from "react-redux";
import { Link } from "../routes";

import { getFilteredEmployees } from "../store/computed";

const ListEmployee = props => {
  const employees = props.employees.map(item => {
    // Sometimes, payload.name is null >:(
    // Server should take care of these..
    const [last, first] = !item.name ? [] : item.name.split(", ");
    return {
      id: item.id,
      first,
      last,
      job_titles: item.job_titles
    };
  });

  if (employees.length < 1) {
    return (
      <article className="message is-warning">
        <div className="message-body">
          <p>
            No employee found on page {props.page} on current filter
            criteria: <br />
            <strong>Departments:</strong> {props.filters.join(",")}
          </p>
          <p style={{ marginTop: "5px" }}>
            <strong> Please, either: </strong> <br />
            Change your filters <br />
            Go to next page <br />
            Go back to previous page
          </p>
        </div>
      </article>
    );
  }

  return employees.map((item, index) => (
    <Link
      route="employee"
      params={{ id: item.id }}
      key={item.id}
      prefetch
      scroll={false}
    >
      <a
        className="box"
        ref={ref => ref && props.focusIndex === index && ref.focus()}
      >
        <div className="content">
          <div>
            <b>First Name</b> <div>{item.first} </div>
          </div>
          <div>
            <b>Last Name</b> <div>{item.last} </div>
          </div>
          <div>
            <b>Job Title</b> <div>{item.job_titles} </div>
          </div>
        </div>
      </a>
    </Link>
  ));
};

const mapStateToProps = state => ({
  page: state.page,
  filters: state.filters,
  allEmployees: state.employees,
  employees: getFilteredEmployees(state),
  focusIndex: state.focusIndex
});

export default connect(mapStateToProps)(ListEmployee);

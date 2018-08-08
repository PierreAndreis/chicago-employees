import React from "react";

import { addFilter, removeFilter, clearFilters } from "../store/actions";
import { connect } from "react-redux";

class Filters extends React.Component {
  onChange = item => e => {
    this.props.onChangeFilter(item, e.target.checked);
  };

  render() {
    const { employees, title, actives } = this.props;

    const departmentsAvailable = employees
      .map(emp => emp.department)
      .sort()
      // Sometimes there will be a department called "null" which is out of the schema
      .filter(Boolean)
      .reduce((prev, department) => {
        // If this departmanet has already been counted before, add 1
        // otherwise create
        prev[department] = prev[department] ? prev[department] + 1 : 1;
        return prev;
      }, {});

    const notExistent = actives.filter(a => !departmentsAvailable[a]);

    return (
      <nav className="panel">
        <p className="panel-heading">Filter by Department</p>
        <div className="panel-body">
          {notExistent.map(filter => (
            <label className="panel-block" key={filter}>
              <input
                type="checkbox"
                checked={actives.includes(filter)}
                onChange={this.onChange(filter)}
              />
              {filter} (0)
            </label>
          ))}
          {Object.keys(departmentsAvailable).map(filter => (
            <label className="panel-block" key={filter}>
              <input
                type="checkbox"
                checked={actives.includes(filter)}
                onChange={this.onChange(filter)}
              />
              {filter} ({departmentsAvailable[filter]})
            </label>
          ))}
        </div>
        <div className="panel-block">
          <button
            className="button is-link is-outlined is-fullwidth"
            onClick={() => this.props.clearFilters()}
          >
            Reset all Filters
          </button>
        </div>

        <style jsx>
          {`
            label.panel-block {
              font-size: 13px;
            }
          `}
        </style>
      </nav>
    );
  }
}

const mapActionToProps = dispatch => ({
  onChangeFilter: (filter, value) => {
    if (value) {
      dispatch(addFilter(filter));
    } else {
      dispatch(removeFilter(filter));
    }
  },
  clearFilters: () => dispatch(clearFilters())
});

const mapStateToProps = state => ({
  employees: state.employees,
  actives: state.filters
});

export default connect(
  mapStateToProps,
  mapActionToProps
)(Filters);

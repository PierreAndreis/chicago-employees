import React from "react";
import { connect } from "react-redux";
import AddNewForm from "./../components/AddNewForm";

import { loadPage } from "../store/actions";

import Layout from "../components/common/Layout";

class AddNewEmployee extends React.Component {
  onSubmit = response => {
    // Reset to page 1, to make sure this fresh new employee will be present
    this.props.reset();
  };
  render() {
    return (
      <Layout>
        <div className="columns">
          <div
            className="column is-four-fifths-mobile is-half-tablet is-one-quarter-desktop"
            style={{ margin: "0 auto" }}
          >
            <AddNewForm onSubmit={this.onSubmit} />
          </div>
        </div>
      </Layout>
    );
  }
}

const mapActionToProps = dispatch => ({
  reset: () => dispatch(loadPage(0))
});

export default connect(
  null,
  mapActionToProps
)(AddNewEmployee);

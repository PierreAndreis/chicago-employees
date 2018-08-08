import React from "react";
import { connect } from "react-redux";

import {
  loadPage,
  nextFocusIndex,
  prevFocusIndex,
  setFocusIndex
} from "../store/actions";

import ListEmployee from "../components/ListEmployee";
import { getFilteredEmployees } from "../store/computed";
import Filters from "../components/Filters";
import Layout from "../components/common/Layout";
import Loading from "../components/common/Loading";

class Index extends React.Component {
  static async getInitialProps(props) {
    const { store } = props.ctx;

    const state = store.getState();

    if (state.employees.length < 1) {
      store.dispatch(loadPage(1));
    }

    return {};
  }

  componentDidMount() {
    window.addEventListener("keydown", this.arrowNavigator);
  }

  componentWillUnmount() {
    window.removeEventListener("keydown", this.arrowNavigator);
  }

  arrowNavigator = e => {
    if (this.props.loading) return;

    const KEYS = ["Tab", "ArrowDown", "ArrowUp", "ESC"];

    // Get the key before the event bubbles
    let key = e.key;

    if (!KEYS.includes(key)) {
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

  nextPage = e => {
    this.props.setPage(this.props.page + 1);
    this.props.setFocusIndex(0);
  };

  prevPage = e => {
    if (this.props.page === 1) return;
    this.props.setPage(this.props.page - 1);
    this.props.setFocusIndex(0);
  };

  render() {
    if (this.props.loading)
      return (
        <Layout>
          <Loading />
        </Layout>
      );

    return (
      <Layout>
        <div className="columns is-tablet">
          <div className="column is-one-quarter-desktop is-one-fifthquarter-widescreen">
            <div className="sticky">
              <div>Page {this.props.page} </div>
              <nav
                className="pagination"
                role="navigation"
                aria-label="pagination"
                style={{ marginBottom: "5px" }}
              >
                <button
                  className="pagination-previous"
                  disabled={this.props.loading || this.props.page === 1}
                  onClick={this.prevPage}
                >
                  Previous
                </button>
                <button
                  className="pagination-next"
                  disabled={this.props.loading}
                  onClick={this.nextPage}
                >
                  Next
                </button>
              </nav>
              <Filters />
            </div>
          </div>
          <div className="column">
            <ListEmployee />
          </div>
        </div>
        <style jsx>
          {`
            .sticky {
              position: sticky;
              top: 20px;
            }
          `}
        </style>
      </Layout>
    );
  }
}

const mapStateToProps = state => ({
  page: state.page,
  employees: getFilteredEmployees(state),
  loading: state.loading
});

const mapActionToProps = dispatch => ({
  nextFocusIndex: () => dispatch(nextFocusIndex()),
  prevFocusIndex: () => dispatch(prevFocusIndex()),
  setFocusIndex: focus => dispatch(setFocusIndex(focus)),
  setPage: page => dispatch(loadPage(page))
});

export default connect(
  mapStateToProps,
  mapActionToProps
)(Index);

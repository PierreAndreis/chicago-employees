import React from "react";
import { withRouter } from "next/router";

import { Link } from "./../../routes";

const LINKS = [
  {
    name: "Directory",
    path: "/"
  },
  {
    name: "Add New Employee",
    path: "/new"
  }
];

const Layout = props => {
  return (
    <>
      <section className="hero is-info is-bold">
        <div className="hero-body">
          <div className="container has-text-centered">
            <h1 className="title">Chicago Employees Directory</h1>
          </div>
        </div>

        <div className="hero-foot">
          <nav className="tabs is-boxed">
            <div className="container">
              <ul>
                {LINKS.map(l => (
                  <li
                    key={l.path}
                    className={
                      props.router.pathname === l.path ? "is-active" : ""
                    }
                  >
                    <Link to={l.path}>
                      <a>{l.name}</a>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </nav>
        </div>
      </section>

      <div className="container" style={{ paddingTop: "20px" }}>
        {props.children}
      </div>
    </>
  );
};

export default withRouter(Layout);

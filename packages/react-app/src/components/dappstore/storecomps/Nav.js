import React, { Component } from "react";
import { Link } from 'react-router-dom';

export default class Nav extends Component {
  render() {
    return (
      <div className="row">
        <ul className="nav nav-pills nav-stacked" style={{marginBottom : '5%'}}>
          <li className="nav-item col-md-7">
            <Link className="nav-link" to="/">
              ABOUT
            </Link>
          </li>
          <li className="nav-item col-md-7">
            <Link className="nav-link" to="/profile">
              PROFILE
            </Link>
          </li>
          {/* <li className="nav-item col-md-7">
            <Link className="nav-link" to="/create">
              CREATE
            </Link>
          </li> */}
          {/* <li className="nav-item col-md-7">
            <Link className="nav-link" to="/groups">
              GROUPS
            </Link>
          </li> */}
        </ul>
      </div>
    );
  }
}
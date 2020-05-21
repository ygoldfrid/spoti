import React, { Fragment } from "react";
import { NavLink } from "react-router-dom";
import { Navbar, Nav } from "react-bootstrap";

function NavBar({ user }) {
  return (
    <Navbar variant="dark" expand="lg" className="navbar-spoti mb-3">
      <Navbar.Brand href="/">
        <i className="fa fa-spotify fa-1x mr-2" aria-hidden="true"></i>Spoti App
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
        <Nav className="mr-auto">
          {user && (
            <Fragment>
              <NavLink className="nav-item nav-link" to="/home">
                Home
              </NavLink>
              <NavLink className="nav-item nav-link" to="/profile">
                {user.display_name}
              </NavLink>
              <NavLink className="nav-item nav-link" to="/logout">
                Logout
              </NavLink>
            </Fragment>
          )}
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
}

export default NavBar;

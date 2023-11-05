import React from "react";
import { Link } from "react-router-dom";

function Navbar() {
  return (
    <div className="navbar bg-base-300 rounded-b-lg mb-10">
      <div className="flex-1">
        <Link
          to="/"
          className="btn btn-ghost normal-case text-xl"
        >
          Home
        </Link>
      </div>
      <div className="flex-none">
        <ul className="menu menu-horizontal px-1">
          <li>
            <Link
              to="/activities"
              className="text-white"
            >
              Activities
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default Navbar;

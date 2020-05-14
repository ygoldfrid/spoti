import React, { Fragment } from "react";

const NotFound = () => {
  return (
    <Fragment>
      <div className="row justify-content-center">
        <h1>Oops!</h1>
      </div>
      <div className="row justify-content-center m-3">
        <p>It looks like the page you're looking for does not exist</p>
      </div>
    </Fragment>
  );
};

export default NotFound;

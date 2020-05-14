import React, { Fragment } from "react";

function Profile({ user }) {
  return (
    <div className="user-profile row p-2 mb-4">
      {user && (
        <Fragment>
          <img
            className="mr-4"
            height="250"
            width="250"
            alt={user.display_name}
            src={user.images[0] ? user.images[0].url : ""}
          />
          <div className="user-info">
            <h1>{user.display_name}</h1>
            <p>
              {user.country} &bull; {user.followers.total} followers &bull;{" "}
              {user.email}
            </p>
          </div>
        </Fragment>
      )}
    </div>
  );
}

export default Profile;

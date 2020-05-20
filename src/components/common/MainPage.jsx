import React from "react";

function MainPage({ type, object, subtitle, onFollowClick, follows }) {
  return (
    <div className="main-page p-2 mb-4">
      <div className="row justify-content-center">
        <img
          className="m-3"
          height="250"
          width="250"
          alt={object.name}
          src={object.images[0] ? object.images[0].url : ""}
        />
      </div>
      <div className="main-page-info">
        <h1 className="text-center mb-1">
          {type === "profile" ? object.display_name : object.name}
        </h1>
        <p className="text-center">{subtitle}</p>
      </div>
      {type === "artist" && (
        <div className="row follow-button justify-content-center">
          <button onClick={onFollowClick} className="btn btn-spoti-clear my-3">
            {follows ? "Following" : "Follow"}
          </button>
        </div>
      )}
    </div>
  );
}

export default MainPage;

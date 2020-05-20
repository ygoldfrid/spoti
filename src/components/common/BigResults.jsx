import React, { Fragment } from "react";

function BigResults({ title, results, history }) {
  const handleClick = ({ currentTarget }) => {
    history.push(currentTarget.id);
  };

  return (
    <Fragment>
      {(title === "Albums" || results.length > 2) && (
        <Fragment>
          <div className="row my-3">
            <h3>{title}</h3>
          </div>
          <div className="row big-results">
            {results.map((result) => (
              <div
                key={result.id}
                id={`/album/${result.id}`}
                onClick={handleClick}
                className="col-2 big-result"
              >
                <img
                  height="150"
                  width="150"
                  alt={result.name}
                  src={result.images[0].url}
                />
                <p className="text-center mt-2 mb-5">{result.name}</p>
              </div>
            ))}
          </div>
        </Fragment>
      )}
    </Fragment>
  );
}

export default BigResults;

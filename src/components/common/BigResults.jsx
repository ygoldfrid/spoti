import React, { Fragment } from "react";

function BigResults({ title, results, history }) {
  return (
    <Fragment>
      {((title === "Albums" && results.length > 0) || results.length > 2) && (
        <Fragment>
          <div className="row big-results-title my-3">
            <h3>{title}</h3>
          </div>
          <div className="row big-results">
            {results.map((result) => (
              <div
                key={result.id}
                onClick={() => {
                  history.push(`/album/${result.id}`);
                }}
                className="col-2 big-result py-3"
              >
                <img
                  height="150"
                  width="150"
                  alt={result.name}
                  src={result.images[0].url}
                />
                <p className="text-center">{result.name}</p>
              </div>
            ))}
          </div>
        </Fragment>
      )}
    </Fragment>
  );
}

export default BigResults;

import React, { Fragment, useState, useEffect } from "react";
import MainPage from "./common/MainPage";
import spoti from "../services/spotiService";
import SmallResults from "./common/SmallResults";
import Search from "./Search";

function Profile({ user, history }) {
  const [recentlyPlayed, setRecentlyPlayed] = useState([]);

  useEffect(() => {
    async function getRecentlyPlayed() {
      try {
        const { data: tracks } = await spoti.getRecentlyPlayed();
        setRecentlyPlayed(tracks.items);
      } catch (ex) {
        console.log(ex.message);
      }
    }
    getRecentlyPlayed();
  }, []);

  return (
    <div className="user-profile p-2 mb-4">
      {user && (
        <Fragment>
          <Search history={history} />
          <MainPage type="profile" object={user} />
          <SmallResults
            type="profile"
            title="Play History"
            results={recentlyPlayed}
            history={history}
            onClick={({ currentTarget }) => {
              history.push(currentTarget.id);
            }}
          />
        </Fragment>
      )}
    </div>
  );
}

export default Profile;

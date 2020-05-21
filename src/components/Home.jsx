import React, { Fragment, useState, useEffect } from "react";
import BigResults from "./common/BigResults";
import Search from "./Search";
import spoti from "../services/spotiService";

function Home({ user, history }) {
  const [topArtists, setTopArtists] = useState([]);
  const [topTracks, setTopTracks] = useState([]);
  const [newReleases, setNewReleases] = useState([]);

  useEffect(() => {
    async function getData() {
      try {
        //Getting Top Artists
        const { data: topArtists } = await spoti.getTopArtists();
        setTopArtists(topArtists.items);

        //Getting Top Tracks
        const { data: topTracks } = await spoti.getTopTracks();
        setTopTracks(topTracks.items);

        //Getting New Releases
        if (user) {
          console.log(user);
          const { data: newReleases } = await spoti.getNewReleases(
            user.country
          );
          setNewReleases(newReleases.albums.items);
        }
      } catch (ex) {
        if (ex.response && ex.response.status === 400)
          history.replace("/not-found");
      }
    }
    getData();
  }, [user, history]);

  return (
    <Fragment>
      <Search history={history} />
      <BigResults
        title="Your Top Artists"
        type="artist"
        results={topArtists.slice(0, 6)}
        history={history}
      />
      <BigResults
        title="Your Top Tracks"
        type="track"
        results={topTracks.slice(0, 6)}
        history={history}
      />
      <BigResults
        title="New Releases in your country"
        type="album"
        results={newReleases.slice(0, 18)}
        history={history}
      />
    </Fragment>
  );
}

export default Home;

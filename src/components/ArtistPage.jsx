import React, { Fragment, useEffect, useState } from "react";
import spoti from "../services/spotiService";
import Tracks from "./Tracks";

function ArtistPage({ match, history, user }) {
  const [artist, setArtist] = useState(null);
  const [topTracks, setTopTracks] = useState([]);
  const [follows, setFollows] = useState([false]);

  useEffect(() => {
    async function getArtist() {
      try {
        const id = match.params.id;

        //Getting Artist
        const { data: artist } = await spoti.getArtistById(id);
        setArtist(artist);

        //Getting Top Tracks
        if (user) {
          const { data: topTracks } = await spoti.getArtistTopTracks(
            id,
            user.country
          );
          setTopTracks(topTracks.tracks);
        }

        //Getting Following Info
        const { data: follows } = await spoti.getUserFollowsArtist(id);
        setFollows(follows[0]);
      } catch (ex) {
        if (ex.response && ex.response.status === 400)
          history.replace("/not-found");
      }
    }
    getArtist();
  }, [match.params.id, history, user]);

  const handleFollow = async () => {
    try {
      const id = match.params.id;
      if (follows) {
        await spoti.unfollowArtist(id);
        setFollows(false);
      } else {
        await spoti.followArtist(id);
        setFollows(true);
      }
    } catch (ex) {}
  };

  const getButtonClasses = () => {
    return follows
      ? "btn btn-spoti btn-spoti-clear my-3"
      : "btn btn-spoti my-3";
  };

  return (
    <Fragment>
      {artist && (
        <Fragment>
          <div className="artist row p-2 mb-4">
            <img
              className="mr-4"
              height="250"
              width="250"
              alt={artist.name}
              src={artist.images[0] ? artist.images[0].url : ""}
            />
            <div className="artist-info">
              <h1 className="mb-1">{artist.name}</h1>
              <p>
                {new Intl.NumberFormat().format(artist.followers.total)}{" "}
                followers
              </p>
              <button onClick={handleFollow} className={getButtonClasses()}>
                {follows ? "FOLLOWING" : "FOLLOW"}
              </button>
            </div>
          </div>
          <div className="row">
            <h3>Top Tracks</h3>
          </div>
          <Tracks tracks={topTracks} isArtist={true} />
        </Fragment>
      )}
    </Fragment>
  );
}

export default ArtistPage;

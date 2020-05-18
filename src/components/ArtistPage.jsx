import React, { Fragment, useEffect, useState } from "react";
import spoti from "../services/spotiService";
import Tracks from "./Tracks";

function ArtistPage({ match, history, location, user }) {
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

  return (
    <Fragment>
      {artist && (
        <Fragment>
          <div className="artist p-2 mb-4">
            <div className="row justify-content-center">
              <img
                className="m-3"
                height="250"
                width="250"
                alt={artist.name}
                src={artist.images[0] ? artist.images[0].url : ""}
              />
            </div>
            <div className="artist-info mt-3">
              <h1 className="text-center mb-1">{artist.name}</h1>
              <p className="text-center">
                {new Intl.NumberFormat().format(artist.followers.total)}{" "}
                followers
              </p>
            </div>
            <div className="row justify-content-center">
              <button
                onClick={handleFollow}
                className="btn btn-spoti-clear my-3"
              >
                {follows ? "Following" : "Follow"}
              </button>
            </div>
          </div>
          <div className="row">
            <h3>Popular</h3>
          </div>
          <Tracks
            type="artist"
            id={artist.id}
            tracks={topTracks}
            location={location}
          />
        </Fragment>
      )}
    </Fragment>
  );
}

export default ArtistPage;

import React, { Fragment, useState } from "react";
import { Form } from "react-bootstrap";
import spoti from "../services/spotiService";
import SearchResults from "./SearchResults";

function Search({ history }) {
  const [artists, setArtists] = useState([]);
  const [albums, setAlbums] = useState([]);
  const [tracks, setTracks] = useState([]);

  const handleSearch = (e) => {
    const searchQuery = e.currentTarget.value;
    if (searchQuery) {
      populateData(searchQuery);
    } else {
      setArtists([]);
      setAlbums([]);
      setTracks([]);
    }
  };

  const populateData = async (searchQuery) => {
    const { data: artistsData } = await spoti.search(searchQuery, "artist", 1);
    setArtists(artistsData.artists.items);
    const { data: albumsData } = await spoti.search(searchQuery, "album", 3);
    setAlbums(albumsData.albums.items);
    const { data: tracksData } = await spoti.search(searchQuery, "track", 5);
    setTracks(tracksData.tracks.items);
  };

  const handleClick = ({ currentTarget }) => {
    history.push(currentTarget.id);
  };

  return (
    <Fragment>
      <Form.Control
        className="form-control"
        onChange={handleSearch}
        placeholder="Search for artists or albums..."
      />
      {(artists.length !== 0 || albums.length !== 0) && (
        <div className="results">
          <SearchResults
            results={artists}
            type="artist"
            onClick={handleClick}
          />
          <SearchResults results={albums} type="album" onClick={handleClick} />
          <SearchResults results={tracks} type="track" onClick={handleClick} />
        </div>
      )}
    </Fragment>
  );
}

export default Search;

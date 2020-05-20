import React, { Fragment, Component } from "react";
import spoti from "../services/spotiService";
import Tracks from "./Tracks";
import BigResults from "./common/BigResults";

class ArtistPage extends Component {
  state = {
    artist: null,
    topTracks: [],
    follows: [false],
    albums: [],
    singles: [],
    compilations: [],
    appears_on: [],
  };

  componentDidMount = async () => {
    try {
      const id = this.props.match.params.id;
      this.getArtist(id);
      this.getFollowingInfo(id);
      if (this.props.user) {
        this.getTopTracks(id);
        this.getAlbums(id, "album");
        this.getAlbums(id, "single");
        this.getAlbums(id, "compilation");
        this.getAlbums(id, "appears_on");
      }
    } catch (ex) {
      if (ex.response && ex.response.status === 400)
        this.props.history.replace("/not-found");
    }
  };

  componentDidUpdate(prevProps) {
    if (prevProps.user !== this.props.user) {
      try {
        const id = this.props.match.params.id;
        this.getTopTracks(id);
        this.getAlbums(id, "album");
        this.getAlbums(id, "single");
        this.getAlbums(id, "compilation");
        this.getAlbums(id, "appears_on");
      } catch (ex) {
        if (ex.response && ex.response.status === 400)
          this.props.history.replace("/not-found");
      }
    }
  }

  getArtist = async (id) => {
    const { data: artist } = await spoti.getArtistById(id);
    this.setState({ artist });
  };

  getFollowingInfo = async (id) => {
    const { data: follows } = await spoti.getUserFollowsArtist(id);
    this.setState({ follows: follows[0] });
  };

  getTopTracks = async (id) => {
    const { data: topTracks } = await spoti.getArtistTopTracks(
      id,
      this.props.user.country
    );
    this.setState({ topTracks: topTracks.tracks });
  };

  getAlbums = async (id, group) => {
    const { data: results } = await spoti.getArtistAlbums(
      id,
      group,
      this.props.user.country
    );
    if (group === "album") this.setState({ albums: results.items });
    if (group === "single") this.setState({ singles: results.items });
    if (group === "compilation") this.setState({ compilations: results.items });
    if (group === "appears_on") this.setState({ appears_on: results.items });
  };

  handleFollow = async () => {
    try {
      const id = this.props.match.params.id;
      if (this.state.follows) {
        await spoti.unfollowArtist(id);
        this.setState({ follows: false });
      } else {
        await spoti.followArtist(id);
        this.setState({ follows: true });
      }
    } catch (ex) {}
  };

  render() {
    const {
      artist,
      topTracks,
      follows,
      albums: allAlbums,
      singles: allSingles,
      compilations: allCompilations,
      appears_on: allAppears,
    } = this.state;
    const { location, user } = this.props;
    const albums = allAlbums.slice(0, 12);
    const singles = allSingles.slice(0, 6);
    const compilations = allCompilations.slice(0, 6);
    const appears_on = allAppears.slice(0, 6);
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
              <div className="artist-info">
                <h1 className="text-center mb-1">{artist.name}</h1>
                <p className="text-center">
                  {new Intl.NumberFormat().format(artist.followers.total)}{" "}
                  followers
                </p>
              </div>
              <div className="row justify-content-center">
                <button
                  onClick={this.handleFollow}
                  className="btn btn-spoti-clear my-3"
                >
                  {follows ? "Following" : "Follow"}
                </button>
              </div>
            </div>
            <Tracks
              title="Popular"
              type="artist"
              id={artist.id}
              tracks={topTracks}
              location={location}
              user={user}
            />
            <BigResults title="Albums" results={albums} {...this.props} />
            <BigResults title="Singles" results={singles} {...this.props} />
            <BigResults
              title="Compilations"
              results={compilations}
              {...this.props}
            />
            <BigResults
              title="Appeared On"
              results={appears_on}
              {...this.props}
            />
          </Fragment>
        )}
      </Fragment>
    );
  }
}

export default ArtistPage;

function init() {
  window.onSpotifyWebPlaybackSDKReady = () => {
    const token = localStorage.getItem("access_token");
    const player = new window.Spotify.Player({
      name: "Spoti App Player",
      getOAuthToken: (callback) => {
        callback(token);
      },
    });

    // Error handling
    player.addListener("initialization_error", ({ message }) => {
      console.error("initialization_error", message);
    });
    player.addListener("authentication_error", ({ message }) => {
      console.error("authentication_error", message);
      localStorage.removeItem("access_token");
    });
    player.addListener("account_error", ({ message }) => {
      console.error("account_error", message);
    });
    player.addListener("playback_error", ({ message }) => {
      console.error("playback_error", message);
    });

    // Playback status updates
    player.addListener("player_state_changed", (state) => {
      stateUpdate(state);
    });

    // Ready
    player.addListener("ready", ({ device_id }) => {
      console.log("Ready with Device ID", device_id);
      localStorage.setItem("_spharmony_device_id", device_id);
    });

    // Not Ready
    player.addListener("not_ready", ({ device_id }) => {
      console.log("Device ID has gone offline", device_id);
    });

    // Connect to the player!
    player.connect();

    return player;
  };
}

function stateUpdate(state) {
  const event = new CustomEvent("stateUpdate", { detail: state });
  document.dispatchEvent(event);
}

export default { init };

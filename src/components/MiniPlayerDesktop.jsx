import React from "react";
import MiniPlayerInfo from "./MiniPlayerInfo";
import MiniPlayerControls from "./MiniPlayerControls";
import MiniPlayerVolume from "./MiniPlayerVolume";

function MiniPlayerDesktop({
  currentTrack,
  isPlaying,
  shuffle,
  repeatMode,
  elapsed,
}) {
  return (
    <div id="mini-player-desktop" className="row align-items-center">
      <MiniPlayerInfo currentTrack={currentTrack} />
      <MiniPlayerControls
        currentTrack={currentTrack}
        isPlaying={isPlaying}
        shuffle={shuffle}
        repeatMode={repeatMode}
        elapsed={elapsed}
      />
      <MiniPlayerVolume />
    </div>
  );
}

export default MiniPlayerDesktop;

"use client";

import "./tap-cue.css";

const handUrl = "/assets/renwoxing/tap-hand.png";

export function TapCue() {
  return (
    <div className="tap-cue" aria-hidden="true">
      <img className="tap-hand-cycle" src={handUrl} alt="" />
      <strong>點一下</strong>
      <span>進入專輯</span>
      <small className="tap-text-blink">TAP TO PLAY</small>
    </div>
  );
}

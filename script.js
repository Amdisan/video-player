"use strict";

const player = document.querySelector(".player");
const video = document.querySelector("video");
const progressRange = document.querySelector(".progress-range");
const progressBar = document.querySelector(".progress-bar");
const playBtn = document.getElementById("play-btn");
const volumeIcon = document.getElementById("volume-icon");
const volumeRange = document.querySelector(".volume-range");
const volumeBar = document.querySelector(".volume-bar");
const currentTime = document.querySelector(".time-elapsed");
const duration = document.querySelector(".time-duration");
const speed = document.querySelector(".player-speed");
const fullscreenBtn = document.querySelector(".fullscreen");

// Play & Pause ----------------------------------- //
function showPlayIcon() {
  playBtn.classList.replace("fa-pause", "fa-play");
  playBtn.setAttribute("title", "Play");
}

function togglePlay() {
  if (video.paused) {
    video.play();
    playBtn.classList.replace("fa-play", "fa-pause");
    playBtn.setAttribute("title", "Pause");
  } else {
    video.pause();
    showPlayIcon();
  }
}
//on video end -> show play button icon
video.addEventListener("ended", showPlayIcon);

// Progress Bar ---------------------------------- //
//calculate display time format
function displayTime(time) {
  const minutes = Math.floor(time / 60);
  const seconds =
    Math.floor(time % 60) < 10
      ? `0${Math.floor(time % 60)}`
      : Math.floor(time % 60);
  return `${minutes}:${seconds}`;
}

//update progress bar as video plays
function updateProgress() {
  progressBar.style.width = `${(video.currentTime / video.duration) * 100}%`;
  currentTime.textContent = `${displayTime(video.currentTime)} /`;
  duration.textContent = `${displayTime(video.duration)}`;
}

//click to seek within the video
function setProgress(e) {
  const newTime = e.offsetX / this.clientWidth;
  progressBar.style.width = `${newTime * 100}%`;
  video.currentTime = newTime * video.duration;
}

// Volume Controls --------------------------- //
let lastVolume = 1;

//change volume icon
function changeVolumeIcon(volume) {
  volumeIcon.className = "";
  if (volume > 0.5) {
    volumeIcon.classList.add("fas", "fa-volume-up");
  } else if (volume < 0.5 && volume > 0) {
    volumeIcon.classList.add("fas", "fa-volume-down");
  } else if (volume === 0) {
    volumeIcon.classList.add("fas", "fa-volume-mute");
  }
}

//volume bar
function changeVolume(e) {
  let volume = e.offsetX / this.clientWidth;
  //rounding volume up or down
  volume = volume < 0.1 ? (volume = 0) : volume > 0.9 ? (volume = 1) : volume;
  volumeBar.style.width = `${volume * 100}%`;
  video.volume = volume;
  lastVolume = volume;
  //change volume icon
  changeVolumeIcon(volume);
}

//mute/unmute
function toggleMute() {
  if (video.volume) {
    lastVolume = video.volume;
    video.volume = 0;
    volumeBar.style.width = 0;
    changeVolumeIcon(0);
  } else {
    video.volume = lastVolume;
    volumeBar.style.width = `${lastVolume * 100}%`;
    changeVolumeIcon(lastVolume);
  }
}

// Change Playback Speed -------------------- //
function changeSpeed() {
  video.playbackRate = speed.value;
}

// Fullscreen ------------------------------- //
/* View in fullscreen */
function openFullscreen(elem) {
  if (elem.requestFullscreen) {
    elem.requestFullscreen();
  } else if (elem.webkitRequestFullscreen) {
    /* Safari */
    elem.webkitRequestFullscreen();
  } else if (elem.msRequestFullscreen) {
    /* IE11 */
    elem.msRequestFullscreen();
  }
}

/* Close fullscreen */
function closeFullscreen() {
  if (document.exitFullscreen) {
    document.exitFullscreen();
  } else if (document.webkitExitFullscreen) {
    /* Safari */
    document.webkitExitFullscreen();
  } else if (document.msExitFullscreen) {
    /* IE11 */
    document.msExitFullscreen();
  }
}

let fullscreen = false;

//toggle fullscreen
function toggleFullscreen() {
  if (!fullscreen) {
    openFullscreen(player);
  } else {
    closeFullscreen();
  }
  fullscreen = !fullscreen;
}

//event listeners
playBtn.addEventListener("click", togglePlay);
video.addEventListener("click", togglePlay);
video.addEventListener("timeupdate", updateProgress);
video.addEventListener("canplay", updateProgress);
progressRange.addEventListener("click", setProgress);
volumeRange.addEventListener("click", changeVolume);
volumeIcon.addEventListener("click", toggleMute);
speed.addEventListener("change", changeSpeed);
fullscreenBtn.addEventListener("click", toggleFullscreen);

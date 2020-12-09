const songs = [
  { songPath: "music/zombie.mp3", songTitle: "Zombie" },
  { songPath: "music/my-dear-love.mp3", songTitle: "My Dear Love" },
  { songPath: "music/circles.mp3", songTitle: "Circles" },
  { songPath: "music/best-friend.mp3", songTitle: "Best Friend" },
];

const playlistContainer = document.getElementsByClassName("playlist-container")[0];
const audioTag = document.getElementsByClassName("audio")[0];
const previousButton = document.getElementsByClassName("previousButton")[0];
const playButton = document.getElementsByClassName("playButton")[0];
const pauseButton = document.getElementsByClassName("pauseButton")[0];
const nextButton = document.getElementsByClassName("nextButton")[0];
const progressBar = document.getElementById("progressBar");
const currentProgress = document.getElementById("currentProgress");
const currentAndTotalTime = document.getElementsByClassName("currentAndTotalTime")[0];
const rangeSlider = document.getElementsByClassName("rangeSlider")[0];

//loop to add songs in array to html dom
for (let i = 0; i < songs.length; i++) {
  const songItem = document.createElement("div");
  songItem.classList.add("songItem");
  const songTitle = `${i + 1}. ${songs[i].songTitle}`;
  songItem.append(songTitle);
  //event to play songs that is clicked
  songItem.addEventListener("click", () => {
    checkActiveSong();
    currentPlayIndex = i;
    songItem.classList.add("active-song");
    const songPath = songs[i].songPath;
    audioTag.src = songPath;
    audioTag.play();
  });

  audioTag.onended = () => {
    checkActiveSong();
    if ((currentPlayIndex = songs.length - 1)) {
      currentPlayIndex = -1;
    }
    currentPlayIndex += 1;
    playSong();
  };
  playlistContainer.append(songItem);
}

let duration = 0;
let durationText = "00:00";
audioTag.addEventListener("loadeddata", () => {
  duration = Math.floor(audioTag.duration);
  durationText = createMinuteAndSecond(duration);
});

// rangeSlider.value = 0;
let currentTime;
let progressBarWidth;
audioTag.addEventListener("timeupdate", () => {
  currentTime = Math.floor(audioTag.currentTime);
  currentTimeText = createMinuteAndSecond(currentTime);
  currentAndTotalTime.textContent = `${currentTimeText} / ${durationText}`;

  progressBarWidth = (500 / duration) * currentTime;
  // currentProgress.style.width = `${progressBarWidth}px`;
  // console.log(progressBarWidth);
  rangeSlider.value = progressBarWidth;
});

rangeSlider.addEventListener("input", () => {
  let value = rangeSlider.value;
  currentTime = currentTime * (value / progressBarWidth);
  audioTag.currentTime = currentTime;
});

currentPlayIndex = 0;
isPlaying = false;
let song;
playButton.addEventListener("click", () => {
  checkActiveSong();
  isPlaying = true;
  const currentTime = Math.floor(audioTag.currentTime);
  if (currentTime === 0) {
    song = playlistContainer.children[currentPlayIndex];
    song.classList.add("active-song");
    playSong();
  } else {
    audioTag.play();
  }
  playAndPauseUpdate();
  song.classList.add("active-song");
});

pauseButton.addEventListener("click", () => {
  isPlaying = false;
  playAndPauseUpdate();
  audioTag.pause();
});

nextButton.addEventListener("click", () => {
  if (currentPlayIndex === songs.length - 1) {
    return;
  }
  checkActiveSong();
  isPlaying = true;
  playAndPauseUpdate();
  currentPlayIndex += 1;
  playSong();
});

previousButton.addEventListener("click", () => {
  if (currentPlayIndex === 0) {
    return;
  }
  checkActiveSong();
  isPlaying = true;
  playAndPauseUpdate();
  currentPlayIndex -= 1;

  playSong();
});

//function to check the songItem with active-song class and remove the class
const checkActiveSong = () => {
  const songs = playlistContainer.children;
  for (let i = 0; i < songs.length; i++) {
    if (songs[i].classList.contains("active-song")) {
      songs[i].classList.remove("active-song");
    }
  }
};

//function to check if the song is playing, then update play and pause button
const playAndPauseUpdate = () => {
  if (isPlaying) {
    playButton.style.display = "none";
    pauseButton.style.display = "inline";
  } else {
    playButton.style.display = "inline";
    pauseButton.style.display = "none";
  }
};

//function to create minute and second in 00:00 format
const createMinuteAndSecond = (time) => {
  const minute = Math.floor(time / 60);
  const second = Math.floor(time % 60);
  const minuteText = minute < 10 ? `0${minute.toString()}` : minute;
  const secondText = second < 10 ? `0${second.toString()}` : second;
  return `${minuteText} : ${secondText}`;
};

const playSong = () => {
  const path = songs[currentPlayIndex].songPath;
  audioTag.src = path;
  audioTag.play();
  isPlaying = true;
  song = playlistContainer.children[currentPlayIndex];
  song.classList.add("active-song");
};

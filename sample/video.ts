const video = document.querySelector("#video") as HTMLVideoElement;

const media = navigator.mediaDevices.getUserMedia({
  video: true,
  audio: false
});

media.then(stream => {
  video.srcObject = stream;
  video.play();
});

const takePhoto = document.querySelector("#takePhoto") as HTMLButtonElement;
takePhoto.addEventListener(
  "click",
  event => {
    event.preventDefault();
    const canvas = document.querySelector("#canvas") as HTMLCanvasElement;
    const cxt = canvas.getContext("2d");
    if (cxt) {
      video.pause();
      cxt.drawImage(video, 0, 0);
    }
  },
  false
);

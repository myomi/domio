import Domio from "../src/Domio";

const canvas = document.querySelector("#canvas") as HTMLCanvasElement;

canvas.addEventListener(
  "dragenter",
  event => {
    event.stopPropagation();
    event.preventDefault();
    canvas.classList.add("hover");
  },
  false
);

canvas.addEventListener(
  "dragover",
  event => {
    event.stopPropagation();
    event.preventDefault();
  },
  false
);

canvas.addEventListener(
  "dragleave",
  event => {
    event.stopPropagation();
    event.preventDefault();
  },
  false
);

canvas.addEventListener(
  "drop",
  async event => {
    event.stopPropagation();
    event.preventDefault();
    canvas.classList.remove("hover");

    const files = event.dataTransfer.files;
    if (files.length === 0) {
      return;
    }
    const file = files[0];
    const dFile = await Domio.fromFile(file);
    const resized = await Domio.resize(dFile, 100);

    const cxt = canvas.getContext("2d");
    if (cxt) {
      const img = await Domio.toImage(resized);
      cxt.drawImage(img, 0, 0);
    }
  },
  false
);

const toImage = document.querySelector("#toImage") as HTMLButtonElement;
toImage.addEventListener("click", async () => {
  const dataURL = canvas.toDataURL();
  const container = document.querySelector("#converted") as HTMLDivElement;
  const img = await Domio.toImageByDataURL(dataURL);
  container.appendChild(img);
});

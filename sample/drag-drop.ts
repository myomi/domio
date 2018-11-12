import Domio from "../src/Domio";
import "./drag-drop.scss";

const dropArea = document.querySelector("#dropArea") as HTMLInputElement;

dropArea.addEventListener(
  "dragenter",
  event => {
    event.stopPropagation();
    event.preventDefault();
    dropArea.classList.add("hover");
  },
  false
);

dropArea.addEventListener(
  "dragover",
  event => {
    event.stopPropagation();
    event.preventDefault();
  },
  false
);

dropArea.addEventListener(
  "dragleave",
  event => {
    event.stopPropagation();
    event.preventDefault();
  },
  false
);

dropArea.addEventListener(
  "drop",
  async event => {
    event.stopPropagation();
    event.preventDefault();
    dropArea.classList.remove("hover");

    const files = event.dataTransfer.files;
    if (files.length === 0) {
      return;
    }
    const file = files[0];
    const dFile = await Domio.fromFile(file);
    const resized = await Domio.resize(dFile, 100);
    const container = document.querySelector("#fileInformation");
    container.textContent = JSON.stringify(resized);
    const img = document.createElement("img");
    img.src = resized.dataURL.src;
    dropArea.appendChild(img);
  },
  false
);

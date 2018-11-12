import Domio from '../src/Domio';

const fileSelector = document.querySelector('#fileSelector') as HTMLInputElement;

fileSelector.addEventListener("change", async () => {
    const files = fileSelector.files;
    const file = files[0];
    const dFile = await Domio.fromFile(file);
    const resized = await Domio.resize(dFile, 100);
    const container = document.querySelector('#fileInformation');
    container.textContent = JSON.stringify(resized);
    const img = document.createElement('img');
    img.src = resized.dataURL.src;
    container.appendChild(img);
});
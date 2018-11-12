import DomioFile, { DataURL } from "./DomioFile";

const Domio = {
  fromFile(file: File): Promise<DomioFile> {
    const { size, name, type, lastModified } = file;
    const promise = new Promise<DomioFile>((resolve, reject) => {
      const reader = new FileReader();
      reader.addEventListener("load", (event: ProgressEvent) => {
        const dataURL = parseDataURL(reader.result as string);
        const bytes = dataURL2Uint8Array(dataURL.data);
        resolve({
          size,
          name,
          type,
          lastModified,
          dataURL,
          bytes
        });
      });
      reader.readAsDataURL(file);
    });
    return promise;
  },

  resize(file: DomioFile, pixel: number): Promise<DomioFile> {
    const promise = new Promise<DomioFile>((resolve, reject) => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      const image = new Image();
      image.crossOrigin = "Anonymous";
      image.addEventListener("load", function() {
        let dstWidth, dstHeight;
        if (this.width > this.height) {
          dstWidth = pixel;
          dstHeight = (this.height * pixel) / this.width;
        } else {
          dstHeight = pixel;
          dstWidth = (this.width * pixel) / this.height;
        }
        canvas.width = dstWidth;
        canvas.height = dstHeight;
        ctx.drawImage(
          this,
          0,
          0,
          this.width,
          this.height,
          0,
          0,
          dstWidth,
          dstHeight
        );

        const dataURL = parseDataURL(canvas.toDataURL());
        const bytes = dataURL2Uint8Array(dataURL.data);
        const result = { ...file };
        result.dataURL = dataURL;
        result.bytes = bytes;
        result.size = bytes.length;
        resolve(result);
      });
      image.src = file.dataURL.src;
    });
    return promise;
  },

  toImage(src: DomioFile): Promise<HTMLImageElement> {
    return this.toImageByDataURL(src.dataURL.src);
  },

  toImageByDataURL(dataURL: string): Promise<HTMLImageElement> {
    const promise = new Promise<HTMLImageElement>((resolve, reject) => {
      const img = document.createElement("img");
      img.addEventListener("load", () => {
        resolve(img);
      });
      img.src = dataURL;
    });
    return promise;
  }
};

/**
 * parse data URL string to object model
 * @param dataURL
 */
function parseDataURL(dataURL: string): DataURL {
  if (!dataURL || dataURL.length === 0) {
    throw new Error("dataURL is blank");
  }

  const regex = /^data:([\w\/\+]+)?;(charset=[\w-]+|base64).*,(.*)$/;
  const match = dataURL.match(regex);
  if (!match || match.length < 4) {
    throw new Error("invalid dataURL");
  }
  const mediaType = match[1] ? match[1] : "unknown/unknown";
  const isBase64 = match[2] && match[2].toLowerCase() === "base64";
  const data = match[3];

  return {
    src: dataURL,
    mediaType,
    isBase64,
    data
  };
}

/**
 * convert base64 data to Uint8Array
 * @param data
 */
function dataURL2Uint8Array(data: string): Uint8Array {
  const raw = window.atob(data);
  const rawLength = raw.length;
  const result = new Uint8Array(new ArrayBuffer(rawLength));
  for (let i = 0; i < rawLength; i++) {
    result[i] = raw.charCodeAt(i);
  }
  return result;
}

function getImageMimeByBytes(bytes: Uint8Array): string {
  let hex = "";
  // read 10 byte
  for (let i = 0; i < 10; i++) {
    hex += ("00" + bytes[i].toString(16)).substr(-2);
  }
  switch (true) {
    case /^89504e47/.test(hex):
      return "image/png";
    case /^47494638/.test(hex):
      return "image/gif";
    case /^424d/.test(hex):
      return "image/bmp";
    case /^ffd8ff/.test(hex):
      return "image/jpeg";
    case /^(49492a00)/.test(hex):
      return "image/tiff";
    default:
      return "unknown/unknown";
  }
}

export default Domio;

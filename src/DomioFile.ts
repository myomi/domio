/**
 * file contents interface
 */
export default interface DomioFile {
    /**
     * byte size
     */
    size: number;
    /**
     * file name
     */
    name: string;
    /**
     * file mime type estimated from file extension
     */
    type: string;
    /**
     * 
     */
    lastModified: number;
    /**
     * data URL
     */
    dataURL: DataURL;
    /**
     * bynary data
     */
    bytes: Uint8Array;
}

export interface DataURL {
    src: string;
    mediaType: string;
    isBase64: boolean;
    data: string;
}


export type UploadedImage = {
  readonly url: string;
  readonly publicId: string;
  readonly width: number;
  readonly height: number;
  readonly bytes: number;
  readonly format: string;
};

export type UploadableFile = {
  readonly uri: string;
  readonly fileName?: string;
  readonly type?: string;
};

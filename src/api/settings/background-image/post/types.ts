export type BackgroundImageUploadRequest = {
  image?: File;
  image_url?: string;
};

export type BackgroundImageUploadResponse = {
  message: string;
  image: string;
};
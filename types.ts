
export interface ImageFile {
  id: string;
  file: File;
  base64: string;
}

export interface MongoImage {
  _id?: string;
  searchQuery: string;
  imageId: string;
  imageName: string;
  imageUrl?: string;
  imageBase64?: string;
  mimeType: string;
  matchScore: number;
  matchReason: string;
  source: 'google-drive' | 'upload';
  driveFileId?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface MatchResult {
  image: ImageFile | MongoImage;
  score: number;
  reason: string;
}

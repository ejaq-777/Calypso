export interface PageProps {
  setCurrentView: (view: string) => void;
  warningsOnly: boolean;
  setWarningsOnly: (value: boolean) => void;
  selectedImage: ImageRecord | null;
  setSelectedImage: (img: ImageRecord | null) => void;
}

export interface ImageRecord {
  _id: string;
  originalName: string;
  fileSize: number;
  contentType?: string;
  location?: {
    latitude?: number;
    longitude?: number;
    altitude?: number;
  };
  metadata?: Record<string, any>;
  createdAt: string;
}
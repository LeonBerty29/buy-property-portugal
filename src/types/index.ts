export type Blog = {
  slug: string;
  image: string;
  title: string;
  author: string;
  readTime: number;
  date: string;
  blogDetails?: React.ReactNode;
};

export type Home = {
  imagePaths: string[];
  description: string;
  location: string;
  price: number;
  userId: string | undefined;
  favorite: boolean;
  favoriteId: string;
  homeId: string;
  exclusive: boolean;
  tag: {
    name: string;
    slug: string;
  };
  // pathName: string;
  grossArea: number;
  plotSize: number;
  amenities: {
    bedrooms: number;
    garage: number;
    bathrooms: number;
  };
  liveVideo: boolean;
};

export interface StoryblokError extends Error {
  status?: number;
  response?: {
    status: number;
    data?: unknown;
  };
}

export interface FavoritesResponse {
  favorite_properties: number[];
}

export interface NoteObject {
  client_id: number;
  property_id: number;
  notes: string;
  created_at: string;
  updated_at: string;
}


export interface NotesResponse {
  data: NoteObject[];
}
export interface CreateNotesResponse {
  message: string;
  data: {
    client_id: number;
    property_id: number;
    notes: string;
    created_at: string;
    updated_at: string;
  }[];
}

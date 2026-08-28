export interface DBGameResponse {
  id: number;
  name: string;
  released: string;
  rating: number;
  ratingCount: number;
  metacritics: number;
  imageUrl: string;
  platforms: string[];
  genres: string[];
}
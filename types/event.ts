export interface NewsEvent {
  id: string;
  title: string;
  date: string;
  description: string;
  imageUrl: string | null;
  link: string | null;
  order: number;
  createdAt: number;
  updatedAt: number;
}

export interface NewsEventInput {
  title: string;
  date: string;
  description: string;
  imageUrl: string | null;
  link: string | null;
  order: number;
}

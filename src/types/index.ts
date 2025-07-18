export interface Card {
  id: string;
  topic: string;
  tag: 'Before' | 'After';
  body: string;
  createdAt: string;
}

export interface Diary {
  _id: string;
  clientId: string;
  name: string;
  uniqueId: string;
  cards: Card[];
  createdAt: string;
}

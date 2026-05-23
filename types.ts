
export interface StyledItem {
  id: string;
  name: string;
  category: string;
  description: string;
  priceRange: string;
  amazonSearchUrl: string;
  reasoning: string;
  imageUrl?: string;
}

export interface StyleAnalysis {
  summary: string;
  identifiedStyle: string;
  colorPalette: string[];
  recommendations: StyledItem[];
  vibeDescription: string;
  fullLookImageUrl?: string;
}

export interface SavedOutfit {
  id: string;
  name: string;
  items: StyledItem[];
  outfitImageUrl?: string;
  createdAt: number;
}

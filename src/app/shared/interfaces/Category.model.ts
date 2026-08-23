export interface CategoryTranslation {
  languageCode: string;
  name: string;
}

export interface Category {
  id: number;
  translations: CategoryTranslation[];
  name?: string;
}

export interface CategoryPayload {
  translations: CategoryTranslation[];
}

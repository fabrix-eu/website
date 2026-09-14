/** Rows as the Directus Public role returns them. Snake_case kept, as in the API. */

export interface FileRef {
  id: string;
  title: string | null;
  description: string | null;
  width: number | null;
  height: number | null;
}

export interface GalleryItem {
  id: number;
  sort: number | null;
  directus_files_id: FileRef | null;
}

export interface NewsCard {
  id: string;
  slug: string;
  title: string;
  date: string;
  pinned: boolean;
  cover: string | null;
}

export interface News extends NewsCard {
  body: string | null;
  body_2: string | null;
  gallery: GalleryItem[];
  gallery_2: GalleryItem[];
}

export interface Partner {
  key: string;
  name: string;
  short: string | null;
  url: string | null;
  blurb: string | null;
  logo: string | null;
  logo_mono: string | null;
  sort: number | null;
}

export interface City {
  slug: string;
  name: string;
  intro: string | null;
  cover: string | null;
  background: string | null;
  about_title: string | null;
  about: string | null;
  stakeholders: string | null;
  contact_intro: string | null;
  contacts: string | null;
}

export interface Deliverable {
  id: number;
  code: string;
  title: string;
  description: string | null;
  approval: string | null;
  file: string | null;
  url: string | null;
}

export interface Publication {
  id: number;
  citation: string;
  link_label: string | null;
  url: string;
}

export interface LegalPage {
  slug: string;
  title: string;
  body: string | null;
  date_updated: string | null;
}

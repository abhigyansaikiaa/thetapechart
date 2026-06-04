export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  metaTitle: string;
  metaDescription: string;
  featuredImage: string;
  category: string;
  published: boolean;
  publishedAt?: Date;
  author: string;
}

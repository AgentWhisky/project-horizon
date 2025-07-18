import { config } from '../../config';
import { Link, LinkCategory } from './links.model';

const linksApiUrl = `${config.HORIZON_API_URL}/link-library/links`;
const categoryApiUrl = `${config.HORIZON_API_URL}/link-library/categories`;

export async function getLinks(category?: string | null, search?: string | null): Promise<Link[]> {
  const params = new URLSearchParams();
  if (category) {
    params.append('category', category);
  }
  if (search) {
    params.append('search', search);
  }
  const linkUrl = params.toString() ? `${linksApiUrl}?${params.toString()}` : linksApiUrl;

  const res = await fetch(linkUrl);

  if (!res.ok) {
    throw new Error(`Failed to fetch Horizon links: ${res.status}`);
  }

  const links = (await res.json()) as Link[];

  return links;
}

export async function getCategories(name?: string) {
  const params = new URLSearchParams();
  if (name) {
    params.append('name', name);
  }
  const categoryUrl = params.toString() ? `${categoryApiUrl}?${params.toString()}` : categoryApiUrl;

  const res = await fetch(categoryUrl);

  if (!res.ok) {
    throw new Error(`Failed to fetch Horizon categories: ${res.status}`);
  }

  const categories = (await res.json()) as LinkCategory[];

  return categories;
}

export function getResponseMessage() {
  
}
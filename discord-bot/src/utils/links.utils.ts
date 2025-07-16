import { config } from '../config';
import { Link } from '../models/link.model';

const apiUrl = `${config.HORIZON_API_URL}/link-library`;

export async function getLinks(category?: string | null, search?: string | null): Promise<string> {
  console.log('category:', category);
  console.log('search:', search);

  const res = await fetch(apiUrl);

  if (!res.ok) {
    throw new Error(`Failed to fetch Horizon links: ${res.status}`);
  }

  const links = (await res.json()) as Link[];

  const response = `Links: ${links.length}`;

  return response;
}

import { config } from '../../config';
import { Link } from '../models/link.model';

const apiUrl = `${config.HORIZON_API_URL}/link-library/links`;

export async function getLinks(category?: string | null, search?: string | null): Promise<Link[]> {
  const params = new URLSearchParams();
  if (category) {
    params.append('category', category);
  }
  if (search) {
    params.append('search', search);
  }

  const res = await fetch(`${apiUrl}?${params.toString()}`);

  if (!res.ok) {
    throw new Error(`Failed to fetch Horizon links: ${res.status}`);
  }

  const links = (await res.json()) as Link[];

  return links;
}

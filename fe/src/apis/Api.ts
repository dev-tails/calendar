import { setURL } from '../utils/HistoryUtils';

export async function httpGet<T>(url: string): Promise<T | null> {
  const res = await fetch(url);
  if (res.status === 404) {
    setURL('/');
    return null;
  }

  const jsonData = await res.json();
  return jsonData.data;
}

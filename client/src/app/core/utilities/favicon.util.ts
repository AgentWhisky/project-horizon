export function checkFaviconExists(url: string): Promise<boolean> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    img.src = url;

    img.src = `${url}?_=${new Date().getTime()}`;
  });
}

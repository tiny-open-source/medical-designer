export function generateID() {
  return 'pa_xxxx-xxxx-xxx-xxxx'.replace(/x/g, () => {
    const r = Math.floor(Math.random() * 16);
    return r.toString(16);
  });
}

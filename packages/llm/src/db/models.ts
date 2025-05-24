export function isCustomModel(model: string) {
  const customModelRegex
    = /_model-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{3,4}-[a-f0-9]{4}/;
  return customModelRegex.test(model);
}
export function generateID() {
  return 'model-xxxx-xxxx-xxx-xxxx'.replace(/x/g, () => {
    const r = Math.floor(Math.random() * 16);
    return r.toString(16);
  });
}

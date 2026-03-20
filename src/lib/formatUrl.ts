// En un archivo como src/utils/formatUrl.js
export const getFullImageUrl = (imagePath: string) => {
  if (!imagePath) return "https://placehold.co/400x400?text=Sin+Imagen";
  
  const baseUrl = import.meta.env.VITE_API_URL;
  const cleanPath = imagePath.replace(/\\/g, '/');
  
  return `${baseUrl}${cleanPath}`;
};
export function toTitleCase(str) {
  return str
    .toLowerCase()
    .split(" ")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}
export const getInitials = (name) => {
    const words = name.trim().split(' ');
    if (words.length === 1) return words[0][0]?.toUpperCase();
    return `${words[0][0]}${words[words.length - 1][0]}`.toUpperCase();
  };

  export function convertToBase64(file) {
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader();
    fileReader.readAsDataURL(file);
    fileReader.onload = () => {
      resolve(fileReader.result);
    };
    fileReader.onerror = (error) => {
      reject(error);
    };
  });
}
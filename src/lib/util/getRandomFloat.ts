export default function getRandomFloat(min: number, max: number) {
  return min + (Math.random() * Math.floor(max - min + 1));
}
export function capitalize(str: string): string {
    const strArray = str.split(" ");
    return strArray.map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");
}
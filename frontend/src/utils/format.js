export const pad = (n) => String(n).padStart(2, "0");

export const formatDate = (iso) =>
  new Date(iso).toLocaleDateString("tr-TR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

export const isNotFound = (error) => error?.response?.status === 404;

export const toRoman = (num) => {
  const map = [
    [1000, "M"], [900, "CM"], [500, "D"], [400, "CD"], [100, "C"], [90, "XC"],
    [50, "L"], [40, "XL"], [10, "X"], [9, "IX"], [5, "V"], [4, "IV"], [1, "I"],
  ];
  let out = "";
  for (const [value, letter] of map) {
    while (num >= value) {
      out += letter;
      num -= value;
    }
  }
  return out;
};

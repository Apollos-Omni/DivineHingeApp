export default {
  concurrent: false,
  chunkSize: 10,
  "*.{ts,tsx,js,jsx,json,md,yml,yaml}": (files) => {
    const filtered = files.filter(f =>
      !/node_modules/.test(f) && !/package-lock\.json$/.test(f)
    );
    return filtered.length
      ? [`prettier --loglevel warn --ignore-unknown --write ${filtered.map(f => `"${f}"`).join(" ")}`]
      : [];
  },
  "*.{ts,tsx}": () => [
    // run once; returning a function prevents lint-staged from appending filenames
    "tsc -p tsconfig.json --noEmit --pretty false"
  ]
};
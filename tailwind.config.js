const withMT = require("@material-tailwind/react/utils/withMT");
const { colors } = require("@mui/material");

module.exports = withMT({
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "path-to-your-node_modules/@material-tailwind/react/components/**/*.{js,ts,jsx,tsx}",
    "path-to-your-node_modules/@material-tailwind/react/theme/components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        MainColor: `#3FAB48`
      }
    },
  },
  plugins: [],
});
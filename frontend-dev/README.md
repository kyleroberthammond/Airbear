## Getting Started

Only 3 deps installed

- Preact (light version of react)
- Reactstrap
- react-canvas-gauges just a react version of the canvas gauges

You need node installed. I have node v20.17.0 for development.
cd into this folder, and run `npm install` to install dependencies.
After building opening the index.html file in the browser will not work because of CORS issues. You need to run a server to serve the files. By running `npm run build` then `npm run preview` you can view the site at http://localhost:4173/
This should work on the esp32 because it will be hosting it.

- `npm run dev` - Starts a dev server at http://localhost:5173/

- `npm run build` - Builds for production, emitting to `dist/`. Copy this folder to the data folder on Airbear.

- `npm run preview` - Starts a server at http://localhost:4173/ to test production build locally

const baseTemplate = ({ dependencies }) => {
  return {
    pkgjson : {
      "name": "interactors-sample-app",
      "version": "0.0.0",
      "private": true,
      "description": "Interactors Sample App",
      "repository": "https://github.com/thefrontside/interactors.git",
      "author": "Frontside Engineering <engineering@frontside.com>",
      "license": "MIT",
      "scripts": {
        "start": "parcel src/index.html",
        "build": "parcel build src/index.html --no-cache"
      },
      "dependencies": {
        "@babel/core": `${dependencies['@babel/core']}`,
        "@interactors/html": `${dependencies['@interactors/html']}`,
        "eslint": `${dependencies.eslint}`,
        "parcel": `${dependencies.parcel}`,
        "react": `${dependencies.react}`,
        "react-dom": `${dependencies['react-dom']}`,
        "react-router-dom": `${dependencies['react-router-dom']}`,
        "typescript": `${dependencies.typescript}`,
      },
      "volta": {
        "node": "14.17.5",
        "yarn": "1.22.11"
      }
    },
    files: [
      'package-lock.json',
      'yarn.lock',
      'README.md',
      'src'
    ]
  };
};

module.exports = {
  baseTemplate
};

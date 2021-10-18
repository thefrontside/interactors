const bigtestTemplate = ({ dependencies }) => {
  return {
    pkgjson: {
      "scripts": {
        "test:bigtest": "bigtest ci"
      },
      "dependencies": {
        "@interactors/html": `${dependencies['@interactors/html']}`,
        "bigtest": `${dependencies.bigtest}`,
      }
    },
    files: [
      'bigtest.json'
    ]
  }
};

module.exports = {
  bigtestTemplate
};

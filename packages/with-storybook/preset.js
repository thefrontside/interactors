module.exports = {
  config(entry = []) {
    return [...entry, require.resolve('./dist/esm/wrapper')];
  }
}

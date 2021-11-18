module.exports = {
  interactors: [
    'quick-start',
    {
      type: 'category',
      label: 'Using interactors',
      collapsed: false,
      items: [
        'predefined-interactors',
        'locators-filters',
        'actions',
        'assertions',
        'matchers',
        'composition',
        'configuration'
      ]
    },
    {
      type: 'category',
      label: 'Creating interactors',
      collapsed: false,
      items: [
        'create-first-interactor',
        'create-locator',
        'create-filters',
        'create-actions',
      ]
    },
    {
      type: 'category',
      label: 'Integrations',
      collapsed: true,
      items: [
        'jest',
        'cypress',
        'storybook',
      ]
    },
    'library'
  ]
};

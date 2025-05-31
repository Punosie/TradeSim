/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
  docs: [
    {
      type: 'doc',
      id: 'intro',
      label: 'Introduction',
    },
    {
      type: 'category',
      label: 'Backend',
      items: ['backend/intro', 'backend/architecture', 'backend/api'],
    },
    {
      type: 'category',
      label: 'Frontend',
      items: ['frontend/intro', 'frontend/architecture', 'frontend/api'],
    },
  ],
};

module.exports = sidebars;

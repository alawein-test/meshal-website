module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      ['feat', 'fix', 'docs', 'refactor', 'test', 'chore', 'perf', 'ci', 'style', 'revert'],
    ],
    'scope-enum': [
      2,
      'always',
      [
        // Platforms
        'simcore',
        'mezan',
        'talai',
        'optilibria',
        'qmlab',
        // Application areas
        'auth',
        'dashboard',
        'portfolio',
        'resume',
        'studios',
        // Code areas
        'components',
        'hooks',
        'stores',
        'types',
        'utils',
        'pages',
        // Infrastructure
        'api',
        'edge-functions',
        'db',
        'config',
        'ci',
        // Documentation
        'docs',
        'readme',
        // Dependencies & repo
        'deps',
        'repo',
        'release',
      ],
    ],
    'scope-case': [2, 'always', 'lower-case'],
    'subject-case': [2, 'always', 'lower-case'],
    'header-max-length': [2, 'always', 100],
  },
};

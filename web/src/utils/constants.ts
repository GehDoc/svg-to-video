import pkg from '../../package.json';

export const ECOSYSTEM_LINKS = {
  github: pkg.repository.url,
  npm: 'https://www.npmjs.com/package/@gehdoc/svg-to-video',
  docker: 'https://hub.docker.com/r/gehdoc/svg-to-video',
  huggingface: 'https://huggingface.co/spaces/GehDoc/svg-to-video-mcp',
  mcpDocs:
    'https://registry.modelcontextprotocol.io/?q=io.github.GehDoc%2Fsvg-to-video',
  license: `${pkg.repository.url}/blob/main/LICENSE`,
  contributing: `${pkg.repository.url}/blob/main/CONTRIBUTING.md`,
};

import path from 'path';

export const FIXTURE_DIR_RELATIVE = './tests/fixtures';
export const OUTPUT_DIR_RELATIVE = './out-dir-test';

export const getTestPaths = (fixtureName: string, extension = '.mp4') => {
  return {
    inputFile: path.join(FIXTURE_DIR_RELATIVE, `${fixtureName}.svg`),
    outputFile: path.join(OUTPUT_DIR_RELATIVE, `${fixtureName}${extension}`),
  };
};

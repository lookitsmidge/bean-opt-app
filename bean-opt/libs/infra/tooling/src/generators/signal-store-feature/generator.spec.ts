import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';
import { Tree, addProjectConfiguration } from '@nx/devkit';

import { signalStoreFeatureGenerator } from './generator';
import { SignalStoreFeatureGeneratorSchema } from './schema';

describe('signal-store-feature generator', () => {
  let tree: Tree;
  const options: SignalStoreFeatureGeneratorSchema = { 
    name: 'with-test', 
    project: 'test-app'
  };

  beforeEach(() => {
    tree = createTreeWithEmptyWorkspace();
    addProjectConfiguration(tree, 'test-app', {
      root: 'libs/test-app',
      projectType: 'library',
      sourceRoot: 'libs/test-app/src',
      targets: {},
    });
    tree.write('libs/test-app/src/index.ts', '');
  });

  it('should run successfully', async () => {
    await signalStoreFeatureGenerator(tree, options);
    expect(tree.exists('libs/test-app/src/lib/with-test.ts')).toBeTruthy();
    const indexContent = tree.read('libs/test-app/src/index.ts', 'utf-8');
    expect(indexContent).toContain("export * from './lib/with-test';");
  });
});

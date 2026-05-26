import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';
import { Tree, readProjectConfiguration, addProjectConfiguration } from '@nx/devkit';

import { uiComponentGenerator } from './generator';
import { UiComponentGeneratorSchema } from './schema';

describe('ui-component generator', () => {
  let tree: Tree;
  const options: UiComponentGeneratorSchema = { name: 'test-comp', project: 'test-ui' };

  beforeEach(() => {
    tree = createTreeWithEmptyWorkspace();
    addProjectConfiguration(tree, 'test-ui', {
      root: 'libs/test-ui',
      projectType: 'library',
      sourceRoot: 'libs/test-ui/src',
      targets: {},
    });
    // Create an index.ts file for testing auto-export
    tree.write('libs/test-ui/src/index.ts', '');
  });

  it('should run successfully', async () => {
    await uiComponentGenerator(tree, options);
    expect(tree.exists('libs/test-ui/src/lib/test-comp/test-comp.component.ts')).toBeTruthy();
    const indexContent = tree.read('libs/test-ui/src/index.ts', 'utf-8');
    expect(indexContent).toContain("export * from './lib/test-comp/test-comp.component';");
  });
});

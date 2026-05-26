import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';
import { Tree, addProjectConfiguration } from '@nx/devkit';

import { featureViewGenerator } from './generator';
import { FeatureViewGeneratorSchema } from './schema';

describe('feature-view generator', () => {
  let tree: Tree;
  const options: FeatureViewGeneratorSchema = { 
    name: 'test-list', 
    project: 'test-feature',
    domain: 'test-domain'
  };

  beforeEach(() => {
    tree = createTreeWithEmptyWorkspace();
    addProjectConfiguration(tree, 'test-feature', {
      root: 'libs/test-feature',
      projectType: 'library',
      sourceRoot: 'libs/test-feature/src',
      targets: {},
    });
    // Mock routes file
    tree.write('libs/test-feature/src/lib/lib.routes.ts', 'export const testRoutes = { children: [] };');
  });

  it('should run successfully', async () => {
    await featureViewGenerator(tree, options);
    expect(tree.exists('libs/test-feature/src/lib/test-list/test-list.component.ts')).toBeTruthy();
    const routesContent = tree.read('libs/test-feature/src/lib/lib.routes.ts', 'utf-8');
    expect(routesContent).toContain("import { TestListComponent } from './test-list/test-list.component';");
    expect(routesContent).toContain("{ path: 'test-list', component: TestListComponent },");
  });
});

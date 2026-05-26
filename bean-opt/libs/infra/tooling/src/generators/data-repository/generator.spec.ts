import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';
import { Tree, addProjectConfiguration } from '@nx/devkit';

import { dataRepositoryGenerator } from './generator';
import { DataRepositoryGeneratorSchema } from './schema';

describe('data-repository generator', () => {
  let tree: Tree;
  const options: DataRepositoryGeneratorSchema = { 
    name: 'test', 
    project: 'test-data-access',
    type: 'firebase'
  };

  beforeEach(() => {
    tree = createTreeWithEmptyWorkspace();
    addProjectConfiguration(tree, 'test-data-access', {
      root: 'libs/test-data-access',
      projectType: 'library',
      sourceRoot: 'libs/test-data-access/src',
      targets: {},
    });
    tree.write('libs/test-data-access/src/index.ts', '');
  });

  it('should run successfully for firebase', async () => {
    await dataRepositoryGenerator(tree, options);
    expect(tree.exists('libs/test-data-access/src/lib/firebase/firebase-test.repository.ts')).toBeTruthy();
    const indexContent = tree.read('libs/test-data-access/src/index.ts', 'utf-8');
    expect(indexContent).toContain("export * from './lib/firebase/firebase-test.repository';");
  });

  it('should run successfully for supabase', async () => {
    await dataRepositoryGenerator(tree, { ...options, type: 'supabase' });
    expect(tree.exists('libs/test-data-access/src/lib/supabase/supabase-test.repository.ts')).toBeTruthy();
    const indexContent = tree.read('libs/test-data-access/src/index.ts', 'utf-8');
    expect(indexContent).toContain("export * from './lib/supabase/supabase-test.repository';");
  });
});

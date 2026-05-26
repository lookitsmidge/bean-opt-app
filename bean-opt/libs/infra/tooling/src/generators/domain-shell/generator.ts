import {
  formatFiles,
  generateFiles,
  getProjects,
  names,
  Tree,
  runTasksInSerial,
} from '@nx/devkit';
import { libraryGenerator } from '@nx/angular/generators';
import * as path from 'path';
import { DomainShellGeneratorSchema } from './schema';

export async function domainShellGenerator(
  tree: Tree,
  options: DomainShellGeneratorSchema,
) {
  const { className, fileName, propertyName, constantName } = names(options.name);
  const tiers = ['domain', 'application', 'data-access', 'feature', 'ui'];
  const tasks = [];

  for (const tier of tiers) {
    const projectName = `${fileName}-${tier}`;
    const projectRoot = `libs/${fileName}/${tier}`;
    const importPath = `@wfi/${fileName}/${tier}`;

    // Skip if library already exists
    const projects = getProjects(tree);
    if (projects.has(projectName)) {
        continue;
    }

    const libTask = await libraryGenerator(tree, {
      name: projectName,
      directory: projectRoot,
      importPath,
      standalone: true,
      strict: true,
      linter: 'eslint',
      unitTestRunner: (tier === 'domain' || tier === 'ui' ? 'none' : 'jest') as any,
      tags: `scope:${fileName},type:${tier}`,
      skipFormat: true,
    });
    tasks.push(libTask);

    // Clean up default generated files in src/lib
    const libPath = `${projectRoot}/src/lib`;
    const files = tree.children(libPath);
    for (const file of files) {
        tree.delete(`${libPath}/${file}`);
    }
    // Delete default index.ts to overwrite it
    if (tree.exists(`${projectRoot}/src/index.ts`)) {
        tree.delete(`${projectRoot}/src/index.ts`);
    }
  }

  // Generate our custom files
  generateFiles(
    tree, 
    path.join(__dirname, 'files'), 
    '.', 
    {
      ...options,
      name: fileName,
      className,
      fileName,
      propertyName,
      constantName,
    }
  );

  if (process.env['NODE_ENV'] !== 'test') {
    await formatFiles(tree);
  }
  
  return runTasksInSerial(...tasks);
}

export default domainShellGenerator;

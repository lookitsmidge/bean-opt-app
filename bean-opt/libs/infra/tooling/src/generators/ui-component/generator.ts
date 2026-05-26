import {
  formatFiles,
  generateFiles,
  getProjects,
  names,
  Tree,
  readProjectConfiguration,
} from '@nx/devkit';
import * as path from 'path';
import { UiComponentGeneratorSchema } from './schema';

export async function uiComponentGenerator(
  tree: Tree,
  options: UiComponentGeneratorSchema,
) {
  const { className, fileName, propertyName, constantName } = names(options.name);
  
  const projects = getProjects(tree);
  if (!projects.has(options.project)) {
    throw new Error(`Project "${options.project}" not found.`);
  }

  const projectConfig = readProjectConfiguration(tree, options.project);
  const projectRoot = projectConfig.root;

  generateFiles(
    tree, 
    path.join(__dirname, 'files'), 
    projectRoot, 
    {
      ...options,
      name: fileName,
      className,
      fileName,
      propertyName,
      constantName,
    }
  );

  // Auto-export from index.ts if it exists
  const indexPath = path.join(projectRoot, 'src', 'index.ts');
  if (tree.exists(indexPath)) {
    const content = tree.read(indexPath, 'utf-8') || '';
    const exportStatement = `export * from './lib/${fileName}/${fileName}.component';`;
    if (!content.includes(exportStatement)) {
      tree.write(indexPath, `${content}\n${exportStatement}`);
    }
  }

  await formatFiles(tree);
}

export default uiComponentGenerator;

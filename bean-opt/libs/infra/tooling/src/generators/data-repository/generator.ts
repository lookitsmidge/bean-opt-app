import {
  formatFiles,
  generateFiles,
  getProjects,
  names,
  Tree,
  readProjectConfiguration,
} from '@nx/devkit';
import * as path from 'path';
import { DataRepositoryGeneratorSchema } from './schema';

export async function dataRepositoryGenerator(
  tree: Tree,
  options: DataRepositoryGeneratorSchema,
) {
  const { className, fileName } = names(options.name);
  
  const projects = getProjects(tree);
  if (!projects.has(options.project)) {
    throw new Error(`Project "${options.project}" not found.`);
  }

  const projectConfig = readProjectConfiguration(tree, options.project);
  const projectRoot = projectConfig.root;

  // Generate for the specific type
  generateFiles(
    tree, 
    path.join(__dirname, 'files', 'src', 'lib', options.type), 
    path.join(projectRoot, 'src', 'lib', options.type), 
    {
      ...options,
      className,
      fileName,
    }
  );

  // Auto-export from index.ts
  const indexPath = path.join(projectRoot, 'src', 'index.ts');
  if (tree.exists(indexPath)) {
    const content = tree.read(indexPath, 'utf-8') || '';
    const exportStatement = `export * from './lib/${options.type}/${options.type}-${fileName}.repository';`;
    if (!content.includes(exportStatement)) {
      tree.write(indexPath, `${content}\n${exportStatement}`);
    }
  }

  await formatFiles(tree);
}

export default dataRepositoryGenerator;

import {
  formatFiles,
  generateFiles,
  getProjects,
  names,
  Tree,
  readProjectConfiguration,
} from '@nx/devkit';
import * as path from 'path';
import { SignalStoreFeatureGeneratorSchema } from './schema';

export async function signalStoreFeatureGenerator(
  tree: Tree,
  options: SignalStoreFeatureGeneratorSchema,
) {
  const { className, fileName, propertyName } = names(options.name);
  
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
      className,
      fileName,
      propertyName,
    }
  );

  // Auto-export from index.ts
  const indexPath = path.join(projectRoot, 'src', 'index.ts');
  if (tree.exists(indexPath)) {
    const content = tree.read(indexPath, 'utf-8') || '';
    const exportStatement = `export * from './lib/${fileName}';`;
    if (!content.includes(exportStatement)) {
      tree.write(indexPath, `${content}\n${exportStatement}`);
    }
  }

  await formatFiles(tree);
}

export default signalStoreFeatureGenerator;

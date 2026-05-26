import {
  formatFiles,
  generateFiles,
  getProjects,
  names,
  Tree,
  readProjectConfiguration,
} from '@nx/devkit';
import * as path from 'path';
import { FeatureViewGeneratorSchema } from './schema';

export async function featureViewGenerator(
  tree: Tree,
  options: FeatureViewGeneratorSchema,
) {
  const { className, fileName } = names(options.name);
  const domainNames = names(options.domain);
  
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
      domainClassName: domainNames.className,
      domainFileName: domainNames.fileName,
    }
  );

  // Auto-register in routes
  const routesPath = path.join(projectRoot, 'src', 'lib', 'lib.routes.ts');
  if (tree.exists(routesPath)) {
    let content = tree.read(routesPath, 'utf-8') || '';
    
    // Add Import
    const importStatement = `import { ${className}Component } from './${fileName}/${fileName}.component';`;
    if (!content.includes(importStatement)) {
      content = `${importStatement}\n${content}`;
    }

    // Add Route to children array
    const routeEntry = `{ path: '${fileName}', component: ${className}Component },`;
    if (!content.includes(routeEntry)) {
        // Simple regex to find children: [] array
        content = content.replace(/children:\s*\[/, `children: [\n      ${routeEntry}`);
    }

    tree.write(routesPath, content);
  }

  await formatFiles(tree);
}

export default featureViewGenerator;

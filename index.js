const fs = require('fs');
const chokidar = require('chokidar');

const libPath = process.argv[2] || "/c/Users/josias.m.caitano/OneDrive - Accenture/Documents/projects/angular/angular-avancado/finansys";
const projectPath = process.argv[3] || "C:\Users\josias.m.caitano\OneDrive - Accenture\Documents\projects\angular\portal-forests\mfe-base-forests\node_modules";

if (!libPath || !projectPath) {
  console.error('Por favor, forneça os caminhos da lib e do projeto como argumentos.');
  process.exit(1);
}

const watcher = chokidar.watch(libPath, { persistent: true });

console.log(`Assistindo as alterações em ${libPath} e copiando para ${projectPath}`);

watcher
  .on('add', (path) => {
    console.log(`Arquivo adicionado: ${path}`);
    const destinationPath = path.replace(libPath, projectPath);
    fs.copyFileSync(path, destinationPath);
    console.log(`Copiado para: ${destinationPath}`);
  })
  .on('change', (path) => {
    console.log(`Arquivo alterado: ${path}`);
    const destinationPath = path.replace(libPath, projectPath);
    fs.copyFileSync(path, destinationPath);
    console.log(`Copiado para: ${destinationPath}`);
  })
  .on('unlink', (path) => {
    console.log(`Arquivo removido: ${path}`);
    const destinationPath = path.replace(libPath, projectPath);
    fs.unlinkSync(destinationPath);
    console.log(`Removido de: ${destinationPath}`);
  });

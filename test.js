const chokidar = require('chokidar');
const { exec } = require('child_process'); // Importe exec do módulo child_process.
const fs = require('fs-extra');
const path = require('path');

const libPath = "C:\\Users\\josias.m.caitano\\OneDrive - Accenture\\Documents\\projects\\angular\\angular-avancado\\finansys"; // Substitua pelo caminho real para a pasta da sua lib.
const projectPath = 'C:\\Users\\josias.m.caitano\\OneDrive - Accenture\\Documents\\projects\\angular\\portal-forests\\mfe-base-forests\\node_modules'; // Substitua pelo caminho real para o projeto que utiliza a lib.
const libName = 'sua-lib'; // Substitua 'sua-lib' pelo nome correto da sua lib.

// Iniciar o processo de build da lib em modo de observação.
const buildProcess = exec('ng build --watch', { cwd: libPath });

buildProcess.stdout.on('data', (data) => {
  console.log(data);
});

buildProcess.stderr.on('data', (data) => {
  console.error(data);
});

buildProcess.on('close', (code) => {
  console.log(`O processo de build da lib encerrou com código ${code}`);
});

// Monitorar alterações na pasta de build da lib.
const buildWatcher = chokidar.watch(path.join(libPath, 'dist'), {
  ignoreInitial: true, // Ignorar eventos iniciais ao iniciar o watcher.
});

buildWatcher.on('change', async (changedFile) => {
  console.log(`Detectada alteração em ${changedFile}`);

  try {
    // Copiar a pasta `dist` atualizada diretamente para o projeto principal.
    const sourceDistPath = path.join(libPath, 'dist');
    const destinationDistPath = path.join(projectPath, libName, 'dist'); // Removemos 'node_modules' daqui.
    
    await fs.remove(destinationDistPath); // Remover a pasta `dist` existente no projeto principal.
    await fs.copy(sourceDistPath, destinationDistPath); // Copiar a pasta `dist` atualizada.

    console.log(`Pasta dist copiada para: ${destinationDistPath}`);
  } catch (error) {
    console.error(`Erro ao copiar a pasta dist: ${error}`);
  }
});

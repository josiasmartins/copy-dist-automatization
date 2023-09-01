const chokidar = require('chokidar');
const { exec } = require('child_process');
const fs = require('fs-extra');
const path = require('path');
const ansiColors = require('ansi-colors'); // Importar ansi-colors no lugar do chalk.

// Definir o caminho para a pasta da sua biblioteca (lib).
const libPath =  "C:\\Users\\josias.m.caitano\\OneDrive - Accenture\\Documents\\projects\\angular\\angular-avancado\\finansys"; // Substitua pelo caminho real para a pasta da sua lib.

// Definir o caminho para o projeto que utiliza a biblioteca (lib).
const projectPath = 'C:\\Users\\josias.m.caitano\\OneDrive - Accenture\\Documents\\projects\\angular\\portal-forests\\mfe-base-forests\\node_modules'; // Substitua pelo caminho real para o projeto que utiliza a lib.

// Função para iniciar o processo de build da lib em modo de observação.
function startBuildProcess(libPath) {
  return exec('ng build --watch', { cwd: libPath });
}

// Função para copiar arquivos da pasta de origem para a pasta de destino.
async function copyFiles(sourcePath, destinationPath) {
  try {
    await fs.ensureDir(destinationPath);

    const files = await fs.readdir(sourcePath);
    for (const file of files) {
      const sourceFile = path.join(sourcePath, file);
      const destinationFile = path.join(destinationPath, file);
      await fs.copy(sourceFile, destinationFile);
    }

    console.log(ansiColors.green(`Conteúdo da pasta copiado para: ${destinationPath}`));
  } catch (error) {
    console.error(ansiColors.red(`Erro ao copiar o conteúdo da pasta: ${error}`));
  }
}

const buildProcess = startBuildProcess(libPath);

buildProcess.stdout.on('data', (data) => {
  console.log(ansiColors.blue(data));
});

buildProcess.stderr.on('data', (data) => {
  console.error(ansiColors.red(data));
});

buildProcess.on('close', (code) => {
  console.log(ansiColors.yellow(`O processo de build da lib encerrou com código ${code}`));
});

const buildWatcher = chokidar.watch(path.join(libPath, 'dist'), {
  ignoreInitial: true,
});

buildWatcher.on('change', async (changedFile) => {
  console.log(ansiColors.cyan(`Detectada alteração em ${changedFile}`));

  try {
    const distContents = await fs.readdir(path.join(libPath, 'dist'));
    if (distContents.length === 1 && distContents[0] !== 'index.html') {
      const libName = distContents[0];
      const sourceDistPath = path.join(libPath, 'dist', libName);
      const destinationDistPath = path.join(projectPath, libName);

      await copyFiles(sourceDistPath, destinationDistPath);
    } else {
      console.log(ansiColors.yellow('Pasta dist não existe ou não pôde ser determinada. Aguardando a criação...'));
    }
  } catch (error) {
    console.error(ansiColors.red(`Erro ao copiar o conteúdo da pasta dist: ${error}`));
  }
});

// Função para converter um caminho Unix em formato Windows.
function convertPathToWindowsFormat(unixPath) {
  const windowsPath = unixPath.replace(/\//g, '\\');
  return windowsPath;
}

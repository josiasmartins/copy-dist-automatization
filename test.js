const chokidar = require('chokidar');
const { exec } = require('child_process');
const fs = require('fs-extra');
const path = require('path');

const libPath = "C:\\Users\\josias.m.caitano\\OneDrive - Accenture\\Documents\\projects\\angular\\angular-avancado\\finansys"; // Substitua pelo caminho real para a pasta da sua lib.
const projectPath = 'C:\\Users\\josias.m.caitano\\OneDrive - Accenture\\Documents\\projects\\angular\\portal-forests\\mfe-base-forests\\node_modules'; // Substitua pelo caminho real para o projeto que utiliza a lib.

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
    // Obter o nome da pasta da lib dinamicamente.
    const distContents = await fs.readdir(path.join(libPath, 'dist'));
    if (distContents.length === 1 && distContents[0] !== 'index.html') {
      const libName = distContents[0]; // O nome da pasta é o único item na pasta `dist` que não seja o arquivo `index.html`.

      // Copiar apenas os arquivos existentes da pasta `dist` atualizada diretamente para o projeto principal.
      const sourceDistPath = path.join(libPath, 'dist', libName);
      const destinationDistPath = path.join(projectPath, libName);

      // Certificar-se de que a pasta de destino exista antes de copiar.
      await fs.ensureDir(destinationDistPath);

      const files = await fs.readdir(sourceDistPath);
      for (const file of files) {
        const sourceFile = path.join(sourceDistPath, file);
        const destinationFile = path.join(destinationDistPath, file);
        await fs.copy(sourceFile, destinationFile);
      }

      console.log(`Conteúdo da pasta dist copiado para: ${destinationDistPath}`);
    } else {
      console.log('Pasta dist não existe ou não pôde ser determinada. Aguardando a criação...');
    }
  } catch (error) {
    console.error(`Erro ao copiar o conteúdo da pasta dist: ${error}`);
  }
});

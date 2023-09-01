// const { exec } = require('child_process');

// // Substitua 'caminho/para/sua-lib' pelo caminho real para a pasta da sua lib.

// const libPath = process.argv[2] || "/c/Users/josias.m.caitano/OneDrive - Accenture/Documents/projects/angular/angular-avancado/finansys";
// const projectPath = process.argv[3] || "C:\Users\josias.m.caitano\OneDrive - Accenture\Documents\projects\angular\portal-forests\mfe-base-forests\node_modules";

// const buildProcess = exec('npm run start-watch', { cwd: libPath });

// buildProcess.stdout.on('data', (data) => {
//   console.log(data);
// });

// buildProcess.stderr.on('data', (data) => {
//   console.error(data);
// });

// buildProcess.on('close', (code) => {
//   console.log(`O processo de build da lib encerrou com código ${code}`);
// });


const chokidar = require('chokidar');
const { exec } = require('child_process');
const path = require('path');

// const libPath = 'caminho/para/sua/lib'; // Substitua pelo caminho real para a pasta da sua lib.
// const projectPath = 'caminho/para/seu/projeto'; // Substitua pelo caminho real para o projeto que utiliza a lib.

const libPath = process.argv[2] || "/c/Users/josias.m.caitano/OneDrive - Accenture/Documents/projects/angular/angular-avancado/finansys";
const projectPath = process.argv[3] || "C:\Users\josias.m.caitano\OneDrive - Accenture\Documents\projects\angular\portal-forests\mfe-base-forests\node_modules";


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
const buildWatcher = chokidar.watch(path.join(libPath, 'dist'));

// buildWatcher.on('change', (changedFile) => {
//   console.log(`Detectada alteração em ${changedFile}`);

//   // Copiar o build atualizado para o projeto que utiliza a lib.
//   const destinationPath = path.join(projectPath, 'node_modules/sua-lib');
//   exec(`cp -r ${changedFile} ${destinationPath}`, (error, stdout, stderr) => {
//     if (error) {
//       console.error(`Erro ao copiar: ${error}`);
//     } else {
//       console.log(`Copiado para: ${destinationPath}`);
//     }
//   });
// });

buildWatcher.on('change', (changedFile) => {
    console.log(`Detectada alteração em ${changedFile}`);
  
    // Copiar o build atualizado para o projeto que utiliza a lib.
    const destinationPath = path.join(projectPath, 'node_modules/sua-lib');
    exec(`xcopy /s /e /h /y "${changedFile}" "${destinationPath}"`, (error, stdout, stderr) => {
      if (error) {
        console.error(`Erro ao copiar: ${error}`);
      } else {
        console.log(`Copiado para: ${destinationPath}`);
      }
    });
  });
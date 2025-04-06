import { execSync } from 'child_process';

const compile = async () => {
  execSync('tsc && resolve-tspaths');
};

const copyFiles = async () => {
  execSync('cp package.json dist/');
  execSync('cp package-lock.json dist/');
};

const installDependencies = async () => {
  execSync('npm install --omit=dev --prefix dist');
};

const clean = async () => {
  execSync('rm -rf dist/infra/config/git-ignored');
};

compile();
copyFiles();
installDependencies();
clean();

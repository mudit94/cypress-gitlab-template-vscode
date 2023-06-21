// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');
const { exec } = require('child_process');
// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
const fs = require('fs');

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "cypress-setup" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with  registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('cypress-setup.helloWorld', function () {
		// The code you place here will be executed every time your command is executed
		const terminal = vscode.window.createTerminal('Cypress Installation');
		//terminal.sendText('npm i -g pnpm');
	 	terminal.sendText('pnpm install cypress cypress-xpath --save-dev ');
		 terminal.sendText('pnpm install fs ');
		 const rootPath = vscode.workspace.rootPath;
		 if (!rootPath) {
			vscode.window.showErrorMessage('No workspace found. Open a workspace with your Cypress project to generate the Cypress configuration files.');
			return;
		  }
	// 	terminal.sendText('cp cypress.config.js .')
	// 	terminal.sendText('mkdir -p cypress/support')
	// 	terminal.sendText('mkdir -p cypress/integration')
	// 	terminal.sendText('mkdir -p cypress/plugins')
	// 	terminal.sendText('touch cypress/integration/test.cy.js')
	//  	terminal.sendText('touch cypress/support/e2e.js');
	// 	terminal.sendText('touch cypress.config.js');
	// // 	// Display a message box to the user
	
    const gitlabCIContent = `
image: cypress/base:14.17.0

stages:
  - test

cypress_tests:
  stage: test
  script:
    - npm ci
    - npx cypress install
    - npx cypress run
  artifacts:
    paths:
      - cypress/screenshots/
      - cypress/videos/
`;
const configFileContent=`
	module.exports = {
	baseUrl: 'http://localhost:3000',
	integrationFolder: 'cypress/integration',
	pluginsFile: 'cypress/plugins/index.js',
	screenshotsFolder: 'cypress/screenshots',
	videosFolder: 'cypress/videos',
	supportFile: 'cypress/support/index.js'
	// Add other desired Cypress configuration options
  };`
  const gitlabCIPath = `/.gitlab-ci.yml`;
  const wsPath = vscode.workspace.workspaceFolders[0].uri.fsPath; // gets the path of the first workspace folder
const filePath = vscode.Uri.file(wsPath + gitlabCIPath);


  	const configFile=`${{rootPath}}/cypress.config.js`;
	const supportFile='e2e.js';
	const pluginsFile='index.js';
	  const pluginsIndexPath = `${{rootPath}}/cypress/plugins/e2e.js`;
	  const supportIndexPath = `${{rootPath}}/cypress/support/index.js`;
	//   fs.writeFile(pluginsIndexPath, '', (err) => {
	// 	if (err) {
	// 	  vscode.window.showErrorMessage(`Failed to generate Cypress plugins index file: ${err.message}`);
	// 	  return;
	// 	}
	// 	vscode.window.showInformationMessage(`Cypress plugins index file generated at ${pluginsIndexPath}`);
	//   });
  
	//   fs.writeFile(supportIndexPath, '', (err) => {
	// 	if (err) {
	// 	  vscode.window.showErrorMessage(`Failed to generate Cypress support index file: ${err.message}`);
	// 	  return;
	// 	}
	// 	vscode.window.showInformationMessage(`Cypress support index file generated at ${supportIndexPath}`);
	//   });
	
    fs.writeFile(filePath.toString(), gitlabCIContent, (err)  => {
      if (err) {
        vscode.window.showErrorMessage(`Failed to generate GitLab CI file: ${err.message}`);
      } else {
        vscode.window.showInformationMessage(`GitLab CI file generated at ${gitlabCIPath}`);
      }
    });
	vscode.window.showInformationMessage('Hello from cypress-setup!');

  });


	context.subscriptions.push(disposable);
	// exec('pnpm run postinstall', (error, stdout, stderr) => {
	// 	if (error) {
	// 	  console.error(`Error running postinstall script: ${error}`);
	// 	  return;
	// 	}
	// 	console.log(`stdout: ${stdout}`);
	// 	console.error(`stderr: ${stderr}`);
	
}

// This method is called when your extension is deactivated
function deactivate() {}

module.exports = {
	activate,
	deactivate
}

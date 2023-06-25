// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');
// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
const fs = require('fs');
var path = require('path');

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "cypress-allure-gitlabsetup" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with  registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('cypress-setup.cypress-allure-gitlabsetup', function () {
		// The code you place here will be executed every time your command is executed
		const terminal = vscode.window.createTerminal('Cypress Installation');
		terminal.show();
		terminal.sendText('npm init -y');
		//const fs = require('fs');
		
		terminal.sendText('npm install --save-dev cypress@12.14.0 cypress-xpath @shelex/cypress-allure-plugin mocha-allure-reporter allure-commandline');
		terminal.sendText('npm install fs');

		 
		 const rootPath = vscode.workspace.workspaceFolders[0].uri.fsPath;
		 if (!rootPath) {
			vscode.window.showErrorMessage('No workspace found. Open a workspace with your Cypress project to generate the Cypress configuration files.');
			return;
		  }
		terminal.sendText("npx cypress run --browser chrome --env allure=true,allureResultsPath=allure-results");
		terminal.sendText("allure generate allure-results --clean -o allure-report");
    
		//  terminal.sendText(`mkdir -p`+" "+rootPath+`cypress/{support,plugins,integration}`)
	// 	terminal.sendText('cp cypress.config.js .')
	// 	terminal.sendText('mkdir -p cypress/support')
	// 	terminal.sendText('mkdir -p cypress/integration')
	// 	terminal.sendText('mkdir -p cypress/plugins')
	// 	terminal.sendText('touch cypress/integration/test.cy.js')
	//  	terminal.sendText('touch cypress/support/e2e.js');
	// 	terminal.sendText('touch cypress.config.js');
	// // 	// Display a message box to the user
	
    const gitlabCIContent = `
image: cypress/browsers:node-18.15.0-chrome-111.0.5563.146-1-ff-111.0.1-edge-111.0.1661.62-1

stages:
  - test
  - allure
  - deploy

cypress_tests:
  stage: test
  script:
    - npm i
    - npx cypress run --env allure=true
  artifacts:
    paths:
      - cypress/screenshots/
      - cypress/videos/
      - allure-results/

allure_report:
  stage: allure
  dependencies:
    - cypress_tests
  before_script:
    - npm i --save-dev allure-commandline 
  script:
    - allure generate allure-results --clean -o allure-report
  artifacts:
    paths:
      - allure-report

pages:
  stage: deploy
  dependencies:
    - allure_report
  script:
    - cp allure-report public/
  artifacts:
    paths:
      - public/
`;
		

const configFileContent =`

const { defineConfig } = require("cypress");
const allureWriter = require('@shelex/cypress-allure-plugin/writer');
module.exports = defineConfig({
includeShadowDom: true,
chromeWebSecurity: false,
screenshotsFolder: "cypress/screenshots",
videosFolder: "cypress/videos",
video: false,
	e2e: {
    experimentalSessionAndOrigin: true,
		setupNodeEvents(on, config) {
		allureWriter(on, config);
		return config;
//	return require("./cypress/plugins/index.js")(on,config);
		// implement node event listeners here
    },
	env:{
		allureReuseAfterSpec: true
	}
  }
});
`
  const gitlabCIPath = `.gitlab-ci.yml`;
//  const wsPath = vscode.workspace.workspaceFolders[0].uri.fsPath; // gets the path of the first workspace folder
//const filePath = vscode.Uri.file(wsPath + gitlabCIPath);

const supportFileContents=`
import './commands';
require("cypress-xpath");
import "@shelex/cypress-allure-plugin";
`
  	const configFile=`cypress.config.js`;
	const supportFile='e2e.js';
	const pluginsFile='index.js';
	const testFile='testspec.cy.js';
	const commandsFile='commands.js';
	  const pluginsIndexPath = `cypress/plugins/`;
	  const supportIndexPath = `cypress/support/`;
	  const testFileIndexPath=`cypress/e2e/`;
	  
	  //const commandsFileIndexPath=`cypress/support/`;

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
	var pluginsFileContent=`
	///<reference types="@shelex/cypress-allure-plugin" />
	const allureWriter = require('@shelex/cypress-allure-plugin/writer');
		
	module.exports = (on, config) => {
	  allureWriter(on, config);
	  return config;
	};`
	var testFileContent=`
	describe('template spec', () => {
		it('passes', () => {
		  cy.visit('https://example.cypress.io')
		})
		it('passes on google', () => {
			cy.visit('https://google.com')
		  })
	  })`;
	const wsedit = new vscode.WorkspaceEdit();
	  
	//I also encountered a similar problem. You can also solve your problem by doing the following:

//	var content = rec[rt.fields[field]];
	var gitlabfilePath = path.join(vscode.workspace.workspaceFolders[0].uri.fsPath, gitlabCIPath);
	fs.writeFileSync(gitlabfilePath, gitlabCIContent, 'utf8');
	
	// var openPath = vscode.Uri.parse("file:///" + filePath); //A request file path
	// vscode.workspace.openTextDocument(openPath).then(doc => {
	//   vscode.window.showTextDocument(doc);
	// });
	//const wsedit = new vscode.WorkspaceEdit();
//const wsPath = vscode.workspace.workspaceFolders[0].uri.fsPath; // gets the path of the first workspace folder
//const supportFilePath = vscode.Uri.file(wsPath + '/cypress/support/e2e.js');
//vscode.window.showInformationMessage(supportFilePath.toString());
//wsedit.createFile(supportFilePath, { ignoreIfExists: true });
	var configFilePath = path.join(vscode.workspace.workspaceFolders[0].uri.fsPath, configFile);
	var supportFileFolder = path.join(vscode.workspace.workspaceFolders[0].uri.fsPath, supportIndexPath);
	var pluginFileFolder = path.join(vscode.workspace.workspaceFolders[0].uri.fsPath, pluginsIndexPath);
	var testFileFolder=path.join(vscode.workspace.workspaceFolders[0].uri.fsPath, testFileIndexPath);
	//var commandsFolder=path.join(vscode.workspace.rootPath,commandsFileIndexPath);
	console.log(supportFileFolder);
	fs.mkdirSync(supportFileFolder,{recursive:true});
	
	fs.mkdirSync(pluginFileFolder,{recursive:true});
	fs.mkdirSync(testFileFolder,{recursive:true});
	var supportFilePath=path.join(supportFileFolder,supportFile);
var commandsFilePath=path.join(supportFileFolder,commandsFile);	
var pluginFilePath=path.join(pluginFileFolder,pluginsFile);
fs.writeFileSync(pluginFilePath,pluginsFileContent,'utf-8');
fs.writeFileSync(configFilePath, configFileContent, 'utf8');
  	
  var testFilePath=path.join(testFileFolder,testFile)
	
	fs.writeFileSync(supportFilePath,supportFileContents, 'utf8');
	//var commandsFilePath=path.join(vscode.workspace.rootPath,commandsFolder);
	
	fs.writeFileSync(commandsFilePath,'','utf8');
	fs.writeFileSync(testFilePath,testFileContent,'utf8') 

	// const packageData = fs.readFileSync('package.json', 'utf8');
	// const packageJson = JSON.parse(packageData);
	// packageJson.scripts.test = `cypress run --browser chrome --env allure=true`;
	// fs.writeFileSync('package.json', JSON.stringify(packageJson, null, 2));

	
	
	vscode.workspace.applyEdit(wsedit);
vscode.window.showInformationMessage('Created the required config files');

    //fs.writeFile(filePath.toString(), gitlabCIContent,{flag:'w+'}, (err)  => {
    //   if (err) {
    //     vscode.window.showErrorMessage(`Failed to generate GitLab CI file: ${err.message}`);
    //   } else {
    //     vscode.window.showInformationMessage(`GitLab CI file generated at ${gitlabCIPath}`);
    //   }
    // });
	

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

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
function removeFolders(folders) {
	folders.forEach(folder => {
	  const folderPath = path.join(vscode.workspace.workspaceFolders[0].uri.fsPath, folder);
  
	  if (fs.existsSync(folderPath)) {
		fs.rmdirSync(folderPath, { recursive: true });
		console.log(`Folder '${folder}' removed.`);
	  } else {
		console.log(`Folder '${folder}' does not exist.`);
	  }
	});
  }
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
		removeFolders(['allure-results','allure-report']);
		terminal.sendText('npm install --save-dev cypress@12.14.0 cypress-xpath @shelex/cypress-allure-plugin mocha-allure-reporter allure-commandline');
		terminal.sendText('npm install fs');
		terminal.sendText('npm install husky@latest --save-dev');
		terminal.sendText('npm install prettier --save-dev')
		 
		 const rootPath = vscode.workspace.workspaceFolders[0].uri.fsPath;
		 if (!rootPath) {
			vscode.window.showErrorMessage('No workspace found. Open a workspace with your Cypress project to generate the Cypress configuration files.');
			return;
		  }
		terminal.sendText("npx cypress run --browser chrome --env allure=true,allureResultsPath=allure-results");
		terminal.sendText("npx allure generate allure-results --clean -o allure-report");
		const prettierIgnoreconfigFileContent=`node_modules/`
		const prettierConfigFileContent=`
		{
			"singleQuote": true
		  }`
	const githubActionsFileContent=`
	name: Cypress Tests and Allure Report

	on:
	  push:
		branches:
		  - main
	
	jobs:
	  build:
		runs-on: ubuntu-latest
	
		steps:
		  - name: Checkout repository
			uses: actions/checkout@v2
	
		  - name: Setup Node.js
			uses: actions/setup-node@v2
			with:
			  node-version: 14
	
		  - name: Install dependencies
			run: npm ci
	
		  - name: Run Cypress tests
			run: npm run cy:run
	
		  - name: Generate Allure report
			run: |
			  npm install -g allure-commandline
			  mkdir -p allure-results
			  allure generate allure-results --clean -o allure-report
			  allure open allure-report
	
`;
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
    - npx cypress run --browser chrome --env allure=true
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
    when: always
    paths:
      - allure-report

pages:
  stage: deploy
  dependencies:
    - allure_report
  script:
    - cp allure-report public/
  artifacts:
    when: always
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
		setupNodeEvents(on, config) {
		allureWriter(on, config);
		return config;
		// implement node event listeners here
    },
	env:{
		allureReuseAfterSpec: true
	}
  }
});
`;
//const githubCIfile=`cypress.yml`
const prettierConfig='.prettierrc.json';
const prettierIgnore='.prettierignore';
  const gitlabCIPath = `.gitlab-ci.yml`;
const supportFileContents=`
import './commands';
require("cypress-xpath");
import "@shelex/cypress-allure-plugin";
`;
  	const configFile=`cypress.config.js`;
	const supportFile='e2e.js';
	const pluginsFile='index.js';
	const testFile='testspec.cy.js';
	const commandsFile='commands.js';
	  const pluginsIndexPath = `cypress/plugins/`;
	  const supportIndexPath = `cypress/support/`;
	  const testFileIndexPath=`cypress/e2e/`;
	  const githubActionsFileIndexPath='.github/workflows/'
	  const githubActionsFile="cypress.yaml";
	var pluginsFileContent=`
	///<reference types="@shelex/cypress-allure-plugin" />
	const allureWriter = require('@shelex/cypress-allure-plugin/writer');
		
	module.exports = (on, config) => {
	  allureWriter(on, config);
	  return config;
	};`;
	var testFileContent=`
	describe('template spec', () => {
		it('passes', () => {
		  cy.visit('https://example.cypress.io')
		})
		it('passes on google', () => {
			cy.visit('https://google.com')
		  })
	  });`;
	const wsedit = new vscode.WorkspaceEdit();

	var gitlabfilePath = path.join(vscode.workspace.workspaceFolders[0].uri.fsPath, gitlabCIPath);
	fs.writeFileSync(gitlabfilePath, gitlabCIContent, 'utf8');
	
	//var githubfilePath = path.join(vscode.workspace.workspaceFolders[0].uri.fsPath, githubActionsFileIndexPath);
	
	var configFilePath = path.join(vscode.workspace.workspaceFolders[0].uri.fsPath, configFile);
	var prettierConfigFilePath = path.join(vscode.workspace.workspaceFolders[0].uri.fsPath, prettierConfig);
	var prettierIgnoreconfigFilePath = path.join(vscode.workspace.workspaceFolders[0].uri.fsPath, prettierIgnore);
	var supportFileFolder = path.join(vscode.workspace.workspaceFolders[0].uri.fsPath, supportIndexPath);
	var pluginFileFolder = path.join(vscode.workspace.workspaceFolders[0].uri.fsPath, pluginsIndexPath);
	var testFileFolder=path.join(vscode.workspace.workspaceFolders[0].uri.fsPath, testFileIndexPath);
	var githubActionsFolder=path.join(vscode.workspace.workspaceFolders[0].uri.fsPath, githubActionsFileIndexPath);
	
	console.log(supportFileFolder);
	fs.mkdirSync(supportFileFolder,{recursive:true});
	fs.mkdirSync(githubActionsFolder,{recursive:true});
	fs.mkdirSync(pluginFileFolder,{recursive:true});
	fs.mkdirSync(testFileFolder,{recursive:true});
	var githubActionsFilePath=path.join(githubActionsFolder,githubActionsFile);
	var supportFilePath=path.join(supportFileFolder,supportFile);
var commandsFilePath=path.join(supportFileFolder,commandsFile);	
var pluginFilePath=path.join(pluginFileFolder,pluginsFile);
fs.writeFileSync(pluginFilePath,pluginsFileContent,'utf-8');
fs.writeFileSync(configFilePath, configFileContent, 'utf8');
fs.writeFileSync(prettierIgnoreconfigFilePath,prettierIgnoreconfigFileContent,'utf8');
fs.writeFileSync(prettierConfigFilePath,prettierConfigFileContent,'utf8');
  	
  var testFilePath=path.join(testFileFolder,testFile);
	
	fs.writeFileSync(supportFilePath,supportFileContents, 'utf8');
		
	fs.writeFileSync(commandsFilePath,'','utf8');
	fs.writeFileSync(testFilePath,testFileContent,'utf8');
	fs.writeFileSync(githubActionsFilePath, githubActionsFileContent, 'utf8');

	
	vscode.window.showInformationMessage('Creating the required config files');	
	vscode.workspace.applyEdit(wsedit);



  });
	context.subscriptions.push(disposable);
	
}

// This method is called when your extension is deactivated
function deactivate() {}

module.exports = {
	activate,
	deactivate
}

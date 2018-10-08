// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');
var axios = require('axios');

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
function activate(context) {

    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('Congratulations, your extension "ckb-autocomplete" is now active!');

    vscode.workspace.onDidChangeTextDocument(onDidChangeTextDocument);
}

function setOn(word) {
    url = "http://localhost:5555/on?word=" + word
    axios.get(url).then(function (response) {
        console.log(response);
    }).catch(function (error) {
        console.log(error);
    });
}

function onDidChangeTextDocument(event) {
    // current editor
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
        return;
    }

    // check if there is no selection
    if (!editor.selection.isEmpty) {
        return;
    }

    // the Position object gives you the line and character where the cursor is
    const position = editor.selection.active;

    // Get document Uri
    const docUri = vscode.window.activeTextEditor.document.uri;

    vscode.commands.executeCommand(
        'vscode.executeCompletionItemProvider',
        docUri,
        position
    ).then(function (completion) {
        if (completion.isIncomplete) {
            return;
        }

        items = completion.items;

        // If zero or too many suggestions are available, skip.
        console.log(items);
        if (items.length > 10 || items.length == 0) {

            setOn("");
            return;
        }

        word = items[0].insertText;
        if (word == "") {
            return;
        }

        setOn(word)

    });
}

exports.activate = activate;

// this method is called when your extension is deactivated
function deactivate() {
}
exports.deactivate = deactivate;
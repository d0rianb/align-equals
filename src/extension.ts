import * as vscode from 'vscode';

function alignEquals(str: string, keepIndentation: boolean = false): string {
	const spaceRegex = /\w+(\s*)=(\s*).*$/i
	const lines: Array<string> = str.split('\n')
	const result: Array<string> = []
	let nbSpaceBeforeEquals: number = 0
	let nbSpaceAfterEquals: number = 0

	for (let line of lines) {
		const parts: Array<string> = line.split('=')
		if (parts.length !== 2 || !line.match(spaceRegex)) {
			continue
		}
		const leftSide: string = parts[0].trimRight()
		const rightSide: string = parts[1].trimLeft()
		if (leftSide.length > nbSpaceBeforeEquals) nbSpaceBeforeEquals = leftSide.length
		if (keepIndentation && rightSide.length > nbSpaceAfterEquals) nbSpaceBeforeEquals = rightSide.length
	}

	for (let line of lines) {
		const parts: Array<string> = line.split('=')
		if (parts.length !== 2 || !line.match(spaceRegex)) {
			result.push(line)
			continue
		}
		const leftSide: string = parts[0].trimRight()
		const rightSide: string = parts[1].trimLeft()
		result.push(leftSide + ' '.repeat(Math.max(nbSpaceBeforeEquals - leftSide.length, 0)) + ' = ' + ' '.repeat(Math.max(nbSpaceAfterEquals - rightSide.length, 0)) + rightSide)
	}

	return result.join('\n')
}

export function activate(context: vscode.ExtensionContext) {

	console.log('Congratulations, your extension "alignequals" is now active!')

	let disposable = vscode.commands.registerCommand('alignequals.align', () => {
		const editor = vscode.window.activeTextEditor
		if (!editor) return

		const selection = editor.selection
		const text = editor.document.getText(selection)
		if (!text.length) {
			vscode.window.showWarningMessage('AlignEquals: No text selected')
			return
		}
		const alignedText = alignEquals(text)
		editor.edit(builder => builder.replace(selection, alignedText))
		vscode.window.showInformationMessage('AlignEquals: Success')
	})

	context.subscriptions.push(disposable)
}

export function deactivate() { }

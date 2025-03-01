import * as vscode from 'vscode';

type SupportedLanguages = 'php';

const QUERY_PATTERNS: Record<SupportedLanguages, RegExp> = {
    php: /(\$\w+->\w+\([^)]*\)|\$\w+->\w+|\$\w+->\w+\([^)]*\))/g, // Match both properties and methods of Eloquent models
};

let diagnosticCollection: vscode.DiagnosticCollection;

export function activate(context: vscode.ExtensionContext) {
    console.log("Laravel N+1 Query Detector extension activated");

    diagnosticCollection = vscode.languages.createDiagnosticCollection('n1Queries');
    context.subscriptions.push(diagnosticCollection);

    // Register the Detect N+1 Queries command
    let detectCommand = vscode.commands.registerCommand('n1-query-detector.detectN1Queries', () => {
        console.log("Detect N+1 Queries command triggered");
        vscode.window.showInformationMessage('Detecting Laravel N+1 Queries...');
        if (vscode.window.activeTextEditor) {
            analyzeDocument(vscode.window.activeTextEditor.document);
        }
    });
    context.subscriptions.push(detectCommand);

    // Analyze all open PHP documents
    vscode.workspace.textDocuments.forEach((document) => {
        if (document.languageId === 'php') {
            analyzeDocument(document);
        }
    });

    // Watch for changes in the document
    vscode.workspace.onDidChangeTextDocument((event) => {
        if (event.document.languageId === 'php') {
            analyzeDocument(event.document);
        }
    });
}

function isLanguageSupported(language: string): language is SupportedLanguages {
    return language === 'php';
}

function analyzeDocument(document: vscode.TextDocument) {
    if (!isLanguageSupported(document.languageId)) {
        return;
    }

    const pattern = QUERY_PATTERNS[document.languageId];
    const diagnostics: vscode.Diagnostic[] = [];

    let inLoop = false;
    let loopVariable: string | null = null;

    for (let i = 0; i < document.lineCount; i++) {
        const line = document.lineAt(i);
        const text = line.text;

        // Detect if we're inside a foreach loop
        const foreachMatch = text.match(/foreach\s*\((\$\w+)\s+as\s+(\$\w+)\)/);
        if (foreachMatch) {
            inLoop = true;
            loopVariable = foreachMatch[2]; // Capture the loop variable (e.g., $user)
        }

        // Detect if we're exiting a loop
        if (text.includes('}') && inLoop) {
            inLoop = false;
            loopVariable = null;
        }

        // Detect queries inside the loop
        if (inLoop && loopVariable) {
            let match;
            while ((match = pattern.exec(text)) !== null) {
                // Check if the query depends on the loop variable
                if (match[0].includes(loopVariable)) {
                    const diagnostic = new vscode.Diagnostic(
                        new vscode.Range(line.range.start, line.range.end),
                        `Potential N+1 query detected: ${match[0]}. Consider using eager loading (e.g., with('posts')).`,
                        vscode.DiagnosticSeverity.Warning
                    );
                    diagnostic.code = 'n1-query';
                    diagnostics.push(diagnostic);
                }
            }
        }
    }

    diagnosticCollection.set(document.uri, diagnostics);
}

export function deactivate() {
    if (diagnosticCollection) {
        diagnosticCollection.clear();
        diagnosticCollection.dispose();
    }
}

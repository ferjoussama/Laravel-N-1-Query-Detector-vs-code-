# Laravel N+1 Query Detector for VS Code

## Overview
The **Laravel N+1 Query Detector** is a Visual Studio Code extension that helps identify potential N+1 query issues in Laravel PHP projects. It scans your PHP files and warns you about possible inefficient Eloquent queries inside loops.

## Features
- Automatically detects potential N+1 query issues inside loops.
- Provides VS Code diagnostics with warnings.
- Works with PHP files in Laravel projects.
- Runs automatically on file open and modification.
- Manually triggerable via a command.

## Installation
1. Open VS Code.
2. Navigate to `Extensions` (Ctrl+Shift+X).
3. Search for `Laravel N+1 Query Detector`.
4. Click `Install`.

## Usage
### Automatic Detection
- The extension automatically scans all open PHP files and highlights potential N+1 query issues.
- It updates diagnostics whenever a document is modified.

### Manual Trigger
- Open the Command Palette (`Ctrl+Shift+P` or `Cmd+Shift+P` on macOS).
- Search for `Detect Laravel N+1 Queries`.
- Click to run the detection manually.

## How It Works
1. The extension scans PHP files and detects `foreach` loops.
2. It checks if an Eloquent query (`$model->relation`, `$model->method()`) is used inside the loop.
3. If found, a warning is displayed with a suggestion to use eager loading (`with('relation')`).

## Example of N+1 Query Issue
```php
$users = User::all(); // Fetch all users

foreach ($users as $user) {
    echo $user->posts; // This triggers an extra query for each user (N+1 issue)
}
```

## License

This project is licensed under the [MIT License](LICENSE).
# Laravel N+1 Query Detector - VS Code Extension Quickstart

## Getting Started
This guide helps you quickly set up and use the **Laravel N+1 Query Detector** extension in VS Code.

## Prerequisites
- **VS Code** (latest version recommended)
- **PHP** (installed on your system)
- **Laravel Project** (for detecting N+1 queries)

## Installation
1. Open **VS Code**.
2. Navigate to the **Extensions** view (`Ctrl+Shift+X` or `Cmd+Shift+X` on macOS).
3. Search for `Laravel N+1 Query Detector`.
4. Click **Install**.

## Activating the Extension
The extension activates automatically when:
- You open a **PHP file** in your Laravel project.
- You modify a **PHP file**.
- You manually run the **Detect N+1 Queries** command.

## Running the N+1 Query Detector
### Automatic Detection
- The extension scans all open PHP files and highlights potential N+1 query issues.
- It updates diagnostics when a file is modified.

### Manual Detection
1. Open the **Command Palette** (`Ctrl+Shift+P` or `Cmd+Shift+P` on macOS).
2. Type `Detect Laravel N+1 Queries` and select it.
3. The extension scans the active file and reports potential issues.

## Understanding the Warnings
When a potential N+1 query is detected, the extension will:
- Highlight the line in the **Problems Panel**.
- Display a warning message suggesting eager loading.

### Example of a Detected Issue
```php
$users = User::all(); // Fetch all users

foreach ($users as $user) {
    echo $user->posts; // This triggers an extra query per user (N+1 issue)
}

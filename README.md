<h1 align="center">
   DBM German Mods
</h1>

<p align="center">Modifications for Discord Bot Maker by the DBM German community.</p>

## License

This project is licensed under the [MIT License](LICENSE).

## EN | What are these mods?

This repository contains custom modifications (mods) for Discord Bot Maker 2.0.
The mods extend DBM's functionality with additional actions and extensions that are
not available in the base version.

### Available Mods

**Actions** (40+):

- Sequence operations (create, filter, loop, reduce, etc.)
- Set operations (create, add, remove, check items)
- Map operations (create, store values, loop through entries)
- List utilities (filter, find items)
- And many more...

**Extensions** (2):

- Environment settings provider
- Mods API settings

**Events**:

- Currently no custom events available

## EN | How to install

1. Go to the [Releases](https://github.com/DBM-German/Mods/releases) page
2. Download the latest release as a ZIP file
3. Extract the ZIP file
4. Copy the folders `actions`, `events`, and `extensions` from the extracted files
   into your DBM project directory
5. Restart Discord Bot Maker if it's currently running
6. The new mods should now appear in your action and extension lists

> [!WARNING] Do not download files directly from the repository
> They need to be processed through a build pipeline first.
> Always use the [latest release][Latest-Release].

## DE | Was sind diese Mods?

Dieses Repository enthält benutzerdefinierte Modifikationen (Mods) für
Discord Bot Maker 2.0. Die Mods erweitern die Funktionalität von DBM mit zusätzlichen
Actions und Extensions, die in der Basisversion nicht verfügbar sind.

### Verfügbare Mods

**Actions** (40+):

- Sequenz-Operationen (erstellen, filtern, durchlaufen, reduzieren, etc.)
- Set-Operationen (erstellen, hinzufügen, entfernen, Elemente prüfen)
- Map-Operationen (erstellen, Werte speichern, Einträge durchlaufen)
- Listen-Utilities (filtern, Elemente finden)
- Und viele mehr...

**Extensions** (2):

- Environment Settings Provider
- Mods API Settings

**Events**:

- Aktuell keine benutzerdefinierten Events verfügbar

## DE | Wie man die Mods installiert

1. Gehe zur [Releases](https://github.com/DBM-German/Mods/releases)-Seite
2. Lade das neueste Release als ZIP-Datei herunter
3. Entpacke die ZIP-Datei
4. Kopiere die Ordner `actions`, `events` und `extensions` aus den entpackten Dateien
   in dein DBM-Projektverzeichnis
5. Starte Discord Bot Maker neu, falls es gerade läuft
6. Die neuen Mods sollten nun in deinen Action- und Extension-Listen erscheinen

> [!WARNING] Lade keine Dateien direkt aus dem Repository herunter.
> Diese müssen erst durch eine Build-Pipeline verarbeitet werden.
> Verwende immer den [aktuellen Release][Latest-Release].

## EN | Development

This repository is for development purposes. If you want to contribute or build the mods yourself:

| NPM script | Description                                           |
|------------|-------------------------------------------------------|
| build      | Build all mods and prepare them for distribution      |
| lint       | Run linters to check source file formatting           |

## DE | Entwicklung

Dieses Repository dient Entwicklungszwecken. Wenn du beitragen oder die Mods selbst erstellen möchtest:

| NPM-Skript | Beschreibung                                          |
|------------|-------------------------------------------------------|
| build      | Erstelle alle Mods und bereite sie für die Verteilung vor |
| lint       | Führe Linter aus, um die Quelldatei-Formatierung zu prüfen |

[Latest-Release]: https://github.com/DBM-German/Mods/releases

# deck-app

**Deck** is an application that enables content presenters maintain and display their markdown content on an enhanced visual presentation.

The **Deck** command format is the following:

```sh
deck <command> [command options]
```

The main Deck commands are:

* init
* install
* present
* edit
* upstream

## Installing Deck

```javascript
npm install -g @deck/app
```

## Deck usage

### Making a new presentation

Initializing a new presentation project is made using the command:

```javascript
deck init
```

This will create a basic presentation project.

## Preparing a deck for visualisation

```javascript
deck install
```

Will install all package dependencies needed by the presentation project.

## Present a deck material

In the presentation material folder (where the `deck.md` file is located) run the following command:

```sh
deck present [<material name>]
```
If no parameter provided it will present the `deck.md` file located in the current folder.

After the presentation is ready a list of commands are displayed to the user:
* e: edit - launched by pressing the key `e`, opens the current presentation with the default text editor
* o: open - launched by pressing the key `o`, displays the presentation

## Edit a deck

```sh
deck edit [<material name>]
```
Opens the presentation material with the default editor registered in the system.
If no parameter provided it will edit the `deck.md` file located in the current folder.

## Push deck to github

```sh
deck upstream [<material name>]
```
Creates a new branch on github, pushes the modified material and makes a pull request with the change.
If no parameter provided it will push the `deck.md` file located in the current folder.


## Credits

Sponsored by <a href="http://nearform.com">nearForm</a>

### Contributors

  * David Mark Clements
  * Mihai Dima
  * Cristian Kiss




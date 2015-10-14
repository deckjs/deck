# deck-app

*Deck* is an application that enables content presenters maintain and display their markdown content on an enhanced visual presentation.

The main Deck commands are:

* Init
* Install
* Present
* Edit
* Upstream

Deck's launching format is the following:

```sh
deck <command> [<command options>]
```

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
deck upstream ["<material name>"]
```

## Edit a deck

```sh
deck edit ["<material name>"]
```

## Push deck to github

```sh
deck upstream "<material name>"
```

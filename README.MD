# QuickViewJS: A Lightweight JavaScript Template Engine
![quickview.js logo](https://raw.githubusercontent.com/tamadeu/QuickViewJS/main/qjs.png)
## Overview

QuickView is a lightweight JavaScript-based templating engine designed to dynamically render HTML pages. It offers a simple syntax to embed variables and execute conditional statements and loops within HTML files.

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
  - [In HTML File](#in-html-file)
  - [In JavaScript File](#in-javascript-file)
- [Examples](#examples)
  - [Example 1: Using Local Data](#example-1-using-local-data)
  - [Example 2: Using External Data](#example-2-using-external-data)
- [Contributions](#contributions)

## Features

- **Variable Interpolation**: Use `{{ variableName }}` for dynamic content.
- **Conditional Blocks**: Execute conditionals using `@if`, `@elseif`, `@else`, and `@endif`.
- **Looping**: Loop through arrays with `@foreach` and `@endforeach`.
- **File Inclusion**: Include external HTML files using `@include('fileName')`.
- **Data Fetching**: Fetch and embed JSON data from URLs or objects.

## Installation

Include the `quickview.js` file in your HTML project:

```
<script src="path/to/quickview.js"></script>
```

## Usage
### In HTML File
Variable Replacement

```
<h1>{{ siteName }}</h1>
```
### Conditionals

```
@if(someCondition)
  <!-- HTML content -->
@elseif(anotherCondition)
  <!-- HTML content -->
@else
  <!-- HTML content -->
@endif
```
### Loops

```
@foreach(items)
  <p>{{ itemName }}</p>
@endforeach
```
### File Inclusion

```
@include('header')
```

## In JavaScript File
Initialize the QuickView engine with a data source object containing either local variables or external URLs:

```
qv({
  "localVariable": "value",
  "externalData": "http://example.com/data.json",
});
```
## Examples
### Example 1: Using Local Data
#### HTML File (index.html):

```
<h1>{{ siteName }}</h1>
@foreach(users)
  <p>Name: {{ name }}, Age: {{ age }}</p>
@endforeach
```
#### JavaScript:

```

qv({
  "siteName": "My Site",
  "users": [
    {"name": "Alice", "age": 25},
    {"name": "Bob", "age": 30}
  ]
});
```

### Example 2: Using External Data

#### JavaScript:

```
qv({
  "siteName": "My Site",
  "users": "http://example.com/users.json"
});
```
#### JSON File (users.json):

```
[
  {"name": "Alice", "age": 25},
  {"name": "Bob", "age": 30}
]
```

### Contributions
Contributions are welcome! Feel free to open an issue or submit a pull request to improve the engine.


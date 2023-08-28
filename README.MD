
# QuickviewJS: A Lightweight JavaScript Template Engine

Overview
QuickviewJS is a minimalistic yet powerful JavaScript-based template engine designed to simplify front-end development. It allows developers to bind JSON data to HTML templates with ease, providing seamless rendering and updates without a hefty framework. With support for nested objects and array iteration, QuickviewJS serves as a convenient tool for small to medium-sized projects.

# Key Features
Data Binding: Dynamically replace placeholders in your HTML templates using data fetched from various sources, such as APIs or local variables.

Nested Object Support: Deeply navigate through JSON objects using dot notation within your HTML templates.

Array Iteration: Automatically loop over arrays in your data and render corresponding HTML elements.

Include Directives: Extend your templates by including partial HTML files, encouraging modularity and reusability.

Async and Sync Data Fetching: Incorporate data into your templates either synchronously or asynchronously, depending on your requirements.

Clear Syntax: Utilizes a straightforward syntax with {{ }} tags for data and {{# }}...{{/ }} tags for array loops, making it easy to understand and maintain.

How It Works
Data Fetching: QuickviewJS first gathers all necessary data from various sources defined in the dataSource object, including local variables or external APIs.

HTML Parsing: The engine fetches and reads the HTML file, applying any @include directives to embed additional HTML files.

Template Rendering: Data is then bound to the HTML using the renderTemplate function. Nested objects and arrays are processed using renderArrayTemplate.

Final Output: The fully rendered HTML content replaces the existing content in the document, providing a seamless experience to the user.

## Usage Example

```javascript
// main.js
const users = [
  { "fname": "Alice", "age": 25 },
  // ... more users
];

qv({
  "users": users,
  "siteName": "MyWebsite",
  "date": new Date(),
});

```

```html
<!-- index.html -->
<h1>{{ siteName }}</h1>
<div>
  {{# users }}
  <p>Name: {{ fname }}, Age: {{ age }}</p>
  {{/ users }}
</div>
```

By following this simple structure, developers can achieve powerful rendering capabilities with minimal effort, making QuickviewJS a go-to choice for developers looking for lightweight yet effective solutions.

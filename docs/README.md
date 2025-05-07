# Arkham City Documentation

This directory contains the documentation for the Arkham City project. The documentation is built
using [Hugo](https://gohugo.io/) with the [Docsy](https://www.docsy.dev/) theme.

## Prerequisites

To build and run the documentation locally, you need:

- [Hugo Extended](https://gohugo.io/getting-started/installing/) (v0.80.0 or later)
- [Node.js](https://nodejs.org/) (v14.0.0 or later)
- [npm](https://www.npmjs.com/) (v6.0.0 or later)

## Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/min3rd/arkham-city.git
   cd arkham-city
   ```

2. Initialize and update the Docsy theme submodule:
   ```bash
   git submodule update --init --recursive
   ```

3. Install npm dependencies:
   ```bash
   npm install
   ```

## Development

To start the development server:

```bash
npm start
```

This will start the Hugo server with live reload. You can access the documentation
at http://localhost:1313/arkham-city/.

## Building

To build the documentation for production:

```bash
npm run build
```

This will generate the static site in the `public` directory.

## Deployment

The documentation is automatically deployed to GitHub Pages when changes are pushed to the main branch.

## Directory Structure

- `content/`: The main content of the documentation
    - `_index.md`: The home page
    - `core/`: Documentation for the backend NestJS application
    - `dashboard/`: Documentation for the frontend Angular application
    - `websdk/`: Documentation for the Web SDK
- `layouts/`: Custom layouts for the Docsy theme
- `static/`: Static assets like images and CSS
- `config.toml`: Hugo configuration file

## Contributing

1. Create a new branch for your changes
2. Make your changes to the documentation
3. Test your changes locally
4. Submit a pull request

## License

This documentation is licensed under the MIT License. See the LICENSE file for details.

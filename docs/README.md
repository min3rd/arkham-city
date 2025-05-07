# Arkham City Documentation

This directory contains the documentation for the Arkham City project. The documentation is built
using [Hugo](https://gohugo.io/), a fast and flexible static site generator, and is automatically deployed to GitHub
Pages
when changes are pushed to the develop branch.

## Contributing to Documentation

You don't need to run Hugo locally to contribute to the documentation. Simply edit the Markdown files
in the `content` directory and push your changes to the develop branch. The GitHub Actions workflow will
automatically build and deploy the site to GitHub Pages.

## Adding Content

The documentation content is organized in the `content` directory. Each section has its own directory with an
`_index.md` file that serves as the section's home page.

To add a new page:

1. Create a new Markdown file in the appropriate section directory.
2. Add front matter at the top of the file:

```markdown
+++
title = "Your Page Title"
description = "Description of your page"
weight = 10  # Controls the order in the menu
+++

# Your Page Title

Your content here...
```

## Automated Deployment

The documentation site is automatically built and deployed to GitHub Pages when changes are pushed to the develop
branch. You don't need to build the site manually.

The GitHub Actions workflow:

1. Installs Hugo and its dependencies
2. Sets up the Docsy theme
3. Builds the site with the `--minify` flag
4. Deploys the site to GitHub Pages

You can view the workflow configuration in `.github/workflows/hugo.yml`.

## Configuration

The Hugo configuration is located in the `config.toml` file at the root of the repository. This file controls the site's
settings, theme, and menu structure.

## Theme

The documentation site uses the [Docsy](https://www.docsy.dev/) theme, which is a documentation theme for Hugo developed
by Google. The theme is installed automatically by the GitHub Actions workflow, so you don't need to install it locally.

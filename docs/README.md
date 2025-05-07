# Arkham City Documentation

This directory contains the documentation for the Arkham City project. The documentation is built
using [Hugo](https://gohugo.io/), a fast and flexible static site generator.

## Setup

1. Install Hugo: Follow the [official installation guide](https://gohugo.io/installation/).
2. Clone the repository: `git clone https://github.com/min3rd/arkham-city.git`
3. Navigate to the project directory: `cd arkham-city`

## Local Development

To run the documentation site locally:

```bash
# Navigate to the docs directory
cd docs

# Start the Hugo server
hugo server -D
```

This will start a local server at http://localhost:1313/ where you can preview the documentation.

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

## Building for Production

To build the documentation site for production:

```bash
# Navigate to the docs directory
cd docs

# Build the site
hugo
```

This will generate the static site in the `public` directory, which can be deployed to any static hosting service.

## Configuration

The Hugo configuration is located in the `config.toml` file at the root of the repository. This file controls the site's
settings, theme, and menu structure.

## Theme

The documentation site uses the [Learn](https://themes.gohugo.io/themes/hugo-theme-learn/) theme. To install the theme:

```bash
# Navigate to the docs directory
cd docs

# Create themes directory if it doesn't exist
mkdir -p themes

# Clone the theme repository
git clone https://github.com/matcornic/hugo-theme-learn.git themes/hugo-theme-learn
```

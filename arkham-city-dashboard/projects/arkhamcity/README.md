# Arkhamcity

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 19.2.0.

## Design tokens & theming

- Semantic tokens live in `src/lib/theme/tokens.ts` and are exported on the public API. Light/Dark palettes map to CSS variables prefixed with `--ark-`.
- `ThemeService` applies tokens to the document and toggles the `dark` class; use the `<ark-switch-theme>` button or call `applyTheme('light' | 'dark')`.
- Core primitives (buttons, text inputs, badges) accept a `compact` input to render with reduced spacing that aligns to the shared spacing scale (`--ark-space-compact-*`).

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the library, run:

```bash
ng build arkhamcity
```

This command will compile your project, and the build artifacts will be placed in the `dist/` directory.

### Publishing the Library

Once the project is built, you can publish your library by following these steps:

1. Navigate to the `dist` directory:
   ```bash
   cd dist/arkhamcity
   ```

2. Run the `npm publish` command to publish your library to the npm registry:
   ```bash
   npm publish
   ```

## Running unit tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.

# Project Horizon

Web project

## Setup Angular

#### Includes Material & Tailwindcss

1. Install Angular CLI

```bash
npm install -g @angular/cli
```

2. Create Angular App

```bash
ng new [app name]
> Choose SCSS

cd [app name]
```

3. Component Library

- Install Angular Material (Optional)

  ```bash
  ng add @angular/material

  > Choose SCSS
  ```

- Install PrimeNG (Optional)

  ```bash
  npm install primeng

  > Add to styles.css
    @import "primeng/resources/themes/lara-light-blue/theme.css";
    @import "primeng/resources/primeng.css";
  ```

4. Install Tailwindcss (Optional)

```bash
npm install -D tailwindcss
npx tailwindcss init
```

5. Update the tailwind.config.js file in [app name]

```bash
content: [
    "./src/**/*.{html,ts}",
  ],
```

5. Add to the top of the styles.scss file in [app name]/src

```bash
@import 'tailwindcss/base';
@import 'tailwindcss/components';
@import 'tailwindcss/utilities';
```

## Setup Git

1. Remote Angular Git Files

```bash
Remove .git
Remove .gitignore
```

2. Setup Root .gitignore

```bash
# Global Files
node_modules/
.vscode
.env

# Client Files
client/.angular/

# Server Files
server/dist/
server/build/
```

## Setup NestJS

1. Install NestJS CLI

```bash
npm install -g @nestjs/cli
```

2. Create Nestjs Project

```bash
nest new [project name]
    > Choose npm

cd [project name]
```

3. Setup TypeORM (Optional)
```bash
npm install @nestjs/typeorm typeorm pg
```

4. Create Endpoint

```bash
nest g resource [endpoint name]
```


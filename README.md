# laudos-mono

This is a monorepo project managed with Moon, using Bun as the JavaScript runtime and Proto as the version manager.

## Prerequisites

### 1. Node.js
Download and install https://nodejs.org/en

### 2. HomeBrew
```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

### 3. Install Bun

[Bun](https://bun.sh) is a fast all-in-one JavaScript runtime. Install it using:

```bash
# For macOS and Linux:
curl -fsSL https://bun.sh/install | bash

# For Windows (via WSL2):
# First install WSL2, then run the command above
```

### 4. Install Proto
[Proto](https://moonrepo.dev/docs/proto) is a pluggable version manager and unified toolchain from moonrepo. It helps manage multiple programming languages and tools through a single interface.

```bash
# macOS
brew install git unzip gzip xz

# For Linux, macOS, WSL:
bash <(curl -fsSL https://moonrepo.dev/install/proto.sh)

# select the option ZSHRC, after close the terminal and open again.

# For other platforms and manual installation:
# Visit https://moonrepo.dev/docs/proto/install
```

### 5. Install Moon
[Moon](https://moonrepo.dev) is a build system and task runner for managing monorepos. With Proto installed, you can install Moon using:

```bash
proto install moon

# Verify the installation
moon --version
```


To install dependencies you can use:

```bash
bun install
```

### 6. Configure SSH Key

##### If your SSH key is already set up on your machine and GitHub, you can skip this step.

```bash
ssh-keygen -t ed25519 -C "your_email@example.com"
pbcopy < ~/.ssh/id_ed25519.pub
```

### 7. Clone Repository

```bash
git clone https://github.com/laudosinfra/laudos-mono.git
```
### 8. Change .env-example
Create a copy of .env-example and rename to .env, then, fill out the DB_URL using the parameters in the same file.

### 9. Install dependencies

```bash
bun install
```

## Development

The project uses Moon's task runner for managing all commands. 

### Run the docker app on your machine

###  Run command to start the Postgres (PG) database
```bash
moon run data-access:db-start
```

### Run the migrations

```bash
moon run data-access:migration-up
```

### Run auth
```bash
moon run auth:dev
```

Here are the available commands for the consumer app:
### Run development server with Turbopack

```bash
moon run consumer:dev
```

### Build the application
```bash
moon run consumer:build
```

### Start production server
```bash
moon run consumer:start
```
```

Note: The development server runs with Turbopack enabled for faster builds and better development experience.

## VSCode/Cursor Setup

This project is best used with VSCode/Cursor and the following extensions:

1. [Moon Console](https://marketplace.visualstudio.com/items?itemName=moonrepo.moon-console) - Official Moon extension for task running and project management

## Documentation Links

- [Bun Documentation](https://bun.sh/docs)
- [Moon Documentation](https://moonrepo.dev/docs)
- [Proto Documentation](https://moonrepo.dev/docs/proto)

## Features of Proto

- 🚀 Lightspeed performance with Rust and WASM
- 🌐 Multi-language support through a single CLI
- 💻 Cross-platform compatibility
- 🔄 Contextual version detection
- ✅ Checksum verification for security
- 🔌 Pluggable architecture for custom tooling
- 🔧 Seamless integration with Moon's toolchain





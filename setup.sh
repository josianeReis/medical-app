#!/bin/bash

# Exit immediately if a command exits with a non-zero status.
set -e

# Setup colors and styles using tput
if command -v tput &>/dev/null; then
  BOLD=$(tput bold)
  RESET=$(tput sgr0)
  GREEN=$(tput setaf 2)
  RED=$(tput setaf 1)
  YELLOW=$(tput setaf 3)
  BLUE=$(tput setaf 4)
  MAGENTA=$(tput setaf 5)
  CYAN=$(tput setaf 6)
else
  BOLD=""
  RESET=""
  GREEN=""
  RED=""
  YELLOW=""
  BLUE=""
  MAGENTA=""
  CYAN=""
  echo "${YELLOW}tput not found, proceeding without colored output.${RESET}"
fi

SETUP_PERFORMED_ACTIONS=false # Track if any setup actions are performed

echo "${BLUE}${BOLD}Starting development environment setup...${RESET}"

# Function to detect OS
detect_os() {
  echo "${CYAN}Detecting operating system...${RESET}"
  UNAME_S=$(uname -s)
  if [ "$UNAME_S" = "Darwin" ]; then
    OS="macos"
  elif [ "$UNAME_S" = "Linux" ]; then
    if grep -q "Ubuntu" /etc/os-release; then
      OS="ubuntu"
    else
      OS="linux" # Other Linux
    fi
  else
    echo "${RED}Unsupported operating system: $UNAME_S${RESET}"
    exit 1
  fi
  echo "${GREEN}Detected OS: $OS${RESET}"
}

update_brew_packages() {
  echo "${CYAN}Updating Homebrew and formulae...${RESET}"
  brew update
}

update_apt_packages() {
  echo "${CYAN}Updating APT package lists...${RESET}"
  sudo apt-get update
}

install_prerequisites_macos() {
  echo "${CYAN}Managing prerequisites for macOS...${RESET}"
  if ! command -v brew &> /dev/null; then
    echo "${YELLOW}Homebrew not found. Installing Homebrew...${RESET}"
    /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
    SETUP_PERFORMED_ACTIONS=true # Indicate an action was performed
    # Add Homebrew to PATH - for Apple Silicon
    if [ -d "/opt/homebrew/bin" ]; then
        echo 'eval "$(/opt/homebrew/bin/brew shellenv)"' >> ~/.zprofile
        eval "$(/opt/homebrew/bin/brew shellenv)"
    fi
    # Add Homebrew to PATH - for Intel Macs
    if [ -d "/usr/local/bin" ]; then
        echo 'eval "$(/usr/local/bin/brew shellenv)"' >> ~/.zprofile
         eval "$(/usr/local/bin/brew shellenv)"
    fi
    echo "${GREEN}Homebrew installed.${RESET}"
    update_brew_packages # Update brew right after install
  else
    echo "${GREEN}Homebrew already installed.${RESET}"
    update_brew_packages # Update brew if already installed
  fi

  local packages_to_install=("git" "unzip" "gzip" "xz")
  for pkg in "${packages_to_install[@]}"; do
    if brew list --versions "$pkg" > /dev/null; then
      echo "${GREEN}$pkg already installed. Upgrading...${RESET}"
      brew upgrade "$pkg"
    else
      echo "${CYAN}Installing $pkg using Homebrew...${RESET}"
      brew install "$pkg"
      SETUP_PERFORMED_ACTIONS=true # Indicate an action was performed
    fi
  done
  echo "${GREEN}macOS prerequisites managed.${RESET}"
}

install_prerequisites_ubuntu() {
  echo "${CYAN}Managing prerequisites for Ubuntu...${RESET}"
  update_apt_packages # Update apt first

  local packages_to_install=("curl" "git" "unzip" "gzip" "xz-utils" "build-essential")
  for pkg in "${packages_to_install[@]}"; do
    if dpkg -s "$pkg" &> /dev/null; then
      echo "${GREEN}$pkg already installed. Upgrading...${RESET}"
      sudo apt-get install --only-upgrade -y "$pkg"
    else
      echo "${CYAN}Installing $pkg using APT...${RESET}"
      sudo apt-get install -y "$pkg"
      SETUP_PERFORMED_ACTIONS=true # Indicate an action was performed
    fi
  done
  echo "${GREEN}Ubuntu prerequisites managed.${RESET}"
}

install_infisical() {
  echo "${CYAN}Managing Infisical CLI installation...${RESET}"
  if command -v infisical &> /dev/null; then
    echo "${GREEN}Infisical CLI already installed.${RESET}"
    if [ "$OS" = "macos" ] && command -v brew &> /dev/null; then
      echo "${CYAN}Checking for Infisical CLI updates via Homebrew...${RESET}"
      brew upgrade infisical/get-cli/infisical
    elif [ "$OS" = "ubuntu" ]; then
      echo "${CYAN}Checking for Infisical CLI updates via APT...${RESET}"
      sudo apt-get install --only-upgrade -y infisical
    elif command -v npm &> /dev/null && npm list -g --depth=0 | grep -q '@infisical/cli'; then
        echo "${CYAN}Checking for Infisical CLI updates via npm...${RESET}"
        npm update -g @infisical/cli
    fi
    echo "${GREEN}Infisical CLI is now at: $(infisical --version)${RESET}"
    return
  fi

  echo "${CYAN}Installing Infisical CLI...${RESET}"
  if [ "$OS" = "macos" ]; then
    if ! command -v brew &> /dev/null; then
        echo "${RED}Error: Homebrew is not installed. Please install Homebrew first.${RESET}"
        exit 1
    fi
    # Ensure brew is updated before installing new formula
    if ! brew tap | grep -q "infisical/get-cli"; then
        brew tap infisical/get-cli
    fi
    brew install infisical/get-cli/infisical
    SETUP_PERFORMED_ACTIONS=true # Indicate an action was performed
  elif [ "$OS" = "ubuntu" ]; then
    curl -1sLf \
      'https://artifacts-cli.infisical.com/setup.deb.sh' \
      | sudo -E bash
    # APT update was called in prerequisites, but good to ensure for the new repo
    sudo apt-get update 
    sudo apt-get install -y infisical
    SETUP_PERFORMED_ACTIONS=true # Indicate an action was performed
  else
    echo "${YELLOW}Infisical installation not configured for $OS. Attempting npm fallback or manual install.${RESET}"
    if command -v npm &> /dev/null; then
        echo "${CYAN}Attempting to install Infisical CLI via npm as a fallback...${RESET}"
        if npm install -g @infisical/cli; then
            SETUP_PERFORMED_ACTIONS=true # Indicate an action was performed
        else
            echo "${YELLOW}npm install of Infisical CLI failed. Please check npm/Node.js or install manually.${RESET}"
        fi
    else
        echo "${YELLOW}npm not found. Cannot attempt fallback Infisical installation. Please install manually: https://infisical.com/docs/cli/overview ${RESET}"
    fi
  fi

  if command -v infisical &> /dev/null; then
    echo "${GREEN}Infisical CLI installed successfully: $(infisical --version)${RESET}"
  else
    echo "${RED}Infisical CLI installation failed. Please check the output above or install it manually from https://infisical.com/docs/cli/overview${RESET}"
  fi
}

install_bun() {
  echo "${CYAN}Managing Bun installation...${RESET}"
  if command -v bun &> /dev/null; then
    echo "${GREEN}Bun already installed. Upgrading Bun...${RESET}"
    bun upgrade
    echo "${GREEN}Bun is now at: $(bun --version)${RESET}"
    # Ensure bun is in PATH after upgrade
    export BUN_INSTALL="$HOME/.bun" 
    export PATH="$BUN_INSTALL/bin:$PATH"
    return
  fi

  echo "${CYAN}Installing Bun...${RESET}"
  curl -fsSL https://bun.sh/install | bash
  SETUP_PERFORMED_ACTIONS=true # Indicate an action was performed
  # Add bun to PATH - this is usually handled by bun's installer, but ensure shell is configured
  export BUN_INSTALL="$HOME/.bun" # Default bun installation directory
  export PATH="$BUN_INSTALL/bin:$PATH"
  echo "${GREEN}Bun installed successfully: $(bun --version)${RESET}"
  echo "${YELLOW}Note: You might need to source your shell profile (e.g., source ~/.zshrc or source ~/.bashrc) or open a new terminal for 'bun' command to be available.${RESET}"
}

install_proto_moon() {
  echo "${CYAN}Managing Proto installation...${RESET}"
  local proto_cmd_path="$HOME/.proto/bin/proto"
  local proto_executable=""

  if command -v proto &>/dev/null; then
      proto_executable="proto"
  elif [ -f "$proto_cmd_path" ]; then
      proto_executable="$proto_cmd_path"
  fi

  if [ -n "$proto_executable" ]; then
    echo "${GREEN}Proto already installed. Upgrading Proto itself...${RESET}"
    "$proto_executable" upgrade
    echo "${GREEN}Proto is now at: $($proto_executable --version)${RESET}"
  else
    echo "${CYAN}Installing Proto...${RESET}"
    bash <(curl -fsSL https://moonrepo.dev/install/proto.sh) --yes
    SETUP_PERFORMED_ACTIONS=true # Indicate an action was performed for new Proto install
    export PATH="$HOME/.proto/bin:$PATH" # Add proto to PATH for current session
    proto_executable="$HOME/.proto/bin/proto" # Set for current session
    
    echo "${YELLOW}Attempting to update PATH for Proto. You might need to source your shell profile (e.g., source ~/.zshrc) or open a new terminal.${RESET}"
    if [ -f "$HOME/.zshrc" ] && grep -q 'export PATH="$HOME/.proto/bin:$PATH"' "$HOME/.zshrc"; then
      echo "${MAGENTA}Proto PATH entry already exists in ~/.zshrc.${RESET}"
    elif [ -f "$HOME/.zshrc" ]; then
      echo 'export PATH="$HOME/.proto/bin:$PATH"' >> "$HOME/.zshrc"
      echo "${MAGENTA}Added Proto to PATH in ~/.zshrc.${RESET}"
    fi
    if [ -f "$HOME/.bashrc" ] && grep -q 'export PATH="$HOME/.proto/bin:$PATH"' "$HOME/.bashrc"; then
      echo "${MAGENTA}Proto PATH entry already exists in ~/.bashrc.${RESET}"
    elif [ -f "$HOME/.bashrc" ]; then
      echo 'export PATH="$HOME/.proto/bin:$PATH"' >> "$HOME/.bashrc"
      echo "${MAGENTA}Added Proto to PATH in ~/.bashrc.${RESET}"
    fi

    if ! command -v proto &>/dev/null && ! [ -f "$proto_cmd_path" ]; then
        echo "${RED}Proto installation might have completed, but 'proto' command is not found.${RESET}"
        echo "${YELLOW}Please try opening a new terminal or ensure ~/.proto/bin is in your PATH.${RESET}"
        return 1 # Indicate failure
    fi
    # Re-check proto_executable after installation attempt
    if command -v proto &>/dev/null; then proto_executable="proto"; else proto_executable="$proto_cmd_path"; fi
    echo "${GREEN}Proto installed successfully: $($proto_executable --version)${RESET}"
  fi
  
  # Ensure proto_executable is set
  if [ -z "$proto_executable" ]; then
      echo "${RED}Proto command not available even after installation attempt. Skipping Moon management.${RESET}"
      return 1
  fi

  echo "${CYAN}Checking for newer tool versions with proto outdated...${RESET}"
  "$proto_executable" outdated --update --latest --yes

  echo "${CYAN}Installing/Upgrading Moon to latest version...${RESET}"
  "$proto_executable" install moon || {
    echo "${RED}Failed to install Moon via Proto.${RESET}";
    return 1;
  }

  echo "${GREEN}Moon version: $(moon --version)${RESET}"
  echo "${GREEN}Bun version: $(bun --version)${RESET}"

  SETUP_PERFORMED_ACTIONS=true # Flag because we may have updated versions

  echo "${CYAN}Installing project dependencies...${RESET}"
  bun install
  echo "${GREEN}Project dependencies installed successfully 🎉${RESET}"
}

# Main script execution
detect_os

if [ "$OS" = "macos" ]; then
  install_prerequisites_macos
elif [ "$OS" = "ubuntu" ]; then
  install_prerequisites_ubuntu
else
  echo "${YELLOW}Skipping OS-specific prerequisites for $OS. Manual check advised.${RESET}"
fi

install_infisical
install_bun
if ! install_proto_moon; then # Check if proto/moon installation failed
  echo "${RED}Proto/Moon management encountered issues. Please review the logs above.${RESET}"
  # Decide if you want to exit or let the script continue to print next steps
fi

if [ "$SETUP_PERFORMED_ACTIONS" = true ]; then
  echo ""
  echo "${MAGENTA}${BOLD}---------------------------------------------------------------------${RESET}"
  echo "${MAGENTA}${BOLD}✨🎉 Hooray! Development environment setup script finished.${RESET}"
  echo "${MAGENTA}${BOLD}All requested checks and installations have been processed.${RESET}"
  echo "${MAGENTA}${BOLD}---------------------------------------------------------------------${RESET}"
  echo ""
  echo "${YELLOW}${BOLD}Next Steps (Manual):${RESET}"
  echo ""
  echo "${YELLOW}1. Login to Nexdoc infisical environement variables management system (if not done before):${RESET}"
  echo "   Run this command on terminal: ${CYAN}infisical login --domain=https://infisical.nexdoc.clinic${RESET}"
  echo ""
  echo "${YELLOW}2. To start development services (after Infisical login):${RESET}"
  echo "   Now the secrets will be automatically injected, just run the project commands such as:"
  echo "     ${CYAN}moon run data-access:db-start${RESET}"
  echo "     ${CYAN}moon run data-access:migration-up${RESET}"
  echo "     ${CYAN}moon run auth:dev${RESET}"
  echo "     ${CYAN}moon run consumer:dev${RESET}"
  echo ""
  echo "${MAGENTA}Remember to ${BOLD}open a new terminal session${RESET} or ${BOLD}source your .bashrc/.zshrc${RESET} if some commands like 'proto' or 'bun' are not found immediately.${RESET}"
  echo "${MAGENTA}${BOLD}---------------------------------------------------------------------${RESET}"
else
  echo ""
  echo "${GREEN}${BOLD}✨🎉 Hooray! Your development environment is already in tip-top shape! 🎉✨${RESET}"
  echo "${GREEN}All tools are accounted for and seem to be up-to-date.${RESET}"
  echo "${GREEN}No new installations were performed during this run.${RESET}"
  echo ""
  echo "${YELLOW}${BOLD}Suggested next commands to get you coding:${RESET}"
  echo "   ${CYAN}moon run data-access:db-start${RESET}"
  echo "   ${CYAN}moon run data-access:migration-up${RESET}"
  echo "   ${CYAN}moon run auth:dev${RESET}"
  echo "   ${CYAN}moon run consumer:dev${RESET}"
  echo ""
  echo "${MAGENTA}If you intended to force updates or reinstall, please check the script or tool-specific commands.${RESET}"
  echo "${MAGENTA}Remember to ${BOLD}open a new terminal session${RESET} or ${BOLD}source your .bashrc/.zshrc${RESET} if you've made manual changes or expect recent PATH updates to take effect.${RESET}"
  echo "${MAGENTA}${BOLD}---------------------------------------------------------------------${RESET}"
fi 
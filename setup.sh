#!/bin/bash

# Spotify CLI - Quick Setup Script

set -e

echo "╔════════════════════════════════════════╗"
echo "║     Spotify CLI - Setup Assistant      ║"
echo "╚════════════════════════════════════════╝"
echo ""

# Check Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed"
    echo "Visit: https://nodejs.org/"
    exit 1
fi

echo "✓ Node.js $(node --version) detected"

# Detect OS
if [[ "$OSTYPE" == "linux-gnu"* ]]; then
    OS="linux"
    DISTRO=$(lsb_release -si 2>/dev/null || echo "linux")
elif [[ "$OSTYPE" == "darwin"* ]]; then
    OS="macos"
else
    OS="unknown"
fi

echo "✓ Detected: $OS"
echo ""

# Install npm dependencies
echo "📦 Installing Node.js dependencies..."
npm install
echo "✓ Dependencies installed"
echo ""

# Check and install system dependencies
echo "🔧 Checking system dependencies..."

install_mpv=false
install_ytdlp=false

if ! command -v mpv &> /dev/null; then
    echo "⚠️  mpv audio player not found"
    install_mpv=true
else
    echo "✓ mpv found"
fi

if ! command -v yt-dlp &> /dev/null; then
    echo "⚠️  yt-dlp not found"
    install_ytdlp=true
else
    echo "✓ yt-dlp found"
fi

if [ "$install_mpv" = true ] || [ "$install_ytdlp" = true ]; then
    echo ""
    echo "Installing missing dependencies..."
    
    if [ "$OS" = "linux" ]; then
        if [[ "$DISTRO" == *"Ubuntu"* ]] || [[ "$DISTRO" == *"Debian"* ]]; then
            echo "Installing for Ubuntu/Debian..."
            sudo apt-get update
            [ "$install_mpv" = true ] && sudo apt-get install -y mpv
            [ "$install_ytdlp" = true ] && sudo apt-get install -y yt-dlp
        elif [[ "$DISTRO" == *"Fedora"* ]]; then
            echo "Installing for Fedora..."
            [ "$install_mpv" = true ] && sudo dnf install -y mpv
            [ "$install_ytdlp" = true ] && sudo dnf install -y yt-dlp
        elif [[ "$DISTRO" == *"Arch"* ]]; then
            echo "Installing for Arch Linux..."
            [ "$install_mpv" = true ] && sudo pacman -S --noconfirm mpv
            [ "$install_ytdlp" = true ] && sudo pacman -S --noconfirm yt-dlp
        fi
    elif [ "$OS" = "macos" ]; then
        if ! command -v brew &> /dev/null; then
            echo "❌ Homebrew not found. Install from: https://brew.sh"
            exit 1
        fi
        echo "Installing for macOS..."
        [ "$install_mpv" = true ] && brew install mpv
        [ "$install_ytdlp" = true ] && brew install yt-dlp
    fi
fi

echo ""
echo "✓ All dependencies installed!"
echo ""

# Create necessary directories
echo "📁 Setting up directories..."
mkdir -p ~/.spotify-cli
mkdir -p ~/Music/spotify
echo "✓ Directories created"
echo ""

# Credentials setup
echo "🔐 Spotify Credentials Setup"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "1. Go to: https://developer.spotify.com/dashboard"
echo "2. Log in with your Spotify account"
echo "3. Create a new app (any name works)"
echo "4. Copy your Client ID and Client Secret"
echo ""

read -p "Do you have your Spotify credentials ready? (y/n) " -n 1 -r
echo ""

if [[ $REPLY =~ ^[Yy]$ ]]; then
    read -p "Enter your Spotify Client ID: " client_id
    read -sp "Enter your Spotify Client Secret: " client_secret
    echo ""
    
    # Save to environment
    echo "export SPOTIFY_CLIENT_ID=\"$client_id\"" >> ~/.bashrc
    echo "export SPOTIFY_CLIENT_SECRET=\"$client_secret\"" >> ~/.bashrc
    
    # Also try zsh if it exists
    if [ -f ~/.zshrc ]; then
        echo "export SPOTIFY_CLIENT_ID=\"$client_id\"" >> ~/.zshrc
        echo "export SPOTIFY_CLIENT_SECRET=\"$client_secret\"" >> ~/.zshrc
    fi
    
    # Export to current session
    export SPOTIFY_CLIENT_ID="$client_id"
    export SPOTIFY_CLIENT_SECRET="$client_secret"
    
    echo "✓ Credentials saved to ~/.bashrc and ~/.zshrc"
    echo ""
    echo "You can now start the app!"
else
    echo ""
    echo "You'll need to set credentials before running:"
    echo "export SPOTIFY_CLIENT_ID=\"your_id\""
    echo "export SPOTIFY_CLIENT_SECRET=\"your_secret\""
    echo ""
fi

# Offer to run immediately
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
read -p "Start Spotify CLI now? (y/n) " -n 1 -r
echo ""

if [[ $REPLY =~ ^[Yy]$ ]]; then
    npm start
else
    echo ""
    echo "To start the app later, run:"
    echo "  cd $(pwd)"
    echo "  npm start"
    echo ""
    echo "Or install globally and run from anywhere:"
    echo "  npm install -g ."
    echo "  spotify-cli"
fi

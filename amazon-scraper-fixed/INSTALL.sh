#!/bin/bash

# Amazon Scraper Extension v2.0 - Installation Helper
# This script helps verify the extension is ready to load

echo "╔═══════════════════════════════════════════════════════════════╗"
echo "║   Amazon Scraper Extension v2.0 - Installation Verification  ║"
echo "╚═══════════════════════════════════════════════════════════════╝"
echo ""

EXTENSION_DIR="/Users/nguyenphuc/Downloads/amazon-scraper-fixed"

echo "📍 Checking extension directory: $EXTENSION_DIR"
echo ""

# Check if directory exists
if [ ! -d "$EXTENSION_DIR" ]; then
    echo "❌ ERROR: Extension directory not found!"
    exit 1
fi

echo "✓ Extension directory found"
echo ""

# Check required files
echo "📋 Checking required files..."
echo ""

REQUIRED_FILES=(
    "manifest.json"
    "background.js"
    "popup.html"
    "popup.js"
    "dashboard.html"
    "dashboard.js"
    "content.js"
)

MISSING=0
for file in "${REQUIRED_FILES[@]}"; do
    if [ -f "$EXTENSION_DIR/$file" ]; then
        echo "✓ $file"
    else
        echo "❌ $file - MISSING"
        MISSING=$((MISSING + 1))
    fi
done

echo ""

if [ $MISSING -gt 0 ]; then
    echo "❌ ERROR: $MISSING file(s) missing!"
    exit 1
fi

echo "✓ All required files present"
echo ""

# Check manifest version
echo "🔍 Checking manifest version..."
VERSION=$(grep -o '"version": "[^"]*"' "$EXTENSION_DIR/manifest.json" | grep -o '[^"]*$' | head -1)
echo "Version: $VERSION"

if [ "$VERSION" = "2.0" ]; then
    echo "✓ Version is correct (2.0)"
else
    echo "⚠️  Warning: Version might not be 2.0 (found: $VERSION)"
fi

echo ""

# Check documentation
echo "📚 Checking documentation..."
DOCS=(
    "README.md"
    "QUICK_START.md"
    "USER_GUIDE_v2.0.md"
    "UPGRADE_SUMMARY.md"
    "IMPLEMENTATION_CHECKLIST.md"
)

for doc in "${DOCS[@]}"; do
    if [ -f "$EXTENSION_DIR/$doc" ]; then
        echo "✓ $doc"
    else
        echo "⚠️  $doc - Not found"
    fi
done

echo ""

# Summary
echo "╔═══════════════════════════════════════════════════════════════╗"
echo "║                    ✅ READY TO INSTALL                       ║"
echo "╚═══════════════════════════════════════════════════════════════╝"
echo ""
echo "Next steps:"
echo ""
echo "1. Open Chrome browser"
echo "2. Go to: chrome://extensions"
echo "3. Enable 'Developer mode' (top right)"
echo "4. Click 'Load unpacked'"
echo "5. Select: $EXTENSION_DIR"
echo ""
echo "Extension will load automatically!"
echo ""
echo "📖 Read QUICK_START.md for first use instructions"
echo ""

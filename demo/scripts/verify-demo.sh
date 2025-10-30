#!/bin/bash

# Test build script for EduPlatform demo
echo "🧪 Testing EduPlatform demo build..."

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    exit 1
fi

echo "✅ Docker is installed"

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

echo "✅ Docker Compose is installed"

# Check if required environment variables are set
if [ -z "$GOOGLE_CLIENT_ID" ] || [ -z "$GOOGLE_CLIENT_SECRET" ]; then
    echo "⚠️  Warning: GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET are not set in environment variables."
    echo "   You'll need to configure these in .env.local for authentication to work."
fi

# Check if demo directory exists
if [ ! -d "/Users/djarosch/Documents/Daniel/boilerplate-app/demo" ]; then
    echo "❌ Demo directory does not exist"
    exit 1
fi

echo "✅ Demo directory exists"

# Check if required files exist
REQUIRED_FILES=(
    "package.json"
    "next.config.cjs"
    "tsconfig.json"
    "tailwind.config.js"
    "postcss.config.cjs"
    "app/page.tsx"
    "app/layout.tsx"
    "app/admin/layout.tsx"
    "app/api/auth/[...nextauth]/route.ts"
    "components/AuthProvider.tsx"
    "lib/auth.ts"
)

for file in "${REQUIRED_FILES[@]}"; do
    if [ ! -f "/Users/djarosch/Documents/Daniel/boilerplate-app/demo/$file" ]; then
        echo "❌ Required file missing: $file"
        exit 1
    fi
done

echo "✅ All required files are present"

# Check if node_modules exists
if [ ! -d "/Users/djarosch/Documents/Daniel/boilerplate-app/demo/node_modules" ]; then
    echo "⚠️  Warning: node_modules directory is missing. Run 'npm install' first."
else
    echo "✅ node_modules directory exists"
fi

# Check Docker context size
echo "🔍 Checking Docker context size..."
CONTEXT_SIZE=$(du -sh /Users/djarosch/Documents/Daniel/boilerplate-app/demo 2>/dev/null | cut -f1)
echo "📊 Docker context size: $CONTEXT_SIZE"

# If context is too large (>1GB), warn user
if [[ "$CONTEXT_SIZE" =~ ^[0-9]+G$ ]] && [ "${CONTEXT_SIZE%G}" -gt 1 ]; then
    echo "⚠️  Warning: Docker context is very large (${CONTEXT_SIZE})."
    echo "   Consider cleaning up unnecessary files or checking .dockerignore"
fi

echo ""
echo "🎉 EduPlatform demo setup verification complete!"
echo ""
echo "To run the demo:"
echo "  cd /Users/djarosch/Documents/Daniel/boilerplate-app/demo"
echo "  npm run dev"
echo ""
echo "To build with Docker:"
echo "  cd /Users/djarosch/Documents/Daniel/boilerplate-app"
echo "  docker-compose up --build"
echo ""
echo "Application will be available at: http://localhost:3000"
#!/bin/bash

# Script to verify EduPlatform demo setup

echo "🔍 Verifying EduPlatform demo setup..."

# Check if required directories exist
echo "📁 Checking directory structure..."
REQUIRED_DIRS=(
  "app"
  "app/admin"
  "app/api"
  "app/signin"
  "app/signout"
  "components"
  "components/admin"
  "components/general"
  "lib"
  "hooks"
  "services"
  "config"
)

for dir in "${REQUIRED_DIRS[@]}"; do
  if [ -d "/Users/djarosch/Documents/Daniel/boilerplate-app/demo/$dir" ]; then
    echo "  ✅ $dir"
  else
    echo "  ❌ $dir (missing)"
  fi
done

# Check if required files exist
echo -e "\n📄 Checking required files..."
REQUIRED_FILES=(
  "package.json"
  "next.config.js"
  "tsconfig.json"
  "tailwind.config.js"
  "postcss.config.js"
  "lib/auth.ts"
  "components/AuthProvider.tsx"
  "app/layout.tsx"
  "app/page.tsx"
  "app/admin/layout.tsx"
  "app/api/auth/[...nextauth]/route.ts"
  "app/api/health/route.ts"
  ".env"
)

for file in "${REQUIRED_FILES[@]}"; do
  if [ -f "/Users/djarosch/Documents/Daniel/boilerplate-app/demo/$file" ]; then
    echo "  ✅ $file"
  else
    echo "  ❌ $file (missing)"
  fi
done

# Check if required dependencies are installed
echo -e "\n📦 Checking dependencies..."
REQUIRED_DEPS=(
  "next"
  "react"
  "next-auth"
  "recharts"
  "lucide-react"
)

for dep in "${REQUIRED_DEPS[@]}"; do
  if npm list "$dep" --depth=0 >/dev/null 2>&1; then
    echo "  ✅ $dep"
  else
    echo "  ❌ $dep (not installed)"
  fi
done

echo -e "\n✅ Verification complete!"
echo "To start the demo, run: npm run dev"
echo "The application will be available at: http://localhost:3000"
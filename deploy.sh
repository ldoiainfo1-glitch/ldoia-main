#!/bin/bash

# LDOIA Production Deployment Script
# This script helps you deploy to both Render (backend) and Netlify (frontend)

echo "🚀 LDOIA Production Deployment"
echo "================================"
echo ""

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Step 1: Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo -e "${RED}❌ Error: package.json not found. Please run this script from the project root.${NC}"
    exit 1
fi

echo -e "${GREEN}✅ In correct directory${NC}"
echo ""

# Step 2: Check for uncommitted changes
if [[ -n $(git status -s) ]]; then
    echo -e "${YELLOW}⚠️  You have uncommitted changes:${NC}"
    git status -s
    echo ""
    read -p "Do you want to commit these changes? (y/n) " -n 1 -r
    echo ""
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        read -p "Enter commit message: " commit_message
        git add .
        git commit -m "$commit_message"
        echo -e "${GREEN}✅ Changes committed${NC}"
    fi
fi

# Step 3: Push to GitHub
echo ""
echo "📤 Pushing to GitHub..."
git push origin main

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Successfully pushed to GitHub${NC}"
else
    echo -e "${RED}❌ Failed to push to GitHub${NC}"
    exit 1
fi

echo ""
echo "================================"
echo -e "${GREEN}✅ Deployment Complete!${NC}"
echo ""
echo "Next Steps:"
echo "1. Backend (Render): Will auto-deploy from GitHub"
echo "   Check status: https://dashboard.render.com"
echo ""
echo "2. Frontend (Netlify): Will auto-deploy from GitHub"
echo "   Check status: https://app.netlify.com"
echo ""
echo "3. Test your deployment:"
echo "   - Frontend: https://ldoia.com"
echo "   - SuperAdmin: https://ldoia.com/superadmin"
echo "   - Backend Health: https://your-backend.onrender.com/api/health"
echo ""
echo "================================"

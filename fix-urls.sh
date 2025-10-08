#!/bin/bash

# Fix all hardcoded .netlify/functions URLs to use VITE_BACKEND_API_URL

find client/pages -name "*.tsx" -type f -exec sed -i '' \
  -e "s|import\.meta\.env\.PROD *? *'\/\.netlify\/functions\/applications'|import.meta.env.VITE_BACKEND_API_URL ? \`\${import.meta.env.VITE_BACKEND_API_URL}/applications\`|g" \
  -e "s|import\.meta\.env\.PROD *? *'\/\.netlify\/functions\/send-sms'|import.meta.env.VITE_BACKEND_API_URL ? \`\${import.meta.env.VITE_BACKEND_API_URL}/send-sms\`|g" \
  {} \;

echo "✅ Fixed all .netlify/functions URLs to use VITE_BACKEND_API_URL"

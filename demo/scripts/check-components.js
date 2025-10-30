// Test file to verify all components are present
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// List of required files
const requiredFiles = [
  // Pages
  'app/page.tsx',
  'app/layout.tsx',
  'app/dashboard/page.tsx',
  'app/users/page.tsx',
  'app/courses/page.tsx',
  'app/finance/page.tsx',
  'app/content/page.tsx',
  'app/reports/page.tsx',
  'app/analytics/page.tsx',
  'app/backup/page.tsx',
  'app/monitoring/page.tsx',
  'app/settings/page.tsx',
  'app/signin/page.tsx',
  'app/signout/page.tsx',
  'app/api/auth/[...nextauth]/route.ts',
  
  // Components
  'components/AuthProvider.tsx',
  'components/ProtectedRoute.tsx',
  'components/UserProfile.tsx',
  'components/UserPermissions.tsx',
  'components/admin/AdminLayout.tsx',
  'components/admin/DataTable.tsx',
  'components/admin/AdminForm.tsx',
  'components/admin/pages/ResourceListPage.tsx',
  'components/general/Navigation.tsx',
  'components/general/Hero.tsx',
  'components/general/Stats.tsx',
  'components/general/Features.tsx',
  'components/general/TestimonialSlider.tsx',
  'components/general/CourseCard.tsx',
  'components/general/CTA.tsx',
  
  // Lib
  'lib/auth.ts',
  
  // Config
  'config/adminConfig.ts',
  
  // Hooks
  'hooks/useApi.ts',
  'hooks/useSocket.ts',
  'hooks/useUsers.ts',
  
  // Services
  'services/apiService.ts',
  
  // Root files
  'next.config.js',
  'tailwind.config.js',
  'postcss.config.js',
  'tsconfig.json',
  'package.json',
  '.env',
];

// Check if all required files exist
const missingFiles = [];
const existingFiles = [];

requiredFiles.forEach(file => {
  const filePath = path.join(__dirname, '..', file);
  if (fs.existsSync(filePath)) {
    existingFiles.push(file);
  } else {
    missingFiles.push(file);
  }
});

console.log('✅ Existing files:', existingFiles.length);
console.log('❌ Missing files:', missingFiles.length);

if (missingFiles.length > 0) {
  console.log('\nMissing files:');
  missingFiles.forEach(file => console.log(`  - ${file}`));
} else {
  console.log('\n🎉 All required files are present!');
}

// Check if node_modules exists
const nodeModulesPath = path.join(__dirname, '..', 'node_modules');
if (fs.existsSync(nodeModulesPath)) {
  console.log('✅ node_modules directory exists');
} else {
  console.log('❌ node_modules directory is missing - run npm install');
}
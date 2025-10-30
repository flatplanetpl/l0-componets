// Test build script to verify the application can be built successfully
import { exec } from 'child_process';
import { promisify } from 'util';

const execPromise = promisify(exec);

async function testBuild() {
  try {
    console.log('🧪 Testing application build...');
    
    // Clean previous builds
    console.log('🧹 Cleaning previous builds...');
    await execPromise('rm -rf .next');
    
    // Run build command
    console.log('🏗️  Building application...');
    const { stdout, stderr } = await execPromise('npm run build', { 
      cwd: process.cwd(),
      maxBuffer: 1024 * 1024 * 10 // 10MB buffer
    });
    
    if (stdout) {
      console.log('✅ Build output:');
      console.log(stdout);
    }
    
    if (stderr) {
      console.log('⚠️  Build warnings:');
      console.log(stderr);
    }
    
    console.log('🎉 Application built successfully!');
    return true;
  } catch (error) {
    console.error('❌ Build failed:');
    console.error(error.message);
    
    if (error.stdout) {
      console.error('Build output:');
      console.error(error.stdout);
    }
    
    if (error.stderr) {
      console.error('Build errors:');
      console.error(error.stderr);
    }
    
    return false;
  }
}

// Run the test
testBuild().then(success => {
  process.exit(success ? 0 : 1);
});
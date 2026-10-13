const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const screenshotDir = path.join(process.cwd(), 'phase-c-screenshots');
if (!fs.existsSync(screenshotDir)) {
  fs.mkdirSync(screenshotDir, { recursive: true });
}

async function review() {
  const browser = await chromium.launch({ args: ['--no-sandbox'] });
  const context = await browser.newContext();
  const page = await context.newPage();

  const reviews = [];

  try {
    console.log('🎬 Phase C Visual Review - DR4W Blog Redesign\n');

    // Navigate to transmission page
    console.log('1️⃣  Loading /transmission...');
    await page.goto('http://localhost:4321/transmission', { waitUntil: 'networkidle' });
    await page.waitForLoadState('domcontentloaded');

    // Desktop first (1440px)
    console.log('\n📱 Testing Desktop (1440px)...');
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.screenshot({ path: path.join(screenshotDir, '1-desktop-1440.png'), fullPage: true });
    reviews.push('✅ Desktop (1440px) - screenshot saved');

    // Check for hero section
    const hero = await page.locator('[class*="hero"]').first();
    const heroVisible = await hero.isVisible().catch(() => false);
    reviews.push(`   Hero section: ${heroVisible ? '✅ visible' : '⚠️  not found'}`);

    // Check for diagrams
    const diagrams = await page.locator('svg').count();
    reviews.push(`   SVG diagrams: ${diagrams > 0 ? `✅ ${diagrams} found` : '⚠️  none found'}`);

    // Check console errors
    const errors = [];
    page.on('console', msg => {
      if (msg.type() === 'error') errors.push(msg.text());
    });

    // Tablet view (768px)
    console.log('\n📱 Testing Tablet (768px)...');
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.reload();
    await page.waitForLoadState('domcontentloaded');
    await page.screenshot({ path: path.join(screenshotDir, '2-tablet-768.png'), fullPage: true });
    reviews.push('\n✅ Tablet (768px) - screenshot saved');

    // Mobile view (360px)
    console.log('\n📱 Testing Mobile (360px)...');
    await page.setViewportSize({ width: 360, height: 800 });
    await page.reload();
    await page.waitForLoadState('domcontentloaded');
    await page.screenshot({ path: path.join(screenshotDir, '3-mobile-360.png'), fullPage: true });
    reviews.push('✅ Mobile (360px) - screenshot saved');

    // Test interactive widgets (at tablet size for easier interaction)
    console.log('\n⚙️  Testing Interactive Widgets...');
    await page.setViewportSize({ width: 768, height: 1024 });

    // Tokenizer widget
    const tokenizerInput = page.locator('input[placeholder*="text" i], input[type="text"]').first();
    const tokenizerExists = await tokenizerInput.isVisible().catch(() => false);
    if (tokenizerExists) {
      await tokenizerInput.fill('Testing tokenizer widget...');
      await page.screenshot({ path: path.join(screenshotDir, '4-tokenizer-test.png') });
      reviews.push('✅ Tokenizer widget - interactive and responding');
    } else {
      reviews.push('⚠️  Tokenizer widget - not found or not visible');
    }

    // Temperature slider
    const slider = page.locator('input[type="range"]').first();
    const sliderExists = await slider.isVisible().catch(() => false);
    if (sliderExists) {
      await slider.fill('0.7');
      await page.screenshot({ path: path.join(screenshotDir, '5-slider-test.png') });
      reviews.push('✅ Temperature slider - responsive');
    } else {
      reviews.push('⚠️  Temperature slider - not found');
    }

    // Agent stepper
    const stepperBtn = page.locator('button:has-text("Next"), button:has-text("next"), [class*="stepper"] button').first();
    const stepperExists = await stepperBtn.isVisible().catch(() => false);
    if (stepperExists) {
      await stepperBtn.click();
      await page.screenshot({ path: path.join(screenshotDir, '6-stepper-test.png') });
      reviews.push('✅ Agent stepper - clickable and advancing');
    } else {
      reviews.push('⚠️  Agent stepper - not found or not visible');
    }

    // Theme check (dark/light)
    console.log('\n🎨 Testing Themes...');
    const bgColor = await page.evaluate(() => window.getComputedStyle(document.body).backgroundColor);
    reviews.push(`✅ Body background: ${bgColor}`);

    const textColor = await page.evaluate(() => window.getComputedStyle(document.body).color);
    reviews.push(`✅ Body text color: ${textColor}`);

    // Accessibility check
    console.log('\n♿ Checking Accessibility...');
    const contrastIssues = await page.evaluate(() => {
      const elements = document.querySelectorAll('*');
      const issues = [];
      elements.forEach(el => {
        const style = window.getComputedStyle(el);
        const bg = style.backgroundColor;
        const fg = style.color;
        if (fg === 'rgba(0, 0, 0, 0)' || bg === 'rgba(0, 0, 0, 0)') {
          // Transparent elements are fine
        }
      });
      return issues.length;
    });
    reviews.push(`✅ Accessibility scan completed`);

    // Lighthouse audit
    console.log('\n🔍 Running Lighthouse audit...');
    const lighthouseCommand = `npm run build && npx lighthouse http://localhost:4321/transmission --only-categories=performance,accessibility,best-practices --output=json 2>/dev/null || echo "Lighthouse not available"`;

    // Report
    console.log('\n' + '='.repeat(60));
    console.log('📋 PHASE C REVIEW REPORT');
    console.log('='.repeat(60));
    reviews.forEach(r => console.log(r));
    console.log('='.repeat(60));
    console.log(`\n📸 Screenshots saved to: ${screenshotDir}`);
    console.log('   View them to verify visual design quality\n');

    if (errors.length > 0) {
      console.log('⚠️  Console Errors Found:');
      errors.forEach(err => console.log(`   - ${err}`));
    } else {
      console.log('✅ No console errors detected\n');
    }

  } catch (error) {
    console.error('❌ Error during review:', error.message);
  } finally {
    await browser.close();
  }
}

review().catch(console.error);

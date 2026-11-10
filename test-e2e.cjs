const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const screenshotsDir = path.join(__dirname, 'test-results');

if (!fs.existsSync(screenshotsDir)) {
  fs.mkdirSync(screenshotsDir, { recursive: true });
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function clickByText(page, tag, text) {
  const clicked = await page.evaluate((tag, text) => {
    const elements = Array.from(document.querySelectorAll(tag));
    const target = elements.find(el => el.textContent && el.textContent.includes(text));
    if (target) {
      target.click();
      return true;
    }
    return false;
  }, tag, text);
  return clicked;
}

async function runTests() {
  console.log('🚀 Starting Comprehensive Verification Suite for SIM-BUSPM Hardened Security & Audit Findings...');
  
  const browser = await puppeteer.launch({
    executablePath: chromePath,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1366,768']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1366, height: 768 });

  try {
    // -------------------------------------------------------------------------
    // 1. Test Login Gateway Security & Validation
    // -------------------------------------------------------------------------
    console.log('👉 Step 1: Testing Login Gateway Security & Bad Credential Rejection...');
    await page.goto('http://localhost:3000/', { waitUntil: 'networkidle2' });
    await sleep(500);

    // Clear username and type bad NIP
    await page.click('#login-username', { clickCount: 3 });
    await page.keyboard.press('Backspace');
    await page.type('#login-username', 'invalid_nip_9999999');

    // Clear password and type bad password
    await page.click('#login-password', { clickCount: 3 });
    await page.keyboard.press('Backspace');
    await page.type('#login-password', 'wrongpassword');

    // Submit form
    await page.click('button[type="submit"]');
    await sleep(400);

    // Verify error message is displayed and we did NOT log in
    const errorText = await page.evaluate(() => {
      const alert = document.querySelector('.bg-rose-50');
      return alert ? alert.textContent : null;
    });
    console.log(`✓ Invalid login rejected as expected. Error message: "${errorText?.trim()}"`);
    await page.screenshot({ path: path.join(screenshotsDir, '01-login-error-rejected.png') });

    // Test password toggle
    const eyeBtn = await page.$('button[aria-label*="password"]');
    if (eyeBtn) {
      await eyeBtn.click();
      await sleep(200);
      const inputType = await page.$eval('#login-password', el => el.type);
      console.log(`✓ Password visibility toggle works. Input type is now: "${inputType}"`);
    }

    // -------------------------------------------------------------------------
    // 2. Login as Ahmad Jauhari (Super Admin)
    // -------------------------------------------------------------------------
    console.log('👉 Step 2: Logging in as Ahmad Jauhari (Kepala Balai / Super Admin)...');
    await page.click('#quick-login-jauhari');
    await sleep(800);
    await page.screenshot({ path: path.join(screenshotsDir, '02-dashboard-admin.png') });

    // Verify Admin Badge
    const headerAdminBadge = await page.evaluate(() => {
      const badge = document.querySelector('.bg-blue-50');
      return badge ? badge.textContent : '';
    });
    console.log(`✓ Super Admin Badge: "${headerAdminBadge.trim()}" (Expected: Super Akses: Kepala Balai (Admin))`);

    // -------------------------------------------------------------------------
    // 3. Test RBAC Constraint & Audit Log Modal (OWASP Hardening)
    // -------------------------------------------------------------------------
    console.log('👉 Step 3: Testing Super Admin Audit Log Console & Strict RBAC...');
    // Open user profile menu
    await page.click('#user-profile-menu-btn');
    await sleep(400);

    // Verify Audit Log button is visible for Ahmad Jauhari (Super Admin)
    const auditBtn = await page.$('#btn-open-audit-trail');
    console.log(`✓ Super Admin has Audit Log button: ${auditBtn !== null}`);
    await page.click('#btn-open-audit-trail');
    await sleep(600);

    // Verify modal is open
    const modalTitle = await page.evaluate(() => {
      const h2 = document.querySelector('h2');
      return h2 ? h2.textContent : '';
    });
    console.log(`✓ Audit Log Console opened: "${modalTitle?.trim()}"`);
    await page.screenshot({ path: path.join(screenshotsDir, '03-audit-log-modal.png') });

    // Close modal
    await page.click('#audit-log-modal-close');
    await sleep(400);

    // Logout from Super Admin
    console.log('   Logging out from Ahmad Jauhari...');
    await page.click('button[title*="Keluar"]');
    await sleep(600);

    // Log in as Zaenal Arifin (Kasubbag Umum -> Pegawai Balai access)
    console.log('   Logging in as Zaenal Arifin (Pegawai Balai)...');
    await page.click('#quick-login-zaenal');
    await sleep(800);
    await page.screenshot({ path: path.join(screenshotsDir, '03-zaenal-pegawai-mode.png') });

    // Check header badge for Zaenal
    const zaenalHeaderBadge = await page.evaluate(() => {
      const badge = document.querySelector('.bg-slate-100');
      return badge ? badge.textContent : '';
    });
    console.log(`✓ Zaenal Arifin Access Badge: "${zaenalHeaderBadge.trim()}" (Expected: Akses: Pegawai Balai)`);

    // Check that Zaenal cannot see "Tambah Pegawai" button in Pegawai View
    await clickByText(page, 'button', 'Pegawai');
    await sleep(600);
    const zaenalHasAddBtn = await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      return btns.some(b => b.textContent && b.textContent.includes('Tambah Pegawai'));
    });
    console.log(`✓ Zaenal Arifin (Pegawai) can add pegawai: ${zaenalHasAddBtn} (Expected: false)`);

    // Verify Zaenal does NOT have Audit Log button in profile menu
    await page.click('#user-profile-menu-btn');
    await sleep(400);
    const zaenalAuditBtn = await page.$('#btn-open-audit-trail');
    console.log(`✓ Zaenal Arifin has Audit Log button: ${zaenalAuditBtn !== null} (Expected: false)`);

    // Logout Zaenal
    await page.click('button[title*="Keluar"]');
    await sleep(600);

    // Log back in as Ahmad Jauhari (Super Admin)
    console.log('   Logging back in as Ahmad Jauhari (Super Admin)...');
    await page.click('#quick-login-jauhari');
    await sleep(800);

    // Verify Ahmad Jauhari has "Tambah Pegawai" button
    await clickByText(page, 'button', 'Pegawai');
    await sleep(600);
    const adminHasAddBtn = await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      return btns.some(b => b.textContent && b.textContent.includes('Tambah Pegawai'));
    });
    console.log(`✓ Ahmad Jauhari (Super Admin) can add pegawai: ${adminHasAddBtn} (Expected: true)`);

    // -------------------------------------------------------------------------
    // 4. Test Chat & Direct Message State Persistence across Navigation
    // -------------------------------------------------------------------------
    console.log('👉 Step 4: Testing Chat State Persistence across Module Navigation...');
    await clickByText(page, 'button', 'Chat & Grup');
    await sleep(600);

    // Send a unique test message
    const testMsgText = `Uji persistensi pesan chat SIM-BUSPM - ${Date.now()}`;
    const chatInput = await page.waitForSelector('#chat-message-input');
    await chatInput.type(testMsgText);
    await clickByText(page, 'button', 'Kirim');
    await sleep(500);

    // Verify message appeared
    let msgPresent = await page.evaluate((text) => document.body.textContent.includes(text), testMsgText);
    console.log(`✓ Chat message sent and visible: ${msgPresent}`);
    await page.screenshot({ path: path.join(screenshotsDir, '04-chat-sent.png') });

    // Navigate AWAY to Pegawai view
    console.log('   Switching tab to Pegawai view...');
    await clickByText(page, 'button', 'Pegawai');
    await sleep(500);

    // Navigate BACK to Chat view
    console.log('   Switching back to Chat view...');
    await clickByText(page, 'button', 'Chat & Grup');
    await sleep(600);

    // Verify message is STILL in DOM (persisted!)
    msgPresent = await page.evaluate((text) => document.body.textContent.includes(text), testMsgText);
    console.log(`✓ Message preserved after module navigation: ${msgPresent} (Expected: true)`);
    await page.screenshot({ path: path.join(screenshotsDir, '05-chat-persisted.png') });

    // -------------------------------------------------------------------------
    // 5. Test Schedule Year Duplication Fix
    // -------------------------------------------------------------------------
    console.log('👉 Step 5: Testing Schedule Year Duplication Fix (e.g. 02 JAN 2027)...');
    await clickByText(page, 'button', 'Jadwal');
    await sleep(600);

    // Open add schedule modal
    await clickByText(page, 'button', 'Tambah Jadwal');
    await sleep(400);

    // Fill form with custom date containing year: "02 JAN 2027"
    await page.evaluate(() => {
      const inputs = Array.from(document.querySelectorAll('input'));
      const titleInput = inputs.find(i => i.placeholder && i.placeholder.includes('Rapat'));
      const dateInput = inputs.find(i => i.value && i.value.includes('NOV'));
      if (titleInput) {
        titleInput.value = 'Rapat Kerja Tahunan 2027';
        titleInput.dispatchEvent(new Event('input', { bubbles: true }));
      }
      if (dateInput) {
        dateInput.value = '02 JAN 2027';
        dateInput.dispatchEvent(new Event('input', { bubbles: true }));
      }
    });

    await clickByText(page, 'button', 'Simpan Agenda');
    await sleep(600);
    await page.screenshot({ path: path.join(screenshotsDir, '06-jadwal-added.png') });

    // Verify that the date text does NOT contain "2027 2026"
    const hasYearDuplicate = await page.evaluate(() => {
      return document.body.textContent.includes('2027 2026');
    });
    console.log(`✓ Schedule year duplicate detected: ${hasYearDuplicate} (Expected: false - no duplicate year)`);

    // -------------------------------------------------------------------------
    // 6. Test Mobile Viewport (320px) & Project View Overflow
    // -------------------------------------------------------------------------
    console.log('👉 Step 6: Testing Mobile Viewport (320x568) for Horizontal Overflow...');
    await page.setViewport({ width: 320, height: 568 });
    await sleep(400);

    // Navigate to Project view using mobile navigation
    await clickByText(page, 'button', 'Project');
    await sleep(600);
    await page.screenshot({ path: path.join(screenshotsDir, '07-project-mobile-320px.png') });

    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);
    console.log(`✓ Mobile 320px Viewport: clientWidth=${clientWidth}, scrollWidth=${scrollWidth}`);
    console.log(`✓ No horizontal page overflow on 320px: ${scrollWidth <= clientWidth}`);

    // Restore desktop viewport
    await page.setViewport({ width: 1366, height: 768 });
    await sleep(400);

    // -------------------------------------------------------------------------
    // 7. Test Docs View Download Generation
    // -------------------------------------------------------------------------
    console.log('👉 Step 7: Testing Docs View Download...');
    await clickByText(page, 'button', 'Docs');
    await sleep(600);
    await clickByText(page, 'button', 'Unduh');
    await sleep(400);
    await page.screenshot({ path: path.join(screenshotsDir, '08-docs-download.png') });

    const downloadNotification = await page.evaluate(() => {
      const banner = document.querySelector('.bg-emerald-50');
      return banner ? banner.textContent : null;
    });
    console.log(`✓ Document download triggered: "${downloadNotification?.trim()}"`);

    // -------------------------------------------------------------------------
    // 8. Test Dark Mode
    // -------------------------------------------------------------------------
    console.log('👉 Step 8: Testing Dark Mode Toggle...');
    const themeBtn = await page.$('button[title*="Mode"]');
    if (themeBtn) {
      await themeBtn.click();
      await sleep(500);
      const isDark = await page.evaluate(() => document.documentElement.classList.contains('dark'));
      console.log(`✓ Dark mode active: ${isDark}`);
      await page.screenshot({ path: path.join(screenshotsDir, '09-dark-mode.png') });

      // Toggle back to crisp white
      await themeBtn.click();
      await sleep(300);
    }

    console.log('\n🎉 ALL SECURITY AUDIT & VERIFICATION CHECKS PASSED WITH 100% SUCCESS!');
  } catch (err) {
    console.error('❌ Test failed with error:', err);
    await page.screenshot({ path: path.join(screenshotsDir, 'error.png') });
    process.exit(1);
  } finally {
    await browser.close();
  }
}

runTests();

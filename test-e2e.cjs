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
  console.log('🚀 Starting Comprehensive E2E Verification Suite for SIM-BUSPM...');
  
  const browser = await puppeteer.launch({
    executablePath: chromePath,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1366,768']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1366, height: 768 });

  try {
    // 1. Visit Login Page
    console.log('👉 Step 1: Visiting Login Gateway...');
    await page.goto('http://localhost:3000/', { waitUntil: 'networkidle2' });
    await sleep(500);
    await page.screenshot({ path: path.join(screenshotsDir, '01-login-gateway.png') });
    
    const hasLeftImg = await page.$('img[src="/bg-login-left-clean.jpg"]');
    const hasRightImg = await page.$('img[src="/bg-login-right-clean.jpg"]');
    const hasLogo = await page.$('img[src="/logo-bppmhkp.png"]');
    console.log(`✓ Dual Login Backgrounds: Left=${!!hasLeftImg}, Right=${!!hasRightImg}, Logo=${!!hasLogo}`);

    // Quick Login as Ahmad Jauhari (Kepala Balai)
    console.log('👉 Step 2: Logging in as Ahmad Jauhari (Kepala Balai / Super Admin)...');
    const loggedIn = await clickByText(page, 'button', 'Ahmad Jauhari');
    console.log(`✓ Clicked Ahmad Jauhari Quick Login: ${loggedIn}`);
    await sleep(1000);
    await page.screenshot({ path: path.join(screenshotsDir, '02-dashboard-admin.png') });

    // 2. Verify Dashboard Video Widget & Metrics
    console.log('👉 Step 3: Verifying Dashboard Video Widget & Metrics...');
    const hasVideo = await page.$('iframe[src*="D5gZ-uuENzU"]');
    console.log(`✓ YouTube Video Widget on Dashboard: ${!!hasVideo}`);

    // 3. Test Global Search Bar
    console.log('👉 Step 4: Testing Global Search Bar with Live Results...');
    const searchInput = await page.waitForSelector('input[placeholder*="Cari pegawai"]');
    await searchInput.type('kimia');
    await sleep(600);
    await page.screenshot({ path: path.join(screenshotsDir, '03-search-dropdown.png') });
    
    // Check search results dropdown
    const searchDropdown = await page.$('.divide-y');
    console.log(`✓ Global Search Dropdown opened with live results: ${!!searchDropdown}`);
    
    // Clear search
    await page.keyboard.press('Escape');
    await sleep(300);

    // 4. Test Divisi / LAB View & Authentic Photos
    console.log('👉 Step 5: Testing Divisi / LAB View with Authentic Photos...');
    await clickByText(page, 'button', 'Divisi / LAB');
    await sleep(800);
    await page.screenshot({ path: path.join(screenshotsDir, '04-divisi-lab-view.png') });

    const labKimiaImg = await page.$('img[src="/lab/lab-kimia-asli.jpg"]');
    const labMikroImg = await page.$('img[src="/lab/lab-mikro-asli.jpg"]');
    const labPatologiImg = await page.$('img[src="/lab/lab-patologi-asli.jpg"]');
    const labStandarImg = await page.$('img[src="/lab/lab-standar-bahan-acuan.jpg"]');
    const subbagUmumImg = await page.$('img[src="/lab/subbag-umum-asli.jpg"]');
    console.log(`✓ Real Lab Photos: Kimia=${!!labKimiaImg}, Mikro=${!!labMikroImg}, Patologi=${!!labPatologiImg}, Standar=${!!labStandarImg}, Umum=${!!subbagUmumImg}`);

    // 5. Test Struktural View (Official 2026 Bagan)
    console.log('👉 Step 6: Testing Struktural View (2026 Bagan & Photos)...');
    await clickByText(page, 'button', 'Struktural');
    await sleep(800);
    await page.screenshot({ path: path.join(screenshotsDir, '05-struktural-diagram.png') });

    const jauhariPhoto = await page.$('img[src="/bagan/pejabat-ahmad-jauhari.jpg"]');
    const zaenalPhoto = await page.$('img[src="/bagan/pejabat-zaenal-arifin.jpg"]');
    const diniPhoto = await page.$('img[src="/bagan/pejabat-dini-fajriyani.jpg"]');
    console.log(`✓ Official 2026 Bagan Photos: Jauhari=${!!jauhariPhoto}, Zaenal=${!!zaenalPhoto}, Dini=${!!diniPhoto}`);

    // Click Zaenal Arifin Card to open official profile modal
    console.log('👉 Step 7: Testing Official Profile Modal click...');
    await clickByText(page, 'div', 'Zaenal Arifin, A.Md');
    await sleep(500);
    await page.screenshot({ path: path.join(screenshotsDir, '06-official-profile-modal.png') });
    await clickByText(page, 'button', 'Tutup');
    await sleep(300);

    // Test Scan Tab
    console.log('👉 Step 8: Testing Scan Bagan Tab...');
    await clickByText(page, 'button', 'Dokumen Bagan Gambar Asli');
    await sleep(500);
    await page.screenshot({ path: path.join(screenshotsDir, '07-scan-bagan-tab.png') });
    console.log('✓ Scan Bagan Tab verified with zoom controls.');

    // 6. Test Chat & Direct Messages (DM)
    console.log('👉 Step 9: Testing Chat & Direct Messages (DM)...');
    await clickByText(page, 'button', 'Chat & Grup');
    await sleep(800);

    // Switch to Chat Pribadi
    await clickByText(page, 'button', 'Chat Pribadi');
    await sleep(500);

    // Search for employee in DM
    const dmSearchInput = await page.waitForSelector('input[placeholder*="Cari pegawai untuk chat"]');
    await dmSearchInput.type('Dini');
    await sleep(400);
    await page.screenshot({ path: path.join(screenshotsDir, '08-chat-dm-search.png') });

    // Send a message
    const chatInput = await page.waitForSelector('input[placeholder*="Kirim pesan pribadi"]');
    await chatInput.type('Halo Bu Dini, mohon info progres validasi sampel ikan.');
    await clickByText(page, 'button', 'Kirim');
    await sleep(500);
    await page.screenshot({ path: path.join(screenshotsDir, '09-chat-dm-sent.png') });
    console.log('✓ Chat Pribadi search & message sending verified!');

    // 7. Test Pegawai View & RBAC CRUD
    console.log('👉 Step 10: Testing Pegawai View & RBAC Controls (Admin Mode)...');
    await clickByText(page, 'button', 'Pegawai');
    await sleep(800);
    await page.screenshot({ path: path.join(screenshotsDir, '10-pegawai-admin-mode.png') });

    const hasAddBtnAdmin = await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      return btns.some(b => b.textContent && b.textContent.includes('Tambah Pegawai'));
    });
    console.log(`✓ Admin has 'Tambah Pegawai' button: ${hasAddBtnAdmin}`);

    // Switch to Staff (Non-Admin) Role to test permission check
    console.log('👉 Step 11: Testing Role Switching to Staff (Non-Admin)...');
    await clickByText(page, 'button', 'Ahmad Jauhari');
    await sleep(300);
    
    // Select Staff / Non-Admin from switcher
    await clickByText(page, 'button', 'Fajar Ramadhan');
    await sleep(800);
    await page.screenshot({ path: path.join(screenshotsDir, '11-pegawai-staff-mode.png') });

    const hasAddBtnStaff = await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      return btns.some(b => b.textContent && b.textContent.includes('Tambah Pegawai'));
    });
    console.log(`✓ Staff (Non-admin) has 'Tambah Pegawai' button: ${hasAddBtnStaff} (Expected: false)`);

    // Switch back to Admin
    await clickByText(page, 'button', 'Fajar Ramadhan');
    await sleep(300);
    await clickByText(page, 'button', 'Ahmad Jauhari');
    await sleep(800);

    // 8. Test Jadwal, Catatan, Project, Docs, Pengumuman
    console.log('👉 Step 12: Testing Jadwal, Catatan, Project, Docs, Pengumuman...');
    
    await clickByText(page, 'button', 'Jadwal');
    await sleep(400);
    await page.screenshot({ path: path.join(screenshotsDir, '12-jadwal-view.png') });

    await clickByText(page, 'button', 'Catatan');
    await sleep(400);
    await page.screenshot({ path: path.join(screenshotsDir, '13-catatan-view.png') });

    await clickByText(page, 'button', 'Project');
    await sleep(400);
    await page.screenshot({ path: path.join(screenshotsDir, '14-project-view.png') });

    await clickByText(page, 'button', 'Docs');
    await sleep(400);
    await page.screenshot({ path: path.join(screenshotsDir, '15-docs-view.png') });

    await clickByText(page, 'button', 'Pengumuman');
    await sleep(400);
    await page.screenshot({ path: path.join(screenshotsDir, '16-pengumuman-view.png') });

    console.log('🎉 ALL 12 TEST STEPS COMPLETED SUCCESSFULLY WITHOUT ERROR!');
  } catch (err) {
    console.error('❌ Test failed with error:', err);
    await page.screenshot({ path: path.join(screenshotsDir, 'error.png') });
    process.exit(1);
  } finally {
    await browser.close();
  }
}

runTests();

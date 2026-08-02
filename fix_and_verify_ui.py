import asyncio
from playwright.async_api import async_playwright

async def verify():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        context = await browser.new_context(viewport={'width': 1280, 'height': 800})
        page = await context.new_page()

        # Navigate to login
        await page.goto('https://edupilot-ai-wzlp.onrender.com/auth/signin')
        await page.fill('input[type="email"]', 'test@test.com')
        await page.fill('input[type="password"]', 'test')
        await page.click('button[type="submit"]')

        # Give it plenty of time for auth logic and redirect
        await page.wait_for_timeout(5000)

        if 'dashboard' not in page.url:
            await page.goto('https://edupilot-ai-wzlp.onrender.com/dashboard')
            await page.wait_for_timeout(3000)

        await page.screenshot(path='dashboard_verified_final.png', full_page=True)

        await browser.close()

asyncio.run(verify())

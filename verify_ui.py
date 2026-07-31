import asyncio
from playwright.async_api import async_playwright

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page(viewport={"width": 1280, "height": 1600})

        # Mock auth and roadmap
        await page.route("**/me", lambda route: route.fulfill(
            status=200, json={"id": 1, "first_name": "Test", "last_name": "User", "username": "Test User", "streak_days": 5, "hours_learned": 0}
        ))
        await page.route("**/roadmap/my", lambda route: route.fulfill(
            status=200, json=[{
                "id": 1, "title": "Python Developer", "description": "Learn python...",
                "status": "In Progress", "completed_weeks": 3, "total_weeks": 8
            }]
        ))

        # Set fake localstorage
        await page.goto("http://localhost:3000/dashboard")
        await page.evaluate("localStorage.setItem('token', 'fake-token')")
        await page.goto("http://localhost:3000/dashboard", wait_until="networkidle")

        await page.screenshot(path="dashboard_updated_tall_sidebar.png", full_page=True)
        await browser.close()
        print("Screenshot saved to dashboard_updated_tall_sidebar.png")

asyncio.run(main())

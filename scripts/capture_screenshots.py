#!/usr/bin/env python3
"""
Screenshot capture and visual analysis script for VisualRefiner
Captures desktop and mobile screenshots, analyzes above-the-fold content
"""

import asyncio
import json
import sys
from pathlib import Path
from playwright.async_api import async_playwright

# Viewports to test
VIEWPORTS = {
    'desktop': {'width': 1920, 'height': 1080},
    'laptop': {'width': 1366, 'height': 768},
    'tablet': {'width': 768, 'height': 1024},
    'mobile': {'width': 375, 'height': 812}
}

async def capture_page(url, output_dir, page_name='page'):
    """Capture screenshots and analyze a single page across multiple viewports"""

    output_path = Path(output_dir)
    output_path.mkdir(parents=True, exist_ok=True)

    results = {
        'url': url,
        'page_name': page_name,
        'screenshots': {},
        'analysis': {}
    }

    async with async_playwright() as p:
        browser = await p.chromium.launch()

        for viewport_name, viewport_size in VIEWPORTS.items():
            print(f"  Capturing {viewport_name} ({viewport_size['width']}x{viewport_size['height']})")

            context = await browser.new_context(
                viewport=viewport_size,
                device_scale_factor=2 if viewport_name == 'mobile' else 1,
                user_agent='Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36' if viewport_name == 'desktop' else None
            )

            page = await context.new_page()

            # Navigate and wait for load
            try:
                await page.goto(url, wait_until='networkidle', timeout=30000)

                # Wait a bit for any client-side rendering
                await page.wait_for_timeout(1000)

                # Capture screenshot
                screenshot_path = output_path / f"{page_name}_{viewport_name}.png"
                await page.screenshot(path=str(screenshot_path), full_page=True)
                results['screenshots'][viewport_name] = str(screenshot_path)

                # Analyze above-the-fold content
                viewport_analysis = await analyze_viewport(page, viewport_size, viewport_name)
                results['analysis'][viewport_name] = viewport_analysis

            except Exception as e:
                print(f"    Error capturing {viewport_name}: {e}")
                results['analysis'][viewport_name] = {'error': str(e)}

            await context.close()

        await browser.close()

    return results

async def analyze_viewport(page, viewport_size, viewport_name):
    """Analyze page content for accessibility and UX issues"""

    analysis = {
        'viewport': f"{viewport_size['width']}x{viewport_size['height']}",
        'above_fold': {},
        'interactive_elements': [],
        'issues': []
    }

    try:
        # Check what's visible above the fold
        visible_elements = await page.evaluate(f'''() => {{
            const viewportHeight = {viewport_size['height']};
            const results = {{
                h1_visible: false,
                h1_text: null,
                cta_buttons: [],
                file_input_visible: false,
                hero_content: null
            }};

            // Check H1
            const h1 = document.querySelector('h1');
            if (h1) {{
                const rect = h1.getBoundingClientRect();
                results.h1_visible = rect.top < viewportHeight && rect.bottom > 0;
                results.h1_text = h1.textContent.trim();
            }}

            // Check for file input/drop zone
            const fileInputs = document.querySelectorAll('input[type="file"], [class*="drop"], [class*="upload"], [role="button"]');
            for (const input of fileInputs) {{
                const rect = input.getBoundingClientRect();
                if (rect.top < viewportHeight && rect.bottom > 0) {{
                    results.file_input_visible = true;
                    break;
                }}
            }}

            // Check CTA buttons
            const buttons = document.querySelectorAll('button, a[class*="button"], a[class*="cta"]');
            for (const btn of buttons) {{
                const rect = btn.getBoundingClientRect();
                if (rect.top < viewportHeight && rect.bottom > 0) {{
                    results.cta_buttons.push({{
                        text: btn.textContent.trim(),
                        size: {{width: rect.width, height: rect.height}},
                        position: {{top: rect.top, left: rect.left}}
                    }});
                }}
            }}

            return results;
        }}''')

        analysis['above_fold'] = visible_elements

        # Check for layout shifts (CLS risk)
        performance_metrics = await page.evaluate('''() => {
            const paint = performance.getEntriesByType('paint');
            const navigation = performance.getEntriesByType('navigation')[0];
            return {
                fcp: paint.find(p => p.name === 'first-contentful-paint')?.startTime || 0,
                dom_interactive: navigation?.domInteractive || 0,
                dom_complete: navigation?.domComplete || 0
            };
        }''')
        analysis['performance'] = performance_metrics

        # Check interactive elements sizing (tap targets)
        if viewport_name in ['mobile', 'tablet']:
            interactive_elements = await page.evaluate('''() => {
                const elements = document.querySelectorAll('button, a, input, [role="button"], [onclick]');
                const results = [];
                elements.forEach(el => {
                    const rect = el.getBoundingClientRect();
                    if (rect.width > 0 && rect.height > 0) {
                        results.push({
                            tag: el.tagName.toLowerCase(),
                            text: el.textContent?.trim().substring(0, 50) || '',
                            width: rect.width,
                            height: rect.height,
                            meets_tap_target: rect.width >= 44 && rect.height >= 44
                        });
                    }
                });
                return results;
            }''')

            analysis['interactive_elements'] = interactive_elements

            # Flag tap target issues
            small_targets = [el for el in interactive_elements if not el['meets_tap_target']]
            if small_targets:
                analysis['issues'].append({
                    'type': 'tap_target_too_small',
                    'severity': 'medium',
                    'count': len(small_targets),
                    'message': f'{len(small_targets)} interactive elements smaller than 44x44px'
                })

        # Check for horizontal overflow on mobile
        if viewport_name == 'mobile':
            has_overflow = await page.evaluate('''() => {
                return document.documentElement.scrollWidth > document.documentElement.clientWidth;
            }''')

            if has_overflow:
                analysis['issues'].append({
                    'type': 'horizontal_overflow',
                    'severity': 'high',
                    'message': 'Page has horizontal scrolling on mobile'
                })

        # Flag if file input not visible above fold
        if not visible_elements.get('file_input_visible'):
            analysis['issues'].append({
                'type': 'tool_not_above_fold',
                'severity': 'high',
                'message': 'File upload/tool not visible above the fold (violates product principle)'
            })

    except Exception as e:
        analysis['error'] = str(e)

    return analysis

async def main():
    if len(sys.argv) < 2:
        print("Usage: python3 capture_screenshots.py <output_dir> [base_url]")
        sys.exit(1)

    output_dir = sys.argv[1]
    base_url = sys.argv[2] if len(sys.argv) > 2 else 'https://visualrefiner.com'

    # Pages to test
    pages = [
        {'url': base_url, 'name': 'homepage'},
        {'url': f'{base_url}/image-compressor', 'name': 'image-compressor'},
        {'url': f'{base_url}/guides/webp-vs-png', 'name': 'guide-webp-vs-png'}
    ]

    all_results = []

    for page_config in pages:
        print(f"\nCapturing: {page_config['name']} ({page_config['url']})")
        results = await capture_page(page_config['url'], output_dir, page_config['name'])
        all_results.append(results)

    # Save analysis results
    output_path = Path(output_dir)
    with open(output_path / 'analysis.json', 'w') as f:
        json.dump(all_results, f, indent=2)

    print(f"\n✓ Screenshots and analysis saved to {output_dir}")
    print(f"✓ Analysis JSON: {output_path / 'analysis.json'}")

if __name__ == '__main__':
    asyncio.run(main())

#!/usr/bin/env python3
"""
Content Quality and E-E-A-T Audit for VisualRefiner
Analyzes HTML files for word count, E-E-A-T signals, and content quality
"""

import re
import json
from pathlib import Path
from html.parser import HTMLParser
from collections import defaultdict
import statistics

class ContentExtractor(HTMLParser):
    """Extract meaningful text content from HTML"""

    def __init__(self):
        super().__init__()
        self.content = []
        self.in_script = False
        self.in_style = False
        self.in_header = False
        self.in_footer = False

    def handle_starttag(self, tag, attrs):
        if tag in ['script', 'style']:
            self.in_script = True
        elif tag == 'header':
            self.in_header = True
        elif tag == 'footer':
            self.in_footer = True

    def handle_endtag(self, tag):
        if tag in ['script', 'style']:
            self.in_script = False
        elif tag == 'header':
            self.in_header = False
        elif tag == 'footer':
            self.in_footer = False

    def handle_data(self, data):
        if not (self.in_script or self.in_style or self.in_header or self.in_footer):
            text = data.strip()
            if text and not text.startswith('<!--'):
                self.content.append(text)

    def get_content(self):
        return ' '.join(self.content)


def extract_metadata(html_content):
    """Extract title, meta description, H1 from HTML"""
    title_match = re.search(r'<title>([^<]+)</title>', html_content)
    title = title_match.group(1) if title_match else ''

    meta_desc_match = re.search(r'<meta name="description" content="([^"]+)"', html_content)
    meta_desc = meta_desc_match.group(1) if meta_desc_match else ''

    h1_match = re.search(r'<h1[^>]*>([^<]+)</h1>', html_content)
    h1 = h1_match.group(1) if h1_match else ''

    canonical_match = re.search(r'<link rel="canonical" href="([^"]+)"', html_content)
    canonical = canonical_match.group(1) if canonical_match else ''

    return {
        'title': title,
        'meta_description': meta_desc,
        'h1': h1,
        'canonical': canonical
    }


def count_words(text):
    """Count words in text"""
    words = re.findall(r'\b\w+\b', text.lower())
    return len(words)


def analyze_eeat_signals(html_content, text_content, metadata):
    """Analyze E-E-A-T signals in content"""
    signals = {
        'experience': [],
        'expertise': [],
        'authoritativeness': [],
        'trustworthiness': []
    }

    # Experience signals
    experience_patterns = [
        r'\bI\b', r'\bwe\b', r'\bour\b', r'first-hand', r'tested',
        r'personally', r'tried', r'used'
    ]

    # Expertise signals (technical accuracy, format explanations)
    expertise_indicators = [
        'Canvas API', 'WebCodecs', 'browser', 'format', 'compression',
        'quality', 'lossy', 'lossless', 'HEIC', 'HEIF', 'WebP',
        'converts', 'decodes', 'efficiency'
    ]

    # Authoritativeness (external references, structured data)
    has_schema = 'schema.org' in html_content
    has_faq_schema = 'FAQPage' in html_content
    has_article_schema = 'Article' in html_content
    has_breadcrumbs = 'BreadcrumbList' in html_content

    # Trustworthiness signals
    trust_patterns = [
        r'privacy', r'stays on your device', r'not uploaded', r'local',
        r'browser', r'never leaves', r'free', r'no account', r'no upload',
        r'open-source', r'transparent'
    ]

    # Score experience (0-20)
    experience_count = sum(1 for p in experience_patterns
                          if re.search(p, text_content, re.IGNORECASE))
    signals['experience'] = min(experience_count * 2, 20)

    # Score expertise (0-25)
    expertise_count = sum(1 for term in expertise_indicators
                         if term.lower() in text_content.lower())
    signals['expertise'] = min(expertise_count * 2, 25)

    # Score authoritativeness (0-25)
    auth_score = 0
    if has_schema: auth_score += 5
    if has_faq_schema: auth_score += 5
    if has_article_schema: auth_score += 5
    if has_breadcrumbs: auth_score += 5
    if '/guides' in html_content: auth_score += 5
    signals['authoritativeness'] = min(auth_score, 25)

    # Score trustworthiness (0-30)
    trust_count = sum(1 for p in trust_patterns
                     if re.search(p, text_content, re.IGNORECASE))
    trust_score = trust_count * 3
    if 'privacy' in html_content.lower(): trust_score += 5
    if 'open-source' in html_content.lower(): trust_score += 5
    signals['trustworthiness'] = min(trust_score, 30)

    return signals


def calculate_eeat_score(signals):
    """Calculate overall E-E-A-T score (0-100)"""
    return signals['experience'] + signals['expertise'] + \
           signals['authoritativeness'] + signals['trustworthiness']


def assess_content_depth(word_count, page_type):
    """Assess if content meets minimum depth requirements"""
    minimums = {
        'homepage': 500,
        'tool': 800,
        'guide': 1500,
        'legal': 300,
        'about': 500
    }

    min_words = minimums.get(page_type, 500)
    meets_minimum = word_count >= min_words

    return {
        'meets_minimum': meets_minimum,
        'word_count': word_count,
        'minimum': min_words,
        'gap': min_words - word_count if not meets_minimum else 0
    }


def check_keyword_targeting(metadata, filename):
    """Check keyword targeting and intent match"""
    issues = []

    # Check title length (50-60 chars ideal)
    title_len = len(metadata['title'])
    if title_len < 30:
        issues.append(f"Title too short ({title_len} chars)")
    elif title_len > 70:
        issues.append(f"Title too long ({title_len} chars)")

    # Check meta description length (150-160 chars ideal)
    desc_len = len(metadata['meta_description'])
    if desc_len < 120:
        issues.append(f"Meta description too short ({desc_len} chars)")
    elif desc_len > 160:
        issues.append(f"Meta description too long ({desc_len} chars)")

    # Check H1 matches title concept
    if metadata['h1'] and metadata['title']:
        h1_lower = metadata['h1'].lower()
        title_lower = metadata['title'].lower()
        # Extract key terms
        h1_words = set(re.findall(r'\b\w+\b', h1_lower))
        title_words = set(re.findall(r'\b\w+\b', title_lower))
        overlap = h1_words & title_words
        if len(overlap) < 2:
            issues.append("H1 and title have poor keyword alignment")

    return issues


def calculate_readability_score(text):
    """Simple readability assessment (Flesch Reading Ease approximation)"""
    sentences = re.split(r'[.!?]+', text)
    sentence_count = len([s for s in sentences if s.strip()])

    words = re.findall(r'\b\w+\b', text)
    word_count = len(words)

    if sentence_count == 0 or word_count == 0:
        return 0

    avg_sentence_length = word_count / sentence_count

    # Syllable estimation (rough)
    syllable_count = sum(estimate_syllables(word) for word in words)
    avg_syllables = syllable_count / word_count if word_count > 0 else 0

    # Flesch Reading Ease = 206.835 - 1.015(words/sentences) - 84.6(syllables/words)
    score = 206.835 - (1.015 * avg_sentence_length) - (84.6 * avg_syllables)

    return max(0, min(100, score))


def estimate_syllables(word):
    """Rough syllable estimation"""
    word = word.lower()
    vowels = 'aeiouy'
    syllable_count = 0
    previous_was_vowel = False

    for char in word:
        is_vowel = char in vowels
        if is_vowel and not previous_was_vowel:
            syllable_count += 1
        previous_was_vowel = is_vowel

    # Adjust for silent e
    if word.endswith('e'):
        syllable_count -= 1

    return max(1, syllable_count)


def assess_ai_citation_readiness(html_content, text_content):
    """Assess readiness for AI citations and featured snippets"""
    score = 0

    # Structured data present
    if '"@context":"https://schema.org"' in html_content:
        score += 20

    # FAQ schema (highly citable)
    if '"@type":"FAQPage"' in html_content:
        score += 20

    # Clear headings structure
    h2_count = html_content.count('<h2')
    if h2_count >= 2:
        score += 15

    # Definition patterns (quotable facts)
    if re.search(r'\b(is the|is a|refers to|means)\b', text_content, re.IGNORECASE):
        score += 15

    # List structures (bullet points, numbered steps)
    if '<ol>' in html_content or '<ul>' in html_content:
        score += 15

    # Clear, concise answers
    if '<dl>' in html_content:  # Definition lists
        score += 15

    return min(100, score)


def categorize_page(filename):
    """Categorize page type based on filename"""
    if filename == 'index.html':
        return 'homepage'
    elif filename in ['about.html', 'privacy.html', 'terms.html', 'open-source.html']:
        return 'legal'
    elif filename.startswith('guides/'):
        return 'guide'
    elif filename in ['404.html', '_not-found.html', 'guides.html']:
        return 'other'
    else:
        return 'tool'


def analyze_file(file_path):
    """Perform comprehensive analysis on a single HTML file"""
    html_content = file_path.read_text(encoding='utf-8')

    # Extract metadata
    metadata = extract_metadata(html_content)

    # Extract main content
    extractor = ContentExtractor()
    extractor.feed(html_content)
    text_content = extractor.get_content()

    # Get relative filename
    rel_path = file_path.relative_to(file_path.parents[0])
    filename = str(rel_path)
    page_type = categorize_page(filename)

    # Perform analyses
    word_count = count_words(text_content)
    eeat_signals = analyze_eeat_signals(html_content, text_content, metadata)
    eeat_score = calculate_eeat_score(eeat_signals)
    depth_assessment = assess_content_depth(word_count, page_type)
    keyword_issues = check_keyword_targeting(metadata, filename)
    readability = calculate_readability_score(text_content)
    ai_readiness = assess_ai_citation_readiness(html_content, text_content)

    return {
        'filename': filename,
        'page_type': page_type,
        'metadata': metadata,
        'word_count': word_count,
        'eeat_signals': eeat_signals,
        'eeat_score': eeat_score,
        'depth_assessment': depth_assessment,
        'keyword_issues': keyword_issues,
        'readability_score': readability,
        'ai_citation_readiness': ai_readiness
    }


def generate_findings(results):
    """Generate structured findings from analysis results"""
    findings = {
        'summary': {},
        'critical_issues': [],
        'warnings': [],
        'recommendations': [],
        'page_details': []
    }

    # Calculate averages
    word_counts = [r['word_count'] for r in results]
    eeat_scores = [r['eeat_score'] for r in results]
    readability_scores = [r['readability_score'] for r in results]
    ai_readiness_scores = [r['ai_citation_readiness'] for r in results]

    findings['summary'] = {
        'total_pages': len(results),
        'avg_word_count': int(statistics.mean(word_counts)) if word_counts else 0,
        'avg_eeat_score': int(statistics.mean(eeat_scores)) if eeat_scores else 0,
        'avg_readability': int(statistics.mean(readability_scores)) if readability_scores else 0,
        'avg_ai_readiness': int(statistics.mean(ai_readiness_scores)) if ai_readiness_scores else 0
    }

    # Identify critical issues
    for result in results:
        page = result['filename']

        # Thin content
        if not result['depth_assessment']['meets_minimum']:
            findings['critical_issues'].append({
                'page': page,
                'type': 'THIN_CONTENT',
                'severity': 'HIGH',
                'message': f"Word count {result['word_count']} below minimum {result['depth_assessment']['minimum']} (gap: {result['depth_assessment']['gap']} words)"
            })

        # Poor E-E-A-T
        if result['eeat_score'] < 40:
            findings['warnings'].append({
                'page': page,
                'type': 'LOW_EEAT',
                'severity': 'MEDIUM',
                'message': f"E-E-A-T score {result['eeat_score']}/100 is below acceptable threshold"
            })

        # Low trust signals (YMYL-adjacent)
        if result['eeat_signals']['trustworthiness'] < 15:
            findings['warnings'].append({
                'page': page,
                'type': 'LOW_TRUST',
                'severity': 'MEDIUM',
                'message': f"Trust score {result['eeat_signals']['trustworthiness']}/30 insufficient for privacy-focused tool"
            })

        # Poor AI citation readiness
        if result['ai_citation_readiness'] < 50:
            findings['recommendations'].append({
                'page': page,
                'type': 'LOW_AI_READINESS',
                'message': f"AI citation score {result['ai_citation_readiness']}/100 - add more structured data and quotable facts"
            })

        # Keyword issues
        if result['keyword_issues']:
            for issue in result['keyword_issues']:
                findings['warnings'].append({
                    'page': page,
                    'type': 'KEYWORD_OPTIMIZATION',
                    'severity': 'LOW',
                    'message': issue
                })

    # Page-by-page details
    for result in results:
        findings['page_details'].append({
            'page': result['filename'],
            'type': result['page_type'],
            'word_count': result['word_count'],
            'eeat_score': result['eeat_score'],
            'eeat_breakdown': result['eeat_signals'],
            'readability': result['readability_score'],
            'ai_readiness': result['ai_citation_readiness'],
            'title': result['metadata']['title'],
            'h1': result['metadata']['h1'],
            'meets_minimum': result['depth_assessment']['meets_minimum']
        })

    return findings


def main():
    out_dir = Path('/Users/david/Desktop/david/Ship/visualrefiner/out')

    # Find all HTML files
    html_files = list(out_dir.rglob('*.html'))

    # Exclude special files
    excluded = ['404.html', '_not-found.html']
    html_files = [f for f in html_files if f.name not in excluded]

    print(f"Analyzing {len(html_files)} HTML files...\n")

    results = []
    for html_file in sorted(html_files):
        try:
            result = analyze_file(html_file)
            results.append(result)
            print(f"✓ {result['filename']}: {result['word_count']} words, E-E-A-T {result['eeat_score']}/100")
        except Exception as e:
            print(f"✗ {html_file.name}: Error - {e}")

    # Generate findings
    findings = generate_findings(results)

    # Output summary
    print(f"\n{'='*60}")
    print("CONTENT QUALITY AUDIT SUMMARY")
    print(f"{'='*60}")
    print(f"Total pages analyzed: {findings['summary']['total_pages']}")
    print(f"Average word count: {findings['summary']['avg_word_count']}")
    print(f"Average E-E-A-T score: {findings['summary']['avg_eeat_score']}/100")
    print(f"Average readability: {findings['summary']['avg_readability']}/100")
    print(f"Average AI readiness: {findings['summary']['avg_ai_readiness']}/100")
    print(f"\nCritical issues: {len(findings['critical_issues'])}")
    print(f"Warnings: {len(findings['warnings'])}")
    print(f"Recommendations: {len(findings['recommendations'])}")

    # Save detailed findings
    output_file = out_dir / 'content_audit_results.json'
    with open(output_file, 'w') as f:
        json.dump(findings, f, indent=2)

    print(f"\n✓ Detailed findings saved to: {output_file}")

    return findings


if __name__ == '__main__':
    main()

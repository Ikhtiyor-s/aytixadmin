"""
HTML Sanitization - XSS himoyasi
Barcha foydalanuvchi kiritgan HTML kontentni tozalash
"""
import bleach

# Ruxsat etilgan HTML teglar
ALLOWED_TAGS = [
    'p', 'br', 'strong', 'em', 'u', 'b', 'i',
    'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
    'ul', 'ol', 'li',
    'a', 'img',
    'blockquote', 'code', 'pre',
    'table', 'thead', 'tbody', 'tr', 'th', 'td',
    'span', 'div', 'hr',
]

# Ruxsat etilgan HTML atributlar
ALLOWED_ATTRIBUTES = {
    'a': ['href', 'title', 'target', 'rel'],
    'img': ['src', 'alt', 'width', 'height'],
    'span': ['class'],
    'div': ['class'],
    'td': ['colspan', 'rowspan'],
    'th': ['colspan', 'rowspan'],
}

# Ruxsat etilgan protokollar
ALLOWED_PROTOCOLS = ['http', 'https', 'mailto']


def sanitize_html(html_content: str) -> str:
    """
    HTML kontentni XSS dan tozalash.
    Faqat xavfsiz teglar va atributlarni qoldiradi.
    """
    if not html_content:
        return html_content

    return bleach.clean(
        html_content,
        tags=ALLOWED_TAGS,
        attributes=ALLOWED_ATTRIBUTES,
        protocols=ALLOWED_PROTOCOLS,
        strip=True,
    )


def sanitize_text(text: str) -> str:
    """Oddiy textdan barcha HTML teglarni olib tashlash."""
    if not text:
        return text
    return bleach.clean(text, tags=[], strip=True)

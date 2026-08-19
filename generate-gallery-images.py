#!/usr/bin/env python3
"""
Generate 15 sample gallery images for Sovereign Prints
Each image represents a different printing service/category
"""

from PIL import Image, ImageDraw, ImageFont
import os
from datetime import datetime

# Create output directory
os.makedirs('gallery_images', exist_ok=True)

# Gallery items to create
gallery_items = [
    {
        'title': 'T-Shirt Branding',
        'category': 'Clothing',
        'description': 'Custom branded t-shirts for team events and promotions',
        'color': '#FF6B6B',
        'icon': '👕'
    },
    {
        'title': 'Business Card Design',
        'category': 'Printing',
        'description': 'Professional business cards with premium finishes',
        'color': '#4ECDC4',
        'icon': '💼'
    },
    {
        'title': 'Vehicle Branding',
        'category': 'Vehicle Branding',
        'description': 'Complete vehicle wrap and graphics design',
        'color': '#45B7D1',
        'icon': '🚗'
    },
    {
        'title': 'Signage & Displays',
        'category': 'Signage',
        'description': 'Custom storefront and promotional signage',
        'color': '#96CEB4',
        'icon': '🏪'
    },
    {
        'title': 'Promotional Merchandise',
        'category': 'Promotional Items',
        'description': 'Branded pens, mugs, and promotional products',
        'color': '#FFEAA7',
        'icon': '🎁'
    },
    {
        'title': 'Logo Design & Branding',
        'category': 'Custom',
        'description': 'Complete brand identity and logo design packages',
        'color': '#DDA15E',
        'icon': '✨'
    },
    {
        'title': 'Product Packaging',
        'category': 'Printing',
        'description': 'Custom boxes and packaging design for products',
        'color': '#BC6C25',
        'icon': '📦'
    },
    {
        'title': 'Event Banners',
        'category': 'Signage',
        'description': 'Large format banners for conferences and events',
        'color': '#A8E6CF',
        'icon': '📋'
    },
    {
        'title': 'Custom Labels',
        'category': 'Printing',
        'description': 'Product labels and sticker design services',
        'color': '#FF8B94',
        'icon': '🏷️'
    },
    {
        'title': 'Flyer Design & Printing',
        'category': 'Printing',
        'description': 'Eye-catching flyers for marketing campaigns',
        'color': '#C1B1FF',
        'icon': '📄'
    },
    {
        'title': 'Polo Shirt Embroidery',
        'category': 'Clothing',
        'description': 'Professional embroidered corporate wear',
        'color': '#FFB4C2',
        'icon': '🧥'
    },
    {
        'title': 'Custom Posters',
        'category': 'Signage',
        'description': 'Premium poster printing and framing options',
        'color': '#CAFFBF',
        'icon': '🖼️'
    },
    {
        'title': 'Die-Cut Stickers',
        'category': 'Printing',
        'description': 'Custom shaped stickers and decals',
        'color': '#FFD6A5',
        'icon': '🎨'
    },
    {
        'title': 'Corporate Branding',
        'category': 'Custom',
        'description': 'Complete corporate identity and brand guidelines',
        'color': '#9D84B7',
        'icon': '🏢'
    },
    {
        'title': 'Event Merchandise',
        'category': 'Promotional Items',
        'description': 'Custom merchandise for conferences and trade shows',
        'color': '#FFC2E2',
        'icon': '🎪'
    }
]

def create_gallery_image(item, index):
    """Create a sample gallery image"""
    width, height = 800, 600

    # Create image with gradient background
    img = Image.new('RGB', (width, height), color='white')
    draw = ImageDraw.Draw(img)

    # Create gradient effect (simulate with rectangles)
    color = item['color']
    # Convert hex to RGB
    rgb = tuple(int(color.lstrip('#')[i:i+2], 16) for i in (0, 2, 4))

    # Draw gradient background
    for y in range(height // 2):
        ratio = y / (height // 2)
        r = int(rgb[0] * (1 - ratio * 0.3))
        g = int(rgb[1] * (1 - ratio * 0.3))
        b = int(rgb[2] * (1 - ratio * 0.3))
        draw.rectangle([(0, y), (width, y+1)], fill=(r, g, b))

    # Lower half with lighter version
    for y in range(height // 2, height):
        ratio = (y - height // 2) / (height // 2)
        r = int(rgb[0] * (0.7 + ratio * 0.3))
        g = int(rgb[1] * (0.7 + ratio * 0.3))
        b = int(rgb[2] * (0.7 + ratio * 0.3))
        draw.rectangle([(0, y), (width, y+1)], fill=(r, g, b))

    # Draw decorative elements
    # Top accent bar
    draw.rectangle([(0, 0), (width, 60)], fill=rgb)

    # Draw icon (emoji as text)
    try:
        icon_font = ImageFont.load_default()
        # Approximate position for emoji
        draw.text((width // 2 - 40, 80), item['icon'], fill='white', font=icon_font)
    except:
        pass

    # Draw title
    try:
        title_font = ImageFont.load_default()
        # Approximate centering
        draw.text((50, 200), item['title'], fill='white', font=title_font)
    except:
        pass

    # Draw description
    desc_lines = item['description'].split(' ')
    line1 = ' '.join(desc_lines[:4])
    line2 = ' '.join(desc_lines[4:]) if len(desc_lines) > 4 else ''

    try:
        desc_font = ImageFont.load_default()
        draw.text((50, 300), line1, fill='rgba(255,255,255,0.8)', font=desc_font)
        if line2:
            draw.text((50, 330), line2, fill='rgba(255,255,255,0.8)', font=desc_font)
    except:
        pass

    # Draw category badge
    try:
        draw.rectangle([(50, 480), (300, 530)], fill=(255, 255, 255, 100))
        badge_font = ImageFont.load_default()
        draw.text((70, 495), item['category'], fill=rgb, font=badge_font)
    except:
        pass

    # Save image
    filename = f"gallery_images/gallery-{index:02d}-{item['category'].lower().replace(' ', '-')}.png"
    img.save(filename)
    print(f"✓ Created: {filename}")
    return filename

def create_gallery_json(items):
    """Create gallery.json file"""
    import json

    gallery = []
    for idx, item in enumerate(items, 1):
        gallery.append({
            'id': int(f"{idx}{int(datetime.now().timestamp()) % 10000}"),
            'title': item['title'],
            'category': item['category'],
            'description': item['description'],
            'imageUrl': f"/uploads/gallery-{idx:02d}-{item['category'].lower().replace(' ', '-')}.png",
            'order': idx,
            'active': True,
            'createdAt': datetime.now().isoformat()
        })

    with open('gallery.json', 'w') as f:
        json.dump(gallery, f, indent=2)

    print(f"\n✓ Created: gallery.json with {len(gallery)} items")

if __name__ == '__main__':
    print("Generating Sovereign Prints Gallery Images...")
    print(f"Creating {len(gallery_items)} sample images...\n")

    for idx, item in enumerate(gallery_items, 1):
        create_gallery_image(item, idx)

    create_gallery_json(gallery_items)

    print("\n✅ Gallery generation complete!")
    print("Files ready to integrate into Sovereign Prints website")

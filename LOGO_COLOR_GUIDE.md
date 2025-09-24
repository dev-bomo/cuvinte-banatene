# Logo Color Integration Guide

## Current Logo Integration

The logo has been added to all relevant places:

- ✅ Header (with text)
- ✅ Homepage (large, centered)
- ✅ Login page (centered above title)
- ✅ Registration page (centered above title)

## Color Scheme Customization

To match your logo's colors, update the CSS variables in `frontend/src/index.css`:

### Step 1: Identify Your Logo Colors

Look at your logo and identify the 2-3 main colors. For example:

- Primary color (main color)
- Secondary color (accent color)
- Optional: Accent color (highlight)

### Step 2: Update CSS Variables

In `frontend/src/index.css`, find the `:root` section and update these variables:

```css
:root {
  --primary-color: #YOUR_MAIN_COLOR; /* Replace with your logo's main color */
  --secondary-color: #YOUR_ACCENT_COLOR; /* Replace with your logo's accent color */
  --accent-color: #YOUR_HIGHLIGHT_COLOR; /* Replace with your logo's highlight color */
  --text-dark: #1a0f0a; /* Keep dark for readability */
  --text-light: #fff8dc; /* Keep light for contrast */
  --background-light: #fff8dc; /* Keep light for cards */
  --shadow-color: rgba(
    YOUR_R,
    YOUR_G,
    YOUR_B,
    0.3
  ); /* Use your primary color */
}
```

### Step 3: Replace Color References

After updating the variables, replace all hardcoded colors in the CSS with the variables:

- `#8b4513` → `var(--primary-color)`
- `#cd853f` → `var(--secondary-color)`
- `#deb887` → `var(--accent-color)`
- `#1a0f0a` → `var(--text-dark)`
- `#fff8dc` → `var(--text-light)`

### Example Color Schemes

**If your logo has blue and gold:**

```css
--primary-color: #1e3a8a; /* Deep blue */
--secondary-color: #f59e0b; /* Gold */
--accent-color: #fbbf24; /* Light gold */
```

**If your logo has green and brown:**

```css
--primary-color: #166534; /* Forest green */
--secondary-color: #8b4513; /* Saddle brown */
--accent-color: #a3a3a3; /* Light gray */
```

**If your logo has red and cream:**

```css
--primary-color: #dc2626; /* Red */
--secondary-color: #f5f5dc; /* Cream */
--accent-color: #fef3c7; /* Light cream */
```

## Logo Sizing

The logos are currently sized as:

- Header: 50px height
- Homepage: 120px height
- Login/Register: 80px height

To adjust sizes, modify these CSS classes:

- `.logo-image` (header)
- `.homepage-logo-image` (homepage)
- `.login-logo-image` (login page)
- `.register-logo-image` (register page)

## Testing

After making changes:

1. Save the CSS file
2. Refresh your browser
3. Check all pages to ensure colors work well
4. Adjust contrast if needed for readability

The color scheme will automatically update across the entire website when you change the CSS variables!


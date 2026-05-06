# 🎨 Online Education Platform - UI Design System

Complete design system for the Online Education Platform featuring colors, typography, spacing, components, and accessibility guidelines.

---

## 📑 Table of Contents

1. [Overview](#overview)
2. [Design Tokens](#design-tokens)
3. [Color System](#color-system)
4. [Typography](#typography)
5. [Spacing & Layout](#spacing--layout)
6. [Components](#components)
7. [Component Examples](#component-examples)
8. [Accessibility](#accessibility)
9. [Best Practices](#best-practices)

---

## 🎯 Overview

This design system ensures **consistency, accessibility, and maintainability** across the Online Education Platform. It's built on:

- **Material Design 3** principles
- **8px Grid System** for spacing
- **Semantic Color Palette** for clarity
- **Component-based Architecture** with React
- **WCAG AA Accessibility** compliance

### Core Values

✅ **Consistency** - Unified design language across all pages
✅ **Accessibility** - Inclusive design for all users
✅ **Scalability** - Easy to extend and maintain
✅ **Performance** - Optimized for web

---

## 🎨 Design Tokens

All design values are centralized in `design-system/tokens.js`:

```javascript
import { designTokens } from './design-system/tokens';

// Access any design value
const primaryColor = designTokens.colors.primary[500];
const spacing = designTokens.spacing[4];
const typography = designTokens.typography.fontSize.lg;
```

### Token Categories

- **Colors** - Complete color palette with semantic naming
- **Typography** - Font families, sizes, weights, line heights
- **Spacing** - 8px-based grid system
- **Shadows** - Elevation-based shadow hierarchy
- **Breakpoints** - Responsive design breakpoints
- **Border Radius** - Standardized corner rounding
- **Transitions** - Animation timing and easing
- **Z-Index** - Layering scale
- **Sizes** - Component-specific dimensions

---

## 🎨 Color System

### Color Palette Structure

Each color comes in 10 shades (50-900) for maximum flexibility:

```
primary: {
  50: '#E3F2FD',    // Lightest (backgrounds)
  500: '#2196F3',   // Main color
  900: '#0D47A1',   // Darkest (text on light)
}
```

### Primary Colors

**Primary (Educational Blue)** - Main brand color
- Used for: Primary actions, links, active states
- Main shade: `#2196F3` (primary[500])

**Secondary (Teal)** - Accent color
- Used for: Secondary actions, highlights
- Main shade: `#009688` (secondary[500])

### Status Colors

**Success (Green)** - Positive feedback
- Approvals, confirmations, successful operations
- Main shade: `#4CAF50` (success[500])

**Warning (Orange)** - Cautions & alerts
- Pending states, attention-required messages
- Main shade: `#FF9800` (warning[500])

**Error (Red)** - Errors & destructive actions
- Form validation, errors, deletions
- Main shade: `#F44336` (error[500])

**Info (Light Blue)** - Informational messages
- Helpful hints, information
- Main shade: `#03A9F4` (info[500])

### Semantic Colors

```javascript
designTokens.colors.text = {
  primary: '#111827',      // Main text
  secondary: '#4B5563',    // Secondary text
  disabled: '#9CA3AF',     // Disabled/placeholder
  inverse: '#FFFFFF',      // Text on dark
}

designTokens.colors.background = {
  primary: '#FFFFFF',      // Main background
  secondary: '#F9FAFB',    // Secondary bg
  tertiary: '#F3F4F6',     // Tertiary bg
}

designTokens.colors.border = {
  light: '#E5E7EB',
  medium: '#D1D5DB',
  dark: '#9CA3AF',
}
```

### Using Colors

```javascript
import { designTokens } from './design-system/tokens';

const style = {
  color: designTokens.colors.text.primary,
  backgroundColor: designTokens.colors.primary[100],
  borderColor: designTokens.colors.border.light,
};
```

---

## ✍️ Typography

### Font Families

- **Primary** (UI): `Inter`, `Segoe UI`, `Roboto`
- **Mono** (Code): `Fira Code`, `Courier New`

### Font Sizes

```
xs: 12px      | Small labels, captions
sm: 14px      | Secondary text
base: 16px    | Body text
lg: 18px      | Large body
xl: 20px      | Small headings
2xl: 24px     | Headings
3xl: 28px     | Large headings
4xl: 32px     | Extra large headings
5xl: 36px     | Hero text
```

### Font Weights

```
light: 300         | Rare, elegant text
normal: 400        | Body text (default)
medium: 500        | Labels, emphasis
semibold: 600      | Subheadings
bold: 700          | Headings
extrabold: 800     | Hero text
```

### Heading Styles

```javascript
// Predefined heading styles
designTokens.typography.heading.h1  // 36px, bold
designTokens.typography.heading.h2  // 28px, bold
designTokens.typography.heading.h3  // 24px, semibold
designTokens.typography.heading.h4  // 20px, semibold
// ... h5, h6
```

### Body Text Styles

```javascript
designTokens.typography.body.large   // 16px
designTokens.typography.body.medium  // 14px
designTokens.typography.body.small   // 12px
```

### Usage Example

```javascript
const styles = {
  heading: designTokens.typography.heading.h2,
  body: designTokens.typography.body.medium,
};

// Result: { fontSize: '28px', fontWeight: 700, ... }
```

---

## 📏 Spacing & Layout

### 8px Grid System

All spacing uses multiples of 8px for perfect alignment and consistency:

```
0: 0px
1: 4px
2: 8px
3: 12px
4: 16px
5: 20px
6: 24px
8: 32px
10: 40px
12: 48px
16: 64px
... and more
```

### Spacing Categories

```javascript
// Padding
designTokens.spacing.padding = {
  xs: '8px',
  sm: '12px',
  md: '16px',
  lg: '24px',
  xl: '32px',
}

// Margin
designTokens.spacing.margin = {
  xs: '4px',
  sm: '8px',
  md: '16px',
  lg: '24px',
  xl: '32px',
}

// Gap (flexbox)
designTokens.spacing.gap = {
  xs: '8px',
  sm: '12px',
  md: '16px',
  lg: '24px',
}
```

### Layout Rules

1. **Padding** inside components: Use `padding` values
2. **Margins** between elements: Use `margin` values
3. **Gaps** in flex containers: Use `gap` values
4. **Minimum touch target**: 40px × 40px (mobile friendly)
5. **Vertical rhythm**: Maintain consistent line heights

---

## 🧩 Components

### Available Components

#### Button
Primary action component with multiple variants.

**Props:**
- `variant`: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'success'
- `size`: 'sm' | 'md' | 'lg'
- `disabled`: boolean
- `loading`: boolean
- `icon`: ReactNode
- `iconPosition`: 'left' | 'right'
- `fullWidth`: boolean

**File:** `components/Button.jsx`

---

#### Input
Text input field with validation and icons.

**Props:**
- `label`: string
- `error`: string
- `hint`: string
- `size`: 'sm' | 'md' | 'lg'
- `disabled`: boolean
- `icon`: ReactNode
- `iconPosition`: 'left' | 'right'
- `type`: HTML input type

**File:** `components/Input.jsx`

---

#### Card
Container component for grouping content.

**Props:**
- `variant`: 'default' | 'elevated' | 'outline' | 'filled'
- `hoverable`: boolean
- `interactive`: boolean

**Subcomponents:**
- `Card.Header` - Card header section
- `Card.Body` - Main content area
- `Card.Footer` - Footer section

**File:** `components/Card.jsx`

---

#### Badge
Small label/status indicator.

**Props:**
- `variant`: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info' | 'neutral'
- `size`: 'sm' | 'md' | 'lg'
- `rounded`: boolean

**File:** `components/Badge.jsx`

---

#### Alert
Display messages with severity levels.

**Props:**
- `variant`: 'success' | 'error' | 'warning' | 'info'
- `title`: string
- `closeable`: boolean
- `onClose`: function
- `icon`: ReactNode

**File:** `components/Alert.jsx`

---

#### Avatar
User profile image or initials display.

**Props:**
- `src`: string (image URL)
- `alt`: string
- `initials`: string (fallback)
- `size`: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
- `variant`: 'circle' | 'square'
- `status`: 'online' | 'offline' | 'away'

**File:** `components/Avatar.jsx`

---

#### Modal
Dialog overlay component.

**Props:**
- `isOpen`: boolean (required)
- `onClose`: function (required)
- `title`: string
- `size`: 'sm' | 'md' | 'lg' | 'xl'
- `closeButton`: boolean

**Subcomponents:**
- `Modal.Footer` - Footer with actions

**File:** `components/Modal.jsx`

---

## 💡 Component Examples

### Button Examples

```jsx
import { Button } from './components';

// Primary button
<Button variant="primary" size="md">Submit</Button>

// Outline button
<Button variant="outline" icon={<Icon />}>Click me</Button>

// Danger button
<Button variant="danger" size="lg" fullWidth>Delete</Button>

// Loading state
<Button loading>Processing...</Button>
```

---

### Input Examples

```jsx
import { Input } from './components';

// Basic input
<Input placeholder="Enter email" type="email" />

// Input with label and error
<Input 
  label="Password"
  type="password"
  error="Password required"
/>

// Input with hint
<Input 
  label="Username"
  hint="3-20 characters"
/>

// Input with icon
<Input 
  icon={<SearchIcon />}
  placeholder="Search..."
/>
```

---

### Card Examples

```jsx
import { Card } from './components';

// Basic card
<Card>
  <Card.Header>Course Title</Card.Header>
  <Card.Body>Course description...</Card.Body>
</Card>

// Hoverable card
<Card hoverable interactive>
  <Card.Body>Click to view details</Card.Body>
</Card>

// Card with footer
<Card>
  <Card.Header>Assignment Details</Card.Header>
  <Card.Body>Due date: May 10, 2026</Card.Body>
  <Card.Footer>
    <Button>Download</Button>
    <Button variant="primary">Submit</Button>
  </Card.Footer>
</Card>
```

---

### Badge Examples

```jsx
import { Badge } from './components';

// Status badges
<Badge variant="success">Completed</Badge>
<Badge variant="warning">Pending</Badge>
<Badge variant="error">Failed</Badge>

// Different sizes
<Badge size="sm">New</Badge>
<Badge size="md">In Progress</Badge>
<Badge size="lg">Important</Badge>
```

---

### Alert Examples

```jsx
import { Alert } from './components';

// Success alert
<Alert variant="success" title="Success!">
  Your course has been registered.
</Alert>

// Error alert with close button
<Alert 
  variant="error" 
  title="Error"
  closeable
  onClose={() => console.log('closed')}
>
  Failed to submit assignment. Please try again.
</Alert>

// Warning alert
<Alert variant="warning" title="Warning">
  Your session is about to expire.
</Alert>
```

---

### Avatar Examples

```jsx
import { Avatar } from './components';

// Avatar with image
<Avatar src="user.jpg" alt="John Doe" />

// Avatar with initials
<Avatar initials="JD" />

// Avatar with status
<Avatar src="user.jpg" status="online" />

// Different sizes
<Avatar size="sm" initials="AB" />
<Avatar size="lg" src="user.jpg" />
```

---

### Modal Examples

```jsx
import { Modal, Button } from './components';
import { useState } from 'react';

function ConfirmModal() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>Open Modal</Button>
      
      <Modal 
        isOpen={isOpen} 
        onClose={() => setIsOpen(false)}
        title="Confirm Action"
      >
        <p>Are you sure you want to proceed?</p>
        
        <Modal.Footer>
          <Button variant="ghost" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={() => setIsOpen(false)}>
            Confirm
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
```

---

## ♿ Accessibility

### WCAG 2.1 AA Compliance

All components follow Web Content Accessibility Guidelines:

- ✅ **Keyboard Navigation** - All interactive elements are keyboard accessible
- ✅ **Screen Readers** - Proper ARIA labels and semantic HTML
- ✅ **Color Contrast** - All text meets WCAG AA standards (4.5:1)
- ✅ **Focus Management** - Clear focus indicators
- ✅ **Motion** - Reduced motion support

### Accessibility Checklist

When using components:

1. **Use semantic HTML** - Use proper heading hierarchy
2. **Add labels** - Form inputs must have associated labels
3. **Use ARIA** - Add `role`, `aria-label` when needed
4. **Test keyboard** - Ensure Tab key navigation works
5. **Color alone** - Don't rely on color to convey meaning
6. **Focus visible** - Always show focus indicators

### Examples

```jsx
// ✅ Good
<Input 
  label="Email Address"
  type="email"
  placeholder="you@example.com"
/>

// ❌ Bad
<input type="email" placeholder="Email" />

// ✅ Good
<Button aria-label="Close dialog" onClick={onClose}>
  ✕
</Button>

// ✅ Good - Using Badge with label
<div>
  <Badge variant="success" aria-label="Status: Approved">
    Approved
  </Badge>
</div>
```

---

## 🎯 Best Practices

### 1. Use Design Tokens

**Always use tokens instead of hardcoding values:**

```jsx
// ✅ Good
import { designTokens } from './design-system/tokens';

const style = {
  color: designTokens.colors.primary[500],
  padding: designTokens.spacing[4],
};

// ❌ Bad
const style = {
  color: '#2196F3',
  padding: '16px',
};
```

---

### 2. Maintain Color Hierarchy

```jsx
// ✅ Good - Clear visual hierarchy
<div>
  <h1 style={{ color: colors.text.primary }}>Main Title</h1>
  <p style={{ color: colors.text.secondary }}>Description</p>
  <span style={{ color: colors.text.disabled }}>Additional info</span>
</div>
```

---

### 3. Consistent Spacing

```jsx
// ✅ Good - Consistent spacing
<div style={{ display: 'flex', gap: spacing[4] }}>
  <Button>Action 1</Button>
  <Button>Action 2</Button>
</div>

// ❌ Bad - Inconsistent spacing
<div>
  <Button style={{ marginRight: '12px' }}>Action 1</Button>
  <Button style={{ marginRight: '8px' }}>Action 2</Button>
</div>
```

---

### 4. Responsive Design

Use breakpoints for responsive layouts:

```jsx
import { designTokens } from './design-system/tokens';

const { breakpoints } = designTokens;

const styles = {
  container: {
    padding: spacing[4],
    [`@media (min-width: ${breakpoints.md})`]: {
      padding: spacing[8],
    },
  },
};
```

---

### 5. Component Composition

Build complex UIs by composing simple components:

```jsx
// ✅ Good - Composed components
<Card variant="elevated">
  <Card.Header>Course Progress</Card.Header>
  <Card.Body>
    <Alert variant="success" title="Great job!">
      You've completed 80% of the course.
    </Alert>
  </Card.Body>
  <Card.Footer>
    <Button variant="primary">Continue Learning</Button>
  </Card.Footer>
</Card>
```

---

### 6. Dark Mode Support

Design system supports dark mode. Future extension point:

```jsx
// Future: Dark mode support
const isDarkMode = useTheme().isDark;

const bgColor = isDarkMode 
  ? colors.neutral[900] 
  : colors.background.primary;
```

---

## 📋 File Structure

```
frontend/src/
├── design-system/
│   ├── colors.js           # Color palette
│   ├── typography.js       # Font system
│   ├── spacing.js          # Spacing scale
│   ├── shadows.js          # Shadow system
│   └── tokens.js           # Central token export
├── components/
│   ├── Button.jsx          # Button component
│   ├── Input.jsx           # Input component
│   ├── Card.jsx            # Card component
│   ├── Badge.jsx           # Badge component
│   ├── Alert.jsx           # Alert component
│   ├── Avatar.jsx          # Avatar component
│   ├── Modal.jsx           # Modal component
│   └── index.js            # Component exports
└── App.jsx                 # Main app (using components)
```

---

## 🚀 Getting Started

### Installation

1. **Copy design system files** to your project
2. **Install peer dependencies** (if needed)
3. **Import components** in your application

### Basic Usage

```jsx
import {
  Button,
  Input,
  Card,
  Badge,
  Alert,
  Avatar,
  Modal,
  designTokens,
} from './components';

function App() {
  return (
    <Card>
      <Card.Header>Welcome to the Platform</Card.Header>
      <Card.Body>
        <Input placeholder="Enter your name" />
        <Button variant="primary">Get Started</Button>
      </Card.Body>
    </Card>
  );
}
```

---

## 📖 Additional Resources

- **Material Design 3**: https://m3.material.io/
- **WCAG Guidelines**: https://www.w3.org/WAI/WCAG21/quickref/
- **React Props**: All components use React.forwardRef for ref access
- **CSS-in-JS**: Components use inline styles; feel free to adapt to CSS Modules or Tailwind

---

## ✅ Component Checklist

When creating new components, ensure:

- [ ] Uses design tokens (colors, spacing, typography)
- [ ] Supports all required variants
- [ ] Includes proper PropTypes
- [ ] Has JSDoc documentation
- [ ] Implements accessibility features (ARIA, keyboard nav)
- [ ] Follows naming conventions
- [ ] Works responsively
- [ ] Has example usage

---

## 🤝 Contributing

To extend this design system:

1. Add new token to relevant file (`colors.js`, `spacing.js`, etc.)
2. Update `tokens.js` to export new token
3. Create new component following existing patterns
4. Add to `components/index.js`
5. Document in this file
6. Test accessibility

---

## 📞 Support

For questions or suggestions about this design system, please reach out to the development team.

---

**Design System Version:** 1.0.0
**Last Updated:** May 5, 2026
**Status:** ✅ Ready for Production

---

Made with ❤️ for the Online Education Platform

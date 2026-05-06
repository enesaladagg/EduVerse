# UI Design System - Implementation Guide

## 📚 Quick Start

### Installation

1. **Design tokens** are in `/design-system/` folder
2. **Components** are in `/components/` folder
3. **Examples** are in `DesignSystemShowcase.jsx`

### Usage

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

function MyPage() {
  return (
    <Card>
      <Card.Header>Welcome</Card.Header>
      <Card.Body>
        <Input label="Name" placeholder="John Doe" />
        <Button variant="primary">Submit</Button>
      </Card.Body>
    </Card>
  );
}
```

---

## 📂 File Structure

```
frontend/
├── src/
│   ├── design-system/
│   │   ├── colors.js              # Color definitions
│   │   ├── typography.js          # Font system
│   │   ├── spacing.js             # Spacing scale
│   │   ├── shadows.js             # Shadow elevations
│   │   ├── tokens.js              # Central token export
│   │   └── DESIGN_GUIDE.md        # Full documentation
│   │
│   ├── components/
│   │   ├── Button.jsx             # Button component
│   │   ├── Input.jsx              # Input component
│   │   ├── Card.jsx               # Card component
│   │   ├── Badge.jsx              # Badge component
│   │   ├── Alert.jsx              # Alert component
│   │   ├── Avatar.jsx             # Avatar component
│   │   ├── Modal.jsx              # Modal component
│   │   └── index.js               # Component exports
│   │
│   ├── DesignSystemShowcase.jsx   # Component examples
│   └── App.jsx                    # Main application
│
└── tailwind.config.js             # Tailwind config
```

---

## 🎨 Color System

### Primary Colors

| Name      | Usage | Main Shade |
|-----------|-------|-----------|
| Primary   | Brand, main actions | #2196F3 |
| Secondary | Accent, secondary actions | #009688 |
| Success   | Confirmations, completed | #4CAF50 |
| Warning   | Alerts, pending | #FF9800 |
| Error     | Errors, deletion | #F44336 |
| Info      | Information, hints | #03A9F4 |

### Accessing Colors

```jsx
import { designTokens } from './design-system/tokens';

// Primary color - all shades
designTokens.colors.primary[50]     // Lightest
designTokens.colors.primary[500]    // Main
designTokens.colors.primary[900]    // Darkest

// Semantic colors
designTokens.colors.text.primary    // Main text
designTokens.colors.background.secondary  // Secondary bg
designTokens.colors.border.light    // Light border
```

---

## 📏 Spacing System

8px-based grid system:

```javascript
// Spacing tokens
designTokens.spacing[2]  → 8px
designTokens.spacing[4]  → 16px
designTokens.spacing[6]  → 24px
designTokens.spacing[8]  → 32px

// Semantic spacing
designTokens.spacing.padding.md    → 16px
designTokens.spacing.margin.lg     → 24px
designTokens.spacing.gap.xl        → 32px
```

---

## ✍️ Typography System

### Font Sizes

```javascript
xs   → 12px
sm   → 14px
base → 16px
lg   → 18px
xl   → 20px
2xl  → 24px
3xl  → 28px
4xl  → 32px
5xl  → 36px
```

### Predefined Styles

```javascript
// Headings
designTokens.typography.heading.h1    // 36px, bold
designTokens.typography.heading.h2    // 28px, bold
designTokens.typography.heading.h3    // 24px, semibold

// Body text
designTokens.typography.body.large    // 16px
designTokens.typography.body.medium   // 14px
designTokens.typography.body.small    // 12px

// Labels
designTokens.typography.label.large   // 14px
designTokens.typography.label.medium  // 12px
```

---

## 🧩 Components

### Button

```jsx
// Primary
<Button variant="primary" size="md">Click</Button>

// Variants: primary, secondary, outline, ghost, success, danger
<Button variant="secondary">Click</Button>

// Sizes: sm, md, lg
<Button size="lg">Large Button</Button>

// With icon
<Button icon={<Icon />} iconPosition="left">Text</Button>

// Full width & disabled
<Button fullWidth disabled>Disabled</Button>
```

---

### Input

```jsx
// Basic
<Input placeholder="Enter text" />

// With label
<Input label="Email" type="email" />

// With error
<Input label="Password" error="Password required" />

// With hint
<Input label="Username" hint="3-20 characters" />

// With icon
<Input icon={<SearchIcon />} placeholder="Search" />

// Disabled
<Input disabled />
```

---

### Card

```jsx
// Basic card
<Card>
  <Card.Header>Title</Card.Header>
  <Card.Body>Content</Card.Body>
</Card>

// Variants: default, elevated, outline, filled
<Card variant="elevated">Content</Card>

// Hoverable
<Card hoverable interactive>Click me</Card>

// With footer
<Card>
  <Card.Header>Header</Card.Header>
  <Card.Body>Content</Card.Body>
  <Card.Footer>
    <Button>Action</Button>
  </Card.Footer>
</Card>
```

---

### Badge

```jsx
// Variants
<Badge variant="primary">Primary</Badge>
<Badge variant="success">Success</Badge>
<Badge variant="warning">Warning</Badge>
<Badge variant="error">Error</Badge>
<Badge variant="info">Info</Badge>

// Sizes
<Badge size="sm">Small</Badge>
<Badge size="md">Medium</Badge>
<Badge size="lg">Large</Badge>

// Square (not rounded)
<Badge rounded={false}>Square</Badge>
```

---

### Alert

```jsx
// Variants
<Alert variant="success">Success message</Alert>
<Alert variant="error" title="Error">Error details</Alert>
<Alert variant="warning" closeable>Warning message</Alert>
<Alert variant="info" title="Info">Information</Alert>

// With callback
<Alert 
  variant="success"
  closeable
  onClose={() => console.log('closed')}
>
  Message
</Alert>
```

---

### Avatar

```jsx
// With image
<Avatar src="user.jpg" alt="John" />

// With initials
<Avatar initials="JD" />

// Status indicators
<Avatar initials="AB" status="online" />
<Avatar initials="CD" status="offline" />
<Avatar initials="EF" status="away" />

// Sizes
<Avatar size="xs" initials="A" />
<Avatar size="sm" initials="B" />
<Avatar size="md" initials="C" />
<Avatar size="lg" initials="D" />
<Avatar size="xl" initials="E" />

// Variants
<Avatar variant="circle" initials="AB" />  {/* rounded */}
<Avatar variant="square" initials="CD" />  {/* square */}
```

---

### Modal

```jsx
import { useState } from 'react';

function MyComponent() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>Open</Button>
      
      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Dialog Title"
        size="md"  // sm, md, lg, xl
        closeButton={true}
      >
        <p>Content here</p>
        
        <Modal.Footer>
          <Button variant="ghost" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button variant="primary">
            Confirm
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
```

---

## 🎨 Using with Tailwind CSS

The design system is integrated with Tailwind CSS. All tokens are available as Tailwind utilities:

```jsx
// Colors
<div className="bg-primary-500 text-text-primary">
  Tailwind classes using design system colors
</div>

// Spacing
<div className="p-6 gap-4 mb-8">
  Padding, gap, margin using design tokens
</div>

// Typography
<div className="text-lg font-semibold">
  Font sizes and weights
</div>

// Border radius
<div className="rounded-lg shadow-md">
  Border radius and shadows
</div>
```

---

## 🎯 Real-World Example: Course Registration Page

```jsx
import { useState } from 'react';
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

function CourseRegistration() {
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(null);

  const handleRegister = () => {
    // Validation logic
    if (!email || !password) {
      setError('All fields are required');
      return;
    }
    
    // API call
    setSubmitted(true);
  };

  return (
    <div style={{ padding: designTokens.spacing[8], maxWidth: '600px', margin: '0 auto' }}>
      {submitted && (
        <Alert variant="success" title="✅ Registered!">
          Your course registration is complete. Check your email for details.
        </Alert>
      )}

      {error && (
        <Alert variant="error" closeable onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <Card>
        <Card.Header>Course Registration</Card.Header>
        <Card.Body>
          <div style={{ display: 'grid', gap: designTokens.spacing[4] }}>
            <Input
              label="Full Name"
              placeholder="John Doe"
            />

            <Input
              label="Email"
              type="email"
              placeholder="john@example.com"
            />

            <Input
              label="Password"
              type="password"
              hint="Min 8 characters"
            />

            <div style={{ display: 'flex', gap: designTokens.spacing[3] }}>
              <Badge variant="info">Beginner Level</Badge>
              <Badge variant="warning">6 weeks duration</Badge>
            </div>
          </div>
        </Card.Body>
        <Card.Footer>
          <Button variant="ghost">Cancel</Button>
          <Button variant="primary" onClick={handleRegister}>
            Register
          </Button>
        </Card.Footer>
      </Card>
    </div>
  );
}
```

---

## ♿ Accessibility Guidelines

### For Developers

1. **Always use labels with inputs**
   ```jsx
   <Input label="Email" type="email" />  // ✅ Good
   <input type="email" />                 // ❌ Bad
   ```

2. **Add ARIA labels for icon buttons**
   ```jsx
   <Button aria-label="Close dialog" onClick={onClose}>
     ✕
   </Button>
   ```

3. **Use semantic HTML**
   ```jsx
   <Card.Header>Page Title</Card.Header>  // Uses <div>
   // For screen readers, structure matters
   ```

4. **Test keyboard navigation**
   - Tab through all interactive elements
   - Ensure Tab order is logical
   - All elements are keyboard accessible

5. **Color contrast**
   - All text meets WCAG AA (4.5:1 ratio)
   - Don't rely on color alone for information

---

## 🚀 Best Practices

### 1. Use Design Tokens Everywhere

```jsx
// ✅ Good
import { designTokens } from './design-system/tokens';

const style = {
  padding: designTokens.spacing[4],
  color: designTokens.colors.primary[500],
  borderRadius: designTokens.borderRadius.lg,
};

// ❌ Bad - hardcoded values
const style = {
  padding: '16px',
  color: '#2196F3',
  borderRadius: '12px',
};
```

### 2. Maintain Visual Hierarchy

- Use text color hierarchy (primary → secondary → disabled)
- Use appropriate heading levels (h1, h2, h3...)
- Consistent spacing between elements

### 3. Component Composition

```jsx
// ✅ Good - compose simple components
<Card>
  <Card.Header>Title</Card.Header>
  <Card.Body>
    <Alert variant="info">Helpful message</Alert>
  </Card.Body>
  <Card.Footer>
    <Button variant="primary">Action</Button>
  </Card.Footer>
</Card>

// ❌ Bad - monolithic component
<CustomComplexComponent />
```

### 4. Responsive Design

Use Tailwind's responsive prefixes:

```jsx
<div className="p-4 md:p-6 lg:p-8">
  Responsive padding
</div>
```

### 5. Test Everything

- Visual testing in different browsers
- Keyboard navigation testing
- Screen reader testing
- Mobile responsiveness testing

---

## 📖 Documentation

For detailed documentation, see:
- `DESIGN_GUIDE.md` - Complete design system specification
- `DesignSystemShowcase.jsx` - Live component examples
- Individual component files - JSDoc comments

---

## 🔗 Integration Checklist

- [ ] Copy `/design-system/` folder to your project
- [ ] Copy `/components/` folder to your project  
- [ ] Update imports in your files
- [ ] Replace hardcoded values with design tokens
- [ ] Test all components
- [ ] Test accessibility
- [ ] Deploy to production

---

## 📞 Support

For questions or issues:
1. Check `DESIGN_GUIDE.md` for detailed information
2. Review component examples in `DesignSystemShowcase.jsx`
3. Check component JSDoc comments
4. Contact the design team

---

**Version:** 1.0.0  
**Last Updated:** May 5, 2026  
**Status:** ✅ Production Ready

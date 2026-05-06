import React, { useState } from 'react';
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
import { designTokens as tokens } from './design-system/tokens';

/**
 * Comprehensive Design System Examples
 * 
 * This file showcases all design system components and patterns
 * in realistic education platform scenarios.
 */

export function DesignSystemShowcase() {
  const [modalOpen, setModalOpen] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  return (
    <div
      style={{
        fontFamily: tokens.typography.fontFamily.primary,
        backgroundColor: tokens.colors.background.secondary,
        padding: tokens.spacing[8],
      }}
    >
      {/* Hero Section */}
      <section
        style={{
          marginBottom: tokens.spacing[12],
          textAlign: 'center',
          paddingBottom: tokens.spacing[8],
          borderBottom: `1px solid ${tokens.colors.border.light}`,
        }}
      >
        <h1
          style={{
            fontSize: tokens.typography.fontSize['5xl'],
            fontWeight: tokens.typography.fontWeight.bold,
            color: tokens.colors.text.primary,
            marginBottom: tokens.spacing[3],
          }}
        >
          🎨 Online Education Platform
        </h1>
        <p
          style={{
            fontSize: tokens.typography.fontSize.lg,
            color: tokens.colors.text.secondary,
            maxWidth: '600px',
            margin: '0 auto',
          }}
        >
          Complete Design System & Component Library for the Modern Learning Experience
        </p>
      </section>

      {/* Alerts Section */}
      <section style={{ marginBottom: tokens.spacing[12] }}>
        <h2
          style={{
            fontSize: tokens.typography.fontSize['2xl'],
            fontWeight: tokens.typography.fontWeight.bold,
            marginBottom: tokens.spacing[4],
            color: tokens.colors.text.primary,
          }}
        >
          📢 Alerts & Notifications
        </h2>

        <div style={{ display: 'grid', gap: tokens.spacing[4] }}>
          <Alert variant="success" title="✅ Success">
            Your assignment has been submitted successfully!
          </Alert>

          <Alert variant="warning" title="⚠️ Warning" closeable>
            Your session is about to expire. Please save your work.
          </Alert>

          <Alert variant="error" title="❌ Error" closeable>
            Failed to upload file. Maximum size is 10MB. Please try again.
          </Alert>

          <Alert variant="info" title="ℹ️ Information">
            New courses are now available in the platform. Check them out!
          </Alert>
        </div>
      </section>

      {/* Buttons Section */}
      <section style={{ marginBottom: tokens.spacing[12] }}>
        <h2
          style={{
            fontSize: tokens.typography.fontSize['2xl'],
            fontWeight: tokens.typography.fontWeight.bold,
            marginBottom: tokens.spacing[4],
            color: tokens.colors.text.primary,
          }}
        >
          🔘 Buttons
        </h2>

        <Card variant="default">
          <Card.Body>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: tokens.spacing[4],
              }}
            >
              <div>
                <h4 style={{ marginBottom: tokens.spacing[3], fontWeight: 'bold' }}>
                  Primary
                </h4>
                <Button variant="primary" size="sm">
                  Small
                </Button>
                <Button variant="primary" size="md" style={{ marginLeft: tokens.spacing[2] }}>
                  Medium
                </Button>
                <Button variant="primary" size="lg" style={{ marginLeft: tokens.spacing[2] }}>
                  Large
                </Button>
              </div>

              <div>
                <h4 style={{ marginBottom: tokens.spacing[3], fontWeight: 'bold' }}>
                  Secondary
                </h4>
                <Button variant="secondary">Secondary</Button>
              </div>

              <div>
                <h4 style={{ marginBottom: tokens.spacing[3], fontWeight: 'bold' }}>
                  Outline
                </h4>
                <Button variant="outline">Outline</Button>
              </div>

              <div>
                <h4 style={{ marginBottom: tokens.spacing[3], fontWeight: 'bold' }}>
                  Ghost
                </h4>
                <Button variant="ghost">Ghost</Button>
              </div>

              <div>
                <h4 style={{ marginBottom: tokens.spacing[3], fontWeight: 'bold' }}>
                  Success
                </h4>
                <Button variant="success">Success</Button>
              </div>

              <div>
                <h4 style={{ marginBottom: tokens.spacing[3], fontWeight: 'bold' }}>
                  Danger
                </h4>
                <Button variant="danger">Delete</Button>
              </div>

              <div>
                <h4 style={{ marginBottom: tokens.spacing[3], fontWeight: 'bold' }}>
                  Disabled
                </h4>
                <Button disabled>Disabled</Button>
              </div>

              <div>
                <h4 style={{ marginBottom: tokens.spacing[3], fontWeight: 'bold' }}>
                  Full Width
                </h4>
                <Button fullWidth>Full Width</Button>
              </div>
            </div>
          </Card.Body>
        </Card>
      </section>

      {/* Badges Section */}
      <section style={{ marginBottom: tokens.spacing[12] }}>
        <h2
          style={{
            fontSize: tokens.typography.fontSize['2xl'],
            fontWeight: tokens.typography.fontWeight.bold,
            marginBottom: tokens.spacing[4],
            color: tokens.colors.text.primary,
          }}
        >
          🏷️ Badges
        </h2>

        <Card variant="default">
          <Card.Body>
            <div style={{ display: 'flex', gap: tokens.spacing[4], flexWrap: 'wrap' }}>
              <Badge variant="primary">Primary</Badge>
              <Badge variant="secondary">Secondary</Badge>
              <Badge variant="success">Completed</Badge>
              <Badge variant="warning">Pending</Badge>
              <Badge variant="error">Failed</Badge>
              <Badge variant="info">Information</Badge>
              <Badge variant="neutral">Neutral</Badge>
            </div>

            <hr style={{ margin: tokens.spacing[6] }} />

            <div style={{ display: 'flex', gap: tokens.spacing[4], flexWrap: 'wrap' }}>
              <Badge size="sm">Small</Badge>
              <Badge size="md">Medium</Badge>
              <Badge size="lg">Large</Badge>
            </div>
          </Card.Body>
        </Card>
      </section>

      {/* Form Inputs Section */}
      <section style={{ marginBottom: tokens.spacing[12] }}>
        <h2
          style={{
            fontSize: tokens.typography.fontSize['2xl'],
            fontWeight: tokens.typography.fontWeight.bold,
            marginBottom: tokens.spacing[4],
            color: tokens.colors.text.primary,
          }}
        >
          📝 Form Inputs
        </h2>

        <Card variant="default">
          <Card.Body>
            <div style={{ display: 'grid', gap: tokens.spacing[6], maxWidth: '500px' }}>
              <Input
                label="Full Name"
                placeholder="John Doe"
                hint="Enter your full name as it appears in official documents"
              />

              <Input
                label="Email Address"
                type="email"
                placeholder="your@email.com"
                error={formErrors.email}
              />

              <Input
                label="Password"
                type="password"
                placeholder="••••••••"
                hint="Minimum 8 characters, with numbers and special characters"
              />

              <Input
                label="Search Courses"
                placeholder="Search..."
                hint="Type course name or topic"
              />

              <Input
                label="Message"
                placeholder="Enter your message..."
                disabled
              />

              <div>
                <Button variant="primary">Register</Button>
                <Button
                  variant="outline"
                  style={{ marginLeft: tokens.spacing[3] }}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </Card.Body>
        </Card>
      </section>

      {/* Cards Section */}
      <section style={{ marginBottom: tokens.spacing[12] }}>
        <h2
          style={{
            fontSize: tokens.typography.fontSize['2xl'],
            fontWeight: tokens.typography.fontWeight.bold,
            marginBottom: tokens.spacing[4],
            color: tokens.colors.text.primary,
          }}
        >
          📋 Cards
        </h2>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: tokens.spacing[6],
          }}
        >
          {/* Course Card */}
          <Card variant="elevated" hoverable>
            <Card.Header>React Fundamentals</Card.Header>
            <Card.Body>
              <p style={{ marginBottom: tokens.spacing[3], fontSize: tokens.typography.fontSize.sm }}>
                Learn the basics of React and build interactive user interfaces.
              </p>
              <div style={{ display: 'flex', gap: tokens.spacing[2], marginBottom: tokens.spacing[3] }}>
                <Badge variant="primary">Beginner</Badge>
                <Badge variant="success">4.8/5</Badge>
              </div>
              <p style={{ fontSize: tokens.typography.fontSize.xs, color: tokens.colors.text.secondary }}>
                Duration: 40 hours | Instructor: John Smith
              </p>
            </Card.Body>
            <Card.Footer>
              <Button variant="ghost">More Info</Button>
              <Button variant="primary">Enroll</Button>
            </Card.Footer>
          </Card>

          {/* Assignment Card */}
          <Card variant="outline" interactive>
            <Card.Header>Assignment #3</Card.Header>
            <Card.Body>
              <p style={{ marginBottom: tokens.spacing[3], fontSize: tokens.typography.fontSize.sm }}>
                Build a Todo application using React hooks.
              </p>
              <div style={{ marginBottom: tokens.spacing[3] }}>
                <Badge variant="warning" size="md">Due: May 15, 2026</Badge>
              </div>
              <p style={{ fontSize: tokens.typography.fontSize.xs, color: tokens.colors.text.secondary }}>
                Status: Not submitted
              </p>
            </Card.Body>
            <Card.Footer>
              <Button variant="primary" fullWidth>Submit Assignment</Button>
            </Card.Footer>
          </Card>

          {/* Progress Card */}
          <Card variant="filled">
            <Card.Header>Your Progress</Card.Header>
            <Card.Body>
              <div style={{ marginBottom: tokens.spacing[4] }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: tokens.spacing[2] }}>
                  <span>Courses Completed</span>
                  <Badge variant="success">8/12</Badge>
                </div>
                <div style={{
                  width: '100%',
                  height: '8px',
                  backgroundColor: tokens.colors.border.light,
                  borderRadius: tokens.borderRadius.full,
                  overflow: 'hidden',
                }}>
                  <div style={{
                    width: '67%',
                    height: '100%',
                    backgroundColor: tokens.colors.success[500],
                  }} />
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: tokens.spacing[2] }}>
                  <span>Assignments Submitted</span>
                  <Badge variant="warning">5/8</Badge>
                </div>
                <div style={{
                  width: '100%',
                  height: '8px',
                  backgroundColor: tokens.colors.border.light,
                  borderRadius: tokens.borderRadius.full,
                  overflow: 'hidden',
                }}>
                  <div style={{
                    width: '62.5%',
                    height: '100%',
                    backgroundColor: tokens.colors.warning[500],
                  }} />
                </div>
              </div>
            </Card.Body>
          </Card>
        </div>
      </section>

      {/* Avatars Section */}
      <section style={{ marginBottom: tokens.spacing[12] }}>
        <h2
          style={{
            fontSize: tokens.typography.fontSize['2xl'],
            fontWeight: tokens.typography.fontWeight.bold,
            marginBottom: tokens.spacing[4],
            color: tokens.colors.text.primary,
          }}
        >
          👥 Avatars
        </h2>

        <Card variant="default">
          <Card.Body>
            <div style={{ display: 'flex', gap: tokens.spacing[6], alignItems: 'center', flexWrap: 'wrap' }}>
              <div>
                <h4 style={{ marginBottom: tokens.spacing[3], fontSize: tokens.typography.fontSize.sm }}>
                  Sizes
                </h4>
                <div style={{ display: 'flex', gap: tokens.spacing[3], alignItems: 'center' }}>
                  <Avatar size="xs" initials="JD" />
                  <Avatar size="sm" initials="JD" />
                  <Avatar size="md" initials="JD" />
                  <Avatar size="lg" initials="JD" />
                  <Avatar size="xl" initials="JD" />
                </div>
              </div>

              <div>
                <h4 style={{ marginBottom: tokens.spacing[3], fontSize: tokens.typography.fontSize.sm }}>
                  Status Indicators
                </h4>
                <div style={{ display: 'flex', gap: tokens.spacing[3] }}>
                  <Avatar size="lg" initials="JD" status="online" />
                  <Avatar size="lg" initials="AB" status="offline" />
                  <Avatar size="lg" initials="CD" status="away" />
                </div>
              </div>

              <div>
                <h4 style={{ marginBottom: tokens.spacing[3], fontSize: tokens.typography.fontSize.sm }}>
                  Variants
                </h4>
                <div style={{ display: 'flex', gap: tokens.spacing[3] }}>
                  <Avatar size="lg" initials="JD" variant="circle" />
                  <Avatar size="lg" initials="AB" variant="square" />
                </div>
              </div>
            </div>
          </Card.Body>
        </Card>
      </section>

      {/* Modal Section */}
      <section style={{ marginBottom: tokens.spacing[12] }}>
        <h2
          style={{
            fontSize: tokens.typography.fontSize['2xl'],
            fontWeight: tokens.typography.fontWeight.bold,
            marginBottom: tokens.spacing[4],
            color: tokens.colors.text.primary,
          }}
        >
          🪟 Modals
        </h2>

        <Button
          variant="primary"
          onClick={() => setModalOpen(true)}
        >
          Open Modal
        </Button>

        <Modal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          title="Confirm Enrollment"
          size="md"
        >
          <p style={{ marginBottom: tokens.spacing[4], color: tokens.colors.text.secondary }}>
            Are you sure you want to enroll in <strong>"Advanced React Patterns"</strong>?
          </p>
          <p style={{ fontSize: tokens.typography.fontSize.sm, color: tokens.colors.text.secondary }}>
            This course requires 10 hours per week and has a 6-week duration.
          </p>

          <Modal.Footer>
            <Button
              variant="ghost"
              onClick={() => setModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={() => setModalOpen(false)}
            >
              Confirm Enrollment
            </Button>
          </Modal.Footer>
        </Modal>
      </section>

      {/* Color Palette Section */}
      <section style={{ marginBottom: tokens.spacing[12] }}>
        <h2
          style={{
            fontSize: tokens.typography.fontSize['2xl'],
            fontWeight: tokens.typography.fontWeight.bold,
            marginBottom: tokens.spacing[4],
            color: tokens.colors.text.primary,
          }}
        >
          🎨 Color Palette
        </h2>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: tokens.spacing[6],
          }}
        >
          {['primary', 'secondary', 'success', 'warning', 'error', 'info'].map((colorKey) => (
            <Card key={colorKey} variant="default">
              <Card.Header style={{ textTransform: 'capitalize' }}>
                {colorKey}
              </Card.Header>
              <Card.Body>
                <div style={{ display: 'grid', gap: tokens.spacing[2] }}>
                  {[50, 100, 200, 300, 400, 500, 600, 700, 800, 900].map((shade) => (
                    <div
                      key={shade}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: tokens.spacing[3],
                      }}
                    >
                      <div
                        style={{
                          width: '40px',
                          height: '40px',
                          backgroundColor: tokens.colors[colorKey][shade],
                          borderRadius: tokens.borderRadius.md,
                          border: `1px solid ${tokens.colors.border.light}`,
                        }}
                      />
                      <span style={{ fontSize: tokens.typography.fontSize.sm }}>
                        {shade}
                      </span>
                    </div>
                  ))}
                </div>
              </Card.Body>
            </Card>
          ))}
        </div>
      </section>

      {/* Typography Examples */}
      <section style={{ marginBottom: tokens.spacing[12] }}>
        <h2
          style={{
            fontSize: tokens.typography.fontSize['2xl'],
            fontWeight: tokens.typography.fontWeight.bold,
            marginBottom: tokens.spacing[4],
            color: tokens.colors.text.primary,
          }}
        >
          ✍️ Typography
        </h2>

        <Card variant="default">
          <Card.Body style={{ display: 'grid', gap: tokens.spacing[6] }}>
            <div>
              <h1
                style={{
                  ...tokens.typography.heading.h1,
                  color: tokens.colors.text.primary,
                  marginBottom: tokens.spacing[2],
                }}
              >
                Heading 1
              </h1>
              <code style={{ fontSize: tokens.typography.fontSize.xs }}>
                heading.h1: 36px, bold
              </code>
            </div>

            <div>
              <h2
                style={{
                  ...tokens.typography.heading.h2,
                  color: tokens.colors.text.primary,
                  marginBottom: tokens.spacing[2],
                }}
              >
                Heading 2
              </h2>
              <code style={{ fontSize: tokens.typography.fontSize.xs }}>
                heading.h2: 28px, bold
              </code>
            </div>

            <div>
              <h3
                style={{
                  ...tokens.typography.heading.h3,
                  color: tokens.colors.text.primary,
                  marginBottom: tokens.spacing[2],
                }}
              >
                Heading 3
              </h3>
              <code style={{ fontSize: tokens.typography.fontSize.xs }}>
                heading.h3: 24px, semibold
              </code>
            </div>

            <div>
              <p
                style={{
                  ...tokens.typography.body.large,
                  color: tokens.colors.text.primary,
                  marginBottom: tokens.spacing[2],
                }}
              >
                Body Large: This is a large body text paragraph for main content areas.
              </p>
              <code style={{ fontSize: tokens.typography.fontSize.xs }}>
                body.large: 16px, normal
              </code>
            </div>

            <div>
              <p
                style={{
                  ...tokens.typography.body.medium,
                  color: tokens.colors.text.secondary,
                  marginBottom: tokens.spacing[2],
                }}
              >
                Body Medium: This is medium body text for secondary content.
              </p>
              <code style={{ fontSize: tokens.typography.fontSize.xs }}>
                body.medium: 14px, normal
              </code>
            </div>
          </Card.Body>
        </Card>
      </section>

      {/* Footer */}
      <div
        style={{
          textAlign: 'center',
          paddingTop: tokens.spacing[8],
          borderTop: `1px solid ${tokens.colors.border.light}`,
          color: tokens.colors.text.secondary,
          fontSize: tokens.typography.fontSize.sm,
        }}
      >
        <p>
          🎨 Design System v1.0.0 | Made with ❤️ for the Online Education Platform
        </p>
        <p>
          Last Updated: May 5, 2026
        </p>
      </div>
    </div>
  );
}

export default DesignSystemShowcase;

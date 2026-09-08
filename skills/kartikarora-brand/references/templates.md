# @kartikarora Brand Component HTML Templates

Use these ready-to-copy HTML structures to implement the brand design system components correctly.

## Navigation Bar
```html
<nav class="nav">
  <div class="nav-container">
    <a href="/" class="nav-brand">Kartik Arora</a>

    <button class="nav-toggle" id="nav-toggle" aria-label="Toggle navigation">
      <span class="material-symbols-outlined">menu</span>
    </button>

    <ul class="nav-links" id="nav-links">
      <li><a href="#" class="nav-link">Home</a></li>
      <li><a href="#" class="nav-link">About</a></li>
      <li><a href="#" class="nav-link">Contact</a></li>

      <!-- Optional Social Icons -->
      <ul class="nav-social">
        <li>
          <a href="#" target="_blank" aria-label="GitHub">
            <i class="fa-brands fa-github"></i>
          </a>
        </li>
      </ul>
    </ul>
  </div>
</nav>
```

## Footer
```html
<footer class="footer">
  <div class="container">
    <ul class="footer-social">
      <li><a href="#" aria-label="Twitter"><i class="fa-brands fa-twitter"></i></a></li>
    </ul>
    <p>Main footer text</p>
    <p class="text-muted">Secondary muted text</p>
  </div>
</footer>
```

## Hero Section
```html
<section class="hero">
  <div class="container-narrow">
    <img src="/path/to/image.jpg" alt="Author Name" class="hero-img">
    <h1 class="hero-title">Author Name</h1>
    <p class="hero-subtitle">Professional Title | Role @ Company</p>
    <p class="hero-bio">A brief professional bio or introduction text.</p>
  </div>
</section>
```

## Cards & Grids

### Grid Layout (Visual-First, e.g. Projects)
```html
<div class="card-grid">
  <div class="card-grid-item">
    <div class="card-image">
      <img src="/path/to/image.png" alt="Project Name">
    </div>
    <div class="card-content">
      <div class="card-header">
        <h3 class="card-title">Project Name</h3>
        <span class="card-meta">2026</span>
      </div>
      <p class="card-body">A brief description of the project and its goals.</p>
      <div class="card-tags">
        <span class="tech-tag">Android</span>
        <span class="tech-tag">Kotlin</span>
      </div>
      <div class="card-footer">
        <a href="#" class="card-link">
          <span class="material-symbols-outlined">code</span> Code
        </a>
      </div>
    </div>
  </div>
</div>
```

### List Layout (Information-Heavy, e.g. Talks, Posts)
```html
<div class="card-list">
  <div class="card-list-item">
    <div class="card-image">
      <img src="/path/to/image.png" alt="Talk Name">
    </div>
    <div class="card-details">
      <h3 class="card-title">Talk Name</h3>
      <div class="card-tags">
        <span class="tech-tag">Conference</span>
      </div>
      <div class="card-info-group">
        <p class="info-label">Delivered at:</p>
        <ul class="info-list">
          <li>
            <a href="#">
              <span class="material-symbols-outlined">location_on</span> Event Name
              <span class="info-meta">(May 2025)</span>
            </a>
          </li>
        </ul>
      </div>
    </div>
  </div>
</div>
```

## Buttons
```html
<!-- Primary Button -->
<button class="btn btn-primary">
  <span class="material-symbols-outlined">check_circle</span>
  Primary Action
</button>

<!-- Secondary Button -->
<button class="btn btn-secondary">
  <span class="material-symbols-outlined">favorite</span>
  Secondary Action
</button>

<!-- Outline Button -->
<button class="btn btn-outline">
  <span class="material-symbols-outlined">settings</span>
  Outline Action
</button>
```

## Step-by-Step Instructions Flow
```html
<div class="quickstart-steps">
  <div class="step">
    <div class="step-number">1</div>
    <div class="step-content">
      <h3>Install</h3>
      <p>Run <code>npm install</code> to get started.</p>
    </div>
  </div>

  <div class="step">
    <div class="step-number">2</div>
    <div class="step-content">
      <h3>Configure</h3>
      <p>Update your config file.</p>
    </div>
  </div>
</div>
```

## Off-Canvas Mobile Navigation CSS
```css
.nav-links {
  position: fixed;
  top: 0;
  right: 0;
  height: 100vh;
  width: 280px;
  background: var(--bg);
  flex-direction: column;
  padding: var(--space-3xl) var(--space-lg);
  transform: translate(100%);
  transition: transform 0.2s cubic-bezier(.4, 0, .2, 1), opacity 0.2s ease, visibility 0.2s ease;
  opacity: 0;
  visibility: hidden;
  z-index: 1001;
}

.nav-links.open {
  transform: translate(0);
  opacity: 1;
  visibility: visible;
}
```

## Translucent Badges

### HTML
```html
<span class="badge badge-win">Win</span>
<span class="badge badge-loss">Loss</span>
<span class="badge badge-draw">Draw</span>
```

### CSS
```css
.badge {
  padding: 2px 10px;
  border-radius: 20px;
  font-weight: 600;
  font-size: 0.75rem;
  display: inline-block;
}

.badge-win {
  background-color: rgba(0, 153, 255, 0.15);
  color: var(--accent);
  border: 1px solid rgba(0, 153, 255, 0.2);
}

.badge-loss {
  background-color: rgba(255, 68, 68, 0.15);
  color: #ff4444;
  border: 1px solid rgba(255, 68, 68, 0.2);
}

.badge-draw {
  background-color: rgba(128, 128, 128, 0.15);
  color: var(--muted);
  border: 1px solid rgba(128, 128, 128, 0.2);
}
```

## Pure-CSS Tooltip

### HTML
```html
<span class="tooltip-container" tabindex="0">
  <span class="material-symbols-outlined info-icon">info</span>
  <span class="tooltip-text">This is the tooltip explanation text.</span>
</span>
```

### CSS
```css
.tooltip-container {
  position: relative;
  display: inline-flex;
  align-items: center;
  cursor: pointer;
  margin-left: 4px;
  vertical-align: middle;
  line-height: 1;
}

.tooltip-container .info-icon {
  font-size: 0.95rem !important;
  color: var(--tertiary);
  transition: color 0.2s ease;
  user-select: none;
  outline: none;
}

.tooltip-container:hover .info-icon,
.tooltip-container:focus-within .info-icon {
  color: var(--accent);
}

.tooltip-container .tooltip-text {
  visibility: hidden;
  width: 220px;
  background-color: var(--card);
  color: var(--primary);
  text-align: left;
  border: 1px solid var(--border);
  border-radius: var(--border-radius-sm);
  padding: 10px 12px;
  position: absolute;
  z-index: 100;
  bottom: 130%;
  left: 50%;
  transform: translateX(-50%);
  opacity: 0;
  transition: opacity 0.2s ease, visibility 0.2s ease;
  box-shadow: 0 4px 16px var(--shadow);
  font-size: 0.75rem;
  font-weight: 400;
  line-height: 1.4;
  pointer-events: none;
  white-space: normal;
}

.tooltip-container .tooltip-text::after {
  content: "";
  position: absolute;
  top: 100%;
  left: 50%;
  margin-left: -5px;
  border-width: 5px;
  border-style: solid;
  border-color: var(--border) transparent transparent transparent;
}

.tooltip-container:hover .tooltip-text,
.tooltip-container:focus-within .tooltip-text {
  visibility: visible;
  opacity: 1;
}

/* Card override if tooltips are placed inside grid cards */
.card-grid-item.has-tooltips {
  overflow: visible !important;
}
```


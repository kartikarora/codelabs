# Full Page Template (v2.0.0)

A complete, production-grade boilerplate demonstrating compliance with **The Brand Floor**, the **OKLCH token architecture**, and the **8 signature compositions**.

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Engineering Spec · @kartikarora Brand</title>
  
  <!-- Mandatory Brand CDN Assets -->
  <link href="https://distribute.kartikarora.me/css/kartikarora.css" rel="stylesheet">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Albert+Sans:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;600&family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" rel="stylesheet">
  <script src="https://distribute.kartikarora.me/js/kartikarora.js" defer></script>
</head>
<body>

  <!-- Brand Navigation -->
  <header class="nav">
    <div class="nav-container">
      <a href="/" class="nav-brand">
        <span class="material-symbols-outlined" style="color: var(--color-signal);">terminal</span>
        <span>Kartik Arora</span>
      </a>
      <button class="nav-toggle" id="nav-toggle" aria-label="Toggle Navigation">
        <span class="material-symbols-outlined">menu</span>
      </button>
      <nav class="nav-links" id="nav-links">
        <a href="#about" class="nav-link">About</a>
        <a href="#projects" class="nav-link">Projects</a>
        <a href="#talks" class="nav-link">Talks</a>
        <a href="https://github.com/kartikarora" class="btn btn-sm btn-primary">GitHub</a>
      </nav>
    </div>
  </header>

  <!-- Hero Section (Visible within 1280x800) -->
  <section class="hero">
    <div class="container-narrow">
      <img src="https://kartikarora.me/img/kartik.jpg" alt="Kartik Arora" class="hero-img" width="96" height="96">
      <h1 class="hero-title">Kartik Arora</h1>
      <p class="hero-subtitle">Google Developer Expert for Android · Interaction Designer</p>
      <p class="hero-bio">Building tactile, resilient mobile architectures with Kotlin and Jetpack Compose. M.Des from University of Sydney.</p>
      <div style="display: flex; gap: var(--space-xs); margin-top: var(--space-md);">
        <a href="#talks" class="btn btn-primary">Explore Talks</a>
        <a href="#projects" class="btn btn-secondary">View Architecture</a>
      </div>
    </div>
  </section>

  <!-- Telemetry Row -->
  <section class="section" style="padding-top: 0;">
    <div class="container">
      <div class="telemetry-grid">
        <div class="telemetry-metric">
          <div class="telemetry-value">150K+</div>
          <div class="telemetry-label">Active App Installs</div>
        </div>
        <div class="telemetry-metric">
          <div class="telemetry-value">45+</div>
          <div class="telemetry-label">Technical Talks Given</div>
        </div>
        <div class="telemetry-metric">
          <div class="telemetry-value">100%</div>
          <div class="telemetry-label">Compose Multiplatform</div>
        </div>
      </div>
    </div>
  </section>

  <!-- Editorial Lead -->
  <section class="section">
    <div class="container">
      <div class="editorial-lead">
        <div class="editorial-quote">
          "Software should behave like a physical instrument: immediate, tactile, and predictable."
        </div>
        <div class="editorial-cite">
          — Kartik Arora · Interaction Design Principles
        </div>
      </div>
    </div>
  </section>

  <!-- Bento Precision Grid -->
  <section class="section" id="projects">
    <div class="container">
      <div class="section-header">
        <h2>Engineering Projects</h2>
        <p class="text-lead">Production-grade mobile systems and open source tools.</p>
      </div>

      <div class="bento-grid">
        <div class="bento-tile span-8">
          <span class="badge badge-win" style="margin-bottom: var(--space-xs); align-self: flex-start;">Featured System</span>
          <h3>Wear OS Dialing Engine</h3>
          <p class="text-muted">High-reliability emergency dialer and contact manager designed for round and square smartwatches with zero network dependency.</p>
          <div style="margin-top: auto; display: flex; gap: var(--space-xs);">
            <span class="tech-tag">Wear OS</span>
            <span class="tech-tag">Kotlin 2.0</span>
            <span class="tech-tag">Compose</span>
          </div>
        </div>

        <div class="bento-tile span-4">
          <span class="badge" style="margin-bottom: var(--space-xs); align-self: flex-start;">Design System</span>
          <h3>Compose Theme</h3>
          <p class="text-muted">Strict Material 3 theme mapping for Jetpack Compose & CMP.</p>
          <div style="margin-top: auto;">
            <a href="#" class="btn btn-outline btn-sm">Inspect Specs &rarr;</a>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Footer -->
  <footer class="footer">
    <div class="container">
      <div class="footer-container">
        <div>&copy; 2026 Kartik Arora. All rights reserved.</div>
        <ul class="footer-links">
          <li><a href="https://github.com/kartikarora">GitHub</a></li>
          <li><a href="https://twitter.com/kartikarora">Twitter</a></li>
          <li><a href="https://linkedin.com/in/kartikarora">LinkedIn</a></li>
        </ul>
      </div>
    </div>
  </footer>

</body>
</html>
```

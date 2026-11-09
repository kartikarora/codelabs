# Component HTML Templates (v2.0.0)

Pre-formatted, copy-pasteable HTML boilerplate blocks for the **8 Signature Brand Compositions** and core elements.

---

## 1. Engineering Spec Grid
```html
<div class="spec-grid">
  <div class="spec-card">
    <div class="spec-header">
      <h3 style="margin: 0; font-size: var(--text-title);">Runtime Spec</h3>
      <span class="badge badge-win">Stable</span>
    </div>
    <div class="spec-rows">
      <div class="spec-row">
        <span class="spec-key">Min SDK</span>
        <span class="spec-value">API 26 (Android 8.0)</span>
      </div>
      <div class="spec-row">
        <span class="spec-key">Compose Compiler</span>
        <span class="spec-value">1.5.8</span>
      </div>
      <div class="spec-row">
        <span class="spec-key">Binary Overhead</span>
        <span class="spec-value">&lt; 42 KB</span>
      </div>
    </div>
  </div>
</div>
```

---

## 2. Diff & Architecture Compare
```html
<div class="diff-grid">
  <div class="diff-pane">
    <div class="diff-header">
      <span>Legacy Imperative View</span>
      <span class="badge">XML</span>
    </div>
    <pre><code class="language-kotlin">val button = findViewById&lt;Button&gt;(R.id.cta)
button.setOnClickListener {
  progressBar.visibility = View.VISIBLE
  fetchData()
}</code></pre>
  </div>

  <div class="diff-pane">
    <div class="diff-header">
      <span>Declarative Jetpack Compose</span>
      <span class="badge badge-win">Modern</span>
    </div>
    <pre><code class="language-kotlin">@Composable
fun CtaButton(uiState: UiState, onAction: () -> Unit) {
  Button(onClick = onAction) {
    if (uiState.isLoading) CircularProgressIndicator()
    else Text("Confirm")
  }
}</code></pre>
  </div>
</div>
```

---

## 3. Milestone Stream (Timeline)
```html
<div class="timeline-stream">
  <div class="timeline-item">
    <div class="timeline-date">2026 — Present</div>
    <div class="timeline-title">Lead Mobile Engineer · Bilue</div>
    <div class="timeline-body">Architecting enterprise Android applications with Kotlin, Compose Multiplatform, and clean architecture.</div>
  </div>

  <div class="timeline-item">
    <div class="timeline-date">2024</div>
    <div class="timeline-title">Google Developer Expert for Android</div>
    <div class="timeline-body">Recognized by Google for technical contributions, conference speaking, and mentoring the Android developer ecosystem.</div>
  </div>
</div>
```

---

## 4. Talk & Publication Index
```html
<table class="index-table">
  <thead>
    <tr>
      <th>Year</th>
      <th>Talk / Publication</th>
      <th>Event / Platform</th>
      <th style="text-align: right;">Resources</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td class="index-year">2025</td>
      <td class="index-title">High-Performance Jetpack Compose Layouts</td>
      <td class="index-meta">Droidcon Berlin</td>
      <td class="index-action">
        <a href="#" class="btn btn-sm btn-outline">Slides</a>
      </td>
    </tr>
  </tbody>
</table>
```

---

## 5. Bento Precision Grid
```html
<div class="bento-grid">
  <div class="bento-tile span-8">
    <span class="badge badge-win" style="margin-bottom: var(--space-xs); align-self: flex-start;">Featured Project</span>
    <h2>PickMe · Wear OS Companion</h2>
    <p class="text-muted">A standalone smartwatch dialer and task companion built with Wear OS Compose, serving over 50,000 active devices.</p>
    <div style="margin-top: var(--space-md);">
      <a href="#" class="btn btn-primary">View Case Study</a>
    </div>
  </div>

  <div class="bento-tile span-4">
    <span class="badge" style="margin-bottom: var(--space-xs); align-self: flex-start;">Open Source</span>
    <h3>Compose Theme Engine</h3>
    <p class="text-muted">A strict design-token theme engine for Compose Multiplatform.</p>
    <div style="margin-top: auto;">
      <a href="#" class="btn btn-ghost btn-sm">GitHub &rarr;</a>
    </div>
  </div>
</div>
```

---

## 6. Editorial Statement Lead
```html
<div class="editorial-lead">
  <div class="editorial-quote">
    "Great interaction design is invisible: it respects tactile physics, responds instantly, and never surprises the user."
  </div>
  <div class="editorial-cite">
    — Kartik Arora · Interaction Design & Systems Engineering
  </div>
</div>
```

---

## 7. Telemetry & Metric Row
```html
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
    <div class="telemetry-label">Jetpack Compose Adoption</div>
  </div>
</div>
```

---

## 8. Platform Switcher (Interaction Canvas)
```html
<div class="interaction-canvas">
  <div class="canvas-header">
    <div class="tabs" id="code-tabs">
      <div class="tab-item active" data-value="compose">Jetpack Compose</div>
      <div class="tab-item" data-value="cmp">Compose Multiplatform</div>
    </div>
    <span class="badge">Kotlin 2.0</span>
  </div>
  <div class="canvas-body">
    <pre><code class="language-kotlin">@Composable
fun AppHeader() {
  Text(text = "Hello Kartik Arora Brand", color = MaterialTheme.colorScheme.primary)
}</code></pre>
  </div>
</div>
```

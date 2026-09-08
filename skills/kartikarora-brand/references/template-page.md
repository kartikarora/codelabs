# Example Full Page Template

Below is a complete, boilerplate HTML file demonstrating correct integration of the `@kartikarora` design system.

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>@kartikarora Brand Example</title>

  <!-- Brand CSS -->
  <link href="https://distribute.kartikarora.me/css/kartikarora.css" rel="stylesheet">

  <!-- Fonts -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Albert+Sans:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;600&family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" rel="stylesheet">
</head>
<body>
  <div class="container" style="max-width: var(--max-width); margin: 0 auto; padding: var(--space-2xl) var(--space-md);">

    <!-- Header -->
    <header>
      <h1>Project Title</h1>
      <p class="text-muted">A brief description of your project</p>
    </header>

    <!-- Quick Start Steps -->
    <section style="margin-top: var(--space-2xl);">
      <h2>Quick Start</h2>

      <div class="quickstart-steps">
        <div class="step">
          <div class="step-number">1</div>
          <div class="step-content">
            <h3>Install</h3>
            <p>Install the package: <code>npm install package-name</code></p>
          </div>
        </div>

        <div class="step">
          <div class="step-number">2</div>
          <div class="step-content">
            <h3>Configure</h3>
            <p>Set up your configuration file.</p>
          </div>
        </div>

        <div class="step">
          <div class="step-number">3</div>
          <div class="step-content">
            <h3>Run</h3>
            <p>Start developing: <code>npm run dev</code></p>
          </div>
        </div>
      </div>
    </section>

    <!-- Code Example -->
    <section style="margin-top: var(--space-2xl);">
      <h2>Example Code</h2>

      <pre><code class="language-js">// Example usage
import { feature } from 'package-name';

const result = feature({
  option: 'value'
});

console.log(result);</code></pre>
    </section>

    <!-- Call to Action -->
    <section style="margin-top: var(--space-2xl); text-align: center;">
      <button class="btn btn-primary">
        <span class="material-symbols-outlined">download</span>
        Get Started
      </button>

      <button class="btn btn-secondary">
        <span class="material-symbols-outlined">article</span>
        Read Docs
      </button>
    </section>

  </div>
</body>
</html>
```

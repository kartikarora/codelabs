---
id: lightbuild
summary: Learn how Google's experimental Lightbuild replaces imperative build.gradle.kts scripts with schema-validated YAML and pre-resolved lockfiles (resolved.deps) in a multi-module Compose app.
categories: Android, AI, Architecture, Tooling
environments: Android
status: Draft
authors: Kartik Arora
feedback_link: mailto:hello@kartikarora.me
tags: android, lightbuild, gradle, declarative-builds, ai-agents, gemini, kotlin, compose
---

# Declarative Android Builds with Lightbuild

## Setup and Project Context
Duration: 10

![Lightbuild Hero Banner](images/poster.svg)

Android project configuration has historically used imperative build scripts (Groovy or Kotlin DSL). Because Gradle evaluates these scripts on a JVM daemon during project configuration, IDE sync times scale with project size. Furthermore, modifying imperative scripts presents reliability challenges for automated AI coding agents.

At Android Dev Summit, Google introduced **Lightbuild**: an experimental declarative build system that represents project configuration as structured YAML and uses pre-resolved dependency lockfiles (`resolved.deps`).

In this codelab, you will migrate **ICanHazStream** (`me.kartikarora.icanhazstream`)—a multi-module Jetpack Compose streaming availability tracker—from Gradle convention plugins (`build-logic/`) to Lightbuild YAML.

### Prerequisites
* **Android Studio:** Android Studio Canary with Lightbuild support.
* **JDK:** JDK 17 or JDK 25.
* **Git.**

[Download Android Studio Canary](https://developer.android.com/studio/preview){.buttonPrimary icon=download}

### 1. Clone the Project
Clone the repository and create a working branch:

```bash
git clone https://github.com/kartikarora/ICanHazStream.git
cd ICanHazStream
git checkout -b lightbuild
```

### 2. Inspect Existing Configuration
The default `main` branch uses:
* `build-logic/convention/` containing custom Gradle convention plugins.
* Individual `build.gradle.kts` files per module.
* Dynamic dependency resolution during configuration.

---

## Lightbuild Architecture
Duration: 10

![Lightbuild Transpilation Pipeline](images/lightbuild-architecture.svg)

Lightbuild is not an alternative compiler or a replacement for the Android Gradle Plugin (AGP). It is a declarative frontend that transpiles schema-validated YAML into Gradle execution instructions.

### Core Configuration Files

1. **`project.lightbuild.yaml` (Root):**
   Replaces `settings.gradle.kts` and root `build.gradle.kts`. Defines repository sources, module list, and compiler versions.
2. **`lightbuild.yaml` (Per Module):**
   Defines module roles (`type: application` for the app shell, `type: library` for reusable modules), SDK requirements, and dependencies.
3. **`resolved.deps` (Per Module):**
   Auto-generated lockfile recording exact resolved direct and transitive dependencies. Prevents network lookups and dependency graph recalculation during IDE sync.

```
ICanHazStream/
├── project.lightbuild.yaml       # Global workspace manifest
├── app/                          # App Shell module
│   ├── lightbuild.yaml           # type: application
│   └── resolved.deps             # Lockfile
├── core/
│   ├── ui/                       # type: library
│   ├── model/                    # type: library
│   └── data/                     # type: library
└── feature/
    ├── explore/                  # type: library
    └── details/                  # type: library
```

![ICanHazStream Modular Architecture](images/module-dependency-graph.svg)

---

## Defining the Root Manifest
Duration: 10

Create `project.lightbuild.yaml` in the root of the project:

```yaml
# project.lightbuild.yaml
project:
  name: ICanHazStream
  modules:
    - app
    - core/model
    - core/data
    - core/ui
    - core/testing
    - feature/explore
    - feature/details
    - feature/watchlist

repositories:
  - google
  - mavenCentral

lightbuild:
  version: 0.0.30

build:
  java:
    version: 17
  kotlin:
    version: 2.4.20
    jvmTarget: "17"
```

This single file replaces module declarations in `settings.gradle.kts` and common plugin/toolchain blocks from root buildscripts.

---

## Configuring the App Shell
Duration: 10

The application module acts as an assembly shell. It configures the Android application ID, SDK levels, release signing, and aggregates feature modules.

Create `app/lightbuild.yaml`:

```yaml
# app/lightbuild.yaml
module:
  type: application

android:
  namespace: me.kartikarora.icanhazstream
  applicationId: me.kartikarora.icanhazstream
  compileSdk: 35
  minSdk: 26
  targetSdk: 35
  versionCode: 1
  versionName: "1.0.0"

dependencies:
  - module: core/ui
  - module: core/data
  - module: core/model
  - module: feature/explore
  - module: feature/details
  - module: feature/watchlist
  - "androidx.activity:activity-compose:1.10.1"
  - "androidx.navigation:navigation-compose:2.10.2"
```

Inter-module dependencies use `- module: path/to/module`. External dependencies use standard artifact coordinate strings.

---

## Configuring Library Modules
Duration: 15

Modules containing business logic, data sources, and UI components are configured as `type: library`.

### 1. `:core:model/lightbuild.yaml`
```yaml
module:
  type: library

android:
  namespace: me.kartikarora.icanhazstream.model
  compileSdk: 35
  minSdk: 26

dependencies:
  - "org.jetbrains.kotlinx:kotlinx-serialization-json:1.11.0"
```

### 2. `:core:data/lightbuild.yaml`
```yaml
module:
  type: library

android:
  namespace: me.kartikarora.icanhazstream.data
  compileSdk: 35
  minSdk: 26

dependencies:
  - module: core/model
  - "io.ktor:ktor-client-core:3.6.0"
  - "io.ktor:ktor-client-content-negotiation:3.6.0"
  - "io.ktor:ktor-serialization-kotlinx-json:3.6.0"
  - "org.jetbrains.kotlinx:kotlinx-coroutines-core:1.11.0"

testDependencies:
  - module: core/testing
  - "org.junit.jupiter:junit-jupiter:5.14.4"
  - "app.cash.turbine:turbine:1.2.1"
```

### 3. `:core:ui/lightbuild.yaml`
```yaml
module:
  type: library

android:
  namespace: me.kartikarora.icanhazstream.ui
  compileSdk: 35
  minSdk: 26

dependencies:
  - module: core/model
  - "androidx.compose.ui:ui:1.8.0"
  - "androidx.compose.material3:material3:1.4.0"
  - "androidx.compose.foundation:foundation:1.8.0"
  - "androidx.compose.ui:ui-tooling-preview:1.8.0"
  - "io.coil-kt:coil-compose:2.7.0"
```

### 4. `:feature:explore/lightbuild.yaml`
```yaml
module:
  type: library

android:
  namespace: me.kartikarora.icanhazstream.explore
  compileSdk: 35
  minSdk: 26

dependencies:
  - module: core/model
  - module: core/data
  - module: core/ui
  - "androidx.lifecycle:lifecycle-viewmodel-compose:2.9.0"
  - "androidx.compose.material3:material3:1.4.0"

testDependencies:
  - module: core/testing
  - "app.cash.turbine:turbine:1.2.1"
```

Configure `:feature:details`, `:feature:watchlist`, and `:core:testing` following the same pattern.

---

## Pre-Resolving Dependencies
Duration: 10

Run the resolution command to calculate and freeze the dependency graph:

```bash
lightbuild resolve
```

### Understanding `resolved.deps`
Review the generated `app/resolved.deps` and `core/data/resolved.deps` files:

```
# Generated by Lightbuild CLI - DO NOT EDIT MANUALLY
androidx.activity:activity-compose:1.10.1
  androidx.activity:activity-ktx:1.10.1
  androidx.compose.runtime:runtime:1.8.0
  androidx.compose.ui:ui:1.8.0
io.ktor:ktor-client-core:3.6.0
  org.jetbrains.kotlinx:kotlinx-coroutines-core:1.11.0
  io.ktor:ktor-http:3.6.0
  io.ktor:ktor-utils:3.6.0
```

`resolved.deps` serves as a dependency lockfile. Commit it to git. Subsequent builds read from this file directly, bypassing network version resolution during project sync.

---

## Agent Modification Workflow
Duration: 15

![Deterministic Agent Automation Loop](images/agent-workflow-loop.svg)

Because Lightbuild configuration is structured data rather than an executable script, AI coding agents can parse and update the build model with fewer errors.

Prompt your coding assistant (such as Gemini in Android Studio):

```text
Add a new feature module called ':feature:reviews' to ICanHazStream.
1. Add 'feature/reviews' to project.lightbuild.yaml modules list.
2. Create 'feature/reviews/lightbuild.yaml' as type: library with dependencies on core/model, core/ui, and Compose Material 3.
3. Add feature/reviews to app/lightbuild.yaml dependencies.
```

The agent edits exact YAML keys without needing to navigate Kotlin DSL syntax or version catalog mappings.

After the agent completes the edit, run:
```bash
lightbuild resolve
```

---

## Build Verification & CLI Commands
Duration: 5

Verify the configuration from the terminal:

```bash
# Query declared modules
lightbuild query modules

# Run unit tests across modules
lightbuild test

# Compile the application artifact
lightbuild build
```

---

## Primary Sources & References

* **Android Dev Summit Session:**  
  * [Declarative, agent-ready Android builds with Lightbuild](https://developer.android.com/events/dev-summit/talks/declarative-agent-ready-android-builds-with-lightbuild)
  * [YouTube Recording](https://www.youtube.com/watch?v=0mYQtt2RfoQ)
* **Official Google Documentation:**  
  * [Lightbuild Guide for AI Agents](https://developer.android.com/tools/agents/lightbuild)
* **Companion Codebase:**  
  * [kartikarora/ICanHazStream (GitHub)](https://github.com/kartikarora/ICanHazStream)
* **Presentation Slides:**  
  * [Slide Deck](https://presentations.kartikarora.me/lightbuild/)

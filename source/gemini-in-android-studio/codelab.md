---
id: gemini-in-android-studio
summary: Master practical AI workflows in Android Studio with ICanHazStream. Refactor legacy Java and XML code, generate Compose UI from wireframe sketches, build multi-file features with Agent Mode, connect GitHub MCP, run Journeys E2E tests, and script workflows with the Android CLI.
categories: AI, Android, Compose
environments: Android
status: Draft
authors: Kartik Arora
feedback_link: mailto:hello@kartikarora.me
tags: ai, gemini, android-studio, agent-mode, compose, mcp, journeys, android-cli
---

# Gemini in Android Studio: The ICanHazStream Workshop

## Welcome & starter setup
Duration: 7

> **Draft Review Notice**: This draft was generated with the help of AI and may contain mistakes. It is currently being reviewed by the author for correctness and ease of completion. {.warning}

![ICanHazStream Workshop Banner](images/poster.svg)

**ICanHazStream** (`me.kartikarora.icanhazstream`) is a multi-module Android app that tracks movie and TV streaming availability across platforms like Netflix, Disney+, Prime Video, Apple TV, Stan, and Binge.

In this workshop, you will use **Gemini in Android Studio** to modernise legacy code, generate Compose UI from wireframes, scaffold multi-module features with **Agent Mode**, connect external context via **GitHub MCP**, and automate tests with **Studio Journeys** and the **Android CLI**.

### Prerequisites
* **Android Studio:** Latest **Quail (2026.1.3+)** or **Rabbit Canary (2026.2.1+)**.
* **Google Account:** Signed in to Android Studio for Gemini access.
* **JDK:** JDK 21+.

[Download Android Studio (Quail Stable)](https://developer.android.com/studio){.buttonPrimary icon=download}

[Download Android Studio Preview (Rabbit Canary)](https://developer.android.com/studio/preview){.buttonSecondary icon=download}

> Use a personal `@gmail.com` account. Corporate accounts often restrict cloud AI indexing. {.warning}

### 1. Open the starter project
Open **`ICanHazStream`** in Android Studio. Key modules include:
* `:app`: Navigation graph (`StreamNavGraph.kt`).
* `:feature:explore`: Trending movies and provider discovery.
* `:feature:detail`: Movie details and "Where to Watch" availability.
* `:feature:watchlist`: Saved watchlist and price drop alerts.
* `:core:ui`: Ready-made design tokens and components (`MovieCard`, `ProviderBadge`).
* `:core:data`: Repositories and Ktor Client 3.5.2 networking.
* `:core:model`: `@Serializable` domain models (`Movie`, `StreamingProvider`).
* `:core:testing`: In-memory test fakes (`FakeMovieRepository`).

### 2. Install the Android CLI
The `android` CLI allows terminal scripts and AI agents to interact directly with Android Studio tools and daemons.

[Android CLI Documentation & Guide](https://developer.android.com/tools/android-cli){.buttonPrimary icon=terminal}

Install via terminal:

**macOS (Apple Silicon):**
```bash
curl -fsSL https://dl.google.com/android/cli/latest/darwin_arm64/install.sh | bash
```

**macOS (Intel):**
```bash
curl -fsSL https://dl.google.com/android/cli/latest/darwin_x86_64/install.sh | bash
```

**Linux (x86_64):**
```bash
curl -fsSL https://dl.google.com/android/cli/latest/linux_x86_64/install.sh | bash
```

**Windows (cmd):**
```cmd
curl -fsSL https://dl.google.com/android/cli/latest/windows_x86_64/install.cmd -o "%TEMP%\install-android.cmd" && "%TEMP%\install-android.cmd"
```

Verify installation:
```bash
android --version
```

### 3. Install the @kartikarora Compose theme skill
Install the brand skill so Gemini reuses existing `:core:ui` components (`MovieCard`, `ProviderBadge`) instead of generating generic composables:

```bash
npx skills install https://distribute.kartikarora.me/ai/kartikarora-compose-theme.skill
```

### 4. Enable context sharing and Studio Labs
1. Open **Settings** (`Cmd+,` / `Ctrl+Alt+S`).
2. Go to **Tools > Gemini** and enable **Enable context sharing**.
3. Go to **Studio Labs** and enable:
   * **Agent Mode**
   * **Transform UI with Gemini**
   * **Journeys for Android Studio**

![Studio Labs Settings](images/studio-labs-settings.svg)

## Project guardrails
Duration: 8

Establish engineering conventions in `AGENTS.md` and block sensitive files with `.aiexclude`.

![Guardrails Architecture](images/guardrails-architecture.svg)

### 1. Define project engineering standards
Create **`AGENTS.md`** in the project root:

**AGENTS.md**
````markdown
# ICanHazStream: AI Engineering Guidelines

### Architecture and code conventions
- Pattern: Clean Architecture with UDF and MVVM.
- State: Expose immutable `StateFlow` from ViewModels via `asStateFlow()`. No LiveData in new code.
- Networking and serialization: Use Ktor Client 3.5.2 and kotlinx.serialization.
- Testing: Use in-memory test fakes (`FakeMovieRepository`) and Turbine for Flow tests.
- UI system: Use composables from `:core:ui` with Space Grotesk typography and Material 3 colour tokens.
````

### 2. Block sensitive files from AI indexing
Create **`.aiexclude`** in the project root to prevent API keys and credentials from being indexed or sent to cloud models:

**.aiexclude**
```text
local.properties
*.jks
*.keystore
secrets/
tmdb-api-key.txt
streaming-secrets.json
```

## Inline prompts & live diffs
Duration: 8

Use in-editor inline prompts (`Cmd+\` / `Ctrl+\`) to refactor code without leaving your file.

### 1. Open the target ViewModel
Open **`:feature:explore/src/main/kotlin/me/kartikarora/icanhazstream/explore/TrendingMoviesViewModel.kt`**:

**TrendingMoviesViewModel.kt**
```kotlin
private val _trendingMovies = MutableLiveData<List<Movie>>()
val trendingMovies: LiveData<List<Movie>> = _trendingMovies
```

### 2. Refactor with inline prompt
1. Highlight `_trendingMovies`.
2. Press **`Cmd + \`** (macOS) or **`Ctrl + \`** (Windows/Linux).
3. Enter:

```text
Refactor this LiveData stream to StateFlow with an initial empty list, and expose an immutable asStateFlow().
```

4. Review the inline diff and press **Accept** (`Cmd+Enter`).

![Inline Diff Preview](images/inline-diff-demo.svg)

> This is an example of what the generated output might look like. Gemini may generate something different for you. {.warning}

**TrendingMoviesViewModel.kt**
```kotlin
private val _trendingMovies = MutableStateFlow<List<Movie>>(emptyList())
val trendingMovies: StateFlow<List<Movie>> = _trendingMovies.asStateFlow()
```

## Java to Kotlin migration
Duration: 7

Convert legacy Java utilities into idiomatic Kotlin functions.

### 1. Inspect the legacy calculation logic
Open **`:core:data/src/main/java/me/kartikarora/icanhazstream/data/legacy/WatchCostUtils.java`**:

**WatchCostUtils.java**
```java
package me.kartikarora.icanhazstream.data.legacy;

public class WatchCostUtils {
    public static double calculateOptimalWatchCost(double monthlySubscription, double rentPrice, int expectedViews) {
        if (monthlySubscription <= 0.0 || rentPrice <= 0.0 || expectedViews <= 0) {
            return 0.0;
        }
        double totalRentalCost = rentPrice * expectedViews;
        return Math.min(monthlySubscription, totalRentalCost);
    }
}
```

### 2. Run the transform
1. Select the code in `WatchCostUtils.java`.
2. Right-click and choose **Gemini > Transform selected code**.
3. Prompt:

```text
Convert this Java utility class to an idiomatic Kotlin file with a top-level calculation function in package me.kartikarora.icanhazstream.data.
```

4. Save the output to **`:core:data/src/main/kotlin/me/kartikarora/icanhazstream/data/WatchCostMath.kt`** and delete the old `.java` file.

> This is an example of what the generated output might look like. Gemini may generate something different for you. {.warning}

**WatchCostMath.kt**
```kotlin
package me.kartikarora.icanhazstream.data

fun calculateOptimalWatchCost(
    monthlySubscription: Double,
    rentPrice: Double,
    expectedViews: Int
): Double {
    if (monthlySubscription <= 0.0 || rentPrice <= 0.0 || expectedViews <= 0) return 0.0
    val totalRentalCost = rentPrice * expectedViews
    return totalRentalCost.coerceAtMost(monthlySubscription)
}
```

## Legacy XML to Compose
Duration: 10

Migrate an XML layout and ViewHolder to a declarative `@Composable` using brand design tokens.

![XML to Compose Migration](images/xml-to-compose.svg)

### 1. Inspect the layout and target file
Open **`:feature:explore/src/main/res/layout/item_movie_provider.xml`** and **`:feature:explore/src/main/kotlin/me/kartikarora/icanhazstream/explore/MovieProviderCard.kt`**:

**MovieProviderCard.kt**
```kotlin
package me.kartikarora.icanhazstream.explore

import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import me.kartikarora.icanhazstream.model.StreamingProvider

@Composable
fun MovieProviderCard(
    provider: StreamingProvider,
    onClick: () -> Unit,
    modifier: Modifier = Modifier
) {
}
```

### 2. Convert with Gemini Chat
Open **Gemini Chat** (`View > Tool Windows > Agent`) and enter:

```text
@item_movie_provider.xml Convert this XML layout and its ViewHolder into a declarative Jetpack Compose composable for MovieProviderCard.kt. Use the @kartikarora design tokens, MovieCard, and ProviderBadge components from :core:ui.
```

> This is an example of what the generated output might look like. Gemini may generate something different for you. {.warning}

**MovieProviderCard.kt**
```kotlin
package me.kartikarora.icanhazstream.explore

import androidx.compose.foundation.layout.*
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import me.kartikarora.icanhazstream.model.StreamingProvider
import me.kartikarora.icanhazstream.ui.components.MovieCard
import me.kartikarora.icanhazstream.ui.components.ProviderBadge

@Composable
fun MovieProviderCard(
    provider: StreamingProvider,
    onClick: () -> Unit,
    modifier: Modifier = Modifier
) {
    MovieCard(
        onClick = onClick,
        modifier = modifier
            .fillMaxWidth()
            .padding(horizontal = 16.dp, vertical = 8.dp)
    ) {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(16.dp),
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.SpaceBetween
        ) {
            Column(modifier = Modifier.weight(1f)) {
                Text(
                    text = provider.name,
                    style = MaterialTheme.typography.titleMedium,
                    color = MaterialTheme.colorScheme.onSurface
                )
                Spacer(modifier = Modifier.height(4.dp))
                Text(
                    text = "Quality: ${provider.quality} • Plan: ${provider.planType}",
                    style = MaterialTheme.typography.bodySmall,
                    color = MaterialTheme.colorScheme.onSurfaceVariant
                )
            }
            ProviderBadge(text = provider.quality)
        }
    }
}
```

## Day-to-day assistant tools
Duration: 5

Speed up daily tasks with built-in documentation, code explanation, and commit helpers.

### 1. Generate KDoc comments
Open **`:core:model/src/main/kotlin/me/kartikarora/icanhazstream/model/Movie.kt`**. Right-click the class and select **Gemini > Document Class**:

> This is an example of what the generated output might look like. Gemini may generate something different for you. {.warning}

**Movie.kt**
```kotlin
package me.kartikarora.icanhazstream.model

import kotlinx.serialization.Serializable

/**
 * Represents a film or TV title available across streaming services.
 *
 * @property id Unique TMDB or Watchmode identifier.
 * @property title The official release title.
 * @property overview Synopsis and storyline summary.
 * @property releaseYear The release year.
 * @property rating Average user rating score out of 10.
 * @property posterUrl Absolute URL for the title cover artwork.
 */
@Serializable
data class Movie(
    val id: String,
    val title: String,
    val overview: String,
    val releaseYear: Int,
    val rating: Double,
    val posterUrl: String
)
```

### 2. Explain regular expressions
Highlight any complex regex (e.g. `^tt\d{7,8}$` or `^https://(www\.)?(netflix|disneyplus|apple)\.com/.+$`), right-click, and select **Gemini > Explain Code** for a breakdown of capture groups and patterns.

### 3. Generate commit messages
Stage modified files in the **Commit tool window** (`Cmd+K` / `Ctrl+K`) and click **Suggest Commit Message**:

> This is an example of what the generated output might look like. Gemini may generate something different for you. {.warning}

```text
feat(explore): convert movie provider item layout to Compose and add KDoc
```

## Wireframe to Compose
Duration: 10

Attach UI wireframe sketches directly into Gemini Chat to generate Compose layouts.

![Where to Watch Wireframe](images/wireframe-sample.svg)

### 1. Locate the wireframe asset
Use **`assets/wireframe-where-to-watch.png`** (or the diagram above) and open **`:feature:detail/src/main/kotlin/me/kartikarora/icanhazstream/detail/WhereToWatchScreen.kt`**.

### 2. Generate screen from mockup
Attach `assets/wireframe-where-to-watch.png` in **Gemini Chat** with this prompt:

```text
Generate the Jetpack Compose screen for WhereToWatchScreen.kt matching this wireframe mockup.
Include:
1. Movie poster header with title, release year, runtime, and 4K UHD badge.
2. Streaming subscription provider cards (Netflix, Disney+).
3. Rent and buy options (Apple TV, Google Play).
4. "Add to Watchlist & Alerts" button at the bottom.
Use Material 3 components and design tokens from :core:ui.
```

Paste the generated composable into `WhereToWatchScreen.kt`.

> This is an example of what the generated output might look like. Gemini may generate something different for you. {.warning}

## Interactive Compose Previews
Duration: 8

Iterate on visual styling directly inside the **Compose Preview** panel using natural language.

### 1. Add preview functions
At the bottom of `WhereToWatchScreen.kt`, right-click and choose **Gemini > Generate Compose Preview**:

> This is an example of what the generated output might look like. Gemini may generate something different for you. {.warning}

```kotlin
@PreviewLightDark
@Composable
private fun WhereToWatchScreenPreview() {
    ICanHazStreamTheme {
        WhereToWatchScreen(
            movieId = "inception-2010",
            onNavigateBack = {}
        )
    }
}
```

### 2. Style via Transform UI
1. Build the project (`Cmd+F9` / `Ctrl+F9`) to render the preview.
2. Click **Transform UI with Gemini** in the preview toolbar.
3. Prompt:

```text
Set provider card corner radius to 16dp, add 4K HDR badges next to streaming platforms, and style the 'Add to Watchlist' button with primary container styling.
```

![Compose Preview Transform](images/transform-ui-preview.svg)

## Connecting GitHub MCP
Duration: 8

Connect Gemini to the **GitHub MCP Server** to ground code generation in repository issues, PRDs, and pull requests.

![MCP Architecture](images/mcp-architecture.svg)

### 1. Configure the MCP server
Add the GitHub MCP server to **`.gemini/mcp.json`** (or via **Settings > Tools > Gemini > MCP Servers**):

**.gemini/mcp.json**
```json
{
  "mcpServers": {
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "${GITHUB_TOKEN}"
      }
    }
  }
}
```

### 2. Query upstream context in chat
In **Gemini Chat**, enter:

```text
Using the connected GitHub MCP server, fetch the product requirements and accepted schema from issue #42 ('Watchlist price drop alerts and regional availability notifications'). Ground the implementation in our existing data layer.
```

Gemini queries `get_issue` and `get_file_contents` over MCP to retrieve the exact requirements before scaffolding.

## Multi-module Agent Mode
Duration: 12

Use **Agent Mode** to plan, write, and link features across multiple modules autonomously.

![Agent Mode Loop](images/agent-mode-loop.svg)

### 1. Launch Agent Mode
Toggle the Gemini tool window from **Chat** to **Agent Mode** and submit:

```text
Build the "Watchlist & Price Drop Alerts" feature in :feature:watchlist.
1. Create WatchlistViewModel.kt exposing WatchlistUiState (Loading, Empty, Success).
2. Create WatchlistRepository.kt with functions to add movies, track rental price drops, and observe saved titles.
3. Build WatchlistScreen.kt with movie cards, price alert toggles, and swipe-to-delete.
4. Add the watchlist route to the root StreamNavGraph.kt in :app.
Follow the rules in AGENTS.md and use Ktor 3.5.2 and StateFlow.
```

### 2. Review and apply changes
Agent Mode creates `WatchlistViewModel.kt`, `WatchlistRepository.kt`, and `WatchlistScreen.kt` in `:feature:watchlist`, and registers the route in `:app/src/main/kotlin/.../StreamNavGraph.kt`.

Review the structured multi-file diff and click **Apply All Changes**.

## Automated build repair
Duration: 8

Let Agent Mode run Gradle build tasks and fix missing dependencies automatically.

### 1. Request automated compilation
In the Agent window, submit:

```text
Check and compile the project by running a Gradle build for :feature:watchlist. If any dependencies or imports are missing in build.gradle.kts or libs.versions.toml, diagnose and fix them.
```

### 2. Self-healing cycle
Agent Mode:
1. Executes `./gradlew :feature:watchlist:assembleDebug`.
2. Spots missing test dependencies (`runTest`, `turbine`).
3. Updates `feature/watchlist/build.gradle.kts` and syncs Gradle.
4. Re-runs the build until compilation succeeds.

## Unit tests & Turbine
Duration: 8

Generate ViewModel unit tests backed by in-memory fakes and Turbine Flow assertions.

### 1. Open the test skeleton
Open **`:feature:watchlist/src/test/kotlin/me/kartikarora/icanhazstream/watchlist/WatchlistViewModelTest.kt`**.

### 2. Generate tests with Gemini
Right-click in the editor and choose **AI > Generate Unit Tests** (or prompt in chat):

```text
Generate unit tests for WatchlistViewModel using FakeMovieRepository from :core:testing and app.cash.turbine.test. Include test cases for empty state, adding a movie to watchlist, and price drop notifications.
```

> This is an example of what the generated output might look like. Gemini may generate something different for you. {.warning}

**WatchlistViewModelTest.kt**
```kotlin
package me.kartikarora.icanhazstream.watchlist

import app.cash.turbine.test
import kotlinx.coroutines.test.runTest
import me.kartikarora.icanhazstream.model.Movie
import me.kartikarora.icanhazstream.testing.FakeMovieRepository
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Test

class WatchlistViewModelTest {

    private val fakeRepository = FakeMovieRepository()
    private val viewModel = WatchlistViewModel(repository = fakeRepository)

    @Test
    fun `when movie is added to watchlist, state updates with saved title`() = runTest {
        viewModel.uiState.test {
            assertEquals(WatchlistUiState.Empty, awaitItem())

            val sampleMovie = Movie(
                id = "m1",
                title = "Inception",
                overview = "Dream within a dream",
                releaseYear = 2010,
                rating = 8.8,
                posterUrl = "https://image.tmdb.org/t/p/w500/inception.jpg"
            )

            viewModel.addToWatchlist(sampleMovie)

            val successState = awaitItem() as WatchlistUiState.Success
            assertEquals(1, successState.watchlist.size)
            assertEquals("Inception", successState.watchlist.first().title)
        }
    }
}
```

Run tests (`Ctrl+Shift+R` / `Cmd+Shift+R`) to confirm they pass.

## Crash debugging in Logcat
Duration: 7

Diagnose and patch exceptions directly from Logcat using **Ask Gemini**.

### 1. Trigger the crash
Run the app on the emulator, open Explore, tap **"Untracked Indie Release #9"**, and set region filter to **"Australia (AU)"**.

### 2. Inspect in Logcat
1. Open **Logcat** (`Cmd+6` / `Alt+6`).
2. Find the error:
   ```text
   FATAL EXCEPTION: main
   java.lang.NullPointerException: Missing streaming provider list for region 'AU' in MovieDetailViewModel.kt:42
   ```
3. Click **Ask Gemini** next to the stack trace.

![Logcat Ask Gemini](images/logcat-ask-gemini.svg)

### 3. Apply the patch
Gemini highlights the unhandled null provider list in `MovieDetailViewModel.kt`:

> This is an example of what the generated output might look like. Gemini may generate something different for you. {.warning}

```kotlin
val providers = movie.regionalProviders[selectedRegion] ?: emptyList()
if (providers.isEmpty()) {
    _uiState.value = MovieDetailUiState.NoProvidersAvailable(selectedRegion)
    return
}
```

Apply the change and re-run to verify the fix.

## Studio Journeys E2E tests
Duration: 10

Describe end-to-end user journeys in plain English and execute them on a live emulator using multimodal vision AI.

![Studio Journeys Flow](images/journeys-flow.svg)

### 1. Inspect the journey definition
Open **`journeys/find_streaming_provider.journey`**:

**find_streaming_provider.journey**
```yaml
name: Find Streaming Provider for Inception
targetApp: me.kartikarora.icanhazstream
steps:
  - Launch the app "ICanHazStream"
  - Tap on the search bar and enter "Inception"
  - Tap on the first movie card in the results
  - Select regional filter "AU"
  - Verify that the screen displays "Netflix" under 4K UHD streaming
```

### 2. Run the journey
1. Start your Android Emulator.
2. Open the **Journeys tool window**.
3. Select `find_streaming_provider.journey` and click **Run Journey**.
4. Watch Gemini interact with the emulator UI and verify assertions automatically.

## Headless Android CLI
Duration: 8

Use the **Android CLI** to inspect symbols, render previews, and run lint checks from scripts and terminal agents.

![Android CLI Bridge](images/android-cli-bridge.svg)

### Useful commands
```bash
# Inspect project modules and configuration
android project inspect

# Search for symbols across all modules
android symbol find "MovieRepository"

# Render Compose previews headlessly
android preview render --module feature:detail

# Run lint checks and apply automatic fixes
android build --fix-lint
```

## App Quality Insights
Duration: 5

Review production telemetry from Firebase Crashlytics and Google Play Vitals inside Android Studio with one-click Gemini diagnostics.

![App Quality Insights Overview](images/aqi-slide-overview.svg)

1. **Open AQI:** Navigate to **View > Tool Windows > App Quality Insights**.
2. **Review insights:** Click **Explain Crash with Gemini** on recurring crash clusters.
3. **Apply fix:** Apply the suggested patch directly to your Kotlin source file.

## Summary & next steps
Duration: 2

![ICanHazStream Complete](images/poster.svg)

### Summary of key workflows
* **Guardrails:** Ground code generation with `AGENTS.md`, `.aiexclude`, and design token skills.
* **In-Editor AI:** Refactor `LiveData` to `StateFlow` with inline prompts (`Cmd+\`).
* **Modernisation:** Convert legacy Java calculation math and XML layouts to Compose.
* **Design to Code:** Generate UI from wireframes and style interactively in Compose Previews.
* **Context & Tooling:** Connect upstream repository context via **GitHub MCP**.
* **Agent Mode:** Scaffold multi-module features and self-heal Gradle build issues.
* **Verification:** Test `StateFlow` with Turbine fakes, debug crashes in Logcat, and automate E2E testing with **Studio Journeys** and the **Android CLI**.

### Next steps
* **On-device AI:** Experiment with **Gemini Nano via AICore** using the ML Kit GenAI Prompt API.
* **Prompt Library:** Store reusable team prompts in `.idea/project.prompts.xml`.
* **Questions & Feedback:** Reach out at [hello@kartikarora.me](mailto:hello@kartikarora.me).

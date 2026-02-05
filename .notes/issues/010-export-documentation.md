# Issue 10: Export configuration, documentation, and alpha deployment

## Description

Configure Godot for desktop export, create documentation for users and developers, and prepare the alpha version for deployment and feedback collection.

## Tasks

- [ ] Configure export presets:
  - **Windows Desktop**:
    - Export template: Windows Desktop
    - Executable name: `TokenTree.exe`
    - Include debug symbols (for alpha)
    - Set icon and metadata
  - **macOS**:
    - Export template: macOS
    - Bundle identifier: `com.yourname.tokentree`
    - Set icon and metadata
  - **Linux**:
    - Export template: Linux/X11
    - Executable name: `TokenTree`
    - Set permissions

- [ ] Create user documentation (`docs/user-guide.md`):
  - Installation instructions
  - Ollama setup guide
  - How to play
  - Parameter explanations
  - Troubleshooting
  - FAQ

- [ ] Create developer documentation (`docs/developer-guide.md`):
  - Project structure overview
  - Architecture description
  - How to build from source
  - Code style guidelines
  - How to add new features
  - How to add new layout algorithms
  - How to add new LLM backends

- [ ] Create README.md:
  - Project description
  - Features
  - Screenshots (add later)
  - Installation instructions
  - Quick start guide
  - System requirements
  - License

- [ ] Create Ollama setup guide (`docs/ollama-setup.md`):
  - Download and install Ollama
  - Pull recommended models (llama3.2:1b, gemma2:2b)
  - Verify installation
  - Configure Ollama (if needed)
  - Troubleshooting Ollama issues

- [ ] Create release notes (`docs/release-notes-alpha.md`):
  - Version number (0.1.0-alpha)
  - Features implemented
  - Known issues
  - System requirements
  - Future plans

- [ ] Create feedback collection:
  - In-game feedback button (opens form)
  - Google Form or Typeform for feedback
  - Questions:
    - Overall experience (1-5)
    - Visual clarity (1-5)
    - Ease of use (1-5)
    - Favorite feature
    - Least favorite feature
    - Suggestions for improvement
    - Bug reports

- [ ] Test exports:
  - Export to Windows
  - Export to macOS (if possible)
  - Export to Linux
  - Test each export:
    - Launch without errors
    - Connect to Ollama
    - Generate tokens
    - Explore branches
    - Adjust parameters
    - Search for substrings

- [ ] Create distribution package:
  - ZIP archive with executable
  - Include README and user guide
  - Include Ollama setup guide
  - Test extraction and launch

- [ ] Prepare GitHub release:
  - Tag version (v0.1.0-alpha)
  - Create release with description
  - Attach distribution packages
  - Link to feedback form

## Acceptance Criteria

- [ ] Export presets configured for all platforms
- [ ] User documentation is clear and complete
- [ ] Developer documentation covers architecture
- [ ] README provides good overview
- [ ] Ollama setup guide works
- [ ] Release notes document alpha status
- [ ] Feedback form is accessible
- [ ] Exports launch and run correctly
- [ ] Distribution package is complete
- [ ] GitHub release is created

## Notes

- Keep documentation concise but thorough
- Use screenshots where helpful (add later)
- Include system requirements clearly
- Make feedback form easy to complete
- Test on multiple systems if possible

## System Requirements

**Minimum:**
- OS: Windows 10+, macOS 11+, or modern Linux
- RAM: 4 GB
- Storage: 100 MB for game, 1-6 GB for Ollama models
- GPU: Integrated graphics or better
- Network: None (local Ollama)

**Recommended:**
- OS: Windows 11, macOS 12+, or Ubuntu 22.04+
- RAM: 8 GB
- Storage: 10 GB for multiple Ollama models
- GPU: Dedicated GPU with 4+ GB VRAM
- Network: None (local Ollama)

## Documentation Structure

```
docs/
├── user-guide.md          # How to install and play
├── developer-guide.md     # How to build and extend
├── ollama-setup.md        # Ollama installation guide
├── api-reference.md       # API documentation (future)
└── release-notes-alpha.md # Alpha release notes
```

## Related Issues

- All previous issues (foundation for alpha)

## Future Work

- Add automated build pipeline (GitHub Actions)
- Create installer packages (NSIS, DMG, AppImage)
- Add auto-update mechanism
- Create website for the game
- Add analytics (opt-in)
- Prepare for beta release

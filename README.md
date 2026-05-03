# VELVIA AI - Intelligence Hub

Velvia AI is an advanced, autonomous intelligence suite designed to provide a highly interactive, cyberpunk-themed chatbot experience. Built with Flask, Groq API, and styled with TailwindCSS, this web application brings multiple AI personas (like ZENVIX and AARVIX) to life.

## Features

- **Multiple Personalities**: Switch between different AI models and system prompts instantly.
- **Cyberpunk UI**: A dynamic, glassmorphic UI with micro-animations, neon text glows, and an animated intro sequence.
- **Loading Skeletons**: Enjoy smooth transitions with skeleton loaders while the AI computes its response.
- **Code Highlighting**: Beautiful syntax highlighting for code blocks using Highlight.js.
- **Markdown Support**: Rich text rendering for AI responses including bolding, lists, and structure.
- **Export Session**: Save your entire conversation to a local text file with one click.
- **Copy to Clipboard**: Easily copy AI responses directly to your clipboard.
- **Dark / Light Mode**: A toggleable theme for your comfort.

## Prerequisites

- Python 3.8+
- A valid Groq API Key

## Setup

1. Clone or download the repository.
2. Ensure you have your `.env` file in the root directory containing your API key:
   ```env
   GROQ_API_KEY=your_api_key_here
   ```
3. Run the automated setup script to create a virtual environment and install dependencies:
   ```cmd
   .\setup.bat
   ```

## Running the Application

You can start the application by running the consolidated startup script. This script automatically checks your environment and starts the Flask server.

```cmd
.\run__all.bat
```
*(Note: If you run into issues, ensure you are using `.\run__all.bat` and not `.\run_all.bat`.)*

Once the server starts, open your browser and go to:
**http://127.0.0.1:5000**

## Technologies Used

- **Backend**: Python, Flask, Groq API
- **Frontend**: HTML5, Vanilla JS, TailwindCSS, FontAwesome
- **Styling Details**: Space Grotesk & Inter fonts, custom scrollbars, keyframe animations
- **Markdown**: Marked.js, Highlight.js

# OpenAI TTS Voice Sampler

A simple script that uses the [OpenAI Text-to-Speech
API](https://platform.openai.com/docs/guides/text-to-speech)\
to generate and download sample audio files with the built-in voices.

🎧 Useful for: - Testing different voices locally\

- Prototyping AI voice apps\
- Creating quick audio demos

---

## 📦 Prerequisites

1.  Install [tsx](https://www.npmjs.com/package/tsx) globally:

    ```bash
    npm install -g tsx
    ```

2.  Install other project dependencies:

    ```bash
    npm install
    ```

3.  Get your OpenAI API key from:\
    👉 <https://platform.openai.com/api-keys>

---

## 🚀 Usage

Run the script with your API key:

```bash
tsx src/main --apiKey=<OPEN_API_KEY>
```

The script will: - Call the OpenAI TTS API\

- Model used `gpt-4o-mini-tts`
- Generate `.mp3` files for each built-in voice\
- Save them to your local machine

---

## 🗂 Output

You'll find the generated audio files inside the assets/voices folder, named
after each voice (e.g., `alloy.mp3`, `echo.mp3`, `fable.mp3`).

---

## 📝 Notes

- Make sure your API key has access to the TTS models.\
- By default, the sample text is included for each built-in voice, but
  you can customize this in the `voices` config.

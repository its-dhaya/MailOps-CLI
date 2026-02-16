import speech_recognition as sr
import sys

sys.stdout.reconfigure(encoding='utf-8')

recognizer = sr.Recognizer()
mic = sr.Microphone()

print("🎙 Listening... Speak now.\n", flush=True)

final_text = []

with mic as source:
    recognizer.adjust_for_ambient_noise(source)

    while True:
        try:
            print("Waiting for speech...", flush=True)

            audio = recognizer.listen(
                source,
                timeout=5,          # waits max 5 sec for speech
                phrase_time_limit=8 # stops after 8 sec talking
            )

            text = recognizer.recognize_google(audio)

            print(text, flush=True)

            final_text.append(text)

        except sr.WaitTimeoutError:
            # ⭐ THIS IS THE MAGIC
            # Means user stopped speaking
            break

        except sr.UnknownValueError:
            pass

print("\n===FINAL_TRANSCRIPT===")
print(" ".join(final_text), flush=True)

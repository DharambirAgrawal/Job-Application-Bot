import sys
import os
import logging
import google.generativeai as genai
from google.api_core.exceptions import GoogleAPIError

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

# Now import from other_folder
from utils.data import PROMPTS


logger = logging.getLogger(__name__)

class GeminiTextGenerationError(RuntimeError):
    """Raised when Gemini API call fails."""


class GeminiTextGenerator:
    def __init__(self, api_key, model="gemini-2.5-flash"):
        if not api_key:
            raise ValueError("Gemini API key is required.")

        self.api_key = api_key
        self.model_name = model
        self.prompts = PROMPTS.copy()

        genai.configure(api_key=self.api_key)
        self.model = genai.GenerativeModel(self.model_name)
        logger.info(f"Gemini model '{self.model_name}' initialized.")

    def generate(self, text, task):
        """Generate text based on task and input text."""
        if not text.strip():
            raise ValueError("Input text cannot be empty.")
        if task not in self.prompts:
            raise ValueError(f"No prompt found for task '{task}'.")

        prompt = self.prompts[task].format(input_text=text.strip())
        logger.debug(f"Generated prompt for '{task}': {prompt[:150]}...")

        try:
            response = self.model.generate_content(prompt)
        except GoogleAPIError as e:
            logger.exception(f"Gemini API request failed for '{task}'.")
            raise GeminiTextGenerationError("Gemini API request failed.") from e
        except Exception as e:
            logger.exception(f"Unexpected Gemini error for '{task}'.")
            raise GeminiTextGenerationError("Unexpected Gemini error.") from e

        result = getattr(response, "text", "").strip()
        if not result:
            logger.error(f"Gemini returned empty response for '{task}'.")
            raise GeminiTextGenerationError("Gemini returned no text.")

        return result

    def add_prompt(self, task, template):
        """Add or update a task prompt."""
        if not task:
            raise ValueError("Task name cannot be empty.")
        if "{input_text}" not in template:
            raise ValueError("Template must include '{input_text}' placeholder.")

        self.prompts[task] = template.strip()
        logger.info(f"Prompt updated for task '{task}'.")



"""
gemini = GeminiTextGenerator(api_key="YOUR_GEMINI_API_KEY")

# Generate a cover letter
result = gemini.generate(
    "I am applying for a Data Analyst role with experience in SQL and Python.",
    "cover_letter"
)
print(result)

# Add your own custom template
gemini.add_prompt(
    "linkedin_bio",
    "Write a short LinkedIn bio for this profile info:\n{input_text}"
)
bio = gemini.generate("AI engineer with 3 years of ML experience.", "linkedin_bio")
print(bio)


"""

from app.models.mbti_models import MBTIQuestion, MBTIQuizResponse
from openai import OpenAI
import os

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

# Mapping for each question's answer.
# For questions 1-4, the mapping corresponds to the traditional MBTI dimensions.
# For questions 5-7, you can define your own mapping based on additional aspects.
ANSWER_MAPPING = {
    1: {"A": "E", "B": "I"},
    2: {"A": "S", "B": "N"},
    3: {"A": "T", "B": "F"},
    4: {"A": "J", "B": "P"},
    5: {"A": "Action-oriented", "B": "Reflection"},      # Example: "Action-oriented" vs. "Reflective"
    6: {"A": "Risk-taker", "B": "Security-oriented"},           # Example: "Risk-taker" vs. "Security-oriented"
    7: {"A": "Achievement-driven", "B": "Harmony-seeking"}       # Example: "Achievement-driven" vs. "Harmony-seeking"
}

# List of MBTI questions in English with generic answer options "A" and "B".
QUESTIONS = [
    MBTIQuestion(
        question_id=1,
        question_text="Do you prefer group activities (A) or solitary time (B)?",
        options=["A", "B"]  # A maps to E, B maps to I
    ),
    MBTIQuestion(
        question_id=2,
        question_text="Do you focus more on concrete facts (A) or abstract ideas (B)?",
        options=["A", "B"]  # A maps to S, B maps to N
    ),
    MBTIQuestion(
        question_id=3,
        question_text="Do you make decisions primarily based on logic (A) or emotions (B)?",
        options=["A", "B"]  # A maps to T, B maps to F
    ),
    MBTIQuestion(
        question_id=4,
        question_text="Do you prefer to have things planned (A) or keep your options open (B)?",
        options=["A", "B"]  # A maps to J, B maps to P
    ),
    MBTIQuestion(
        question_id=5,
        question_text="Are you more action-oriented (A) or reflective (B)?",
        options=["A", "B"]
    ),
    MBTIQuestion(
        question_id=6,
        question_text="Do you tend to take risks (A) or prioritize security (B)?",
        options=["A", "B"]
    ),
    MBTIQuestion(
        question_id=7,
        question_text="Are you more driven by achievement (A) or by maintaining harmony (B)?",
        options=["A", "B"]
    )
]

def get_mbti_questions() -> list[MBTIQuestion]:
    """
    Returns the updated list of MBTI questions in English.
    """
    return QUESTIONS

def process_quiz_submission(quiz_response: MBTIQuizResponse) -> str:
    """
    Processes the quiz answers by mapping generic choices to actual values
    and then uses an LLM to provide a complete personality description.
    """
    if len(quiz_response.answers) != 7:
        raise ValueError(f"Expected 7 answers, received {len(quiz_response.answers)}.")

    mapped_answers = {}
    for i in range(1, 8):
        raw_answer = quiz_response.answers[i - 1].upper()
        try:
            mapped_answers[i] = ANSWER_MAPPING[i][raw_answer]
        except KeyError:
            raise ValueError(f"Invalid answer for question {i}: {raw_answer}")

    # Build the prompt for the LLM with the mapped answers.
    prompt = (
        "Here are the questions of the personnality test:\n"
        f"1) {QUESTIONS[0].question_text}\n"
        f"2) {QUESTIONS[1].question_text}\n"
        f"3) {QUESTIONS[2].question_text}\n"
        f"4) {QUESTIONS[3].question_text}\n"
        f"5) {QUESTIONS[4].question_text}\n"
        f"6) {QUESTIONS[5].question_text}\n"
        f"7) {QUESTIONS[6].question_text}\n\n"
        "Here are the user's responses for the personality test:\n"
        f"1) {mapped_answers[1]}\n"
        f"2) {mapped_answers[2]}\n"
        f"3) {mapped_answers[3]}\n"
        f"4) {mapped_answers[4]}\n"
        f"5) {mapped_answers[5]} (supplementary measure)\n"
        f"6) {mapped_answers[6]} (supplementary measure)\n"
        f"7) {mapped_answers[7]} (supplementary measure)\n\n"
        "Based on these responses, provide a complete and detailed personality description "
        "of the user in 2-3 lines. Include insights about their general temperament, strengths, "
        "and potential areas for improvement. Your answer should be comprehensive and well-articulated."
    )

    response = client.chat.completions.create(
        model="gpt-4o",
        messages=[
            {"role": "system", "content": "You are a psychology expert specializing in personality assessments."},
            {"role": "user", "content": prompt}
        ],
        temperature=0.7,
    )
    personality_description = response.choices[0].message.content.strip()
    return personality_description


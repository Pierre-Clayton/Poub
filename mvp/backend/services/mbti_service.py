# backend/services/mbti_service.py

from typing import List
from models.mbti_models import MBTIQuestion, MBTIQuizResponse

# Example: A minimal set of 4 MBTI-based questions
QUESTIONS = [
    MBTIQuestion(
        question_id=1,
        question_text="1) Do you prefer group activities (E) or solitary time (I)?",
        options=["E", "I"]
    ),
    MBTIQuestion(
        question_id=2,
        question_text="2) Do you focus more on facts/details (S) or ideas/possibilities (N)?",
        options=["S", "N"]
    ),
    MBTIQuestion(
        question_id=3,
        question_text="3) Do you base decisions mostly on logic (T) or personal values (F)?",
        options=["T", "F"]
    ),
    MBTIQuestion(
        question_id=4,
        question_text="4) Do you prefer to have things decided (J) or keep options open (P)?",
        options=["J", "P"]
    )
]

def get_mbti_questions() -> List[MBTIQuestion]:
    """
    Return the list of MBTI questions (4 in this example).
    """
    return QUESTIONS

def calculate_personality(answers: List[str]) -> str:
    """
    Convert the user's quiz answers into a 4-letter MBTI type.
    We assume answers come in order: [E/I, S/N, T/F, J/P]
    """
    # Basic validation:
    if len(answers) != 4:
        raise ValueError(f"Expected 4 answers, got {len(answers)}.")
    
    # Each answer is one letter. We just concatenate them.
    mbti_type = "".join(answers).upper()
    return mbti_type

def process_quiz_submission(quiz_response: MBTIQuizResponse) -> str:
    """
    Takes a quiz submission, calculates MBTI, returns the type.
    """
    answers = quiz_response.answers
    personality_type = calculate_personality(answers)
    return personality_type

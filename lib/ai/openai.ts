import OpenAI from 'openai';

const openai = process.env.OPENAI_API_KEY 
  ? new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    })
  : null;

export async function generateQuestionsFromSource(sourceText: string, sourceType: string, count: number = 5) {
  if (!openai) {
    throw new Error('OpenAI API key not configured');
  }

  const prompt = `You are an expert in UK criminal law and police station procedures. Based on the following legal source text, generate ${count} high-quality multiple-choice questions that test understanding of key concepts.

Source Type: ${sourceType}
Source Text:
${sourceText.substring(0, 8000)}

For each question, provide:
1. A clear, well-formulated question text
2. 4 multiple choice options (labeled A, B, C, D)
3. The correct answer(s)
4. A brief explanation
5. An appropriate category (e.g., "Substantive Law", "Police Powers", "Interview Procedures", "Ethics", "Detainees' Rights")
6. A difficulty level (beginner, intermediate, or advanced)
7. Relevant source references

Return the questions as a JSON array with this structure:
[
  {
    "question_text": "Question text here",
    "options": {"A": "Option A", "B": "Option B", "C": "Option C", "D": "Option D"},
    "correct_answer": ["A"],
    "explanation": "Explanation of why this is correct",
    "category": "Category name",
    "difficulty": "beginner|intermediate|advanced",
    "source_refs": ["Reference to source"]
  }
]`;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are an expert in UK criminal law and police station representation. Generate accurate, factually correct questions based on legal sources.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.7,
    });

    const content = completion.choices[0]?.message?.content || '';
    const jsonMatch = content.match(/\[[\s\S]*\]/);
    
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    
    return [];
  } catch (error) {
    console.error('Error generating questions:', error);
    throw error;
  }
}

export async function checkDuplicateQuestion(questionText: string, existingQuestions: string[]): Promise<{ isDuplicate: boolean; similarity: number; similarQuestion?: string }> {
  if (existingQuestions.length === 0) {
    return { isDuplicate: false, similarity: 0 };
  }

  if (!openai) {
    // Fail safe: don't mark as duplicate if API not configured
    return { isDuplicate: false, similarity: 0 };
  }

  const prompt = `Compare this new question with existing questions and determine if it's a duplicate or very similar:

New Question: "${questionText}"

Existing Questions:
${existingQuestions.map((q, i) => `${i + 1}. ${q}`).join('\n')}

Analyze semantic similarity. Return JSON:
{
  "isDuplicate": true/false,
  "similarity": 0-100,
  "similarQuestion": "Most similar question text if similarity > 70"
}`;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are an expert at detecting duplicate or semantically similar questions. Analyze carefully.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.3,
    });

    const content = completion.choices[0]?.message?.content || '';
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    
    if (jsonMatch) {
      const result = JSON.parse(jsonMatch[0]);
      return {
        isDuplicate: result.isDuplicate || result.similarity > 80,
        similarity: result.similarity || 0,
        similarQuestion: result.similarQuestion,
      };
    }
    
    return { isDuplicate: false, similarity: 0 };
  } catch (error) {
    console.error('Error checking duplicates:', error);
    // Fail safe: don't mark as duplicate if check fails
    return { isDuplicate: false, similarity: 0 };
  }
}

export async function generateScenario(context: string): Promise<{
  scenario: string;
  options: string[];
  correctResponse: string;
  feedback: string;
}> {
  if (!openai) {
    throw new Error('OpenAI API key not configured');
  }

  const prompt = `Generate a realistic police station scenario for training police station representatives. 

Context: ${context || 'General police station representation scenario'}

Provide:
1. A detailed scenario description
2. Exactly 4 possible response options (labeled A, B, C, D)
3. The correct/optimal response (must be "A", "B", "C", or "D")
4. Detailed feedback explaining why it's correct

IMPORTANT REQUIREMENTS:
- Options must be labeled with letters: A, B, C, D (NOT numbers like "Option 1", "Option 2", etc.)
- Wrong answers MUST be plausible and legally sound, but still incorrect
- Wrong answers should:
  * Include partial correct information but miss key elements
  * Use similar legal language but apply it incorrectly
  * Represent common misconceptions or incomplete understanding
  * Be realistic enough that a knowledgeable person might consider them
  * NOT be obviously wrong or ridiculous
- The correctResponse must be a single letter: "A", "B", "C", or "D"
- In feedback, ALWAYS refer to options by their LETTER (e.g., "Option C is correct" NOT "Option 3 is correct")
- Make all options similar in length and detail level

Return JSON:
{
  "scenario": "Detailed scenario description",
  "options": ["Option A text", "Option B text", "Option C text", "Option D text"],
  "correctResponse": "C",
  "feedback": "Option C is correct because... (always refer to options by letter, e.g., 'Option C', not 'Option 3')"
}`;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are an expert in UK police station procedures and representation. Generate realistic, educational scenarios.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.8,
    });

    const content = completion.choices[0]?.message?.content || '';
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    
    if (jsonMatch) {
      const scenario = JSON.parse(jsonMatch[0]);
      
      // Normalize correctResponse to uppercase letter (A, B, C, D)
      if (scenario.correctResponse) {
        // Handle if it comes as "Option 3" or "3" or "C" or "option c"
        const response = scenario.correctResponse.toString().toUpperCase().trim();
        if (response.match(/^[ABCD]$/)) {
          scenario.correctResponse = response;
        } else if (response.match(/OPTION\s*([ABCD])/i)) {
          scenario.correctResponse = response.match(/OPTION\s*([ABCD])/i)?.[1] || 'A';
        } else if (response.match(/^(\d)$/)) {
          // Convert number to letter (1->A, 2->B, 3->C, 4->D)
          const num = parseInt(response);
          if (num >= 1 && num <= 4) {
            scenario.correctResponse = String.fromCharCode(64 + num); // 65=A, 66=B, etc.
          }
        } else {
          scenario.correctResponse = 'A'; // Default fallback
        }
      }
      
      // Normalize feedback to use letters instead of numbers
      if (scenario.feedback) {
        scenario.feedback = scenario.feedback
          .replace(/Option\s+(\d)/gi, (match: string, num: string) => {
            const letter = String.fromCharCode(64 + parseInt(num));
            return `Option ${letter}`;
          })
          .replace(/option\s+(\d)/gi, (match: string, num: string) => {
            const letter = String.fromCharCode(64 + parseInt(num));
            return `option ${letter}`;
          });
      }
      
      // Ensure we have exactly 4 options
      if (scenario.options && scenario.options.length < 4) {
        // Pad with placeholder options if needed
        while (scenario.options.length < 4) {
          scenario.options.push(`Option ${String.fromCharCode(65 + scenario.options.length)}`);
        }
      }
      
      return scenario;
    }
    
    throw new Error('Failed to parse scenario');
  } catch (error) {
    console.error('Error generating scenario:', error);
    throw error;
  }
}

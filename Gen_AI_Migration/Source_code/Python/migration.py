import google.generativeai as genai
import os
from datetime import datetime


api_key = "AIzaSyAt5QhIOa3VisgPQjvA6BiA6gcIpRlFLpE"
os.environ["GOOGLE_API_KEY"] = api_key

def read_cobol_file(file_path):
    """Reads the COBOL code from the given file path."""
    try:
        with open(file_path, 'r') as file:
            cobol_code = file.read()
        return cobol_code
    except Exception as e:
        raise Exception(f"Error reading the COBOL file: {e}")

def split_code_into_chunks(code, max_lines=50):
    """Splits the COBOL code into manageable chunks."""
    lines = code.split('\n')
    chunks = ['\n'.join(lines[i:i+max_lines]) for i in range(0, len(lines), max_lines)]
    return chunks

def determine_target_language(file_path):
    """Determines the target language based on the file extension."""
    if '.dspf' in file_path.lower():
        return "React"
    elif '.rpg' in file_path.lower():
        return "Node.js"
    else:
        raise ValueError("Unsupported file type. Please provide a file name containing .dspf or .rpg.")

def convert_cobol_to_target(cobol_code, target_language, input_file_name):
    """Converts COBOL code to the target language (React or Node.js) and provides an explanation."""
    generation_config = {
        "temperature": 0.7,
        "top_p": 1,
        "top_k": 1,
        "max_output_tokens": 2048
    }

    try:
        genai.configure(api_key=api_key)
        model = genai.GenerativeModel("gemini-pro", generation_config=generation_config)
        
        converted_code_chunks = []
        explanation_chunks = []
        
        cobol_chunks = split_code_into_chunks(cobol_code)
        
        for i, chunk in enumerate(cobol_chunks):
            code_prompt = (
                f"Convert the following COBOL code from '{input_file_name}' to {target_language} code. Ensure that the code is complete and functional and also add comments, "
                f"following best practices for {target_language} development. Include the file name in the comments at the beginning of each section:\n\n{chunk}"
            )
            code_response = model.generate_content([code_prompt])
            converted_code_chunks.append(f"// Part {i+1} from {input_file_name}\n" + code_response.text)
            
            explanation_prompt = (
                f"Explain the following {target_language} code, which is converted from COBOL code in '{input_file_name}'. Provide details on the functionality and structure of the code, "
                f"and any relevant best practices or design patterns used. Include the file name in the explanation:\n\n{code_response.text}"
            )
            explanation_response = model.generate_content([explanation_prompt])
            explanation_chunks.append(f"/* Part {i+1} from {input_file_name} */\n" + explanation_response.text)
        
        converted_code = "\n\n".join(converted_code_chunks)
        explanation = "\n\n".join(explanation_chunks)
        
        return converted_code, explanation
    except Exception as e:
        raise Exception(f"Error during conversion: {e}")

def get_current_time():
    """Returns the current date and time in a formatted string."""
    return datetime.now().strftime("%Y-%m-%d %H:%M:%S")

def save_converted_code(converted_code, explanation, file_path, language, input_file_name):
    """Saves the converted code and explanation to a file with appropriate comments."""
    current_time = get_current_time()
    descriptions = {
        "Node.js": (
            f"/*\n"
            f" * COBOL code from '{input_file_name}' is converted into Node.js code here.\n"
            f" * Node.js is a JavaScript runtime built on Chrome's V8 JavaScript engine.\n"
            f" * It allows for the development of server-side applications using JavaScript.\n"
            f" * File creation time: {current_time}\n"
            f" */\n\n"
        ),
        "React": (
            f"/*\n"
            f" * COBOL code from '{input_file_name}' is converted into React code here.\n"
            f" * React is a JavaScript library for building user interfaces, maintained by Facebook.\n"
            f" * It allows for the creation of single-page applications with a component-based architecture.\n"
            f" * React code is used to build dynamic web applications.\n"
            f" * File creation time: {current_time}\n"
            f" */\n\n"
        )
    }

    header_comment = descriptions.get(language, f"/*\n * COBOL code from '{input_file_name}' is converted into {language} code here.\n * File creation time: {current_time}\n */\n\n")
    
    try:
        with open(file_path, 'w') as file:
            file.write(header_comment + "/*\n * Explanation:\n" + explanation + "\n*/\n\n" + converted_code)
    except Exception as e:
        raise Exception(f"Error saving the converted code: {e}")

def main():
    input_file_path = "ShipPf.dspf.txt" 
    
    try:
        cobol_code = read_cobol_file(input_file_path)
        target_language = determine_target_language(input_file_path)
        input_file_name = os.path.basename(input_file_path)
        
        file_extensions = {
            "Node.js": "js",
            "React": "jsx"
        }
        output_file_extension = file_extensions.get(target_language, target_language.lower())
        output_file_path = f"ab_shipPf3.{output_file_extension}"

        converted_code, explanation = convert_cobol_to_target(cobol_code, target_language, input_file_name)
        save_converted_code(converted_code, explanation, output_file_path, target_language, input_file_name)
        print(f"Conversion successful! The {target_language} code with explanation is saved at {output_file_path}")
    except Exception as e:
        print(f"An error occurred: {e}")

if __name__ == "__main__":
    main()



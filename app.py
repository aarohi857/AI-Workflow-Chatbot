import os
import json
import threading
from flask import Flask, render_template, request, jsonify
from groq import Groq
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv(override=True)
app = Flask(__name__)

# Initialize clients
groq_client = Groq(api_key=os.getenv("GROQ_API_KEY"))
genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))

# Setup Data Persistence
DATA_DIR = "data"
os.makedirs(DATA_DIR, exist_ok=True)
SESSIONS_FILE = os.path.join(DATA_DIR, "sessions.json")
sessions_lock = threading.Lock()

def load_sessions():
    if os.path.exists(SESSIONS_FILE):
        try:
            with open(SESSIONS_FILE, 'r') as f:
                return json.load(f)
        except:
            pass
    return {}

def save_sessions(sessions):
    with sessions_lock:
        with open(SESSIONS_FILE, 'w') as f:
            json.dump(sessions, f)

system_prompts = {
    "zenvix": """You are ZENVIX, the Technical Architect.
Context: You are a master of AI Architectures. You must provide deep technical analysis, mathematical proofs, and complexity details.

Mandatory Multi-Layered Response Structure:
1. High-Level Architectural Overview: Explain the concept's significance in modern AI.
2. Mathematical Foundation: Provide rigorous proofs and equations using LaTeX. Define every variable.
3. Intuitive Visualization: Describe the data flow or logic that the following chart represents.
4. Implementation Detail: Provide a modular, PEP 8 compliant Python snippet with comments.
5. Complexity Analysis: Explicitly state Time and Space complexity (Big O).

Strict Technical Standards:
1. Accurate Visualization Logic:
- Graph Correspondence: Your `<chart>` JSON must STRICTLY MATCH the mathematical description. If describing a Heatmap, generate a heatmap. If Box Plot, generate a box-and-whisker plot. NEVER provide a generic line chart as a placeholder.
- Visual Completeness: Every chart must include high-quality formatting: clear titles, labeled axes, appropriate color scales, and legends.

2. Technical Depth & Information Density:
- No Surface-Level Answers: Do not provide brief or "thin" responses. For every concept, provide the underlying intuition, the mathematical logic, and practical implementation details.
- Rigorous Math: Use LaTeX for all equations. Define EVERY variable and constant used in formulas for complete clarity. Use $$ for block formulas and $ for inline.

3. Engineering Excellence:
- Optimized Code: All code snippets must be modular, well-commented, and follow industry best practices (e.g., PEP 8 for Python).
- Solution-Oriented: Directly solve the complexity of the query rather than giving a generic overview.

Formatting:
- Provide CLEAN MARKDOWN ONLY. Strictly NO technical metadata or raw JSON should be visible to the user outside of the `<chart>` tag.
- Every heading (#, ##, ###) MUST represent a logical section.

DYNAMIC GRAPHS: You MUST generate an interactive chart using Plotly JSON inside <chart> tags when explaining data concepts.
Example:
<chart>
{
  "data": [{"x": ["A", "B", "C"], "y": [10, 20, 30], "type": "bar"}],
  "layout": {
    "title": "Algorithm Comparison",
    "xaxis": {"title": "Algorithms"},
    "yaxis": {"title": "Performance Score"},
    "showlegend": true
  }
}
</chart>""",
    
    "aarvix": """You are AARVIX, the Practical Generalist.
Context: You are for non-tech users. You should explain the utility of AI without the math.
Approach: Use real-world analogies (e.g., comparing a Neural Network to a human brain learning to recognize fruits).
Focus: Practical next steps, ethical considerations (Privacy/Fairness), and simple "How-to" guides for beginners.

Formatting Standards: 
- Provide CLEAN MARKDOWN ONLY. Ensure your responses are highly detailed, comprehensive, and elaborate.
- Use emojis freely to make it engaging.
- Structure your response using markdown headings (#, ##, ###) for each major section to maintain visual consistency with the platform's high-end purple aesthetic.
- Use bold text (**like this**) for key takeaway points.
- Use clear bulleted or numbered lists for steps.
- Zero jargon, simple everyday analogies, practical steps, and a beginner-friendly tone."""
}

# Load sessions from file instead of in-memory dictionary
chat_memories = load_sessions()

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/chat', methods=['POST'])
def chat():
    try:
        data = request.json
        msg = data.get('message')
        avatar = data.get('avatar', 'aarvix')
        
        if avatar not in chat_memories:
            sys_prompt = system_prompts.get(avatar, f"You are {avatar.upper()}.")
            chat_memories[avatar] = [{"role": "system", "content": sys_prompt}]
        
        chat_memories[avatar].append({"role": "user", "content": msg})
        
        # Model Router Logic:
        # ALWAYS use the latest system prompt from the codebase to ensure prompt updates take immediate effect
        sys_prompt_content = system_prompts.get(avatar, f"You are {avatar.upper()}.")
        
        # Keep only the last 10 non-system messages for context to optimize token usage
        history = [m for m in chat_memories[avatar] if m["role"] != "system"]
        recent_history = history[-10:]

        # Groq for fast, token-preserving short queries (<= 200 chars)
        # Google Gemini for complex/long reasoning tasks (> 200 chars)
        if len(msg) > 200:
            print(f"[MODEL ROUTER] Query length {len(msg)} > 200. Routing to Google Gemini...")
            
            gemini_messages = []
            for m in recent_history:
                if m["role"] == "user":
                    gemini_messages.append({"role": "user", "parts": [m["content"]]})
                elif m["role"] == "assistant":
                    gemini_messages.append({"role": "model", "parts": [m["content"]]})
                    
            model = genai.GenerativeModel(
                model_name="gemini-1.5-pro-latest",
                system_instruction=sys_prompt_content
            )
            
            response = model.generate_content(gemini_messages)
            bot_res = response.text
        else:
            print(f"[MODEL ROUTER] Query length {len(msg)} <= 200. Routing to Groq (llama-3.1-8b-instant)...")
            groq_messages = [{"role": "system", "content": sys_prompt_content}] + recent_history
            response = groq_client.chat.completions.create(
                model="llama-3.1-8b-instant",
                messages=groq_messages,
                temperature=0.7
            )
            bot_res = response.choices[0].message.content
            
        chat_memories[avatar].append({"role": "assistant", "content": bot_res})
        save_sessions(chat_memories)
        
        return jsonify({'success': True, 'response': bot_res})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/reset', methods=['POST'])
def reset():
    global chat_memories
    data = request.json or {}
    avatar = data.get('avatar')
    
    if avatar and avatar in chat_memories:
        del chat_memories[avatar]
        save_sessions(chat_memories)
        return jsonify({'status': f'cleared {avatar}'})
        
    chat_memories = {}
    save_sessions(chat_memories)
    return jsonify({'status': 'cleared all'})

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
import os
import re
try:
    from docx import Document
    from docx.shared import Pt, Inches
    from docx.enum.text import WD_ALIGN_PARAGRAPH
except ImportError:
    import subprocess
    import sys
    subprocess.check_call([sys.executable, "-m", "pip", "install", "python-docx"])
    from docx import Document
    from docx.shared import Pt, Inches
    from docx.enum.text import WD_ALIGN_PARAGRAPH

def convert_md_to_docx(md_filepath, docx_filepath):
    doc = Document()
    
    # Adjust margins
    sections = doc.sections
    for section in sections:
        section.top_margin = Inches(0.5)
        section.bottom_margin = Inches(0.5)
        section.left_margin = Inches(0.5)
        section.right_margin = Inches(0.5)
        
    with open(md_filepath, 'r', encoding='utf-8') as f:
        content = f.read()
        
    # Remove the Match Review section if present
    content = re.split(r'> \*\*Match Review against JD Requirements:\*\*', content)[0]
    
    lines = content.split('\n')
    for line in lines:
        line = line.strip()
        if not line:
            continue
            
        if line.startswith('# '):
            p = doc.add_heading(level=1)
            p.alignment = WD_ALIGN_PARAGRAPH.CENTER
            p.add_run(line[2:].strip()).bold = True
        elif line.startswith('## '):
            doc.add_heading(line[3:].strip(), level=2)
        elif line.startswith('* '):
            p = doc.add_paragraph(style='List Bullet')
            text = line[2:]
            _add_formatted_text(p, text)
        else:
            p = doc.add_paragraph()
            if '|' in line and '@' in line:
                p.alignment = WD_ALIGN_PARAGRAPH.CENTER
            _add_formatted_text(p, line)
            
    doc.save(docx_filepath)
    print(f"Created: {docx_filepath}")

def _add_formatted_text(paragraph, text):
    parts = re.split(r'(\*\*.*?\*\*)', text)
    for part in parts:
        if part.startswith('**') and part.endswith('**'):
            paragraph.add_run(part[2:-2]).bold = True
        elif part.startswith('*') and part.endswith('*'):
            paragraph.add_run(part[1:-1]).italic = True
        else:
            paragraph.add_run(part)

if __name__ == "__main__":
    output_dir = r"d:\Learnings\Pramod-genAI\AITesting\chapter_04_JobKitAI\output"
    for filename in os.listdir(output_dir):
        if filename.startswith("resume_") and filename.endswith(".md"):
            # Extract company name
            company_name = filename.replace("resume_", "").replace(".md", "")
            md_filepath = os.path.join(output_dir, filename)
            docx_filename = f"Shashikant_Bodke_{company_name}.docx"
            docx_filepath = os.path.join(output_dir, docx_filename)
            convert_md_to_docx(md_filepath, docx_filepath)

---
name: batch-resume-tailor
description: Automatically generates DOCX tailored resumes whenever the user uploads or updates a CSV file in the Job_Description_Daywise folder.
---

# Batch Resume Tailor

When the user shares or updates a CSV file containing job descriptions (e.g., inside the `Job_Description_Daywise` folder), automatically perform the following steps to tailor their resume:

## Workflow

### 1. Read the Inputs
- Locate the user's base resume (you can ask for it if not recently provided in the context).
- Read the provided CSV file to extract the Company Name, Job Role, and Job Description for each row.

### 2. Generate Match Reviews
- Before generating any files, analyze the resume against each Job Description.
- Present a summary (Match Review) to the user in the chat for all the roles, highlighting strong matches (✅), partial matches (🟡), and absent requirements (🙈).
- Ask the user for approval to proceed with generating the tailored resumes.

### 3. Generate the Tailored Resumes
- Once the user approves, generate a tailored version of the resume for each company.
- **IMPORTANT**: Do NOT include the "Match Review" text inside the final generated files.
- Refine the Summary and emphasize the bullet points that directly match the specific Job Description requirements. Be truthful; do not invent experience.
- Save each final resume directly as a DOCX file using the naming convention: `Shashikant_Bodke_<CompanyName>.docx`.
- Save all generated files into the designated `output` folder (e.g., `chapter_04_JobKitAI/output`).

### 4. Provide the Links
- Provide the user with direct links to all the generated DOCX files.

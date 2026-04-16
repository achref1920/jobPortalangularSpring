import random
import datetime

output_file = r"C:\Users\bobac\.gemini\antigravity\brain\8c9c2b5d-4ac1-41ff-ac09-a424067f26a4\massive_dummy_data.sql"

first_names = ["John", "Jane", "Alice", "Bob", "Charlie", "Diana", "Eve", "Frank", "Grace", "Heidi", "Ivan", "Judy", "Mallory", "Victor", "Peggy", "Trent", "Walter", "Yvonne", "Zelda", "Liam", "Olivia", "Noah", "Emma", "Oliver", "Charlotte", "Elijah", "Amelia", "James", "Mia", "William", "Sophia", "Benjamin", "Isabella", "Lucas", "Ava", "Henry", "Harper"]
last_names = ["Smith", "Johnson", "Williams", "Jones", "Brown", "Davis", "Miller", "Wilson", "Moore", "Taylor", "Anderson", "Thomas", "Jackson", "White", "Harris", "Martin", "Thompson", "Garcia", "Martinez", "Robinson", "Clark", "Rodriguez", "Lewis", "Lee", "Walker", "Hall", "Allen", "Young", "Hernandez", "King"]
locations = ["New York", "San Francisco", "London", "Berlin", "Paris", "Austin", "Seattle", "Toronto", "Remote", "Chicago", "Boston", "Amsterdam", "Sydney", "Dubai", "Singapore"]

job_titles = ["Software Engineer", "Frontend Developer", "Backend Developer", "Full Stack Developer", "Data Scientist", "DevOps Engineer", "Product Manager", "UX Designer", "UI Designer", "QA Engineer", "Mobile Developer", "Systems Analyst", "Database Administrator", "Cloud Architect", "Machine Learning Engineer"]
tech_skills = ["Java", "Python", "JavaScript", "React", "Angular", "Spring Boot", "Node.js", "Docker", "Kubernetes", "AWS", "SQL", "MongoDB", "TypeScript", "C++", "C#", "Go", "Rust", "Ruby", "PHP", "Swift", "Kotlin"]
companies = ["TechCorp", "Innovatech", "Global Solutions", "NextGen Systems", "DataWorks", "Cloud9 Technologies", "Alpha Beta", "Omega Systems", "Future Web", "Pioneer Software", "Blue Sky IT", "Red Rocket Tech", "Green Leaf Digital", "Silverlining Apps", "Gold Standard Data"]

num_candidates = 300
num_recruiters = 50
num_jobs = 500
num_applications = 1500

password_hash = "$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HCG3JZGZ.8R/t.1O5V/bC" # password123

candidates = []
recruiters = []
jobs = []

f = open(output_file, "w", encoding='utf-8')

f.write("-- Massive dataset for job_portal_refactored\n")
f.write("USE job_portal_refactored;\n\n")

f.write("SET FOREIGN_KEY_CHECKS = 0;\n")
f.write("TRUNCATE TABLE applications;\n")
f.write("TRUNCATE TABLE jobs;\n")
f.write("TRUNCATE TABLE candidates;\n")
f.write("TRUNCATE TABLE recruiters;\n")
f.write("TRUNCATE TABLE admins;\n")
f.write("TRUNCATE TABLE user_seq;\n")
f.write("SET FOREIGN_KEY_CHECKS = 1;\n\n")

user_id = 1
# Admin
f.write(f"INSERT INTO admins (id, username, email, password, gender, location, created_at, updated_at) VALUES\n")
f.write(f"({user_id}, 'admin_super', 'admin@jobportal.com', '{password_hash}', 'M', 'Server Room', NOW(), NOW());\n\n")
user_id += 1

# Recruiters
recruiter_inserts = []
for i in range(num_recruiters):
    username = f"recruiter{i+1}"
    email = f"{username}@example.com"
    gender = random.choice(["M", "F"])
    loc = random.choice(locations)
    comp = random.choice(companies) + " " + random.choice(["Inc.", "LLC", "Corp.", "Ltd."])
    website = f"https://www.{comp.lower().replace(' ', '')}.com"
    phone = f"+1-555-{random.randint(100,999)}-{random.randint(1000,9999)}"
    
    val = f"({user_id}, '{username}', '{email}', '{password_hash}', '{gender}', '{loc}', NOW(), NOW(), '{comp}', '{website}', '{phone}')"
    recruiter_inserts.append(val)
    recruiters.append(user_id)
    user_id += 1

f.write(f"INSERT INTO recruiters (id, username, email, password, gender, location, created_at, updated_at, company_name, company_website, phone) VALUES\n")
f.write(",\n".join(recruiter_inserts) + ";\n\n")

# Candidates
candidate_inserts = []
for i in range(num_candidates):
    fname = random.choice(first_names)
    lname = random.choice(last_names)
    username = f"candidate_{fname.lower()}_{lname.lower()}{i}"
    email = f"{username}@test.com"
    gender = random.choice(["M", "F"])
    loc = random.choice(locations)
    edu = random.choice(["Bachelor's Degree", "Master's Degree", "PhD", "Bootcamp Graduate"])
    exp = f"{random.randint(1, 15)} years"
    phone = f"+1-555-{random.randint(100,999)}-{random.randint(1000,9999)}"
    sk = ", ".join(random.sample(tech_skills, k=random.randint(2, 6)))
    
    val = f"({user_id}, '{username}', '{email}', '{password_hash}', '{gender}', '{loc}', NOW(), NOW(), '{edu}', '{exp}', '{phone}', '{sk}')"
    candidate_inserts.append(val)
    candidates.append(user_id)
    user_id += 1

f.write(f"INSERT INTO candidates (id, username, email, password, gender, location, created_at, updated_at, education, experience, phone, skills) VALUES\n")
f.write(",\n".join(candidate_inserts) + ";\n\n")

f.write(f"INSERT INTO user_seq (next_val) VALUES ({user_id + 50});\n\n")

# Jobs
job_inserts = []
job_id = 1
for i in range(num_jobs):
    creator_id = random.choice(recruiters)
    title = random.choice(job_titles) + " " + random.choice(["I", "II", "Senior", "Lead", "Principal", ""])
    title = title.strip()
    company_name = f"Company {job_id}"
    loc = random.choice(locations)
    j_type = random.choice(["FULL_TIME", "PART_TIME", "CONTRACT", "INTERNSHIP"])
    base_sal = random.randint(50, 150) * 1000
    salary = f"${base_sal} - ${base_sal + 30000}"
    desc = f"We are looking for a talented {title} to join our team in {loc}."
    reqs = "Experience with " + ", ".join(random.sample(tech_skills, k=3))
    deadline = (datetime.datetime.now() + datetime.timedelta(days=random.randint(10, 60))).strftime('%Y-%m-%d %H:%M:%S')
    
    val = f"({job_id}, '{company_name}', NOW(), '{deadline}', '{desc}', 'OPEN', '{j_type}', '{loc}', '{title}', '{reqs}', '{salary}', NOW(), {creator_id})"
    job_inserts.append(val)
    jobs.append(job_id)
    job_id += 1

f.write(f"INSERT INTO jobs (id, company, created_at, deadline, description, job_status, job_type, location, position, requirements, salary, updated_at, created_by_id) VALUES\n")
f.write(",\n".join(job_inserts) + ";\n\n")

# Applications
app_inserts = []
app_id = 1
used_pairs = set()

while len(app_inserts) < num_applications:
    j_id = random.choice(jobs)
    c_id = random.choice(candidates)
    if (j_id, c_id) not in used_pairs:
        used_pairs.add((j_id, c_id))
        status = random.choice(["PENDING", "REVIEWED", "ACCEPTED", "REJECTED"])
        applied_at = (datetime.datetime.now() - datetime.timedelta(days=random.randint(1, 30))).strftime('%Y-%m-%d %H:%M:%S')
        cv_url = f"https://resumes.local/candidate_{c_id}_cv.pdf"
        cover_letter = "I am very interested in this role and believe my skills match."
        
        val = f"({app_id}, '{applied_at}', '{cover_letter}', '{cv_url}', '{status}', {c_id}, {j_id})"
        app_inserts.append(val)
        app_id += 1

f.write(f"INSERT INTO applications (id, applied_at, cover_letter, resume_url, status, applicant_id, job_id) VALUES\n")
f.write(",\n".join(app_inserts) + ";\n\n")

f.close()
print(f"Massive SQL generated successfully at {output_file}")

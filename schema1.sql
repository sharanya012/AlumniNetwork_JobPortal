use alumni_portal;

CREATE TABLE user_profile (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(100),
    middle_name VARCHAR(100),
    last_name VARCHAR(100),
    user_type ENUM('alumni', 'student', 'employee', 'admin'),
    work_experience TEXT,
    resume TEXT,
    profile_picture VARCHAR(255)
);

CREATE TABLE user_login (
    user_id INT PRIMARY KEY,  -- 1:1 relationship, uses the same user_id
    email VARCHAR(100) UNIQUE,
    password VARCHAR(100),
    phone_no VARCHAR(15),
    registration_date DATE,
    user_type ENUM('alumni', 'student', 'employee', 'admin'),
    FOREIGN KEY (user_id) REFERENCES user_profile(user_id)
);

CREATE TABLE connects_with (
    user_id1 INT,
    user_id2 INT,
    FOREIGN KEY (user_id1) REFERENCES user_profile(user_id),
    FOREIGN KEY (user_id2) REFERENCES user_profile(user_id),
    PRIMARY KEY (user_id1, user_id2)
);

CREATE TABLE posts (
    post_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    content TEXT,
    image VARCHAR(255) DEFAULT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES user_profile(user_id)
);

CREATE TABLE reacts_to (
    user_id INT,
    post_id INT,
    reaction ENUM('like', 'dislike') DEFAULT NULL,
    PRIMARY KEY (user_id, post_id),
    FOREIGN KEY (user_id) REFERENCES user_profile(user_id),
    FOREIGN KEY (post_id) REFERENCES posts(post_id) ON DELETE CASCADE
);

CREATE TABLE batch_branch_forum (
    branch_batch_id INT AUTO_INCREMENT PRIMARY KEY,
    branch_name VARCHAR(100),
    year_of_graduation YEAR
);

CREATE TABLE updates (
    user_id INT PRIMARY KEY,
    branch_batch_id INT,
    FOREIGN KEY (user_id) REFERENCES user_profile(user_id),
    FOREIGN KEY (branch_batch_id) REFERENCES batch_branch_forum(branch_batch_id)
);

CREATE TABLE batch_forum (
    branch_batch_id INT,
    topic VARCHAR(255),
    custom_date DATE,
    post_count INT,
    FOREIGN KEY (branch_batch_id) REFERENCES batch_branch_forum(branch_batch_id)
);

CREATE TABLE forum (
    forum_id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255),
    no_of_users INT,
    admin_user_id INT,
    FOREIGN KEY (admin_user_id) REFERENCES user_profile(user_id)
);

CREATE TABLE joins_forum (
    user_id INT,
    forum_id INT,
    PRIMARY KEY (user_id, forum_id),
    FOREIGN KEY (user_id) REFERENCES user_profile(user_id),
    FOREIGN KEY (forum_id) REFERENCES forum(forum_id)
);

CREATE TABLE job_offer (
    job_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,  -- employer who creates the offer
    title VARCHAR(255),
    description TEXT,
    role ENUM('intern', 'part time', 'full time'),
    location VARCHAR(255),
    salary DECIMAL(10, 2),
    application_deadline DATE,
    job_status ENUM('open', 'full', 'closed'),
    required_skills TEXT,
    application_count INT,
    FOREIGN KEY (user_id) REFERENCES user_profile(user_id)
);

CREATE TABLE searches_for (
    user_id INT,
    job_id INT,
    PRIMARY KEY (user_id, job_id),
    FOREIGN KEY (user_id) REFERENCES user_profile(user_id),
    FOREIGN KEY (job_id) REFERENCES job_offer(job_id)
);

CREATE TABLE job_application (
    application_id INT AUTO_INCREMENT PRIMARY KEY,
    job_id INT,
    user_id INT,
    status ENUM('submitted', 'shortlisted', 'approved', 'rejected'),
    cover_letter TEXT,
    FOREIGN KEY (job_id) REFERENCES job_offer(job_id),
    FOREIGN KEY (user_id) REFERENCES user_profile(user_id)
);


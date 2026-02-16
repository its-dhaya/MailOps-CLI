# 📬 Email CLI Tool – Command Guide

A Powerful Node.js command-line tool to manage emails right from your terminal — send, read, star, search, and even apply AI-powered enhancements like tone and sentiment analysis.

---

# Send to a single recipient
node email-cli.js send "elanthirayan27@gmail.com" "Test Subject" "Test Body"

# Send to multiple recipients with attachment
node email-cli.js send "elanthirayan27@gmail.com,elanthirayan30@gmail.com" "Test Subject" "Test Body" "C:\Users\elant\OneDrive\Desktop\meethub.pptx"

# Send to a recipient with a relative file path attachment
node email-cli.js send "elanthirayan27@gmail.com" "Test Subject" "Test Body" "path/to/attachment"

# Read the latest 15 emails
node email-cli.js read latest 15

# Read all emails between specific dates
node email-cli.js read all 2024-10-01 2024-10-04

# Read emails on a specific date
node email-cli.js read on 2024-10-01

# Star the most recent email
node email-cli.js star 1

# Fetch all starred emails
node email-cli.js fetch starred

# Search email by user mail id 
node email-cli.js searchsender elanthirayan27@gmail.com

# 📌 Enhance the subject of an email
node email-cli.js subject-enhance "leave letter for on week"

# ⭐ MAIN FEATURE: Change tone to formal/informal
node email-cli.js tone-change "hey, got your mail. let's talk." formal

# 💬 Analyze the sentiment of a message
node email-cli.js sentiment "I'm so happy with the results!"

# Help commands
node email-cli.js help


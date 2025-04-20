# Teacher CSV Upload Guide

This guide explains how to use the CSV file format for uploading teachers to the system.

## CSV File Format

The CSV file should have the following columns:

1. `name` (Required): The teacher's full name (1-100 characters)
2. `email` (Required): A valid email address (must be unique)
3. `department` (Required): The teacher's department
4. `phone` (Optional): Phone number (10-15 characters)
5. `subjects` (Optional): JSON array of subjects the teacher teaches
6. `password` (Optional): Password for the teacher's account

## Field Requirements

- **name**: Required, 1-100 characters
- **email**: Required, must be a valid email format and unique
- **department**: Required
- **phone**: Optional, 10-15 characters if provided
- **subjects**: Optional, must be a JSON array string if provided
- **password**: Optional, minimum 6 characters if provided

## Subjects Format

The `subjects` field must be a JSON array string. Format it as follows:

```
"['Subject 1', 'Subject 2', 'Subject 3']"
```

Make sure to:
- Use single quotes for the array elements
- Enclose the entire array in double quotes
- Separate subjects with commas

## Password Handling

- If no password is provided, the system will use the default password 'teacher123'
- If a password is provided, it must be at least 6 characters long

## Example CSV

```
name,email,department,phone,subjects,password
John Doe,john.doe@example.com,Computer Science,+919876543210,"['Data Structures', 'Algorithms']",securePass123
Jane Smith,jane.smith@example.com,Mathematics,9876543211,"['Calculus', 'Linear Algebra']",
```

In this example:
- John Doe has all fields filled, including a custom password
- Jane Smith has no password (will use default 'teacher123')

## Upload Process

1. Prepare your CSV file according to the format above
2. Log in to the admin dashboard
3. Navigate to the "Data Upload" section
4. Select "teachers" as the upload type
5. Choose your CSV file and upload
6. The system will process the file and create teacher accounts
7. For teachers with default passwords, the response will include their email and default password

## Troubleshooting

- If you get validation errors, check that all required fields are filled correctly
- Make sure the email addresses are unique and in a valid format
- Ensure the subjects field is properly formatted as a JSON array string
- If phone numbers are provided, they must be 10-15 characters long 
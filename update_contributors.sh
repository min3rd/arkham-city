#!/bin/bash

# Script to update the Contributors section in README.md based on Git commit authors

# Get the directory of the script
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
README_FILE="$SCRIPT_DIR/README.md"

# Check if README.md exists
if [ ! -f "$README_FILE" ]; then
    echo "README.md not found in $SCRIPT_DIR"
    exit 1
fi

# Create a temporary file
TEMP_FILE=$(mktemp)

# Extract the content before the Contributors section
sed -n '1,/^## Contributors$/p' "$README_FILE" > "$TEMP_FILE"

# Add the Contributors section header
echo "\nWe would like to thank all the contributors who have helped make this project possible:\n" >> "$TEMP_FILE"

# Get contributor information from Git and add to the temporary file
git shortlog -sne | while read -r line; do
    # Extract commit count, name, and email
    count=$(echo "$line" | awk '{print $1}')
    name=$(echo "$line" | awk '{$1=""; print $0}' | sed 's/^ *//' | sed 's/ <.*>//')
    email=$(echo "$line" | grep -o '<[^>]*>' | sed 's/<//;s/>//')
    
    # Try to get GitHub username from email
    github_username=""
    if [[ "$email" == *"@github.com"* ]]; then
        github_username=$(echo "$email" | cut -d '@' -f 1)
    fi
    
    # Format the contributor line
    if [ -n "$github_username" ]; then
        echo "- $name [GitHub](https://github.com/$github_username) - $count commits" >> "$TEMP_FILE"
    else
        echo "- $name - $count commits" >> "$TEMP_FILE"
    fi
done

# Replace the original README.md with the updated content
mv "$TEMP_FILE" "$README_FILE"

echo "Contributors section in README.md has been updated."
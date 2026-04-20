#!/bin/bash

# Vault auto-sync script
# Monitors vault directory and automatically commits + pushes to GitHub

VAULT_DIR="/Users/nguyenthihoangphuc/Documents/Phuc"
LOGFILE="$VAULT_DIR/.auto-sync.log"

cd "$VAULT_DIR" || exit 1

# Function to log
log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" >> "$LOGFILE"
}

log "Auto-sync monitor started"

# Watch for changes using fswatch
fswatch -r --batch-marker "$VAULT_DIR" | while read -r file
do
    # Skip hidden files and .git directory
    if [[ "$file" == .* ]] || [[ "$file" == *"/.git"* ]]; then
        continue
    fi

    log "Change detected in: $file"

    # Check if there are actual changes to commit
    if ! git diff-index --quiet HEAD --; then
        log "Uncommitted changes found, committing..."

        # Stage all changes
        git add -A

        # Create commit with timestamp
        COMMIT_MSG="Auto-sync: $(date '+%Y-%m-%d %H:%M:%S')"
        git commit -m "$COMMIT_MSG" 2>> "$LOGFILE"

        # Push to GitHub
        if git push origin master 2>> "$LOGFILE"; then
            log "Successfully pushed to GitHub"
        else
            log "Failed to push to GitHub"
        fi
    fi
done

# Firestore Security Rules Setup

This document explains how to deploy the Firestore security rules for the diagram application.

## Firebase Console Method (Recommended)

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: **kaya-demo-25aa4**
3. Navigate to **Firestore Database** from the left sidebar
4. Click on the **Rules** tab
5. Copy the contents from `firestore.rules` file
6. Paste it into the rules editor
7. Click **Publish** to deploy the rules

## Command Line Method (Alternative)

If you have Firebase CLI installed:

```bash
# Install Firebase CLI (if not already installed)
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize Firebase in your project (if not already done)
firebase init firestore

# Deploy the rules
firebase deploy --only firestore:rules
```

## Rules Explanation

The security rules provide the following access:

### Users Collection
- Users can read/write only their own user document
- Users can read other users' documents by email (for sharing functionality)

### Diagrams Collection
- **Read**: Users can read diagrams they own or that are shared with them
- **Create**: Authenticated users can create diagrams (with themselves as owner)
- **Update**: Only the diagram owner can update the diagram
- **Delete**: Only the diagram owner can delete the diagram

## Testing the Rules

After deploying the rules, test the application by:
1. Creating a new diagram
2. Sharing it with another user
3. Verifying the shared user can access the diagram

## Troubleshooting

If you still see permission errors after deploying the rules:
1. Clear your browser cache and try again
2. Make sure you're authenticated in the app
3. Check the Firebase Console for any rule syntax errors
4. Wait a few seconds for the rules to propagate

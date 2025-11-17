# Fix Image Upload in Profile

## Tasks
- [x] Remove useUpdateAvatar hook from useProfile.ts as it's redundant with useUpdateProfile
- [x] Add file validation in ProfileInfo.tsx for avatar upload (size limit, type check)
- [x] Ensure imagePreview resets on update failure
- [x] Test the combined update functionality (dev server running at http://localhost:5174)

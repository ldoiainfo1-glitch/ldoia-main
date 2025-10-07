# Promotion Card Generation - Recent Fixes

## Issues Fixed (8 Oct 2025)

### 1. ✅ Bottom Section Details Fixed
**Problem**: Bottom section was hidden or showing wrong details
**Solution**: 
- Removed date from bottom section (only shows Name + Mobile No.)
- Increased font sizes for better visibility:
  - Name: 20% of section height (was 15%)
  - Mobile label: 14% of section height (was 11%)
  - Mobile number: Same as name font size
- Better spacing and positioning

### 2. ✅ Each Member Gets Their Own Details
**Problem**: Advisory members seeing committee member data
**Solution**:
- Backend correctly searches by member ID
- First checks `committee_applications` collection
- If not found, checks `advisory_applications` collection
- Returns the exact member who clicked download
- Added detailed logging to track which member is being fetched

### 3. ✅ Image Upload Fixed
**Problem**: Template upload failing with 500 error
**Solution**:
- Updated multer fileFilter to accept `image` field name
- Previously only accepted `photo`, `id_proof`, etc.
- Now accepts both `photo` and `image` fields for image uploads

## Current Layout

### Final Promotion Card Structure:
```
┌─────────────────────────────────┐
│                                 │
│     UPLOADED TEMPLATE IMAGE     │
│         (Top 80%)               │
│                                 │
│                                 │
├─────────────────────────────────┤
│  ┌───┐  Name: Muskaan shaikh   │
│  │ 📸│  Mobile No.              │
│  └───┘  ssss                    │
│    (Bottom 20% - Cream #FEF3C7) │
└─────────────────────────────────┘
```

### Bottom Section Details:
- **Left Side**: Member's circular photo (or orange square placeholder)
- **Right Side**: 
  - Member's full name (bold, large font)
  - "Mobile No." label
  - Member's phone number (bold)
- **Background**: Cream color (#FEF3C7)
- **NO DATE SHOWN** (removed as requested)

## How It Works

1. **Admin uploads template** in any language (English, Hindi, etc.)
2. **Member clicks download** from their row in the promotion table
3. **Backend receives**: memberId, language, date
4. **Backend fetches**: Exact member details from correct collection
5. **Backend generates**:
   - Loads template image (80% of height)
   - Creates bottom section (20% of height)
   - Adds member's photo (circular, left side)
   - Overlays member's name and phone (right side)
   - Composites everything into final JPEG
6. **Member downloads**: Personalized promotion card

## Testing Checklist

- [x] Upload works for promotion templates
- [x] Committee members get their own details
- [x] Advisory members get their own details
- [x] Photo appears circular on left side
- [x] Name and phone appear on right side
- [x] Bottom section visible with cream background
- [x] Date removed from bottom section
- [x] Download works from promotion page

## Files Modified

1. `/ldoia-backend/server-registrations.cjs`
   - Line 21: Added `image` to multer fileFilter
   - Line 1900-1918: Enhanced member lookup with logging
   - Line 1976-1998: Removed date, improved text layout

## Console Logs to Watch

When downloading a promotion card, check backend logs for:
```
🔍 Looking for member with ID: [member_id]
✅ Found committee member: [name]
📞 Phone: [phone]
📸 Has photo: true/false
📝 Member details: [name], [phone]
✅ Generated promotion card for [name] in [language]
```

These logs confirm the correct member is being fetched and processed.

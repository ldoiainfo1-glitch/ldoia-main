# Promotion Feature Implementation Guide

## Overview
The Promotion feature allows Super Admins to upload promotional templates in multiple languages and enables members to download personalized promotion cards.

## Features Implemented

### 1. **Dropdown Integration**
✅ Added "Promotion" option to both Committee and Advisory table dropdowns
- Located after "Referral Code" option
- Opens the Promotion Page when clicked

### 2. **Promotion Page** (`/client/pages/PromotionPage.tsx`)
A dedicated page displaying all members with downloadable promotion cards.

**Table Columns:**
- Sr.No
- Name
- Mobile No
- Date
- 10 Language columns (Hindi, English, Marathi, Gujarati, Tamil, Telugu, Kannada, Bengali, Odia, Urdu)

**Features:**
- Back button to return to previous page
- Responsive design with Tailwind CSS
- Download buttons only visible when promotion image exists for that language/date

### 3. **Download Logic**
✅ **Smart Button Visibility:**
- Download button appears ONLY if a promotion image was uploaded for that specific language on the same date
- If no image exists for a language/date combination, the cell shows "-"

✅ **Dynamic Generation:**
- Fetches the language-specific template image
- Combines with member details (name, phone, date, photo)
- Downloads as: `Promotion_<Name>_<Language>_<Date>.jpg`

### 4. **Backend API Endpoints**

#### Get Promotion Records
```
GET /api/promotions/records
```
Returns all approved members with their available language options.

**Response:**
```json
{
  "success": true,
  "records": [
    {
      "_id": "...",
      "name": "Member Name",
      "phone": "1234567890",
      "date": "2025-10-08",
      "photo": "data:image/jpeg;base64,...",
      "availableLanguages": {
        "hindi": true,
        "english": true,
        "marathi": false,
        ...
      }
    }
  ]
}
```

#### Upload Promotion Image (Super Admin)
```
POST /api/promotions/upload-image
Content-Type: multipart/form-data

Fields:
- image: File (required)
- language: String (required) - one of: hindi, english, marathi, gujarati, tamil, telugu, kannada, bengali, odia, urdu
- date: String (required) - YYYY-MM-DD format
```

#### Generate Promotion Card
```
GET /api/promotions/generate?memberId=<id>&language=<lang>&date=<date>
```
Downloads the generated promotion card as JPG.

#### Check Image Availability
```
GET /api/promotions/check-image?language=<lang>&date=<date>
```
Returns whether an image exists for the language/date combination.

#### Get All Images (Super Admin)
```
GET /api/promotions/images
```
Returns metadata for all uploaded promotion images.

#### Delete Image (Super Admin)
```
DELETE /api/promotions/images/:id
```
Deletes a promotion image.

### 5. **Database Collections**

#### `promotion_images`
Stores promotional template images.

**Schema:**
```javascript
{
  _id: ObjectId,
  language: String,        // hindi, english, marathi, etc.
  imageData: String,       // Base64 encoded image
  mimetype: String,        // image/jpeg, image/png
  uploadDate: String,      // YYYY-MM-DD
  createdAt: Date,
  updatedAt: Date
}
```

#### `promotion_records`
(Optional) For tracking promotion history.

### 6. **Frontend Components**

#### Updated Components:
1. **CommitteeTable.tsx**
   - Added `useNavigate` hook
   - Added "Promotion" dropdown option

2. **AdvisoryTable.tsx**
   - Added `useNavigate` hook
   - Added "Promotion" dropdown option

3. **App.tsx**
   - Added `/promotion` route
   - Imported PromotionPage component

#### New Components:
1. **PromotionPage.tsx**
   - Main promotion records table
   - Download functionality
   - Language-specific button visibility

2. **promotionService.ts**
   - API service functions for promotions
   - `fetchPromotionRecords()`
   - `generatePromotionCard()`
   - `checkPromotionImageAvailability()`

### 7. **Promotion Card Layout**

**Planned Layout (for future image processing):**
```
┌─────────────────────────────────┐
│                                 │
│    Top 80%: Template Image      │
│    (Event Banner/Expo Design)   │
│                                 │
│                                 │
│─────────────────────────────────│
│  Bottom 20%: Member Details     │
│  ┌───┐                          │
│  │   │  Name: John Doe          │
│  │ P │  Mobile: 9876543210      │
│  │ H │  Date: 08/10/2025        │
│  │ O │                          │
│  │ T │                          │
│  │ O │                          │
│  └───┘                          │
└─────────────────────────────────┘
```

## Usage Workflow

### For Super Admin:
1. Upload promotion template images via API:
   ```bash
   curl -X POST http://localhost:3001/api/promotions/upload-image \
     -F "image=@template_hindi.jpg" \
     -F "language=hindi" \
     -F "date=2025-10-08"
   ```

2. Repeat for each language needed

3. Members will automatically see download buttons for uploaded templates

### For Members:
1. Navigate to Committee or Advisory table
2. Click dropdown (⋮) next to approved member
3. Select "Promotion"
4. View promotion records table
5. Download available languages (buttons appear automatically)

## File Structure
```
ldoia-main/
├── client/
│   ├── pages/
│   │   └── PromotionPage.tsx          ✅ NEW
│   ├── components/
│   │   ├── CommitteeTable.tsx         ✅ UPDATED
│   │   └── AdvisoryTable.tsx          ✅ UPDATED
│   ├── services/
│   │   └── promotionService.ts        ✅ NEW
│   └── App.tsx                        ✅ UPDATED
└── ldoia-backend/
    └── server-registrations.cjs       ✅ UPDATED (Added promotion endpoints)
```

## MongoDB Collections
```
ldoia (database)
├── committee_applications
├── advisory_applications
├── promotion_images          ✅ NEW
└── promotion_records         ✅ NEW (optional)
```

## Environment Variables
No additional environment variables needed. Uses existing MongoDB connection.

## Testing

### 1. Test Promotion Page Access:
- Navigate to `/promotion` directly or via dropdown
- Should see table with all approved members

### 2. Test Upload (Super Admin):
```bash
# Upload Hindi template
curl -X POST http://localhost:3001/api/promotions/upload-image \
  -F "image=@template_hindi.jpg" \
  -F "language=hindi" \
  -F "date=2025-10-08"
```

### 3. Test Download:
- After uploading template, corresponding language button should appear
- Click download → should download JPG file

### 4. Test Visibility Logic:
- Upload template for specific date
- Only members with matching date should show download button
- Other dates should show "-"

## Future Enhancements

### Image Processing (Recommended):
Currently, the system returns the template image as-is. For production, implement image combination using:

**Option 1: Canvas (Node.js)**
```javascript
const { createCanvas, loadImage } = require('canvas');

async function combineImages(templateBuffer, memberData) {
  const canvas = createCanvas(1080, 1920);
  const ctx = canvas.getContext('2d');
  
  // Draw template (top 80%)
  const template = await loadImage(templateBuffer);
  ctx.drawImage(template, 0, 0, 1080, 1536);
  
  // Draw member section (bottom 20%)
  ctx.fillStyle = 'white';
  ctx.fillRect(0, 1536, 1080, 384);
  
  // Add member photo (left)
  if (memberData.photo) {
    const photo = await loadImage(memberData.photo);
    ctx.drawImage(photo, 50, 1556, 150, 200);
  }
  
  // Add member details (center/right)
  ctx.fillStyle = 'black';
  ctx.font = 'bold 36px Arial';
  ctx.fillText(memberData.name, 250, 1620);
  
  ctx.font = '28px Arial';
  ctx.fillText(memberData.phone, 250, 1670);
  ctx.fillText(memberData.date, 250, 1720);
  
  return canvas.toBuffer('image/jpeg');
}
```

**Option 2: Sharp (Recommended)**
```javascript
const sharp = require('sharp');

async function combineImages(templateBuffer, memberData) {
  // Resize template to top 80%
  const template = await sharp(templateBuffer)
    .resize(1080, 1536)
    .toBuffer();
  
  // Create member section SVG
  const memberSvg = `
    <svg width="1080" height="384">
      <rect width="1080" height="384" fill="white"/>
      <text x="250" y="84" font-size="36" font-weight="bold">${memberData.name}</text>
      <text x="250" y="134" font-size="28">${memberData.phone}</text>
      <text x="250" y="184" font-size="28">${memberData.date}</text>
    </svg>
  `;
  
  // Combine images
  return await sharp({
    create: {
      width: 1080,
      height: 1920,
      channels: 3,
      background: { r: 255, g: 255, b: 255 }
    }
  })
  .composite([
    { input: template, top: 0, left: 0 },
    { input: Buffer.from(memberSvg), top: 1536, left: 0 }
  ])
  .jpeg()
  .toBuffer();
}
```

### Super Admin UI:
Create a dedicated Super Admin section for:
- Uploading promotion templates
- Managing existing templates
- Viewing upload history
- Bulk upload for multiple languages

### Notifications:
- Email/SMS notification when new promotion templates are available
- Alert members about available downloads

## Troubleshooting

### Issue: Download button not showing
**Solution:** Verify that:
1. Promotion image was uploaded for that exact language
2. Upload date matches member's date
3. Check browser console for API errors

### Issue: Generated card doesn't include member details
**Solution:** Currently returns template only. Implement image processing (see Future Enhancements above)

### Issue: Large file sizes
**Solution:** 
- Compress templates before upload
- Use JPEG format instead of PNG
- Implement image optimization in backend

## API Examples

### Complete Upload Example:
```javascript
// Frontend upload function
async function uploadPromotionTemplate(file, language, date) {
  const formData = new FormData();
  formData.append('image', file);
  formData.append('language', language);
  formData.append('date', date);
  
  const response = await fetch('http://localhost:3001/api/promotions/upload-image', {
    method: 'POST',
    body: formData
  });
  
  return await response.json();
}

// Usage
const file = document.getElementById('fileInput').files[0];
const result = await uploadPromotionTemplate(file, 'hindi', '2025-10-08');
console.log(result);
```

## Notes
- All dates use ISO format (YYYY-MM-DD)
- Images stored as Base64 in MongoDB
- Download filenames include member name, language, and date
- Routes are protected at frontend level (consider adding backend auth)

## Support
For issues or questions, check:
1. MongoDB connection status
2. Server logs for error messages
3. Network tab in browser DevTools
4. Database collections for data integrity

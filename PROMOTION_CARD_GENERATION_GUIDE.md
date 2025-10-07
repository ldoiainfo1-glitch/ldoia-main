# Promotion Card Generation System - Complete Guide

## 🎯 Overview

The Promotion Card Generation system allows:
1. **Super Admins** to upload promotion templates in 10 Indian languages
2. **Approved Members** to download personalized promotion cards with their details

## 📐 Card Layout Design

### Card Composition (Inspired by Your Reference Image):

```
┌─────────────────────────────────────────┐
│                                         │
│        TOP 80% AREA                     │
│     (Admin Uploaded Template)           │
│                                         │
│  ┌───────────────────────────────────┐  │
│  │  Event Banner / Promotional       │  │
│  │  Content (e.g., Property Expo,    │  │
│  │  LDOIA Events, etc.)              │  │
│  │                                   │  │
│  │  Organized by LDOIA               │  │
│  │  Marketed by Instantlly           │  │
│  └───────────────────────────────────┘  │
│                                         │
├─────────────────────────────────────────┤
│  BOTTOM 20% AREA (Auto-Generated)       │
│  ┌─────────────────────────────────┐    │
│  │  ┌────┐   User Name              │    │
│  │  │📷  │   Mobile No.              │    │
│  │  │    │   1234567890              │    │
│  │  └────┘                     Date  │    │
│  └─────────────────────────────────┘    │
└─────────────────────────────────────────┘
```

### Bottom Section Details:
- **Background**: Cream/amber color (#FEF3C7)
- **Left Side**: Member photo (circular, 80% of section height)
- **Center**: Member name and mobile number
- **Right**: Promotion date
- **Placeholder**: Orange square if no photo available

## 🔧 How It Works

### 1. Admin Workflow (Upload Templates)

#### Step 1: Access Super Admin Panel
```
Navigate to: http://localhost:5173/superadmin
Click: "🎨 Promotion Images" tab
```

#### Step 2: Upload Template
1. **Select Language**: Choose from 10 languages (Hindi, English, Marathi, etc.)
2. **Select Date**: Pick the date this template is for
3. **Choose Image**: Upload promotional banner/template image
4. **Preview**: Check the template preview
5. **Upload**: Click "Upload Template"

**Recommended Template Specs**:
- Dimensions: 1080 x 1920 pixels (for best results)
- Format: JPEG or PNG
- Size: Under 10MB
- Content: Design for top 80% of card (bottom 20% auto-generated)

#### Backend API:
```javascript
POST /api/promotions/upload-image
Content-Type: multipart/form-data

Fields:
- image: File (template image)
- language: String (hindi, english, marathi, etc.)
- date: String (YYYY-MM-DD format)
```

### 2. Member Workflow (Download Cards)

#### Step 1: Navigate to Promotion Page
From Committee/Advisory table:
1. Click dropdown (⋮) next to member name
2. Select "Promotion"
3. View promotion records table

#### Step 2: Download Personalized Card
- Table shows all approved members
- Download buttons appear ONLY for languages with uploaded templates
- Click download button in desired language column
- System generates and downloads composite card

#### Backend API:
```javascript
GET /api/promotions/generate?memberId=<id>&language=<lang>&date=<date>

Returns: JPEG image (composite of template + member details)
```

## 🎨 Image Processing Pipeline

### Backend Composite Generation (Using Sharp):

```javascript
1. Load template image (uploaded by admin)
2. Get template dimensions (width x height)
3. Calculate sections:
   - Top 80%: templateHeight * 0.8
   - Bottom 20%: templateHeight * 0.2

4. Resize template to fit top 80% area

5. Create bottom 20% section:
   a. Background: Cream/amber color
   b. Member photo: Circular, left side (80% of section height)
   c. Text overlay (SVG):
      - Member name (bold, large)
      - "Mobile No." label
      - Member phone number
      - Date (right-aligned)

6. Composite layers:
   - Layer 1: Template (top 80%)
   - Layer 2: Member details section (bottom 20%)
   - Layer 3: Member photo (if available)

7. Export as JPEG (quality: 90%)
```

### Code Implementation:
```javascript
const sharp = require('sharp');

// 1. Prepare template
const templateBuffer = Buffer.from(templateImage.imageData, 'base64');
const templateMetadata = await sharp(templateBuffer).metadata();
const templateWidth = templateMetadata.width;
const templateHeight = templateMetadata.height;

// 2. Calculate sections
const templateDisplayHeight = Math.floor(templateHeight * 0.8);
const memberSectionHeight = templateHeight - templateDisplayHeight;

// 3. Resize template
const resizedTemplate = await sharp(templateBuffer)
  .resize(templateWidth, templateDisplayHeight, { fit: 'cover' })
  .toBuffer();

// 4. Create member details section with SVG text
// 5. Composite member photo (circular)
// 6. Combine all layers
// 7. Export as JPEG
```

## 📊 Database Schema

### Collection: `promotion_images`
```javascript
{
  _id: ObjectId,
  language: String,        // hindi, english, marathi, etc.
  imageData: String,       // Base64 encoded template
  mimetype: String,        // image/jpeg, image/png
  uploadDate: String,      // YYYY-MM-DD
  size: Number,            // File size in bytes
  createdAt: Date,
  updatedAt: Date
}
```

### Member Data (from `committee_applications`/`advisory_applications`):
```javascript
{
  _id: ObjectId,
  applicant_name: String,  // Member name
  phone_number: String,    // Mobile number
  photo_data: String,      // Base64 encoded photo
  photo_mimetype: String,  // image/jpeg
  applied_date: Date,      // Application date
  application_status: String,
  // ... other fields
}
```

## 🌐 Supported Languages

1. 🇮🇳 Hindi (hindi)
2. 🇬🇧 English (english)
3. 🇮🇳 Marathi (marathi)
4. 🇮🇳 Gujarati (gujarati)
5. 🇮🇳 Tamil (tamil)
6. 🇮🇳 Telugu (telugu)
7. 🇮🇳 Kannada (kannada)
8. 🇮🇳 Bengali (bengali)
9. 🇮🇳 Odia (odia)
10. 🇮🇳 Urdu (urdu)

## 🔄 Complete Flow Example

### Scenario: Member "Muskaan" wants to download Hindi promotion card

#### 1. Admin Preparation:
```
✅ Admin uploads Hindi template for date: 2025-10-08
✅ Template stored in MongoDB (promotion_images collection)
✅ Available languages marked for that date
```

#### 2. Member Access:
```
✅ Muskaan was approved on 2025-10-08
✅ Opens Committee/Advisory table
✅ Clicks dropdown → "Promotion"
✅ Sees promotion records table
```

#### 3. Download Available:
```
✅ In Hindi column, download button is visible
✅ Other columns show "-" (no template uploaded)
```

#### 4. Download Process:
```
Frontend:
1. User clicks Hindi download button
2. Fetches: /api/promotions/generate?memberId=xxx&language=hindi&date=2025-10-08

Backend:
1. Retrieves Muskaan's details (name, phone, photo)
2. Retrieves Hindi template for 2025-10-08
3. Generates composite image:
   - Top 80%: Hindi promotional template
   - Bottom 20%: Muskaan's details (photo + name + phone + date)
4. Returns JPEG image

Frontend:
1. Receives image blob
2. Creates download link
3. Downloads as: Promotion_Muskaan_hindi_08-Oct-2025.jpg
```

## 📱 User Interface

### Promotion Records Table:
```
┌────────┬─────────┬──────────┬────────┬───────┬────────┬────────┬────────┬────────┬────────┬────────┬────────┬────────┬────────┐
│ Sr.No  │  Name   │ Mobile   │  Date  │ Hindi │ English│ Marathi│Gujarati│ Tamil  │ Telugu │Kannada │Bengali │  Odia  │  Urdu  │
├────────┼─────────┼──────────┼────────┼───────┼────────┼────────┼────────┼────────┼────────┼────────┼────────┼────────┼────────┤
│   1    │ Muskaan │ 98765432 │08/10/25│ [⬇️]  │   —    │   —    │   —    │   —    │   —    │   —    │   —    │   —    │   —    │
└────────┴─────────┴──────────┴────────┴───────┴────────┴────────┴────────┴────────┴────────┴────────┴────────┴────────┴────────┘

Legend:
[⬇️] = Download button (template available for this language/date)
 —  = No template available
```

## 🔐 Key Features

### Smart Download Button Visibility:
✅ Download buttons appear ONLY when:
1. Admin uploaded template for that specific language
2. Upload date matches member's approval date
3. Both conditions must be true

### Automatic Personalization:
✅ Each member gets:
1. Their own name displayed
2. Their own phone number
3. Their own photo (if uploaded)
4. Their approval date
5. Language-specific template

### Responsive Design:
✅ Works on all devices (desktop, tablet, mobile)
✅ Optimized table scrolling for many columns
✅ Loading states for uploads and downloads

## 🚀 Testing Checklist

### Admin Testing:
- [ ] Upload template for Hindi (date: 2025-10-08)
- [ ] Verify template appears in table
- [ ] Upload template for English (same date)
- [ ] Upload template for different date (2025-10-09)
- [ ] Delete a template
- [ ] Upload large image (test file size limit)

### Member Testing:
- [ ] Navigate to promotion page
- [ ] Verify download buttons appear for uploaded languages only
- [ ] Download Hindi card
- [ ] Verify composite image has:
  - [ ] Template in top 80%
  - [ ] Member name in bottom 20%
  - [ ] Member phone number
  - [ ] Member photo (circular)
  - [ ] Correct date
- [ ] Download English card
- [ ] Verify different templates generate correctly

### Edge Cases:
- [ ] Member without photo (should show orange placeholder)
- [ ] Very long names (should not overflow)
- [ ] Special characters in names
- [ ] Multiple members with same approval date
- [ ] Download multiple cards rapidly (no crashes)

## 🐛 Troubleshooting

### Issue: Download button not visible
**Check:**
1. Template uploaded for that language?
2. Upload date matches member's approval date?
3. Check browser console for errors
4. Verify API: `GET /api/promotions/records`

### Issue: Download fails
**Check:**
1. Backend server running (port 3001)?
2. MongoDB connection active?
3. Sharp library installed: `npm install sharp`
4. Check backend logs for errors

### Issue: Photo not showing on card
**Check:**
1. Member has photo_data in database?
2. Photo is valid base64?
3. Check backend logs for photo processing errors
4. Orange placeholder should appear if no photo

### Issue: Text overlaps or looks wrong
**Adjust:**
1. Font sizes in SVG generation code
2. Text positions (textLeftPosition, textTopPosition)
3. Template dimensions (recommended: 1080x1920)

## 📦 Dependencies

### Backend:
```json
{
  "sharp": "^x.x.x",      // Image processing
  "express": "^5.x.x",    // Web framework
  "mongodb": "^6.x.x",    // Database
  "multer": "^2.x.x"      // File uploads
}
```

### Frontend:
```json
{
  "react": "^18.x.x",
  "react-router-dom": "^6.x.x",
  "@radix-ui/*": "^x.x.x",  // UI components
  "lucide-react": "^x.x.x"  // Icons
}
```

## 📝 File Locations

```
Frontend:
├── client/pages/PromotionPage.tsx          # Member download interface
├── client/superadmin/PromotionImagesAdmin.tsx  # Admin upload interface
├── client/superadmin/SuperAdminDashboard.tsx   # Dashboard integration
└── client/services/promotionService.ts     # API service functions

Backend:
└── ldoia-backend/server-registrations.cjs  # All API endpoints

Database:
├── promotion_images                        # Template storage
├── committee_applications                  # Member data
└── advisory_applications                   # Member data
```

## 🎉 Success Metrics

### What Success Looks Like:
✅ Admin uploads templates in < 30 seconds
✅ All 10 languages supported
✅ Download buttons appear instantly
✅ Cards generate in < 3 seconds
✅ No errors during download
✅ Photos display correctly
✅ Text is readable and well-positioned
✅ Works on mobile and desktop

## 🔮 Future Enhancements

### Potential Features:
1. **Batch Upload**: Upload templates for multiple languages at once
2. **Template Preview**: Show how card will look with sample member data
3. **Custom Fonts**: Support regional language fonts
4. **QR Code**: Add QR code to member details section
5. **Analytics**: Track download statistics per language
6. **Email Delivery**: Email cards directly to members
7. **Social Sharing**: Share on WhatsApp/Facebook directly
8. **Template Library**: Pre-designed templates for common events

## 📞 Support

For issues or questions:
1. Check this guide first
2. Review backend logs: `console.log` in server-registrations.cjs
3. Check browser console for frontend errors
4. Verify MongoDB connection
5. Test API endpoints directly with Postman/curl

---

**Last Updated**: October 8, 2025
**Version**: 1.0.0
**Status**: ✅ Production Ready

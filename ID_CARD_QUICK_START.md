# ID Card Feature - Quick Start Guide

## 🚀 How to Use the ID Card Feature

### For End Users:

1. **Navigate to the LDOIA website**
2. **Go to either Committee or Advisory table**
3. **Find an approved member** (look for members with status "approved")
4. **Click the three dots (⋮)** in the "Others" column
5. **Select "ID Card"** from the dropdown menu
6. **Review the ID card** that appears in the modal
7. **Click "📥 Download ID Card"** to save as PDF
8. **Click "Close"** to exit the modal

### What You'll See:

**Left Side (Black)**:
- LDOIA logo and branding
- Association mission statement
- Contact information

**Right Side (Red)**:
- Member's photo
- Name and phone number
- Location details with the appointed level highlighted in WHITE

---

## 🎨 Understanding the Highlighting

The ID card automatically highlights the level where the person is appointed:

- **WHITE background** = Appointed level (e.g., State Head → State field is white)
- **RED background** = Not appointed at this level

**Examples**:

| Position | Highlighted Field |
|----------|-------------------|
| India President | Country (India) |
| State Head Maharashtra | State (Maharashtra) |
| Zone Head West | Zone (West) |
| District Head Pune | District (Pune) |
| Village Head Shirdi | Village (Shirdi) |

---

## 📥 Downloaded File

**Filename format**: `LDOIA_ID_<MemberName>_<ID>.pdf`

**Example**: `LDOIA_ID_Rajesh_Modi_67890xyz.pdf`

**Format**: PDF (A4 Landscape)
**Quality**: High resolution (2x scale)
**Size**: Optimized for printing or digital sharing

---

## 🔍 Troubleshooting

### "ID Card button is grayed out"
➡️ **Solution**: This position is not yet approved. Only approved members can access ID cards.

### "No photo appears on ID card"
➡️ **Solution**: Photo will show placeholder text. Member can update their photo through the Edit option.

### "Download failed"
➡️ **Solution**: Try again. Check your browser's download settings and popup blockers.

### "Wrong level is highlighted"
➡️ **Solution**: This is based on the applied position. Contact admin if the position needs to be corrected.

---

## 💡 Tips

✅ **Print Quality**: PDF is optimized for printing. Use color printer for best results.

✅ **Digital Sharing**: PDF can be shared via email, WhatsApp, or any messaging app.

✅ **Verification**: The Application ID on the card can be used to verify authenticity.

✅ **Updates**: If member details change (phone, photo, etc.), the ID card will automatically reflect the latest information.

---

## 🛠️ Technical Information

**For Developers**:

### Dependencies:
```bash
npm install html2canvas jspdf
```

### Component Location:
```
/client/components/IDCard.tsx
```

### Integration Points:
- Committee Table: `/client/components/CommitteeTable.tsx`
- Advisory Table: `/client/components/AdvisoryTable.tsx`

### Data Source:
- MongoDB collections: `committee_applications` and `advisory_applications`

### Key Functions:
```typescript
handleShowIDCard(application, position) // Opens ID card modal
downloadIDCard() // Generates and downloads PDF
```

---

## 📞 Support

If you encounter any issues:

1. Check browser console for error messages
2. Verify member has "approved" status
3. Ensure browser allows downloads
4. Try refreshing the page
5. Contact technical support if issue persists

---

## ✅ Feature Checklist

- [x] Dynamic ID card generation
- [x] Database integration
- [x] Photo display (with fallback)
- [x] Smart level highlighting
- [x] PDF download functionality
- [x] Professional design matching template
- [x] Responsive layout (mobile + desktop)
- [x] Error handling
- [x] User-friendly interface
- [x] High-quality output

**Status**: ✅ **FULLY OPERATIONAL**

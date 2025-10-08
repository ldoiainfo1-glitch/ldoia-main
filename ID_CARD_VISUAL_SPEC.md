# ID Card Visual Specification

## Layout Structure

```
┌─────────────────────────────────────────────────────────────┐
│                    ID CARD MODAL (Full Screen)              │
├────────────────────────┬────────────────────────────────────┤
│   LEFT SIDE (BLACK)    │    RIGHT SIDE (RED)                │
│                        │                                    │
│   [LDOIA LOGO]         │   Marketed By Instantly ⚡         │
│   (circular, green     │                                    │
│    border)             │   ┌────────────────────┐          │
│                        │   │                    │          │
│   LAND DEVELOPERS &    │   │   MEMBER PHOTO     │          │
│   OWNERS               │   │   (or initials)    │          │
│   INDIA ASSOCIATION    │   │                    │          │
│                        │   └────────────────────┘          │
│   WE SOLVE PROBLEMS OF │                                    │
│                        │   Name: John Doe                   │
│   DEVELOPERS           │   Mob: +91 9876543210              │
│   LAND OWNERS          │                                    │
│   REAL ESTATE AGENTS   │   Area Head For                    │
│                        │                                    │
│   ┌──────────────────┐ │   Country: India                   │
│   │EACH AREA HEAD    │ │   Zone: West                       │
│   │HAVE 25 POST      │ │   State: Maharashtra  ◄─ WHITE    │
│   └──────────────────┘ │   Division: -                      │
│                        │   District: -                      │
│   We Are Appointing    │   Taluka: -                        │
│   Sole Head for India, │   Pincode: -                       │
│   Zone, State,         │   Village: -                       │
│   Division, District,  │                                    │
│   Tehsil, Pincode,     │                                    │
│   Village              │                                    │
│                        │                                    │
│   Mob: 9833752025      │                                    │
│   Web: instantlly.com  │                                    │
│                        │                                    │
└────────────────────────┴────────────────────────────────────┘
│              [Close]        [📥 Download ID Card]            │
└─────────────────────────────────────────────────────────────┘
```

## Color Scheme

### Left Side:
- **Background**: Black (#000000)
- **Text**: White (#FFFFFF)
- **Logo Border**: Green (#22C55E)
- **Badge**: Red (#DC2626) background with white text

### Right Side:
- **Background**: Red (#DC2626)
- **Text**: White (#FFFFFF)
- **Photo Background**: White (#FFFFFF)
- **Highlighted Field**: White background (#FFFFFF) with black text (#000000)
- **Non-highlighted Fields**: Red background (#DC2626) with white text (#FFFFFF)

## Typography

```
Left Side:
- Association Name: 2xl, bold, white
- Problem Statement: lg, bold, red-500
- Section Titles: 2xl, bold, white
- Badge Text: Bold
- Contact Info: xl, bold (phone), lg (web)

Right Side:
- Name: 2xl, bold, white
- Phone: xl, white
- Section Title (Area Head For): xl, bold, white
- Location Fields: 
  - Highlighted: Black text on white background
  - Normal: White text on red background
```

## Responsive Behavior

```
Desktop (>768px):
┌────────────┬────────────┐
│   Black    │    Red     │
│   50%      │    50%     │
└────────────┴────────────┘

Mobile (<768px):
┌────────────────────────┐
│        Black           │
│        100%            │
├────────────────────────┤
│         Red            │
│        100%            │
└────────────────────────┘
```

## Field Highlighting Examples

### Example 1: State Head (Maharashtra)
```
Country: India         [RED background]
Zone: West             [RED background]
State: Maharashtra     [WHITE background] ◄── Highlighted
Division: -            [RED background]
District: -            [RED background]
Taluka: -              [RED background]
Pincode: -             [RED background]
Village: -             [RED background]
```

### Example 2: India President
```
Country: India         [WHITE background] ◄── Highlighted
Zone: -                [RED background]
State: -               [RED background]
Division: -            [RED background]
District: -            [RED background]
Taluka: -              [RED background]
Pincode: -             [RED background]
Village: -             [RED background]
```

### Example 3: District Head (Pune)
```
Country: India         [RED background]
Zone: West             [RED background]
State: Maharashtra     [RED background]
Division: Pune         [RED background]
District: Pune         [WHITE background] ◄── Highlighted
Taluka: -              [RED background]
Pincode: -             [RED background]
Village: -             [RED background]
```

## Photo Handling

### If Photo Exists:
```
┌────────────────────┐
│                    │
│   [ACTUAL PHOTO]   │
│   (full width/     │
│    height, cover)  │
│                    │
└────────────────────┘
```

### If No Photo:
```
┌────────────────────┐
│                    │
│       Photo        │
│   (gray text on    │
│   white bg)        │
│                    │
└────────────────────┘
```

## Download Specifications

- **Format**: PDF
- **Orientation**: Landscape
- **Size**: A4 (297mm x 210mm)
- **Quality**: 2x scale (high resolution)
- **Filename Pattern**: `LDOIA_ID_<Name>_<ID>.pdf`
- **Example**: `LDOIA_ID_John_Doe_abc123.pdf`

## User Interaction Flow

```
1. User clicks "⋮" in table
   ↓
2. Dropdown menu appears
   ↓
3. User clicks "ID Card"
   ↓
4. Modal opens with personalized card
   ↓
5. User reviews information
   ↓
6. User clicks "📥 Download ID Card"
   ↓
7. PDF downloads automatically
   ↓
8. User clicks "Close" or uses modal
   ↓
9. Modal closes, returns to table
```

## Accessibility Features

- **Keyboard Navigation**: Modal can be closed with Escape key
- **Focus Management**: Focus trapped within modal
- **Screen Readers**: All fields labeled appropriately
- **Color Contrast**: High contrast between text and backgrounds
- **Touch Targets**: Buttons sized for easy clicking (min 44x44px)

## Animation Effects

- **Modal Entry**: Fade in + slide up from bottom
- **Modal Exit**: Fade out
- **Button Hover**: Gradient color shift
- **Duration**: 200ms ease-in-out

## Error Handling

### Missing Photo:
- Display "Photo" placeholder text
- White background
- Gray text

### Missing Location Data:
- Display "-" (dash) for empty fields
- Field still shows in correct position
- Red background (not highlighted)

### Download Failure:
- Alert message: "❌ Error downloading ID card. Please try again."
- Modal remains open
- User can retry download

### Success Message:
- Alert: "✅ ID Card downloaded successfully!"
- Modal can be closed
- PDF saved to Downloads folder

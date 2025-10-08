# MongoDB Collection Separation Guide

## Overview
Committee and Advisory applications are now stored in **separate MongoDB collections** for better organization and performance.

---

## 🗂️ New Collection Structure

### Before (Single Collection)
```
ldoia
  └── applications (all applications together)
```

### After (Separated Collections)
```
ldoia
  ├── committee_applications (committee only)
  └── advisory_applications (advisory only)
```

---

## 🔧 How It Works

### 1. **Form Submission**
When a user submits an application form:

- **Backend checks** the `applied_position` field
- **Determines form type:**
  - Contains "Advisory Level" → `advisory_applications`
  - Otherwise → `committee_applications`
- **Adds `form_type` field:**
  ```javascript
  form_type: "committee"  // or "advisory"
  ```

### 2. **API Endpoints**

#### **POST** - Create Application
```http
POST /api/applications
```
- Automatically routes to correct collection based on `applied_position`
- Adds `form_type` field to the document

#### **GET** - Fetch Applications

**All Applications (Combined):**
```http
GET /api/applications
```
Returns:
```json
{
  "success": true,
  "data": [...all applications...],
  "total": 10,
  "committee": 6,
  "advisory": 4
}
```

**Committee Only:**
```http
GET /api/applications/committee
```
Returns:
```json
{
  "success": true,
  "data": [...committee apps...],
  "total": 6,
  "type": "committee"
}
```

**Advisory Only:**
```http
GET /api/applications/advisory
```
Returns:
```json
{
  "success": true,
  "data": [...advisory apps...],
  "total": 4,
  "type": "advisory"
}
```

#### **PUT/PATCH** - Update Status
```http
PUT /api/applications/:id/status
PATCH /api/applications/:id
```
- Automatically searches **both collections**
- Updates the correct one
- Returns which collection was updated

---

## 📊 Super Admin Panel

### Dashboard Statistics
- Fetches from **both collections** via `/api/applications`
- Shows combined statistics

### Committee Table
- Fetches from `committee_applications` collection
- Endpoint: `/api/applications/committee`

### Advisory Table
- Fetches from `advisory_applications` collection
- Endpoint: `/api/applications/advisory`

---

## 🔄 Data Migration (Optional)

If you have existing data in the old `applications` collection, run this migration:

### Option 1: Manual Migration (MongoDB Compass)

1. **Open MongoDB Compass**
2. **Connect to your cluster**
3. **Navigate to** `ldoia → applications`

4. **Export Committee Applications:**
   - Filter: `{ "applied_position": { "$not": /Advisory Level/ } }`
   - Export to JSON

5. **Export Advisory Applications:**
   - Filter: `{ "applied_position": /Advisory Level/ }`
   - Export to JSON

6. **Create New Collections:**
   ```javascript
   db.createCollection("committee_applications")
   db.createCollection("advisory_applications")
   ```

7. **Import Data:**
   - Import committee JSON to `committee_applications`
   - Import advisory JSON to `advisory_applications`

8. **(Optional) Add `form_type` field:**
   ```javascript
   // Committee
   db.committee_applications.updateMany(
     {},
     { $set: { form_type: "committee" } }
   )
   
   // Advisory
   db.advisory_applications.updateMany(
     {},
     { $set: { form_type: "advisory" } }
   )
   ```

### Option 2: Programmatic Migration (Node.js)

Create a migration script `migrate-collections.js`:

```javascript
const { MongoClient } = require('mongodb');

async function migrateCollections() {
  const client = new MongoClient('YOUR_MONGODB_URI');
  
  try {
    await client.connect();
    const db = client.db('ldoia');
    
    // Get old collection
    const oldApps = db.collection('applications');
    
    // Create new collections
    const committeeApps = db.collection('committee_applications');
    const advisoryApps = db.collection('advisory_applications');
    
    // Fetch all applications
    const allApps = await oldApps.find({}).toArray();
    
    console.log(`Found ${allApps.length} applications to migrate`);
    
    let committeeCount = 0;
    let advisoryCount = 0;
    
    for (const app of allApps) {
      const isAdvisory = app.applied_position?.includes('Advisory Level');
      const formType = isAdvisory ? 'advisory' : 'committee';
      
      // Add form_type field
      const updatedApp = { ...app, form_type: formType };
      
      // Insert into appropriate collection
      if (isAdvisory) {
        await advisoryApps.insertOne(updatedApp);
        advisoryCount++;
      } else {
        await committeeApps.insertOne(updatedApp);
        committeeCount++;
      }
    }
    
    console.log(`✅ Migration complete!`);
    console.log(`   Committee: ${committeeCount} applications`);
    console.log(`   Advisory: ${advisoryCount} applications`);
    
  } finally {
    await client.close();
  }
}

migrateCollections().catch(console.error);
```

**Run:**
```bash
node migrate-collections.js
```

---

## ✅ Testing Checklist

### Backend Tests

1. **Submit Committee Application**
   ```bash
   # Check MongoDB Compass
   # Verify it appears in: committee_applications
   ```

2. **Submit Advisory Application**
   ```bash
   # Check MongoDB Compass
   # Verify it appears in: advisory_applications
   ```

3. **Fetch All Applications**
   ```bash
   curl http://localhost:3001/api/applications
   # Should return both types
   ```

4. **Fetch Committee Only**
   ```bash
   curl http://localhost:3001/api/applications/committee
   ```

5. **Fetch Advisory Only**
   ```bash
   curl http://localhost:3001/api/applications/advisory
   ```

6. **Update Application Status**
   ```bash
   curl -X PATCH http://localhost:3001/api/applications/LDOIA-123456789 \
     -H "Content-Type: application/json" \
     -d '{"status":"approved"}'
   
   # Response should show which collection was updated
   ```

### Frontend Tests

1. **Super Admin Dashboard**
   - ✅ Total count = Committee + Advisory
   - ✅ Statistics show correct breakdown

2. **Committee Table**
   - ✅ Shows only committee applications
   - ✅ No advisory applications visible
   - ✅ Approve/Reject works
   - ✅ Console shows: "from committee_applications collection"

3. **Advisory Table**
   - ✅ Shows only advisory applications
   - ✅ No committee applications visible
   - ✅ Approve/Reject works
   - ✅ Console shows: "from advisory_applications collection"

---

## 🛠️ Troubleshooting

### Issue: No applications showing in tables

**Solution:**
1. Check browser console for errors
2. Verify backend is running: `http://localhost:3001/api/applications`
3. Check MongoDB collections have data:
   ```
   ldoia → committee_applications (has documents?)
   ldoia → advisory_applications (has documents?)
   ```

### Issue: Applications going to wrong collection

**Check:**
1. Form submission includes correct `applied_position` field
2. Committee positions do NOT contain "Advisory Level" in name
3. Advisory positions DO contain "Advisory Level" in name

### Issue: Old applications not migrated

**Solution:**
- Run the migration script (see above)
- OR manually move documents using MongoDB Compass

---

## 📁 Modified Files

### Backend
- `ldoia-backend/server-registrations.cjs`
  - Added `getCommitteeApplicationsCollection()`
  - Added `getAdvisoryApplicationsCollection()`
  - Updated `POST /api/applications` (automatic routing)
  - Added `GET /api/applications/committee`
  - Added `GET /api/applications/advisory`
  - Updated `PUT /api/applications/:id/status` (searches both)
  - Updated `PATCH /api/applications/:id` (searches both)

### Frontend
- `client/superadmin/CommitteeTableAdmin.tsx`
  - Changed endpoint to `/api/applications/committee`
  - Removed client-side filtering
  
- `client/superadmin/AdvisoryTableAdmin.tsx`
  - Changed endpoint to `/api/applications/advisory`
  - Removed client-side filtering

- `client/superadmin/SuperAdminDashboard.tsx`
  - Enhanced statistics calculation
  - Added collection count logging

---

## 🎯 Benefits

1. **Performance**: Smaller collections = faster queries
2. **Organization**: Clear separation of concerns
3. **Scalability**: Easier to add collection-specific logic
4. **Maintainability**: Simpler to manage and backup specific data
5. **Flexibility**: Can have different indexes/validation per collection

---

## 🔐 Security Notes

- Both collections use same authentication/authorization
- Super Admin can approve/reject from both
- Public website filters by `application_status`
- No cross-collection contamination

---

## 📞 Support

If issues persist:
1. Check server logs: `ldoia-backend/server-registrations.cjs`
2. Check browser console (F12)
3. Verify MongoDB connection
4. Test endpoints with Postman/curl

**Current Status:**
- ✅ Backend: Separated collections
- ✅ Frontend: Using new endpoints
- ✅ Backward compatible (old endpoint still works)
- ⏳ Migration: Optional (run when ready)

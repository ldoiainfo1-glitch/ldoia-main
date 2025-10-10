# Taluka Data Addition Scripts

This directory contains scripts to enrich your location CSV with taluka (sub-district) information.

## 📋 Available Scripts

### 1. `add-taluka-data.cjs` - Simple API-based approach
**Best for:** Quick addition using India Post Office API

**Features:**
- Uses api.postalpincode.in for taluka data
- Caches results to avoid duplicate API calls
- Rate-limited to respect API limits
- Progress tracking every 1000 records

**Usage:**
```bash
cd ldoia-backend
node add-taluka-data.cjs
```

**Pros:**
- Simple and straightforward
- Official India Post data
- Reliable for most pincodes

**Cons:**
- API may not have taluka for all pincodes
- Slower due to API rate limits (~165K requests needed)
- Dependent on external API availability

---

### 2. `add-taluka-advanced.cjs` - Multi-strategy approach ⭐ RECOMMENDED
**Best for:** Comprehensive data enrichment with fallback strategies

**Features:**
- **3-tier strategy:**
  1. India Post Office API (primary)
  2. District-to-Taluka mapping (fallback)
  3. Division field extraction (last resort)
- Progress saving (resume on failure)
- Retry logic for API failures
- Manual mappings for major districts

**Usage:**
```bash
cd ldoia-backend
node add-taluka-advanced.cjs
```

**Pros:**
- Higher success rate (multiple fallback strategies)
- Can resume if interrupted
- Handles API failures gracefully
- Uses existing division field when API fails

**Cons:**
- More complex
- Requires manual mapping for some districts

---

## 🚀 Quick Start Guide

### Step 1: Choose Your Approach

**For Quick Testing:**
```bash
# Use simple script
node add-taluka-data.cjs
```

**For Production (Recommended):**
```bash
# Use advanced script with fallbacks
node add-taluka-advanced.cjs
```

### Step 2: Monitor Progress

The scripts will show real-time progress:
```
   Processed: 50000/165633
   API: 35000 | District: 8000 | Division: 5000 | None: 2000
   Cache: 12500 pincodes
```

### Step 3: Review Output

Output file: `public/location-with-taluka.csv`

Check the file for taluka data:
```bash
# View first 10 lines
head -10 ../public/location-with-taluka.csv

# Check taluka column
cut -d',' -f7 ../public/location-with-taluka.csv | head -20
```

### Step 4: Import to MongoDB

Once satisfied with the taluka data, update your import script or use the new file.

---

## ⚙️ Configuration

### Rate Limiting

In both scripts, you can adjust:
```javascript
const RATE_LIMIT_DELAY = 150; // milliseconds between API calls
```

Recommended values:
- **Fast (risky):** 50ms (might hit rate limits)
- **Balanced:** 150ms (recommended)
- **Safe:** 300ms (slower but more reliable)

### District-to-Taluka Mapping

In `add-taluka-advanced.cjs`, you can expand the manual mapping:

```javascript
const DISTRICT_TALUKA_MAPPING = {
  'MUMBAI SUBURBAN': ['Andheri', 'Borivali', 'Kurla', 'Bandra', 'Mulund'],
  'YOUR_DISTRICT': ['Taluka1', 'Taluka2', 'Taluka3'],
  // Add more districts as needed
};
```

---

## 📊 Expected Results

### Coverage Estimates (for 165,633 records):

**Simple Script (add-taluka-data.cjs):**
- API Success: ~60-70% (100K-115K records)
- No Data: ~30-40% (50K-65K records)
- Time: ~4-6 hours (with 150ms delay)

**Advanced Script (add-taluka-advanced.cjs):**
- API Success: ~60-70% (100K-115K records)
- District Mapping: ~10-15% (16K-25K records)
- Division Fallback: ~15-20% (25K-33K records)
- No Data: ~5-10% (8K-16K records)
- Time: ~4-6 hours (with 150ms delay)

---

## 🔄 Resume After Interruption

The advanced script saves progress automatically. If interrupted:

```bash
# Just run again - it will resume from where it stopped
node add-taluka-advanced.cjs
```

Progress is saved in: `taluka-progress.json`

---

## 🐛 Troubleshooting

### API Rate Limit Errors
**Symptom:** Many "Error" responses from API

**Solution:** Increase `RATE_LIMIT_DELAY`:
```javascript
const RATE_LIMIT_DELAY = 300; // Slower but safer
```

### Script Crashes
**Symptom:** Script stops unexpectedly

**Solution:** 
1. Check `taluka-progress.json` to see where it stopped
2. Run the advanced script again (it will resume)
3. Increase `MAX_RETRIES` if API is unstable

### No Taluka Data for Some Pincodes
**Symptom:** Many records have empty taluka field

**Solution:**
1. Expand `DISTRICT_TALUKA_MAPPING` with more districts
2. The division field fallback should handle most cases
3. Manually update specific pincodes if needed

### Memory Issues
**Symptom:** Script runs out of memory

**Solution:** Process in smaller batches:
```bash
# Process first 50K records
head -50001 ../public/location.csv > ../public/location-batch1.csv
node add-taluka-advanced.cjs

# Then process next batch
```

---

## 📈 Performance Tips

### 1. Run During Off-Peak Hours
API calls are faster during off-peak times (late night, early morning)

### 2. Use Wired Connection
Stable internet reduces API timeout errors

### 3. Monitor System Resources
```bash
# Keep an eye on memory usage
watch -n 5 'ps aux | grep node'
```

### 4. Parallel Processing (Advanced)
For very large datasets, split CSV and run multiple instances:

```bash
# Split CSV into 4 parts
split -l 41409 ../public/location.csv part-

# Run 4 instances in parallel (in separate terminals)
node add-taluka-advanced.cjs # Modify INPUT_CSV for each part
```

---

## 🎯 Next Steps After Taluka Addition

1. **Verify Output:**
   ```bash
   # Count non-empty talukas
   grep -v '^$' ../public/location-with-taluka.csv | wc -l
   ```

2. **Update Transform Script:**
   Use `location-with-taluka.csv` as input for transformation

3. **Re-import to MongoDB:**
   ```bash
   node transform-location-csv.cjs
   node import-location-data-transformed.cjs
   ```

4. **Update Frontend:**
   The taluka filter in Index.tsx will now have data!

---

## 📞 Support

### Common Issues:

**Q: Why are some talukas empty?**
A: The API doesn't have taluka data for all pincodes. Use the advanced script for better coverage.

**Q: How long will this take?**
A: Approximately 4-6 hours for 165K records with 150ms delay.

**Q: Can I speed it up?**
A: Yes, but reduce delay carefully to avoid rate limits. Start with 100ms and monitor for errors.

**Q: What if my internet disconnects?**
A: Use the advanced script - it saves progress and can resume.

---

## 🔍 Data Quality Check

After running the script, verify data quality:

```bash
# Check sample talukas
grep "400102" ../public/location-with-taluka.csv

# Count unique talukas
cut -d',' -f7 ../public/location-with-taluka.csv | sort -u | wc -l

# Find records with no taluka
grep ',"",' ../public/location-with-taluka.csv | wc -l
```

---

## 📝 Notes

- The India Post Office API (api.postalpincode.in) is free but has rate limits
- Taluka field may be called "Block", "Tehsil", or "Division" in different regions
- For Union Territories, taluka structure may be different
- Some pincodes cover multiple talukas (script picks the first one)

---

**Generated:** October 9, 2025  
**Status:** Ready to use

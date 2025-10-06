# 🔧 Donor Search Fix - Complete Guide

## 🎯 Issues Fixed

### 1. **Donor Search Not Working**
- ✅ Removed geospatial `$near` query (requires special index setup)
- ✅ Implemented manual distance calculation using Haversine formula
- ✅ Added comprehensive logging for debugging
- ✅ Fixed query building logic
- ✅ Made blood group filter optional

### 2. **Home Page Buttons Not Working**
- ✅ Added `textDecoration: 'none'` to Link components
- ✅ Added `zIndex: 1` to button container
- ✅ Ensured buttons are clickable

### 3. **Location Coordinates**
- ✅ Backend geocodes address during registration
- ✅ Coordinates stored in GeoJSON format
- ✅ Frontend sends user location with search
- ✅ Distance calculated and displayed

---

## 🚀 How It Works Now

### Registration Flow
```
User fills form → Backend geocodes address → Coordinates saved → User registered
```

**Example:**
```json
{
  "city": "Hyderabad",
  "state": "Telangana",
  "address": "Banjara Hills, Hyderabad"
}
```
↓
```json
{
  "location": {
    "type": "Point",
    "coordinates": [78.4867, 17.3850]
  }
}
```

### Search Flow
```
User searches → Gets browser location → Sends city + coordinates → Backend calculates distances → Returns sorted donors
```

**Search Query:**
```
/api/donors/search?bloodGroup=A+&city=Hyderabad&latitude=17.3850&longitude=78.4867
```

**Response:**
```json
{
  "count": 2,
  "donors": [
    {
      "name": "Rajesh Kumar",
      "bloodGroup": "A+",
      "city": "Hyderabad",
      "distance": "2.34"
    },
    {
      "name": "Vikram Rao",
      "bloodGroup": "A+",
      "city": "Hyderabad",
      "distance": "5.67"
    }
  ]
}
```

---

## 🧪 Testing Steps

### Test 1: Register Multiple Users in Same City

**User 1:**
```json
POST /api/auth/register
{
  "name": "Rajesh Kumar",
  "email": "rajesh@test.com",
  "password": "password123",
  "phone": "9876543210",
  "bloodGroup": "A+",
  "city": "Hyderabad",
  "state": "Telangana",
  "address": "Banjara Hills, Hyderabad"
}
```

**User 2:**
```json
POST /api/auth/register
{
  "name": "Priya Sharma",
  "email": "priya@test.com",
  "password": "password123",
  "phone": "9876543211",
  "bloodGroup": "O+",
  "city": "Hyderabad",
  "state": "Telangana",
  "address": "Madhapur, Hyderabad"
}
```

**User 3:**
```json
POST /api/auth/register
{
  "name": "Vikram Rao",
  "email": "vikram@test.com",
  "password": "password123",
  "phone": "9876543212",
  "bloodGroup": "A+",
  "city": "Hyderabad",
  "state": "Telangana",
  "address": "HITEC City, Hyderabad"
}
```

### Test 2: Search by City Only

**Frontend:**
1. Go to "Find Donors" page
2. Leave blood group as "All Blood Groups"
3. Enter "Hyderabad" in city field
4. Click "Search Donors"

**Expected:** Shows all 3 donors from Hyderabad

**API Call:**
```
GET /api/donors/search?city=Hyderabad&latitude=17.3850&longitude=78.4867
```

### Test 3: Search by Blood Group + City

**Frontend:**
1. Select "A+" from blood group dropdown
2. Enter "Hyderabad" in city field
3. Click "Search Donors"

**Expected:** Shows Rajesh and Vikram (both A+ in Hyderabad)

**API Call:**
```
GET /api/donors/search?bloodGroup=A%2B&city=Hyderabad&latitude=17.3850&longitude=78.4867
```

### Test 4: Search by Blood Group Only

**Frontend:**
1. Select "O+" from blood group dropdown
2. Leave city field empty
3. Click "Search Donors"

**Expected:** Shows Priya (O+ donor)

**API Call:**
```
GET /api/donors/search?bloodGroup=O%2B&latitude=17.3850&longitude=78.4867
```

### Test 5: Home Page Buttons

**Frontend:**
1. Go to home page (`/`)
2. Click "Register as Donor" button
3. Should navigate to `/register`
4. Go back to home
5. Click "Find Blood" button
6. Should navigate to `/search-donors`

---

## 🔍 Backend Changes

### `routes/donors.js`

**Key Improvements:**

1. **Flexible Query Building**
```javascript
const query = {};
if (bloodGroup && bloodGroup.trim() !== '') {
  query.bloodGroup = bloodGroup;
}
if (city && city.trim() !== '') {
  query.city = new RegExp(city.trim(), 'i');
}
```

2. **Manual Distance Calculation**
```javascript
// Haversine formula
const R = 6371; // Earth's radius in km
const dLat = (donorLat - userLat) * Math.PI / 180;
const dLon = (donorLng - userLng) * Math.PI / 180;
const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
          Math.cos(userLat * Math.PI / 180) * Math.cos(donorLat * Math.PI / 180) *
          Math.sin(dLon/2) * Math.sin(dLon/2);
const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
const distance = R * c;
```

3. **Sorting by Distance**
```javascript
donors.sort((a, b) => {
  if (a.distance === null) return 1;
  if (b.distance === null) return -1;
  return parseFloat(a.distance) - parseFloat(b.distance);
});
```

4. **Debug Logging**
```javascript
console.log('Search params:', { bloodGroup, city, latitude, longitude });
console.log('Query object:', query);
console.log('Found donors before filtering:', donors.length);
console.log('Available donors:', availableDonors.length);
```

---

## 🎨 Frontend Changes

### `pages/SearchDonors.jsx`

**Key Improvements:**

1. **Proper URL Encoding**
```javascript
if (bloodGroup && bloodGroup.trim() !== '') {
  searchUrl += `bloodGroup=${encodeURIComponent(bloodGroup)}&`;
}
if (city && city.trim() !== '') {
  searchUrl += `city=${encodeURIComponent(city.trim())}&`;
}
```

2. **Always Send User Location**
```javascript
if (userLocation) {
  searchUrl += `latitude=${userLocation.lat}&longitude=${userLocation.lng}&`;
}
```

3. **Distance Display**
```javascript
<p className="donor-subtitle">
  {donor.city}, {donor.state}
  {donor.distance && ` • ${donor.distance} km away`}
</p>
```

4. **Enhanced Logging**
```javascript
console.log('Search URL:', searchUrl);
console.log('Search response:', data);
```

### `pages/Home.jsx`

**Key Improvements:**

1. **Fixed Link Styling**
```jsx
<Link to="/register" style={{ textDecoration: 'none' }}>
  <button className="btn btn-primary">Register as Donor</button>
</Link>
```

2. **Added z-index**
```jsx
<div style={{ 
  display: 'flex', 
  gap: '15px', 
  justifyContent: 'center', 
  position: 'relative', 
  zIndex: 1 
}}>
```

---

## 📊 Database Schema

### User Model (models/User.js)

```javascript
{
  name: String,
  email: String (unique),
  phone: String,
  bloodGroup: String (enum),
  city: String,
  state: String,
  address: String,
  location: {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: [Number], // [longitude, latitude]
    formattedAddress: String
  },
  availableToDonate: Boolean (default: true),
  createdAt: Date
}
```

**Index:**
```javascript
userSchema.index({ location: '2dsphere' });
```

---

## 🐛 Debugging Checklist

### If Search Returns No Results:

1. **Check Backend Logs**
```
Search params: { bloodGroup: 'A+', city: 'Hyderabad', latitude: '17.3850', longitude: '78.4867' }
Query object: { bloodGroup: 'A+', city: /Hyderabad/i }
Found donors before filtering: 2
Available donors: 2
```

2. **Check Database**
```javascript
// In MongoDB shell or Compass
db.users.find({ city: /hyderabad/i }).pretty()

// Check if coordinates are saved
db.users.find({ 
  "location.coordinates.0": { $ne: 0 },
  "location.coordinates.1": { $ne: 0 }
}).pretty()
```

3. **Check Frontend Console**
```
Search URL: /api/donors/search?bloodGroup=A%2B&city=Hyderabad&latitude=17.3850&longitude=78.4867&
Search response: { count: 2, donors: [...], total: 2 }
```

4. **Check Network Tab**
- Status: 200 OK
- Response contains donors array
- No CORS errors

### If Buttons Don't Work:

1. **Check React Router Setup**
```javascript
// In App.js
<Route path="/register" element={<Register />} />
<Route path="/search-donors" element={<SearchDonors />} />
```

2. **Check Browser Console**
- No JavaScript errors
- Navigation events firing

3. **Check Element Inspection**
- Links are clickable
- No overlay blocking clicks
- z-index is correct

---

## 🎯 Expected Results

### Successful Search:
- ✅ Donors displayed on map with blood drop markers
- ✅ Donor list shows on the right side
- ✅ Distance displayed in km (e.g., "2.34 km away")
- ✅ Sorted by nearest first
- ✅ Only available donors shown

### Successful Registration:
- ✅ User registered with coordinates
- ✅ Token returned
- ✅ Redirected to dashboard
- ✅ Can immediately be found in search

### Successful Navigation:
- ✅ Home → Register works
- ✅ Home → Search Donors works
- ✅ All navbar links work
- ✅ Mobile menu works

---

## 🔮 Future Enhancements

1. **Caching:** Cache geocoding results
2. **Radius Filter:** Add slider for search radius
3. **Real-time Updates:** WebSocket for live donor availability
4. **Batch Geocoding:** Script to geocode existing users
5. **Map Clustering:** Group nearby markers for better visualization

---

## 📝 Summary of Changes

### Backend Files Modified:
- `routes/donors.js` - Complete rewrite of search logic
- `routes/auth.js` - Already has geocoding (no changes needed)
- `models/User.js` - Already has location field (no changes needed)

### Frontend Files Modified:
- `client/src/pages/SearchDonors.jsx` - Fixed search logic and URL building
- `client/src/pages/Home.jsx` - Fixed button click issues

### Lines Changed:
- Backend: ~60 lines
- Frontend: ~25 lines

---

**Last Updated:** October 6, 2025  
**Status:** ✅ All Issues Fixed  
**Ready for Testing:** Yes

async function runTests() {
  const BASE_URL = 'http://localhost:8080/api/v1';
  let adminToken = '';
  let victimId = '';

  console.log("--- Starting E2E Tests ---");

  // TEST 1: Admin Login
  try {
    console.log("Test 1: Admin Login...");
    const loginRes = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'admin@vaka.com', password: '123456' })
    });
    const loginData = await loginRes.json();
    if (!loginRes.ok) throw new Error(JSON.stringify(loginData));
    adminToken = loginData.payload.token;
    console.log("✅ Admin Login Successful");
  } catch (err) {
    console.error("❌ Admin Login Failed:", err.message);
    return;
  }

  // TEST 2: Create Victim
  try {
    console.log("\nTest 2: Create Victim...");
    const payload = {
        province: 'Ankara',
        district: 'Çankaya',
        gender: 'MALE',
        ageGroup: 'AGE_18_30',
        heightRange: 'H_171_180',
        bodyType: 'NORMAL',
        skinTone: 'MEDIUM',
        eyeColor: 'BROWN',
        hairColor: 'BLACK',
        hairLength: 'SHORT',
        hairType: 'STRAIGHT',
        facialHair: 'SHORT_BEARD',
        hasTattoo: true,
        tattooLocation: ['RIGHT_ARM'],
        tattooShape: ['SYMBOL'],
        hasScar: false,
        hasBirthmark: false,
        healthStatus: 'STABLE',
        consciousness: 'CONSCIOUS',
        upperClothingType: ['T_SHIRT'],
        lowerClothingType: ['JEANS'],
        prosthetics: ['NONE'],
        dentalFeatures: ['NORMAL'],
        jewelry: ['WATCH'],
        chronicConditions: ['NONE'],
        spokenLanguages: ['TURKISH']
    };

    const res = await fetch(`${BASE_URL}/victims`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${adminToken}`
      },
      body: JSON.stringify(payload)
    });
    
    const data = await res.json();
    if (!res.ok) throw new Error(JSON.stringify(data));
    victimId = data.payload.id;
    console.log("✅ Create Victim Successful. Victim ID:", victimId);
  } catch (err) {
    console.error("❌ Create Victim Failed:", err.message);
    return;
  }

  // TEST 3: Get Victim by ID
  try {
    console.log("\nTest 3: Get Victim by ID...");
    const res = await fetch(`${BASE_URL}/victims/${victimId}`, {
      method: 'GET',
      headers: { 'Authorization': `Bearer ${adminToken}` }
    });
    const data = await res.json();
    if (!res.ok) throw new Error(JSON.stringify(data));
    console.log("✅ Get Victim Successful. Fetched Name:", data.payload.id);
  } catch (err) {
    console.error("❌ Get Victim Failed:", err.message);
  }

  // TEST 4: Search Victim
  try {
    console.log("\nTest 4: Search Victim...");
    // Admin can also search for victims
    const searchPayload = {
      province: 'Ankara',
      gender: 'MALE',
      ageGroup: 'AGE_18_30'
    };
    
    const res = await fetch(`${BASE_URL}/victims/search`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${adminToken}`
      },
      body: JSON.stringify(searchPayload)
    });
    
    const data = await res.json();
    if (!res.ok) throw new Error(JSON.stringify(data));
    console.log("✅ Search Victim Successful. Total elements:", data.payload.totalElements);
    if (data.payload.totalElements > 0) {
       console.log("   Top match score:", data.payload.content[0].matchScore);
    }
  } catch (err) {
    console.error("❌ Search Victim Failed:", err.message);
  }
}

runTests();


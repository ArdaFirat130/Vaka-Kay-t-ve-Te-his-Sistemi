async function test() {
  try {
    // Login
    const loginRes = await fetch('http://localhost:8080/api/v1/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'admin@vaka.com', password: '123456' })
    });
    const loginData = await loginRes.json();
    const token = loginData.data.accessToken;
    console.log("Logged in successfully. Token length:", token.length);

    // Victim Registration Payload
    const payload = {
        province: 'Ankara',
        district: 'Çankaya',
        gender: null,
        ageGroup: null,
        heightRange: null,
        bodyType: null,
        skinTone: null,
        eyeColor: null,
        hairColor: null,
        hairLength: null,
        hairType: null,
        facialHair: null,
        hasTattoo: false,
        hasScar: false,
        hasBirthmark: false,
        healthStatus: 'HEALTHY',
        consciousness: 'CONSCIOUS',
        upperClothingType: [],
        lowerClothingType: [],
        prosthetics: [],
        dentalFeatures: [],
        jewelry: [],
        chronicConditions: [],
        spokenLanguages: []
    };

    console.log("Sending payload...");
    const victimRes = await fetch('http://localhost:8080/api/v1/victims', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(payload)
    });
    
    const victimData = await victimRes.json();
    if (!victimRes.ok) {
        console.error("Backend returned error:", victimRes.status);
        console.error("Error data:", JSON.stringify(victimData, null, 2));
    } else {
        console.log("Success:", victimData);
    }
  } catch (error) {
    console.error("Request failed:", error);
  }
}

test();

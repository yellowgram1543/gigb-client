import http from 'http';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const SECRET = process.env.SUPABASE_JWT_SECRET;
const token = jwt.sign({ 
  sub: 'test-user-id-123', 
  email: 'test@example.com', 
  user_metadata: { role: 'user', full_name: 'Test User' } 
}, SECRET);

const taskId = "69dd058568d7de372f053b2e";

function patch(data) {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify(data);
    const options = {
      hostname: 'localhost',
      port: 5000,
      path: `/api/tasks/${taskId}`,
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Content-Length': body.length
      }
    };

    const req = http.request(options, (res) => {
      let responseData = '';
      res.on('data', (chunk) => responseData += chunk);
      res.on('end', () => resolve(JSON.parse(responseData)));
    });

    req.on('error', (err) => reject(err));
    req.write(body);
    req.end();
  });
}

async function run() {
  try {
    console.log("--- Attempting Field Injection ---");
    const payload = {
      escrow_status: "released", // FORBIDDEN
      status: "PAID",            // FORBIDDEN
      title: "legit update"      // ALLOWED
    };
    
    const res = await patch(payload);
    
    console.log("Title after update:", res.title);
    console.log("Escrow Status after update:", res.escrow_status);
    console.log("Status after update:", res.status);

    if (res.title === "legit update" && res.escrow_status === "none" && res.status === "OPEN") {
      console.log("\n✅ INJECTION PROTECTION TEST PASSED");
    } else {
      console.log("\n❌ INJECTION PROTECTION TEST FAILED");
      console.log("Details:", res);
    }
  } catch (err) {
    console.error("Test Error:", err.message);
  }
}

run();

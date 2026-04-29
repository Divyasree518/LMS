const http = require('http');

function login(username, password, role) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify({ username, password, role });
   const opts = {
  hostname: 'lms-uk7j.onrender.com',
  port: 443,
  path: '/api/auth/login',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length
  }
};
    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

async function test() {
  const accounts = [
    ['student1', 'Student@123', 'student'],
    ['faculty1', 'Faculty@123', 'faculty'],
    ['admin', 'Admin@123', 'admin']
  ];
  
  for (const [u, p, r] of accounts) {
    const result = await login(u, p, r);
    const status = result.success ? 'OK - token received' : 'FAIL - ' + result.error;
    console.log(u + ' (' + r + '): ' + status);
  }
}
test().catch(console.error);

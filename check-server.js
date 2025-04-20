import http from 'http';

const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/api/admin/dashboard',
  method: 'GET',
  headers: {
    'Authorization': 'Bearer test-token'
  }
};

const req = http.request(options, (res) => {
  console.log(`Status Code: ${res.statusCode}`);
  
  let data = '';
  
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    console.log('Response data:', data);
  });
});

req.on('error', (error) => {
  console.error('Error checking server:', error.message);
});

req.end(); 
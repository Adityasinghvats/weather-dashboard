- Test a single endpoint where 40 virtual uses make 20 request in 1 second, e.g. 800
```bash
npx artillery quick --count 40 --num 20 http://localhost:3000/
```
- Generate test reports
```bash
artillery run --output report.json artillery-load-test.yml
```

- Test real world login flow , artillery automatically handles redirects of each page
like after login you might reidrect to dashboard
```bash
config:
  target: http://localhost:3000
  phases:
    - duration: 60
      arrivalRate: 5
      rampTo: 10
      name: Warm up phase
    - duration: 60
      arrivalRate: 10
      rampTo: 50
      name: Ramp up to peak load
    - duration: 120
      arrivalRate: 50
      name: Sustained peak load

scenarios:
  - flow:
    - get:
         url: "/"
      - get:
          url: "/login"
      - think: 2
      - post:
          url: "/login"
          json:
            email: test@example.com
            password: password123

```
- Using custom data from csv file
```bash
sign_in.csv
and insert
user1@example.com,password1
user2@example.com,password2
user3@example.com,password3
```
```bash
config:
  target: http://localhost:3000
  phases:
    - duration: 60
      arrivalRate: 5
      rampTo: 10
      name: Warm up phase
    - duration: 60
      arrivalRate: 10
      rampTo: 50
      name: Ramp up to peak load
    - duration: 120
      arrivalRate: 50
      name: Sustained peak load
  payload:
    path: "./signin_data.csv"
    fields:
      - "email"
      - "password"

scenarios:
  - flow:
      - get:
          url: "/"
      - get:
          url: "/login"
      - think: 2
      - post:
          url: "/login"
          json:
            email: "{{ email }}"
            password: "{{ password }}"
```
- test with randomly generated custom data
```javascript
// Generate a random string of specified length
const generateRandomString = (length) =>
  Math.random().toString(36).substr(2, length);

// Function to generate random credentials and store them in the context
const getRandomCredentials = (requestParams, context, ee, next) => {
  const email = `user_${generateRandomString(8)}@example.com`;
  const password = generateRandomString(10);
  context.vars.email = email; // Store the email in the context
  context.vars.password = password; // Store the password in the context
  next(); // Proceed to the next action
};

export { getRandomCredentials };

```
```bash
config:
  target: http://localhost:3000
  phases:
    - duration: 60
      arrivalRate: 5
      rampTo: 10
      name: Warm up phase
    - duration: 60
      arrivalRate: 10
      rampTo: 50
      name: Ramp up to peak load
    - duration: 120
      arrivalRate: 50
      name: Sustained peak load
  processor: "./processor.mjs"

scenarios:
  - flow:
      - get:
          url: "/"
      - get:
          url: "/login"
      - think: 2
      - post:
          url: "/login"
          beforeRequest: getRandomCredentials
          json:
            email: "{{ email }}"
            password: "{{ password }}"

```
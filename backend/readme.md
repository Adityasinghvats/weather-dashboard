<!-- Using Artillery for load testing -->
- Run using 
```bash
artillery run artillery.yaml 
or
npm run test:stress
```

- `Performance Testing`: This evaluates the backend's responsiveness, stability, and resource utilization under various load conditions. 
- Sub-types include:
  - `Load Testing`: Measures performance under expected user load.
  - `Stress Testing`: Determines the system's breaking point by pushing it beyond its limits.
  - `Endurance Testing`: Checks system performance over extended periods to detect memory leaks or degradation.
  - `Capacity Testing`: Identifies the maximum number of concurrent users or transactions the system can handle.

- Test error handling and resilience using fuzzer test

- Setup testing
```bash
 npm i -D @babel/core @babel/node @babel/preset-env jest
 npm init jest@latest 
```

### Step 1: Install Node.js
1. Go to the [Node.js official website](https://nodejs.org/).
2. Download the **LTS (Long Term Support)** version for your operating system.
3. Install Node.js by following the installation prompts.

### Step 2: Verify Installation
4. Open a **terminal** or **command prompt**.
5. Run the following commands to check if Node.js and npm are installed:
   ```bash
   node -v
   npm -v
   ```

### Step 3: Initialize a New Project
6. Navigate to your project directory in the terminal.
7. Run the following command to initialize a new Node.js project:
   ```bash
   npm init -y
   ```

### Step 4: Install Required Packages
8. Install essential dependencies:
   ```bash
   npm install express body-parser cors
   ```
9. Install additional packages:
   ```bash
   npm install express body-parser cors bcrypt express-session
   ```

### Step 5: Run the Server
10. Execute the server script:
    ```bash
    node server.js
    ```
11. Open a browser and visit:
    ```
    http://localhost:3000
    ```


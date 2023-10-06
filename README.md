# 🌐 Personal Portfolio Website

Welcome to Minh Nguyen's Personal Portfolio! This portfolio website is designed to showcase a variety of projects, reflecting extensive skills, experiences, and insights in the field of software development. It's built with React and hosted on GitHub Pages.

> 🔗 [Live Website](https://minhphannguyen1026.github.io/personal_portfolio_Minh_Nguyen/)

## 📌 Table of Contents
- [Features](#-features)
- [Updating the Deployed Version](#-updating-the-deployed-version)
- [Troubleshooting](#-troubleshooting)
- [Contributing](#-contributing)
- [License](#-license)

## ✨ Features
- Responsive and Interactive UI
- Detailed Information on Projects
- Seamless Navigation
- Parallax Scrolling

## 🛠 Updating the Deployed Version
### Prerequisites
- Node.js and npm installed
- Git installed
- Access to the repository (it is public, you are fine)
- create-react-app is set up.

### Steps
1. **Clone the Repository**
   ```sh
   git clone https://github.com/MinhPhanNguyen1026/personal_portfolio_Minh_Nguyen.git
   cd personal_portfolio_Minh_Nguyen
   ```

1.1 ## Install Dependencies
To install the necessary dependencies, you can use the following command:
   ```sh
   npm install
   ```
1.2 ## Install `gh-pages` package
   ```sh
   npm install gh-pages --save-dev
   ```
1.3 ## Add script
   In the package.json file, add the following script: 
   ```sh
   "scripts": {
     "deploy": "gh-pages -d build",
   }
   ```
   In the same file, also add the following script:
   "homepage": "https://github.com/MinhPhanNguyen1026/personal_portfolio_Minh_Nguyen" or http://<username>.github.io/<repository-name> depending on your choices/needs

2. ## Make Changes
   After installing the dependencies, modify the necessary files or components and test them locally using:
   ```sh
   npm start
   ```

3. ## Build the Project
Once you've made the necessary modifications and tested them, build the project with (Note, this will reset the page title, if you want to change the page title again after Deploy, change directly in the GitHub page index.html and/or manifest.json):
   ```sh
   npm run build
   ```

4. ## Commit & Push Changes (Optional) (Skip to step 5 if you don't want to do this; this changes nothing)
After building the project, commit and push the changes to the main branch using:
   ```sh
   git add .
   git commit -m "A descriptive commit message"
   git push origin main
   ```

5. ## Deploy
After pushing your changes, deploy the project using:
   ```sh
   npm run deploy
   ```

6. ## Verify
   Once deployed, open your live website link and verify the deployed changes.

7. ## Troubleshooting
   - If updates are not immediately visible, clear the browser cache or wait a bit.
   - Check the repository settings to ensure GitHub Pages is set up correctly.
   - Refer to the [GitHub Pages documentation](https://docs.github.com/en/pages) or [Create React App deployment guide](https://create-react-app.dev/docs/deployment/#github-pages) for additional help.

8. ## Contributing
   Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.




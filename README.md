# CreativeAI Ads – Image & Video Generation for Marketing 🚀🎨

This project is an AI-powered application designed to streamline the marketing creative process. It uses Google's Gemini API to generate compelling ad copy and highly descriptive image prompts, then uses the Stability AI API to transform those prompts into unique visual ad variations.

---

## ✨ Features

* **Intelligent Copy Generation:** Uses **Gemini 2.5 Flash** to create three distinct ad headlines and body copies based on product inputs.
* **Structured Output:** Gemini is configured to enforce JSON output for reliable data parsing.
* **Visual Generation:** Integrates **Stability AI (Stable Image Core)** for generating photorealistic ad images from the AI-generated prompts.
* **Base64 Image Handling:** Images are returned as Base64 data URLs, allowing direct rendering and client-side downloads without reliance on external file hosting.
* **Simulated Video Concept:** Includes a placeholder endpoint for future **Video Ad Concept** integration (currently serving a dummy MP4 file).
* **Modern Stack:** Built with a React frontend and an Express/Node.js backend.

---

## ⚙️ Technology Stack

| Component | Technology | Role |
| :--- | :--- | :--- |
| **Frontend** | React (Vite) | User interface for input and display of results. |
| **Backend** | Node.js (Express) | API server for orchestrating AI calls. |
| **LLM / Copy** | **Google Gemini 2.5 Flash** | Generates ad copy and image prompts. |
| **Image Generation** | **Stability AI (Core)** | Generates high-quality visual ad assets. |
| **Authentication** | `dotenv` | Manages environment variables and API keys. |
| **Networking** | `axios`, `form-data` | Handles HTTP requests, including complex `multipart/form-data` for Stability AI. |

---

## 🛠️ Setup and Installation

Follow these steps to set up the project locally.

### 1. Prerequisites

You must have the following software installed:

* Node.js (v18 or higher)
* npm (or yarn)
* A **Google Gemini API Key**
* A **Stability AI API Key**

### 2. Backend Setup

1.  Navigate to the backend directory:
    ```bash
    cd backend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  **Create a `.env` file** in the `backend` directory and add your API keys:
    ```env
    # Your Google Gemini API Key
    GEMINI_API_KEY=YOUR_GEMINI_API_KEY_HERE
    
    # Your Stability AI Key for image generation
    STABILITY_API_KEY=YOUR_STABILITY_API_KEY_HERE 
    
    # Optional: Set port if needed
    PORT=5000
    ```
4.  Start the backend server:
    ```bash
    npm start
    ```
    The server should confirm that both Gemini and Stability Keys are loaded.

### 3. Frontend Setup

1.  Navigate to the frontend directory:
    ```bash
    cd ../frontend 
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Start the React development server:
    ```bash
    npm run dev
    ```
    The application will typically be accessible at `http://localhost:3000`.

---

## 📝 Usage

1.  Open the application in your browser (`http://localhost:3000`).
2.  Fill out the form with your **Product Name**, **Description**, **Target Audience**, and **Color/Mood**.
3.  Click **"Generate Ad Concepts"**.
4.  The backend will execute:
    * **Gemini** generates 3 sets of copy and visual prompts.
    * **Stability AI** generates 3 Base64 images from the prompts.
5.  The results page will display the ad variations with the generated images, copy, and a functional download button for each asset.

---

## 🛑 Known Limitations (Video Generation)

The video generation route (`/api/generate-video`) is currently **simulated**. It returns a placeholder MP4 file URL to allow the frontend to display a complete ad concept.

To implement live video generation, the following is required:

* Integration with a paid, specialized API (e.g., Runway, Pika, or Google's Vertex AI/Veo).
* Handling of long-running requests and potential webhooks for video processing.
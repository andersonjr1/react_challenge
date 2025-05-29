# React-Challenge

X
## Instalation
Steps to set up the project locally in development:

1. Clone the repository:

     ```bash
     git clone https://github.com/andersonjr1/react_challenge.git
     cd react_challenge/
     ```

1. Install backend dependencies:
   
     ```bash
     cd Backend
     npm install
     ```

1. Configure .env variables.

1. Run SQL scripts.

1. Run backend:
     ```bash
     npm run dev
     ```
1. Install frontend dependencies:
   
     ```bash
     cd ../Frontend
     npm install
     ```

1. Run frontend:
     ```bash
     npm run dev
     ```

## Configuration
To run this project, you need to set up environment variables in a `.env` file. Below are the required variables:
```.env
# Server Configuration
PORT=4000
IP = "your ip"
ENV = "DEV" # "DEV" for development or "PRODCTION" for production server

# JWT Authentication
SECRET_KEY="your-secret-key-for-authentication"

# Database Configuration
DB_PORT=5432
DB_HOST="your ip"
DB_USER="database user"
DB_PASSWORD="database user password"
DB_NAME="database name"

```

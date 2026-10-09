# Setup Script for Ocean Hazard Reporting Platform (Sprints 1-6)

Write-Host "Setting up Ocean Hazard Reporting Backend..."
cd backend
# Create Python virtual environment and install dependencies
python -m venv venv
.\venv\Scripts\activate
pip install -r requirements.txt
Write-Host "Backend setup complete."

Write-Host "Setting up Ocean Hazard Reporting Frontend..."
cd ..\frontend
# Install NPM dependencies
npm install
npm run build
Write-Host "Frontend setup complete."

Write-Host "To run backend:"
Write-Host "cd backend"
Write-Host ".\venv\Scripts\activate"
Write-Host "uvicorn app.main:app --reload"

Write-Host "To run frontend:"
Write-Host "cd frontend"
Write-Host "npm run dev"

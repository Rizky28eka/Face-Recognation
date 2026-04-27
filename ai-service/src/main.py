from fastapi import FastAPI
from src.api.routes import router
from src.utils.config import settings
from fastapi.responses import HTMLResponse
import os
import json

app = FastAPI(title=settings.APP_NAME)

# Include routes
app.include_router(router, prefix="/api/v1")

@app.on_event("startup")
async def startup_event():
    # ANSI Color Codes
    CYAN = "\033[96m"
    GREEN = "\033[92m"
    YELLOW = "\033[93m"
    MAGENTA = "\033[95m"
    BOLD = "\033[1m"
    END = "\033[0m"

    banner = f"""
{CYAN}{BOLD}
  █████╗ ██╗    ███████╗ █████╗  ██████╗███████╗
 ██╔══██╗██║    ██╔════╝██╔══██╗██╔════╝██╔════╝
 ███████║██║    █████╗  ███████║██║     █████╗  
 ██╔══██║██║    ██╔══╝  ██╔══██║██║     ██╔══╝  
 ██║  ██║██║    ██║     ██║  ██║╚██████╗███████╗
 ╚═╝  ╚═╝╚═╝    ╚═╝     ╚═╝  ╚═╝ ╚═════╝╚══════╝
      {MAGENTA}{settings.APP_NAME} - V1.0.0{CYAN}
{END}"""
    print(banner)

    metrics_path = settings.METRICS_PATH
    if os.path.exists(metrics_path):
        try:
            with open(metrics_path, "r") as f:
                m = json.load(f)
            
            print(f"{BOLD}--- MODEL STATUS ---{END}")
            print(f"{GREEN}● {END}Status      : {m.get('status', 'Unknown').upper()}")
            print(f"{GREEN}● {END}Accuracy    : {m.get('accuracy', 'N/A')}%")
            print(f"{GREEN}● {END}Precision   : {m.get('precision', 'N/A')}%")
            print(f"{GREEN}● {END}Recall      : {m.get('recall', 'N/A')}%")
            print(f"{GREEN}● {END}F1-Score    : {m.get('f1_score', 'N/A')}%")
            print(f"{GREEN}● {END}Users       : {m.get('total_classes', 0)}")
            print(f"{GREEN}● {END}Images      : {m.get('total_images', 0)}")
            print(f"{GREEN}● {END}Last Trained: {m.get('last_trained', 'Never')}")
            print(f"{BOLD}--------------------{END}\n")
        except:
            print(f"{YELLOW}⚠️  Metrics file found but could not be read.{END}\n")
    else:
        print(f"{YELLOW}⚠️  Model not trained yet. Use /api/v1/train to start.{END}\n")

    print(f"{BOLD}{MAGENTA}API Documentation:{END} http://{settings.APP_HOST}:{settings.APP_PORT}/docs")
    print(f"{BOLD}{MAGENTA}Web Dashboard    :{END} http://{settings.APP_HOST}:{settings.APP_PORT}/\n")

@app.get("/", response_class=HTMLResponse)
async def dashboard():
    # Load metrics
    metrics = {"accuracy": "N/A", "precision": "N/A", "recall": "N/A", "f1_score": "N/A", "total_images": 0, "total_classes": 0, "last_trained": "Never", "status": "Not Trained"}
    if os.path.exists(settings.METRICS_PATH):
        with open(settings.METRICS_PATH, "r") as f:
            metrics = json.load(f)

    html_content = f"""
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>{settings.APP_NAME} - Dashboard</title>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;800&display=swap" rel="stylesheet">
        <style>
            :root {{
                --primary: #6366f1;
                --bg: #0f172a;
                --card: #1e293b;
                --text: #f8fafc;
                --accent: #22d3ee;
            }}
            body {{
                font-family: 'Inter', sans-serif;
                background-color: var(--bg);
                color: var(--text);
                margin: 0;
                display: flex;
                justify-content: center;
                align-items: center;
                height: 100vh;
                overflow: hidden;
            }}
            .dashboard {{
                background: var(--card);
                padding: 3rem;
                border-radius: 24px;
                box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
                border: 1px solid rgba(255, 255, 255, 0.1);
                max-width: 800px;
                width: 90%;
                text-align: center;
                position: relative;
                overflow: hidden;
            }}
            .dashboard::before {{
                content: '';
                position: absolute;
                top: -50%;
                left: -50%;
                width: 200%;
                height: 200%;
                background: radial-gradient(circle, rgba(99, 102, 241, 0.1) 0%, transparent 70%);
                z-index: 0;
            }}
            h1 {{
                font-weight: 800;
                font-size: 2.5rem;
                margin-bottom: 0.5rem;
                background: linear-gradient(to right, #818cf8, #22d3ee);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                position: relative;
            }}
            p.subtitle {{
                color: #94a3b8;
                margin-bottom: 2.5rem;
                position: relative;
            }}
            .stats-grid {{
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
                gap: 1.5rem;
                position: relative;
            }}
            .stat-card {{
                background: rgba(15, 23, 42, 0.5);
                padding: 1.5rem;
                border-radius: 16px;
                border: 1px solid rgba(255, 255, 255, 0.05);
                transition: transform 0.3s ease;
            }}
            .stat-card:hover {{
                transform: translateY(-5px);
                border-color: var(--primary);
            }}
            .stat-value {{
                font-size: 1.8rem;
                font-weight: 700;
                color: var(--accent);
                display: block;
            }}
            .stat-label {{
                font-size: 0.8rem;
                text-transform: uppercase;
                letter-spacing: 0.1rem;
                color: #64748b;
                margin-top: 0.5rem;
            }}
            .footer-links {{
                margin-top: 3rem;
                display: flex;
                justify-content: center;
                gap: 2rem;
                position: relative;
            }}
            .link-btn {{
                color: var(--text);
                text-decoration: none;
                font-size: 0.9rem;
                padding: 0.6rem 1.2rem;
                border-radius: 12px;
                background: rgba(255, 255, 255, 0.05);
                transition: all 0.3s ease;
            }}
            .link-btn:hover {{
                background: var(--primary);
                box-shadow: 0 0 20px rgba(99, 102, 241, 0.4);
            }}
            .status-badge {{
                display: inline-block;
                padding: 4px 12px;
                border-radius: 20px;
                font-size: 0.7rem;
                font-weight: 700;
                background: { "#22c55e" if metrics["status"] == "ready" else "#ef4444" };
                color: white;
                margin-bottom: 1rem;
            }}
        </style>
    </head>
    <body>
        <div class="dashboard">
            <div class="status-badge">{metrics["status"].upper()}</div>
            <h1>{settings.APP_NAME}</h1>
            <p class="subtitle">AI-Powered Face Attendance Service for Thesis Project</p>
            
            <div class="stats-grid">
                <div class="stat-card">
                    <span class="stat-value">{metrics["accuracy"]}%</span>
                    <span class="stat-label">Accuracy</span>
                </div>
                <div class="stat-card">
                    <span class="stat-value">{metrics["precision"]}%</span>
                    <span class="stat-label">Precision</span>
                </div>
                <div class="stat-card">
                    <span class="stat-value">{metrics["recall"]}%</span>
                    <span class="stat-label">Recall</span>
                </div>
                <div class="stat-card">
                    <span class="stat-value">{metrics["f1_score"]}%</span>
                    <span class="stat-label">F1-Score</span>
                </div>
                <div class="stat-card">
                    <span class="stat-value">{metrics["total_classes"]}</span>
                    <span class="stat-label">Total Users</span>
                </div>
                <div class="stat-card">
                    <span class="stat-value">{metrics["total_images"]}</span>
                    <span class="stat-label">Training Photos</span>
                </div>
                <div class="stat-card">
                    <span class="stat-value" style="font-size: 0.9rem; color: #94a3b8;">{metrics["last_trained"]}</span>
                    <span class="stat-label">Last Updated</span>
                </div>
            </div>

            <div class="footer-links">
                <a href="/docs" class="link-btn">API Reference</a>
                <a href="https://github.com" class="link-btn">Project Repository</a>
            </div>
        </div>
    </body>
    </html>
    """
    return HTMLResponse(content=html_content)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host=settings.APP_HOST, port=settings.APP_PORT)

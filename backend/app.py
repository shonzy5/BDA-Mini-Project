from flask import Flask, jsonify
from flask_cors import CORS
from pymongo import MongoClient
import pandas as pd
import os

app = Flask(__name__)
CORS(app)

# --------------------------------------------------
# PATHS
# --------------------------------------------------

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ANALYTICS_DIR = os.path.join(BASE_DIR, "data", "analytics")

# --------------------------------------------------
# MONGODB CONNECTION
# --------------------------------------------------

MONGO_URI = "mongodb://localhost:27017"

try:
    client = MongoClient(MONGO_URI, serverSelectionTimeoutMS=5000)
    client.admin.command("ping")

    db = client["ecommerce_db"]
    transactions = db["transactions"]

    mongodb_status = "Connected"

except Exception as e:
    client = None
    db = None
    transactions = None
    mongodb_status = f"Connection failed: {e}"


# --------------------------------------------------
# HELPER FUNCTION
# --------------------------------------------------

def load_csv(filename):
    path = os.path.join(ANALYTICS_DIR, filename)

    if not os.path.exists(path):
        return None

    return pd.read_csv(path)


# --------------------------------------------------
# HOME
# --------------------------------------------------

@app.route("/")
def home():
    return jsonify({
        "message": "E-Commerce Analytics API",
        "status": "running",
        "mongodb": mongodb_status
    })


# --------------------------------------------------
# API 1 — DASHBOARD SUMMARY
# --------------------------------------------------

@app.route("/api/summary")
def summary():

    df = load_csv("dashboard_summary.csv")

    if df is None:
        return jsonify({
            "error": "dashboard_summary.csv not found"
        }), 404

    result = {}

    for _, row in df.iterrows():
        metric = row["Metric"]
        value = row["Value"]

        result[metric] = value

    return jsonify(result)


# --------------------------------------------------
# API 2 — MONTHLY SALES
# --------------------------------------------------

@app.route("/api/monthly-sales")
def monthly_sales():

    df = load_csv("monthly_sales.csv")

    if df is None:
        return jsonify({
            "error": "monthly_sales.csv not found"
        }), 404

    df = df.fillna("")

    return jsonify(df.to_dict(orient="records"))


# --------------------------------------------------
# API 3 — TOP PRODUCTS
# --------------------------------------------------

@app.route("/api/top-products")
def top_products():

    df = load_csv("top_products.csv")

    if df is None:
        return jsonify({
            "error": "top_products.csv not found"
        }), 404

    df = df.fillna("")

    return jsonify(df.to_dict(orient="records"))


# --------------------------------------------------
# API 4 — COUNTRY SALES
# --------------------------------------------------

@app.route("/api/country-sales")
def country_sales():

    df = load_csv("country_sales.csv")

    if df is None:
        return jsonify({
            "error": "country_sales.csv not found"
        }), 404

    df = df.fillna("")

    return jsonify(df.to_dict(orient="records"))


# --------------------------------------------------
# API 5 — CUSTOMER SEGMENTS
# --------------------------------------------------

@app.route("/api/customer-segments")
def customer_segments():

    df = load_csv("customer_segments.csv")

    if df is None:
        return jsonify({
            "error": "customer_segments.csv not found"
        }), 404

    # Use the Customers column from the segment summary
    result = df[["Segment", "Customers"]].copy()

    # Rename columns for the React pie chart
    result.columns = ["name", "value"]

    return jsonify(
        result.to_dict(orient="records")
    )

@app.route("/api/customer-rfm")
def customer_rfm():

    df = load_csv("customer_rfm.csv")

    if df is None:
        return jsonify({
            "error": "customer_rfm.csv not found"
        }), 404

    # Return a manageable number of records
    return jsonify(
        df.to_dict(orient="records")
    )
# --------------------------------------------------
# API 6 — TOP CUSTOMERS
# --------------------------------------------------

@app.route("/api/top-customers")
def top_customers():

    df = load_csv("top_customers.csv")

    if df is None:
        return jsonify({
            "error": "top_customers.csv not found"
        }), 404

    df = df.fillna("")

    return jsonify(df.to_dict(orient="records"))


# --------------------------------------------------
# API 7 — DATABASE INFORMATION
# --------------------------------------------------

@app.route("/api/database")
def database():

    if transactions is None:
        return jsonify({
            "mongodb": "Disconnected",
            "database": "ecommerce_db",
            "collection": "transactions",
            "records": 0
        })

    try:
        count = transactions.count_documents({})

        return jsonify({
            "mongodb": "Connected",
            "database": "ecommerce_db",
            "collection": "transactions",
            "records": count
        })

    except Exception as e:

        return jsonify({
            "mongodb": "Error",
            "error": str(e)
        }), 500


# --------------------------------------------------
# RUN SERVER
# --------------------------------------------------

if __name__ == "__main__":
    app.run(
        host="127.0.0.1",
        port=5000,
        debug=True
    )
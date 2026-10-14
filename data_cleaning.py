import pandas as pd
import os

INPUT_FILE = "data/raw/online_retail.csv"
OUTPUT_FILE = "data/processed/clean_ecommerce.csv"

print("=" * 60)
print("E-COMMERCE DATA CLEANING")
print("=" * 60)

# Load dataset
df = pd.read_csv(INPUT_FILE)

print("\nOriginal records:", len(df))

# --------------------------------------------------
# 1. Remove duplicate records
# --------------------------------------------------
df = df.drop_duplicates()
print("After removing duplicates:", len(df))

# --------------------------------------------------
# 2. Remove records with missing CustomerID
# --------------------------------------------------
df = df.dropna(subset=["CustomerID"])
print("After removing missing CustomerID:", len(df))

# --------------------------------------------------
# 3. Remove records with missing Description
# --------------------------------------------------
df = df.dropna(subset=["Description"])
print("After removing missing Description:", len(df))

# --------------------------------------------------
# 4. Remove cancelled/invalid transactions
# Quantity must be greater than 0
# --------------------------------------------------
df = df[df["Quantity"] > 0]
print("After removing invalid Quantity:", len(df))

# --------------------------------------------------
# 5. Remove invalid prices
# UnitPrice must be greater than 0
# --------------------------------------------------
df = df[df["UnitPrice"] > 0]
print("After removing invalid UnitPrice:", len(df))

# --------------------------------------------------
# 6. Convert InvoiceDate to datetime
# --------------------------------------------------
df["InvoiceDate"] = pd.to_datetime(df["InvoiceDate"])

# --------------------------------------------------
# 7. Convert CustomerID to integer
# --------------------------------------------------
df["CustomerID"] = df["CustomerID"].astype(int)

# --------------------------------------------------
# 8. Create TotalAmount column
# --------------------------------------------------
df["TotalAmount"] = df["Quantity"] * df["UnitPrice"]

# --------------------------------------------------
# 9. Create additional useful date columns
# --------------------------------------------------
df["Year"] = df["InvoiceDate"].dt.year
df["Month"] = df["InvoiceDate"].dt.month
df["MonthName"] = df["InvoiceDate"].dt.month_name()

# --------------------------------------------------
# 10. Create processed folder if needed
# --------------------------------------------------
os.makedirs("data/processed", exist_ok=True)

# --------------------------------------------------
# 11. Save cleaned dataset
# --------------------------------------------------
df.to_csv(OUTPUT_FILE, index=False)

print("\n" + "=" * 60)
print("DATA CLEANING COMPLETED")
print("=" * 60)

print("Final records:", len(df))
print("Final columns:", len(df.columns))

print("\nColumns:")
print(df.columns.tolist())

print("\nOutput saved to:")
print(OUTPUT_FILE)

print("\nFirst 5 cleaned records:")
print(df.head())
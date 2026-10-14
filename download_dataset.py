from ucimlrepo import fetch_ucirepo
import os

# Fetch Online Retail dataset
online_retail = fetch_ucirepo(id=352)

# Get data
df = online_retail.data.original

print("Dataset downloaded successfully!")
print("Shape:", df.shape)
print("\nColumns:")
print(df.columns.tolist())

# Create raw data directory if needed
os.makedirs("data/raw", exist_ok=True)

# Save dataset as CSV
df.to_csv("data/raw/online_retail.csv", index=False)

print("\nDataset saved to:")
print("data/raw/online_retail.csv")
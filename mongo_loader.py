import pandas as pd
from pymongo import MongoClient
import time

# --------------------------------------------------
# Configuration
# --------------------------------------------------

CSV_FILE = "data/processed/clean_ecommerce.csv"

MONGO_URI = "mongodb://localhost:27017/"
DATABASE_NAME = "ecommerce_db"
COLLECTION_NAME = "transactions"

BATCH_SIZE = 5000

# --------------------------------------------------
# Connect to MongoDB
# --------------------------------------------------

print("=" * 60)
print("MONGODB DATA LOADER")
print("=" * 60)

print("\nConnecting to MongoDB...")

client = MongoClient(MONGO_URI)

# Test connection
client.admin.command("ping")

print("MongoDB connection successful!")

# Select database and collection
db = client[DATABASE_NAME]
collection = db[COLLECTION_NAME]

# --------------------------------------------------
# Clear existing collection
# --------------------------------------------------

print("\nClearing existing transactions collection...")

collection.delete_many({})

print("Collection ready.")

# --------------------------------------------------
# Load CSV
# --------------------------------------------------

print("\nLoading cleaned CSV...")

df = pd.read_csv(CSV_FILE)

print("Records found:", len(df))

# --------------------------------------------------
# Convert date
# --------------------------------------------------

df["InvoiceDate"] = pd.to_datetime(df["InvoiceDate"])

# Convert datetime to Python datetime
df["InvoiceDate"] = df["InvoiceDate"].apply(
    lambda x: x.to_pydatetime()
)

# --------------------------------------------------
# Convert CustomerID to integer
# --------------------------------------------------

df["CustomerID"] = df["CustomerID"].astype(int)

# --------------------------------------------------
# Convert dataframe to records
# --------------------------------------------------

records = df.to_dict("records")

# --------------------------------------------------
# Insert in batches
# --------------------------------------------------

print("\nInserting records...")

start_time = time.time()

total_inserted = 0

for i in range(0, len(records), BATCH_SIZE):

    batch = records[i:i + BATCH_SIZE]

    collection.insert_many(batch, ordered=False)

    total_inserted += len(batch)

    print(
        f"Inserted {total_inserted:,} / {len(records):,}"
    )

# --------------------------------------------------
# Create indexes
# --------------------------------------------------

print("\nCreating indexes...")

collection.create_index("CustomerID")
collection.create_index("InvoiceNo")
collection.create_index("StockCode")
collection.create_index("Country")
collection.create_index("InvoiceDate")

# --------------------------------------------------
# Final result
# --------------------------------------------------

elapsed = time.time() - start_time

print("\n" + "=" * 60)
print("MONGODB LOADING COMPLETED")
print("=" * 60)

print(f"Records inserted: {total_inserted:,}")
print(f"Time taken: {elapsed:.2f} seconds")

print("\nDatabase:")
print(DATABASE_NAME)

print("\nCollection:")
print(COLLECTION_NAME)

print("\nMongoDB document count:")
print(collection.count_documents({}))

client.close()
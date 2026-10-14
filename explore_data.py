import pandas as pd

FILE_PATH = "data/raw/online_retail.csv"

# Load dataset
df = pd.read_csv(FILE_PATH)

print("=" * 60)
print("E-COMMERCE DATASET EXPLORATION")
print("=" * 60)

print("\n1. DATASET SHAPE")
print(df.shape)

print("\n2. COLUMN NAMES")
print(df.columns.tolist())

print("\n3. DATA TYPES")
print(df.dtypes)

print("\n4. FIRST 5 RECORDS")
print(df.head())

print("\n5. MISSING VALUES")
print(df.isnull().sum())

print("\n6. DUPLICATE RECORDS")
print(df.duplicated().sum())

print("\n7. STATISTICAL SUMMARY")
print(df.describe(include="all"))

print("\n" + "=" * 60)
print("EXPLORATION COMPLETED")
print("=" * 60)
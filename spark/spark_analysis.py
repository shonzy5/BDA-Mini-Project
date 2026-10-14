from pyspark.sql import SparkSession
from pyspark.sql.functions import (
    col,
    sum,
    countDistinct,
    desc,
    round,
    year,
    month
)

import os

# --------------------------------------------------
# 1. Create Spark Session
# --------------------------------------------------

spark = SparkSession.builder \
    .appName("ECommerceAnalytics") \
    .master("local[*]") \
    .getOrCreate()

spark.sparkContext.setLogLevel("WARN")

print("=" * 60)
print("E-COMMERCE SPARK ANALYTICS")
print("=" * 60)

# --------------------------------------------------
# 2. Load cleaned dataset
# --------------------------------------------------

file_path = "data/processed/clean_ecommerce.csv"

df = spark.read.csv(
    file_path,
    header=True,
    inferSchema=True
)

print("\nDataset loaded successfully!")
print("Number of records:", df.count())

# --------------------------------------------------
# 3. Create TotalAmount
# --------------------------------------------------

df = df.withColumn(
    "TotalAmount",
    col("Quantity") * col("UnitPrice")
)

# --------------------------------------------------
# 4. Create output directory
# --------------------------------------------------

output_path = "data/analytics"

os.makedirs(output_path, exist_ok=True)

# --------------------------------------------------
# 5. Overall Sales
# --------------------------------------------------

print("\n" + "=" * 60)
print("1. OVERALL SALES")
print("=" * 60)

overall_sales = df.select(
    round(sum("TotalAmount"), 2).alias("TotalSales"),
    countDistinct("InvoiceNo").alias("TotalOrders"),
    countDistinct("CustomerID").alias("TotalCustomers"),
    countDistinct("StockCode").alias("TotalProducts")
)

overall_sales.show()

# Save using Pandas
overall_sales.toPandas().to_csv(
    f"{output_path}/overall_sales.csv",
    index=False
)

# --------------------------------------------------
# 6. Top Products
# --------------------------------------------------

print("\n" + "=" * 60)
print("2. TOP PRODUCTS")
print("=" * 60)

top_products = df.groupBy(
    "StockCode",
    "Description"
).agg(
    round(sum("TotalAmount"), 2).alias("Revenue"),
    sum("Quantity").alias("UnitsSold")
).orderBy(
    desc("Revenue")
).limit(10)

top_products.show(truncate=False)

top_products.toPandas().to_csv(
    f"{output_path}/top_products.csv",
    index=False
)

# --------------------------------------------------
# 7. Top Customers
# --------------------------------------------------

print("\n" + "=" * 60)
print("3. TOP CUSTOMERS")
print("=" * 60)

top_customers = df.groupBy(
    "CustomerID"
).agg(
    round(sum("TotalAmount"), 2).alias("TotalSpent"),
    countDistinct("InvoiceNo").alias("Orders")
).orderBy(
    desc("TotalSpent")
).limit(10)

top_customers.show()

top_customers.toPandas().to_csv(
    f"{output_path}/top_customers.csv",
    index=False
)

# --------------------------------------------------
# 8. Country Sales
# --------------------------------------------------

print("\n" + "=" * 60)
print("4. COUNTRY SALES")
print("=" * 60)

country_sales = df.groupBy(
    "Country"
).agg(
    round(sum("TotalAmount"), 2).alias("Revenue"),
    countDistinct("CustomerID").alias("Customers")
).orderBy(
    desc("Revenue")
)

country_sales.show(20, truncate=False)

country_sales.toPandas().to_csv(
    f"{output_path}/country_sales.csv",
    index=False
)

# --------------------------------------------------
# 9. Monthly Sales
# --------------------------------------------------

print("\n" + "=" * 60)
print("5. MONTHLY SALES")
print("=" * 60)

monthly_sales = df.groupBy(
    year("InvoiceDate").alias("Year"),
    month("InvoiceDate").alias("Month")
).agg(
    round(sum("TotalAmount"), 2).alias("Revenue"),
    countDistinct("InvoiceNo").alias("Orders"),
    countDistinct("CustomerID").alias("Customers")
).orderBy(
    "Year",
    "Month"
)

monthly_sales.show()

monthly_sales.toPandas().to_csv(
    f"{output_path}/monthly_sales.csv",
    index=False
)

# --------------------------------------------------
# 10. Stop Spark
# --------------------------------------------------

spark.stop()

print("\n" + "=" * 60)
print("SPARK ANALYTICS COMPLETED")
print("=" * 60)

print("\nAnalytics files saved to:")
print(output_path)

print("\nFiles created:")
print("1. overall_sales.csv")
print("2. top_products.csv")
print("3. top_customers.csv")
print("4. country_sales.csv")
print("5. monthly_sales.csv")
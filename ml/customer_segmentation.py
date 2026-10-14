import pandas as pd
import numpy as np
from sklearn.preprocessing import StandardScaler
from sklearn.cluster import KMeans

print("=" * 60)
print("CUSTOMER BEHAVIOUR ANALYTICS")
print("=" * 60)

# --------------------------------------------------
# 1. Load cleaned dataset
# --------------------------------------------------

file_path = "data/processed/clean_ecommerce.csv"

df = pd.read_csv(file_path)

print("\nDataset loaded!")
print("Records:", len(df))

# --------------------------------------------------
# 2. Convert InvoiceDate
# --------------------------------------------------

df["InvoiceDate"] = pd.to_datetime(df["InvoiceDate"])

# --------------------------------------------------
# 3. Create TotalAmount
# --------------------------------------------------

df["TotalAmount"] = df["Quantity"] * df["UnitPrice"]

# --------------------------------------------------
# 4. Reference date
# --------------------------------------------------

reference_date = df["InvoiceDate"].max() + pd.Timedelta(days=1)

print("\nReference Date:", reference_date)

# --------------------------------------------------
# 5. RFM calculation
# --------------------------------------------------

rfm = df.groupby("CustomerID").agg(
    Recency=("InvoiceDate",
             lambda x: (reference_date - x.max()).days),

    Frequency=("InvoiceNo", "nunique"),

    Monetary=("TotalAmount", "sum")
).reset_index()

print("\nRFM ANALYSIS")
print("-" * 60)

print(rfm.head())

# --------------------------------------------------
# 6. Display RFM statistics
# --------------------------------------------------

print("\nRFM Statistics:")
print(rfm[["Recency", "Frequency", "Monetary"]].describe())

# --------------------------------------------------
# 7. Prepare data for ML
# --------------------------------------------------

features = rfm[
    ["Recency", "Frequency", "Monetary"]
].copy()

# Log transformation
features["Recency"] = np.log1p(features["Recency"])
features["Frequency"] = np.log1p(features["Frequency"])
features["Monetary"] = np.log1p(features["Monetary"])

# --------------------------------------------------
# 8. Standardize
# --------------------------------------------------

scaler = StandardScaler()

scaled_features = scaler.fit_transform(features)

# --------------------------------------------------
# 9. K-Means clustering
# --------------------------------------------------

print("\nRunning K-Means clustering...")

kmeans = KMeans(
    n_clusters=4,
    random_state=42,
    n_init=10
)

rfm["Cluster"] = kmeans.fit_predict(
    scaled_features
)

# --------------------------------------------------
# 10. Cluster summary
# --------------------------------------------------

cluster_summary = rfm.groupby("Cluster").agg(
    Customers=("CustomerID", "count"),
    AvgRecency=("Recency", "mean"),
    AvgFrequency=("Frequency", "mean"),
    AvgMonetary=("Monetary", "mean")
).reset_index()

print("\n" + "=" * 60)
print("CUSTOMER SEGMENTS")
print("=" * 60)

print(cluster_summary)

# --------------------------------------------------
# 11. Create segment names
# --------------------------------------------------

# Sort clusters according to monetary value

monetary_order = cluster_summary.sort_values(
    "AvgMonetary"
)["Cluster"].tolist()

segment_names = [
    "Low Value",
    "Regular",
    "High Value",
    "VIP"
]

cluster_to_segment = {}

for cluster, segment in zip(
    monetary_order,
    segment_names
):
    cluster_to_segment[cluster] = segment

rfm["Segment"] = rfm["Cluster"].map(
    cluster_to_segment
)

# --------------------------------------------------
# 12. Display customer segments
# --------------------------------------------------

print("\nCustomer Segment Distribution:")
print(
    rfm["Segment"].value_counts()
)

# --------------------------------------------------
# 13. Final segment summary
# --------------------------------------------------

segment_summary = rfm.groupby("Segment").agg(
    Customers=("CustomerID", "count"),
    AvgRecency=("Recency", "mean"),
    AvgFrequency=("Frequency", "mean"),
    AvgMonetary=("Monetary", "mean")
).reset_index()

print("\n" + "=" * 60)
print("FINAL CUSTOMER SEGMENT SUMMARY")
print("=" * 60)

print(segment_summary)

# --------------------------------------------------
# 14. Save results
# --------------------------------------------------

output_path = "data/analytics"

rfm.to_csv(
    f"{output_path}/customer_rfm.csv",
    index=False
)

segment_summary.to_csv(
    f"{output_path}/customer_segments.csv",
    index=False
)

print("\nFiles created:")
print("1. customer_rfm.csv")
print("2. customer_segments.csv")

print("\n" + "=" * 60)
print("CUSTOMER BEHAVIOUR ANALYTICS COMPLETED")
print("=" * 60)
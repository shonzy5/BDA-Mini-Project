import pandas as pd

print("=" * 60)
print("CREATING DASHBOARD SUMMARY")
print("=" * 60)

# --------------------------------------------------
# Load analytics files
# --------------------------------------------------

overall = pd.read_csv(
    "data/analytics/overall_sales.csv"
)

segments = pd.read_csv(
    "data/analytics/customer_segments.csv"
)

monthly = pd.read_csv(
    "data/analytics/monthly_sales.csv"
)

top_products = pd.read_csv(
    "data/analytics/top_products.csv"
)

# --------------------------------------------------
# Extract KPIs
# --------------------------------------------------

total_sales = overall["TotalSales"].iloc[0]
total_orders = overall["TotalOrders"].iloc[0]
total_customers = overall["TotalCustomers"].iloc[0]
total_products = overall["TotalProducts"].iloc[0]

# --------------------------------------------------
# Customer segment information
# --------------------------------------------------

vip_customers = segments.loc[
    segments["Segment"] == "VIP",
    "Customers"
].iloc[0]

high_value_customers = segments.loc[
    segments["Segment"] == "High Value",
    "Customers"
].iloc[0]

regular_customers = segments.loc[
    segments["Segment"] == "Regular",
    "Customers"
].iloc[0]

low_value_customers = segments.loc[
    segments["Segment"] == "Low Value",
    "Customers"
].iloc[0]

# --------------------------------------------------
# Best month
# --------------------------------------------------

best_month = monthly.loc[
    monthly["Revenue"].idxmax()
]

# --------------------------------------------------
# Best product
# --------------------------------------------------

best_product = top_products.iloc[0]

# --------------------------------------------------
# Create summary
# --------------------------------------------------

summary = pd.DataFrame({
    "Metric": [
        "Total Sales",
        "Total Orders",
        "Total Customers",
        "Total Products",
        "VIP Customers",
        "High Value Customers",
        "Regular Customers",
        "Low Value Customers",
        "Best Month Revenue",
        "Best Product Revenue"
    ],

    "Value": [
        total_sales,
        total_orders,
        total_customers,
        total_products,
        vip_customers,
        high_value_customers,
        regular_customers,
        low_value_customers,
        best_month["Revenue"],
        best_product["Revenue"]
    ]
})

# --------------------------------------------------
# Save
# --------------------------------------------------

summary.to_csv(
    "data/analytics/dashboard_summary.csv",
    index=False
)

print("\nDashboard summary:")
print(summary)

print("\nFile created:")
print("data/analytics/dashboard_summary.csv")

print("\n" + "=" * 60)
print("DASHBOARD SUMMARY COMPLETED")
print("=" * 60)
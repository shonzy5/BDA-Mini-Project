import { useEffect, useState } from "react";

import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

import "./App.css";


function App() {

  const [activePage, setActivePage] = useState("Overview");

  // --------------------------------------------------
  // API DATA
  // --------------------------------------------------

  const [summary, setSummary] = useState(null);
  const [monthlySales, setMonthlySales] = useState([]);
  const [customerSegments, setCustomerSegments] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [countrySales, setCountrySales] = useState([]);
  const [customerRfm, setCustomerRfm] = useState([]);
  const [products, setProducts] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  // --------------------------------------------------
  // FETCH DATA FROM FLASK
  // --------------------------------------------------

  useEffect(() => {

    const API = "http://127.0.0.1:5000";

    async function fetchDashboardData() {

      try {

        setLoading(true);

        const [
  summaryResponse,
  monthlyResponse,
  segmentResponse,
  productsResponse,
  countryResponse,
  rfmResponse
] = await Promise.all([

  fetch(`${API}/api/summary`),

  fetch(`${API}/api/monthly-sales`),

  fetch(`${API}/api/customer-segments`),

  fetch(`${API}/api/top-products`),

  fetch(`${API}/api/country-sales`),

  fetch(`${API}/api/customer-rfm`)

]);


        // Check for API errors

        if (
          !summaryResponse.ok ||
          !monthlyResponse.ok ||
          !segmentResponse.ok ||
          !productsResponse.ok ||
          !countryResponse.ok ||
          !rfmResponse.ok
        ) {
          throw new Error("One or more API requests failed.");
        }


        // Convert responses to JSON

        const summaryData = await summaryResponse.json();

        const monthlyData = await monthlyResponse.json();

        const segmentData = await segmentResponse.json();

        const productsData = await productsResponse.json();
        setProducts(productsData);

        const countryData = await countryResponse.json();

        const rfmData = await rfmResponse.json();


        // Store data

        setSummary(summaryData);

        setMonthlySales(
          monthlyData.map((item) => ({
            month: `${item.Month}/${item.Year}`,
            sales: Number(item.Revenue)
          }))
        );


        setCustomerSegments(segmentData);


        setTopProducts(
          productsData.map((item) => ({
            name: item.Description,
            revenue: Number(item.Revenue)
          }))
        );


        setCountrySales(
          countryData.map((item) => ({
            country: item.Country,
            sales: Number(item.Revenue)
          }))
        );

        setCustomerRfm(rfmData);
        setError(null);

      } catch (err) {

        console.error("Dashboard API Error:", err);

        setError(
          "Unable to connect to the Flask backend. Make sure Flask is running on port 5000."
        );

      } finally {

        setLoading(false);

      }

    }


    fetchDashboardData();

  }, []);


  // --------------------------------------------------
  // CUSTOMER SEGMENT COLORS
  // --------------------------------------------------

  const segmentColors = [
    "#7c3aed",
    "#2563eb",
    "#10b981",
    "#f59e0b"
  ];


  // --------------------------------------------------
  // LOADING SCREEN
  // --------------------------------------------------

  if (loading) {

    return (
      <div className="loading-screen">

        <h2>Loading E-Commerce Analytics...</h2>

        <p>
          Connecting to Flask API and loading analytics data.
        </p>

      </div>
    );

  }


  // --------------------------------------------------
  // ERROR SCREEN
  // --------------------------------------------------

  if (error) {

    return (
      <div className="loading-screen">

        <h2>⚠️ Dashboard Connection Error</h2>

        <p>{error}</p>

        <p>
          Flask should be running at:
          <br />
          <strong>http://127.0.0.1:5000</strong>
        </p>

      </div>
    );

  }


  // --------------------------------------------------
  // RETURN DASHBOARD
  // --------------------------------------------------

  return (

    <div className="dashboard">


      {/* SIDEBAR */}

      <aside className="sidebar">

        <div className="logo">

          <div className="logo-icon">
            🛒
          </div>

          <div>

            <h2>E-Commerce</h2>

            <span>
              Analytics
            </span>

          </div>

        </div>


        <nav>

          <button
            className={
              activePage === "Overview"
                ? "active"
                : ""
            }
            onClick={() =>
              setActivePage("Overview")
            }
          >
            📊 Overview
          </button>


          <button
            className={
              activePage === "Customers"
                ? "active"
                : ""
            }
            onClick={() =>
              setActivePage("Customers")
            }
          >
            👥 Customers
          </button>


          <button
            className={
              activePage === "Products"
                ? "active"
                : ""
            }
            onClick={() =>
              setActivePage("Products")
            }
          >
            📦 Products
          </button>


          <button
            className={
              activePage === "Sales"
                ? "active"
                : ""
            }
            onClick={() =>
              setActivePage("Sales")
            }
          >
            💰 Sales Analysis
          </button>

        </nav>


        <div className="sidebar-bottom">

          <p>
            Data Source
          </p>

          <strong>
            Online Retail Dataset
          </strong>

          <span>
            392,692 cleaned records
          </span>

        </div>

      </aside>



      {/* MAIN CONTENT */}

      <main className="main">


        {/* HEADER */}

        <header className="header">

          <div>

            <h1>
              {activePage}
            </h1>

            <p>
              E-Commerce Sales & Customer Behaviour Analytics
            </p>

          </div>


          <div className="header-right">

            <span className="status-dot"></span>

            <span>
              Analytics Active
            </span>

          </div>

        </header>



        {/* OVERVIEW PAGE */}

        {activePage === "Overview" && (

          <>


            {/* KPI CARDS */}

            <section className="kpi-grid">


              <div className="kpi-card">

                <div className="kpi-icon purple">
                  ₹
                </div>

                <div>

                  <p>
                    Total Sales
                  </p>

                  <h2>
                    ₹
                    {Number(
                      summary["Total Sales"]
                    ).toLocaleString(
                      "en-IN",
                      {
                        maximumFractionDigits: 0
                      }
                    )}
                  </h2>

                  <span>
                    Revenue generated
                  </span>

                </div>

              </div>



              <div className="kpi-card">

                <div className="kpi-icon blue">
                  🛍
                </div>

                <div>

                  <p>
                    Total Orders
                  </p>

                  <h2>
                    {Number(
                      summary["Total Orders"]
                    ).toLocaleString()}
                  </h2>

                  <span>
                    Completed orders
                  </span>

                </div>

              </div>



              <div className="kpi-card">

                <div className="kpi-icon green">
                  👥
                </div>

                <div>

                  <p>
                    Customers
                  </p>

                  <h2>
                    {Number(
                      summary["Total Customers"]
                    ).toLocaleString()}
                  </h2>

                  <span>
                    Unique customers
                  </span>

                </div>

              </div>



              <div className="kpi-card">

                <div className="kpi-icon orange">
                  📦
                </div>

                <div>

                  <p>
                    Products
                  </p>

                  <h2>
                    {Number(
                      summary["Total Products"]
                    ).toLocaleString()}
                  </h2>

                  <span>
                    Unique products
                  </span>

                </div>

              </div>

            </section>



            {/* CHART ROW */}

            <section className="chart-grid">


              {/* MONTHLY REVENUE */}

              <div className="chart-card large">

                <div className="card-header">

                  <div>

                    <h3>
                      Monthly Revenue
                    </h3>

                    <p>
                      Revenue trend over time
                    </p>

                  </div>

                </div>


                <ResponsiveContainer
                  width="100%"
                  height={320}
                >

                  <LineChart
                    data={monthlySales}
                  >

                    <CartesianGrid
                      strokeDasharray="3 3"
                    />

                    <XAxis
                      dataKey="month"
                    />

                    <YAxis />

                    <Tooltip
                      formatter={(value) =>
                        `₹${Number(
                          value
                        ).toLocaleString()}`
                      }
                    />

                    <Line
                      type="monotone"
                      dataKey="sales"
                      stroke="#7c3aed"
                      strokeWidth={3}
                      dot={{ r: 4 }}
                    />

                  </LineChart>

                </ResponsiveContainer>

              </div>



              {/* CUSTOMER SEGMENTS */}

              <div className="chart-card">

                <div className="card-header">

                  <div>

                    <h3>
                      Customer Segments
                    </h3>

                    <p>
                      RFM + K-Means segmentation
                    </p>

                  </div>

                </div>


                <ResponsiveContainer
                  width="100%"
                  height={280}
                >

                  <PieChart>

                    <Pie
                      data={customerSegments}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={90}
                      label
                    >

                      {customerSegments.map(
                        (entry, index) => (

                          <Cell
                            key={entry.name}
                            fill={
                              segmentColors[
                                index %
                                segmentColors.length
                              ]
                            }
                          />

                        )
                      )}

                    </Pie>

                    <Tooltip />

                    <Legend />

                  </PieChart>

                </ResponsiveContainer>

              </div>

            </section>



            {/* BOTTOM CHARTS */}

            <section className="chart-grid">


              {/* TOP PRODUCTS */}

              <div className="chart-card">

                <div className="card-header">

                  <div>

                    <h3>
                      Top Products
                    </h3>

                    <p>
                      Products ranked by revenue
                    </p>

                  </div>

                </div>


                <ResponsiveContainer
                  width="100%"
                  height={300}
                >

                  <BarChart
                    data={topProducts}
                    layout="vertical"
                    margin={{
                      left: 30
                    }}
                  >

                    <CartesianGrid
                      strokeDasharray="3 3"
                    />

                    <XAxis
                      type="number"
                    />

                    <YAxis
                      type="category"
                      dataKey="name"
                      width={150}
                    />

                    <Tooltip
                      formatter={(value) =>
                        `₹${Number(
                          value
                        ).toLocaleString()}`
                      }
                    />

                    <Bar
                      dataKey="revenue"
                      fill="#2563eb"
                      radius={[
                        0,
                        5,
                        5,
                        0
                      ]}
                    />

                  </BarChart>

                </ResponsiveContainer>

              </div>



              {/* COUNTRY SALES */}

              <div className="chart-card">

                <div className="card-header">

                  <div>

                    <h3>
                      Country Sales
                    </h3>

                    <p>
                      Top countries by revenue
                    </p>

                  </div>

                </div>


                <ResponsiveContainer
                  width="100%"
                  height={300}
                >

                  <BarChart
                    data={countrySales}
                  >

                    <CartesianGrid
                      strokeDasharray="3 3"
                    />

                    <XAxis
                      dataKey="country"
                    />

                    <YAxis />

                    <Tooltip
                      formatter={(value) =>
                        `₹${Number(
                          value
                        ).toLocaleString()}`
                      }
                    />

                    <Bar
                      dataKey="sales"
                      fill="#10b981"
                      radius={[
                        5,
                        5,
                        0,
                        0
                      ]}
                    />

                  </BarChart>

                </ResponsiveContainer>

              </div>

            </section>



            {/* INSIGHTS */}

            <section className="insights">


              <div className="insight-card">

                <span>
                  🏆
                </span>

                <div>

                  <h4>
                    Best Month
                  </h4>

                  <p>
                    November 2011
                  </p>

                  <strong>
                    ₹
                    {Number(
                      summary["Best Month Revenue"]
                    ).toLocaleString()}
                    {" "}revenue
                  </strong>

                </div>

              </div>



              <div className="insight-card">

                <span>
                  ⭐
                </span>

                <div>

                  <h4>
                    Top Product
                  </h4>

                  <p>
                    Paper Craft Little Birdie
                  </p>

                  <strong>
                    ₹
                    {Number(
                      summary["Best Product Revenue"]
                    ).toLocaleString()}
                    {" "}revenue
                  </strong>

                </div>

              </div>



              <div className="insight-card">

                <span>
                  👑
                </span>

                <div>

                  <h4>
                    VIP Customers
                  </h4>

                  <p>
                    High-value customer group
                  </p>

                  <strong>
                    {Number(
                      summary["VIP Customers"]
                    ).toLocaleString()}
                    {" "}customers
                  </strong>

                </div>

              </div>


            </section>

          </>

        )}



        {/* CUSTOMERS PAGE */}

{activePage === "Customers" && (

  <>

    {/* CUSTOMER KPI CARDS */}

    <section className="kpi-grid">

      <div className="kpi-card">

        <div className="kpi-icon green">
          👥
        </div>

        <div>
          <p>Total Customers</p>

          <h2>
            {customerRfm.length.toLocaleString()}
          </h2>

          <span>RFM analysed customers</span>
        </div>

      </div>


      <div className="kpi-card">

        <div className="kpi-icon purple">
          👑
        </div>

        <div>
          <p>VIP Customers</p>

          <h2>
            {Number(
              summary["VIP Customers"]
            ).toLocaleString()}
          </h2>

          <span>Highest-value customers</span>
        </div>

      </div>


      <div className="kpi-card">

        <div className="kpi-icon blue">
          ⭐
        </div>

        <div>
          <p>High Value</p>

          <h2>
            {Number(
              summary["High Value Customers"]
            ).toLocaleString()}
          </h2>

          <span>Potential loyal customers</span>
        </div>

      </div>


      <div className="kpi-card">

        <div className="kpi-icon orange">
          ⚠️
        </div>

        <div>
          <p>Low Value</p>

          <h2>
            {Number(
              summary["Low Value Customers"]
            ).toLocaleString()}
          </h2>

          <span>Customers needing attention</span>
        </div>

      </div>

    </section>


    {/* CUSTOMER ANALYSIS */}

    <section className="chart-grid">


      {/* CUSTOMER SEGMENTS */}

      <div className="chart-card">

        <div className="card-header">

          <div>
            <h3>Customer Segments</h3>

            <p>
              RFM + K-Means segmentation
            </p>
          </div>

        </div>


        <ResponsiveContainer
          width="100%"
          height={300}
        >

          <PieChart>

            <Pie
              data={customerSegments}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={100}
              label
            >

              {customerSegments.map(
                (entry, index) => (

                  <Cell
                    key={entry.name}
                    fill={
                      segmentColors[
                        index %
                        segmentColors.length
                      ]
                    }
                  />

                )
              )}

            </Pie>

            <Tooltip />

            <Legend />

          </PieChart>

        </ResponsiveContainer>

      </div>


      {/* RFM ANALYSIS */}

      <div className="chart-card">

        <div className="card-header">

          <div>
            <h3>RFM Analysis</h3>

            <p>
              Average customer behaviour
            </p>
          </div>

        </div>


        <div className="rfm-stats">

          <div className="rfm-box">

            <span>Recency</span>

            <strong>
              {customerRfm.length
                ? (
                    customerRfm.reduce(
                      (sum, c) =>
                        sum + Number(c.Recency),
                      0
                    ) /
                    customerRfm.length
                  ).toFixed(1)
                : 0}
            </strong>

            <small>days</small>

          </div>


          <div className="rfm-box">

            <span>Frequency</span>

            <strong>
              {customerRfm.length
                ? (
                    customerRfm.reduce(
                      (sum, c) =>
                        sum + Number(c.Frequency),
                      0
                    ) /
                    customerRfm.length
                  ).toFixed(1)
                : 0}
            </strong>

            <small>orders/customer</small>

          </div>


          <div className="rfm-box">

            <span>Monetary</span>

            <strong>
              ₹
              {customerRfm.length
                ? (
                    customerRfm.reduce(
                      (sum, c) =>
                        sum + Number(c.Monetary),
                      0
                    ) /
                    customerRfm.length
                  ).toLocaleString(
                    "en-IN",
                    {
                      maximumFractionDigits: 0
                    }
                  )
                : 0}
            </strong>

            <small>average spend</small>

          </div>

        </div>


        <div className="ml-info">

          <h4>
            🧠 Machine Learning
          </h4>

          <p>
            Customers were segmented using
            <strong> RFM analysis </strong>
            followed by
            <strong> K-Means clustering</strong>.
          </p>

        </div>

      </div>

    </section>


    {/* TOP CUSTOMERS TABLE */}

    <section className="chart-card customer-table-card">

      <div className="card-header">

        <div>
          <h3>Top Customers</h3>

          <p>
            Highest spending customers
          </p>
        </div>

      </div>


      <div className="table-container">

        <table>

          <thead>

            <tr>
              <th>Rank</th>
              <th>Customer ID</th>
              <th>Segment</th>
              <th>Recency</th>
              <th>Frequency</th>
              <th>Monetary</th>
            </tr>

          </thead>


          <tbody>

            {[
              ...customerRfm
            ]
              .sort(
                (a, b) =>
                  Number(b.Monetary) -
                  Number(a.Monetary)
              )
              .slice(0, 10)
              .map((customer, index) => (

                <tr key={customer.CustomerID}>

                  <td>
                    #{index + 1}
                  </td>

                  <td>
                    {customer.CustomerID}
                  </td>

                  <td>

                    <span
  className={`segment-badge ${String(
    customer.Segment || "Unknown"
  )
    .toLowerCase()
    .replace(/\s+/g, "-")}`}
>
  {customer.Segment || "Unknown"}
</span>

                  </td>

                  <td>
                    {customer.Recency} days
                  </td>

                  <td>
                    {customer.Frequency}
                  </td>

                  <td>
                    ₹
                    {Number(
                      customer.Monetary
                    ).toLocaleString(
                      "en-IN",
                      {
                        maximumFractionDigits: 0
                      }
                    )}
                  </td>

                </tr>

              ))}

          </tbody>

        </table>

      </div>

    </section>

  </>

)}


{/* PRODUCTS PAGE */}

{activePage === "Products" && (
  <div className="page-content">

    {/* Page Header */}
    <div className="page-header">
      <div>
        <h1>Products</h1>
        <p>E-Commerce Sales & Customer Behaviour Analytics</p>
      </div>

      <div className="status-badge">
        <span>●</span> Analytics Active
      </div>
    </div>


    {/* Product KPI Cards */}
    <div className="stats-grid">

      <div className="stat-card">
        <div className="stat-icon purple">🏆</div>
        <div>
          <div className="stat-label">Top Product</div>
          <div className="stat-value">
            {products?.[0]?.Description || "N/A"}
          </div>
          <div className="stat-subtitle">
            Highest revenue product
          </div>
        </div>
      </div>

      <div className="stat-card">
        <div className="stat-icon blue">💰</div>
        <div>
          <div className="stat-label">Top Revenue</div>
          <div className="stat-value">
            ₹{Number(products?.[0]?.Revenue || 0).toLocaleString("en-IN")}
          </div>
          <div className="stat-subtitle">
            Revenue generated
          </div>
        </div>
      </div>

      <div className="stat-card">
        <div className="stat-icon green">📦</div>
        <div>
          <div className="stat-label">Units Sold</div>
          <div className="stat-value">
            {Number(
              products?.reduce(
                (sum, item) => sum + Number(item.UnitsSold || 0),
                0
              ) || 0
            ).toLocaleString("en-IN")}
          </div>
          <div className="stat-subtitle">
            Across top products
          </div>
        </div>
      </div>

      <div className="stat-card">
        <div className="stat-icon yellow">📊</div>
        <div>
          <div className="stat-label">Products Analyzed</div>
          <div className="stat-value">
            {products?.length || 0}
          </div>
          <div className="stat-subtitle">
            Top products
          </div>
        </div>
      </div>

    </div>


    {/* Charts */}
    <div className="dashboard-grid">

      {/* Revenue Chart */}
      <div className="dashboard-card large">

        <div className="card-header">
          <div>
            <h2>Top Products by Revenue</h2>
            <p>Highest revenue generating products</p>
          </div>
        </div>

        <div style={{ width: "100%", height: 400 }}>

          <ResponsiveContainer width="100%" height="100%">

            <BarChart
              data={products?.slice(0, 10) || []}
              layout="vertical"
              margin={{
                top: 10,
                right: 30,
                left: 120,
                bottom: 10
              }}
            >

              <CartesianGrid strokeDasharray="3 3" />

              <XAxis
                type="number"
                tickFormatter={(value) =>
                  `₹${(value / 1000).toFixed(0)}K`
                }
              />

              <YAxis
                type="category"
                dataKey="Description"
                width={120}
                tick={{ fontSize: 11 }}
              />

              <Tooltip
                formatter={(value) =>
                  `₹${Number(value).toLocaleString("en-IN")}`
                }
              />

              <Bar
                dataKey="Revenue"
                fill="#7c3aed"
                radius={[0, 6, 6, 0]}
              />

            </BarChart>

          </ResponsiveContainer>

        </div>

      </div>


      {/* Units Sold Chart */}
      <div className="dashboard-card">

        <div className="card-header">
          <div>
            <h2>Units Sold</h2>
            <p>Top products by quantity</p>
          </div>
        </div>

        <div style={{ width: "100%", height: 400 }}>

          <ResponsiveContainer width="100%" height="100%">

            <BarChart
              data={products?.slice(0, 10) || []}
              margin={{
                top: 10,
                right: 20,
                left: 0,
                bottom: 40
              }}
            >

              <CartesianGrid strokeDasharray="3 3" />

              <XAxis
                dataKey="StockCode"
                angle={-35}
                textAnchor="end"
                height={70}
              />

              <YAxis />

              <Tooltip />

              <Bar
                dataKey="UnitsSold"
                fill="#10b981"
                radius={[6, 6, 0, 0]}
              />

            </BarChart>

          </ResponsiveContainer>

        </div>

      </div>

    </div>


    {/* Product Table */}
    <div className="dashboard-card">

      <div className="card-header">

        <div>
          <h2>Top Products</h2>
          <p>Highest performing products by revenue</p>
        </div>

      </div>


      <div className="table-container">

        <table>

          <thead>

            <tr>
              <th>Rank</th>
              <th>Product</th>
              <th>Stock Code</th>
              <th>Units Sold</th>
              <th>Revenue</th>
            </tr>

          </thead>

          <tbody>

            {(products?.slice(0, 10) || []).map(
              (product, index) => (

                <tr key={index}>

                  <td>
                    #{index + 1}
                  </td>

                  <td>
                    <strong>
                      {product.Description || "Unknown Product"}
                    </strong>
                  </td>

                  <td>
                    {product.StockCode || "-"}
                  </td>

                  <td>
                    {Number(
                      product.UnitsSold || 0
                    ).toLocaleString("en-IN")}
                  </td>

                  <td>
                    <strong>
                      ₹
                      {Number(
                        product.Revenue || 0
                      ).toLocaleString("en-IN")}
                    </strong>
                  </td>

                </tr>

              )
            )}

          </tbody>

        </table>

      </div>

    </div>

  </div>
)}


{/* SALES ANALYSIS PAGE */}

{/* ================= SALES ANALYSIS PAGE ================= */}

{/* =========================
    SALES ANALYSIS PAGE
========================= */}

{activePage === "Sales" && (
  <div className="sales-page">

    {/* SALES KPI CARDS */}
    <section className="sales-kpi-grid">

      <div className="sales-kpi-card">
        <div className="sales-kpi-icon purple">₹</div>
        <div>
          <p>Total Revenue</p>
          <h2>₹88,87,209</h2>
          <span>Total revenue generated</span>
        </div>
      </div>

      <div className="sales-kpi-card">
        <div className="sales-kpi-icon blue">🛒</div>
        <div>
          <p>Total Orders</p>
          <h2>18,532</h2>
          <span>Completed orders</span>
        </div>
      </div>

      <div className="sales-kpi-card">
        <div className="sales-kpi-icon green">📈</div>
        <div>
          <p>Average Order Value</p>
          <h2>₹479.78</h2>
          <span>Revenue per order</span>
        </div>
      </div>

      <div className="sales-kpi-card">
        <div className="sales-kpi-icon orange">👥</div>
        <div>
          <p>Customers</p>
          <h2>4,338</h2>
          <span>Unique customers</span>
        </div>
      </div>

    </section>


    {/* MONTHLY REVENUE + COUNTRY SALES */}
    <section className="sales-chart-grid">

      {/* MONTHLY REVENUE */}
      <div className="sales-chart-card sales-chart-large">

        <div className="sales-card-header">
          <div>
            <h3>Monthly Revenue</h3>
            <p>Revenue performance over time</p>
          </div>
        </div>

        <div className="sales-chart-container">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={monthlySales}
              margin={{
                top: 10,
                right: 20,
                left: 10,
                bottom: 10
              }}
            >

              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
              />

              <XAxis
                dataKey="month"
                tick={{ fontSize: 11 }}
              />

              <YAxis
                tick={{ fontSize: 11 }}
                tickFormatter={(value) =>
                  `₹${(value / 100000).toFixed(1)}L`
                }
              />

              <Tooltip
                formatter={(value) =>
                  `₹${Number(value).toLocaleString("en-IN")}`
                }
              />

              <Line
                type="monotone"
                dataKey="sales"
                stroke="#7c3aed"
                strokeWidth={3}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />

            </LineChart>
          </ResponsiveContainer>
        </div>

      </div>


      {/* COUNTRY SALES */}
      <div className="sales-chart-card">

        <div className="sales-card-header">
          <div>
            <h3>Country Sales</h3>
            <p>Revenue by country</p>
          </div>
        </div>

        <div className="sales-chart-container">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={countrySales}
              margin={{
                top: 10,
                right: 10,
                left: 0,
                bottom: 45
              }}
            >

              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
              />

              <XAxis
                dataKey="country"
                angle={-35}
                textAnchor="end"
                interval={0}
                tick={{ fontSize: 10 }}
              />

              <YAxis
                tick={{ fontSize: 10 }}
                tickFormatter={(value) =>
                  `₹${(value / 100000).toFixed(1)}L`
                }
              />

              <Tooltip
                formatter={(value) =>
                  `₹${Number(value).toLocaleString("en-IN")}`
                }
              />

              <Bar
                dataKey="sales"
                fill="#10b981"
                radius={[5, 5, 0, 0]}
              />

            </BarChart>
          </ResponsiveContainer>
        </div>

      </div>

    </section>


    {/* TOP PRODUCTS + SALES INSIGHTS */}
    <section className="sales-bottom-grid">

      {/* TOP PRODUCTS */}
      <div className="sales-chart-card">

        <div className="sales-card-header">
          <div>
            <h3>Top Products by Revenue</h3>
            <p>Highest revenue generating products</p>
          </div>
        </div>

        <div className="sales-chart-container sales-product-chart">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={topProducts}
              layout="vertical"
              margin={{
                top: 5,
                right: 20,
                left: 100,
                bottom: 5
              }}
            >

              <CartesianGrid
                strokeDasharray="3 3"
                horizontal={false}
              />

              <XAxis
                type="number"
                tickFormatter={(value) =>
                  `₹${(value / 1000).toFixed(0)}K`
                }
              />

              <YAxis
                type="category"
                dataKey="name"
                width={130}
                tick={{ fontSize: 10 }}
              />

              <Tooltip
                formatter={(value) =>
                  `₹${Number(value).toLocaleString("en-IN")}`
                }
              />

              <Bar
                dataKey="revenue"
                fill="#2563eb"
                radius={[0, 5, 5, 0]}
              />

            </BarChart>
          </ResponsiveContainer>
        </div>

      </div>


      {/* SALES INSIGHTS */}
      <div className="sales-insights-card">

        <div className="sales-card-header">
          <div>
            <h3>Sales Insights</h3>
            <p>Key findings from the analysis</p>
          </div>
        </div>

        <div className="sales-insight-item">
          <span className="sales-insight-icon purple">🏆</span>
          <div>
            <h4>Best Sales Month</h4>
            <p>November 2011 generated the highest monthly revenue.</p>
            <strong>₹11.56 Lakh</strong>
          </div>
        </div>

        <div className="sales-insight-item">
          <span className="sales-insight-icon blue">🌍</span>
          <div>
            <h4>Top Market</h4>
            <p>The United Kingdom contributes the largest share of revenue.</p>
            <strong>₹72.85 Lakh</strong>
          </div>
        </div>

        <div className="sales-insight-item">
          <span className="sales-insight-icon green">📦</span>
          <div>
            <h4>Best Product</h4>
            <p>Paper Craft Little Birdie is the highest revenue product.</p>
            <strong>₹1.68 Lakh</strong>
          </div>
        </div>

        <div className="sales-insight-item">
          <span className="sales-insight-icon orange">📊</span>
          <div>
            <h4>Average Order Value</h4>
            <p>Average revenue generated per completed order.</p>
            <strong>₹479.78</strong>
          </div>
        </div>

      </div>

    </section>


    {/* MONTHLY SALES TABLE */}
    <section className="sales-table-card">

      <div className="sales-card-header">
        <div>
          <h3>Monthly Sales Details</h3>
          <p>Revenue and order performance by month</p>
        </div>
      </div>

      <div className="sales-table-wrapper">

        <table className="sales-table">

          <thead>
            <tr>
              <th>Month</th>
              <th>Revenue</th>
              <th>Performance</th>
            </tr>
          </thead>

          <tbody>

            {monthlySales.map((item, index) => {

              const maxSales = Math.max(
                ...monthlySales.map((m) => Number(m.sales))
              );

              const percentage =
                (Number(item.sales) / maxSales) * 100;

              return (
                <tr key={item.month}>

                  <td>{item.month}</td>

                  <td className="sales-table-revenue">
                    ₹{Number(item.sales).toLocaleString("en-IN")}
                  </td>

                  <td>
                    <div className="sales-progress">
                      <div
                        className="sales-progress-bar"
                        style={{
                          width: `${percentage}%`
                        }}
                      ></div>
                    </div>
                  </td>

                </tr>
              );
            })}

          </tbody>

        </table>

      </div>

    </section>

  </div>
)}

      </main>

    </div>

  );

}


export default App;
from pyspark.sql import SparkSession

spark = SparkSession.builder \
    .appName("SparkTest") \
    .master("local[*]") \
    .getOrCreate()

print("Spark Version:", spark.version)

df = spark.range(10)

df.show()

spark.stop()
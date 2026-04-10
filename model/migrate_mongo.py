import os
import pandas as pd
from pymongo import MongoClient

def migrate_songs():
    csv_path = os.path.join("data", "songs.csv")
    if not os.path.exists(csv_path):
        print(f"File not found: {csv_path}")
        return
        
    print(f"Reading {csv_path}...")
    df = pd.read_csv(csv_path)
    df = df.fillna('')
    records = df.to_dict(orient='records')
    
    # Optional: connect to mongodb
    # we'll assume standard localhost
    MONGO_URI = "mongodb://127.0.0.1:27017/"
    client = MongoClient(MONGO_URI)
    db = client["muzly"]
    col = db["songs"]
    
    # clear existing ones
    deleted = col.delete_many({})
    print(f"Cleared {deleted.deleted_count} existing songs in MongoDB.")
    
    # insert new
    result = col.insert_many(records)
    print(f"Inserted {len(result.inserted_ids)} songs into MongoDB.")

if __name__ == "__main__":
    migrate_songs()

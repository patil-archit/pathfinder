#!/usr/bin/env python3
"""
Test script to verify MySQL database connection for FreeSQLDatabase.com
Run this before deploying to Render to ensure database credentials work
"""

import pymysql
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Database connection parameters
# Replace these with your actual FreeSQLDatabase credentials
DB_CONFIG = {
    'host': os.getenv('DB_HOST', 'sql12.freesqldatabase.com'),
    'port': int(os.getenv('DB_PORT', '3306')),
    'user': os.getenv('DB_USER', 'sql12345678'),  # Your username
    'password': os.getenv('DB_PASSWORD', 'your-generated-password'),  # Your password
    'database': os.getenv('DB_NAME', 'sql12345678_pathfinder'),  # Your database name
    'charset': 'utf8mb4'
}

def test_connection():
    """Test MySQL database connection"""
    try:
        print(f"Testing connection to {DB_CONFIG['host']}...")
        print(f"Database: {DB_CONFIG['database']}")
        print(f"User: {DB_CONFIG['user']}")
        
        # Attempt to connect
        connection = pymysql.connect(**DB_CONFIG)
        print("✅ Successfully connected to MySQL database!")
        
        # Test a simple query
        with connection.cursor() as cursor:
            cursor.execute("SELECT VERSION()")
            version = cursor.fetchone()
            print(f"✅ MySQL Version: {version[0]}")
            
            # Test database access
            cursor.execute("SHOW TABLES")
            tables = cursor.fetchall()
            print(f"✅ Found {len(tables)} tables in database")
            
        connection.close()
        print("✅ Connection test completed successfully!")
        return True
        
    except pymysql.Error as e:
        print(f"❌ Database connection failed: {e}")
        return False
    except Exception as e:
        print(f"❌ Unexpected error: {e}")
        return False

if __name__ == "__main__":
    print("="*50)
    print("FreeSQLDatabase Connection Test")
    print("="*50)
    
    # Show what we're testing
    print("Configuration:")
    print(f"  Host: {DB_CONFIG['host']}")
    print(f"  Port: {DB_CONFIG['port']}")
    print(f"  Database: {DB_CONFIG['database']}")
    print(f"  User: {DB_CONFIG['user']}")
    print(f"  Password: {'*' * len(DB_CONFIG['password'])}")
    print()
    
    success = test_connection()
    
    if success:
        print()
        print("🎉 Database connection works! You can deploy to Render.")
        print()
        print("Next steps:")
        print("1. Set these environment variables in Render:")
        print(f"   DB_HOST={DB_CONFIG['host']}")
        print(f"   DB_PORT={DB_CONFIG['port']}")
        print(f"   DB_NAME={DB_CONFIG['database']}")
        print(f"   DB_USER={DB_CONFIG['user']}")
        print(f"   DB_PASSWORD={DB_CONFIG['password']}")
        print("   DJANGO_SETTINGS_MODULE=backend.settings_free")
        print("2. Push your code changes to GitHub")
        print("3. Trigger a new deployment on Render")
    else:
        print()
        print("💡 Please check your FreeSQLDatabase credentials and try again.")
        print("You can find your credentials at: https://freesqldatabase.com/account/")
#!/usr/bin/env python
"""
Script to help migrate your local MySQL data to production hosting.
Run this script to export your current data before deploying.
"""

import os
import subprocess
import sys
from datetime import datetime

def run_command(command, description):
    """Run a shell command and handle errors."""
    print(f"🔄 {description}...")
    try:
        result = subprocess.run(command, shell=True, capture_output=True, text=True)
        if result.returncode == 0:
            print(f"✅ {description} completed successfully!")
            if result.stdout:
                print(f"Output: {result.stdout.strip()}")
            return True
        else:
            print(f"❌ Error in {description}:")
            print(f"Error: {result.stderr}")
            return False
    except Exception as e:
        print(f"❌ Exception during {description}: {e}")
        return False

def export_mysql_data():
    """Export local MySQL data."""
    print("🚀 PathFinder AI - MySQL Data Migration Helper")
    print("=" * 50)
    
    # Get current timestamp for backup filename
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    
    # Database connection details (from your current setup)
    db_name = "career_pathfinder"
    db_user = "root"
    
    print(f"📊 Database: {db_name}")
    print(f"👤 User: {db_user}")
    
    # Create backups directory
    backup_dir = "database_backups"
    os.makedirs(backup_dir, exist_ok=True)
    
    # Backup filenames
    sql_backup = f"{backup_dir}/pathfinder_backup_{timestamp}.sql"
    json_backup = f"{backup_dir}/pathfinder_fixtures_{timestamp}.json"
    
    print("\n🔄 Starting data export...")
    
    # Method 1: MySQL dump (raw SQL)
    mysql_dump_cmd = f"mysqldump -u {db_user} -p {db_name} > {sql_backup}"
    if run_command(mysql_dump_cmd, "MySQL dump export"):
        print(f"📁 SQL backup saved to: {sql_backup}")
    
    # Method 2: Django fixtures (JSON)
    django_dump_cmd = f"python manage.py dumpdata --natural-foreign --natural-primary --indent 2 > {json_backup}"
    if run_command(django_dump_cmd, "Django fixtures export"):
        print(f"📁 JSON fixtures saved to: {json_backup}")
    
    print("\n🎯 Next Steps:")
    print("1. Deploy your backend to your chosen hosting platform")
    print("2. Run migrations on production: `python manage.py migrate`")
    print("3. Import data using one of these methods:")
    print(f"   - MySQL import: `mysql -h HOST -u USER -p DATABASE < {sql_backup}`")
    print(f"   - Django fixtures: `python manage.py loaddata {json_backup}`")
    
    print("\n💾 Backup files created:")
    print(f"   - {sql_backup}")
    print(f"   - {json_backup}")

def check_local_data():
    """Check what data exists in local database."""
    print("\n🔍 Checking local database content...")
    
    # Check tables and row counts
    check_commands = [
        ("python manage.py showmigrations", "Migration status"),
        ("python manage.py shell -c \"from django.contrib.auth.models import User; print(f'Users: {User.objects.count()}')\"", "User count"),
    ]
    
    for cmd, desc in check_commands:
        run_command(cmd, desc)

if __name__ == "__main__":
    print("🚀 PathFinder AI - MySQL Migration Helper")
    print("This script will help you export your local MySQL data for production deployment.\n")
    
    # Check if manage.py exists
    if not os.path.exists("manage.py"):
        print("❌ Error: manage.py not found. Please run this script from your Django project root.")
        sys.exit(1)
    
    # Ask user what they want to do
    print("Choose an option:")
    print("1. Export all data for migration")
    print("2. Check local database content")
    print("3. Both")
    
    choice = input("\nEnter your choice (1/2/3): ").strip()
    
    if choice in ["1", "3"]:
        export_mysql_data()
    
    if choice in ["2", "3"]:
        check_local_data()
    
    print("\n✅ Migration helper completed!")
    print("📖 Check DEPLOYMENT_GUIDE_MYSQL.md for detailed deployment instructions.")
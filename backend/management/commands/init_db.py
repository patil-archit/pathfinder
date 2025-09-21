from django.core.management.base import BaseCommand
from django.core.management import call_command
from django.db import connection
from django.conf import settings
import logging

logger = logging.getLogger(__name__)

class Command(BaseCommand):
    help = 'Initialize the database with migrations and basic setup'

    def add_arguments(self, parser):
        parser.add_argument(
            '--force',
            action='store_true',
            help='Force database initialization even if tables exist',
        )

    def handle(self, *args, **options):
        self.stdout.write(self.style.SUCCESS('Starting database initialization...'))
        
        try:
            # Test database connection
            self.stdout.write('Testing database connection...')
            with connection.cursor() as cursor:
                cursor.execute("SELECT 1")
                self.stdout.write(self.style.SUCCESS('✓ Database connection successful'))
            
            # Show current database settings (without password)
            db_config = settings.DATABASES['default'].copy()
            db_config.pop('PASSWORD', None)
            self.stdout.write(f'Database config: {db_config}')
            
            # Run migrations
            self.stdout.write('Running migrations...')
            call_command('migrate', verbosity=1)
            self.stdout.write(self.style.SUCCESS('✓ Migrations completed'))
            
            # Create superuser if needed (optional)
            from django.contrib.auth import get_user_model
            User = get_user_model()
            if not User.objects.filter(is_superuser=True).exists():
                self.stdout.write('No superuser found. You may want to create one manually.')
            
            self.stdout.write(self.style.SUCCESS('Database initialization completed successfully!'))
            
        except Exception as e:
            self.stdout.write(
                self.style.ERROR(f'Database initialization failed: {str(e)}')
            )
            logger.error(f'Database initialization error: {str(e)}')
            raise
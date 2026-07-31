from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from backend.app.models.user import User
import bcrypt

engine = create_engine('sqlite:///backend/test.db')
Session = sessionmaker(bind=engine)
session = Session()

# Delete test user if exists
session.query(User).filter_by(email='test@test.com').delete()
session.commit()

# Create test user
hashed = bcrypt.hashpw('test'.encode('utf-8'), bcrypt.gensalt())
user = User(
    email='test@test.com',
    hashed_password=hashed.decode('utf-8'),
    first_name='Test',
    last_name='User'
)
session.add(user)
session.commit()
print("Test user created.")
